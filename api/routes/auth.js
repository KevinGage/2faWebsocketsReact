const express = require('express');
const router = express.Router();
const passport = require('passport');
const authorize = require('../controllers/authorization');
const db = require('../controllers/db');
const base32 = require('thirty-two');
const crypto = require('crypto');

/* Route to attempt login and create session */
router.post('/login', async(req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send(); }

    req.logIn(user, async (err) => {
      if (err) { return next(err); }

      // add jwt here???  Or add another route that lets a user fetch a jwt for their session.
      // Probably option 2 so the client side can decide when to authenticate the socket.
      // Only downside is an attacked who has a valid session can just fetch a jwt.  But if an attacker is already authenticated do they need a jwt?
      return res.status(200).json({'data': {
        'id': req.user.id,
        'email': req.user.email,
        'firstname': req.user.firstname,
        'lastname': req.user.lastname,
        'active': req.user.active,
        'otp': req.user.otp ? true : false
      }});
    });
  })(req, res, next);
});

/* Anything below this middleware will require the user to be logged in */
router.use(authorize.authorize);

/* Route to generate totp key */
router.get('/setup-totp', async(req, res, next) => {
  const secret = base32.encode(crypto.randomBytes(16));

  try {
    await db.users.updateTotpSecret(req.user.id, secret);

    return res.status(200).send({'data': {
      'app': 'React2faTest',
      'email': req.user.email,
      'secret': secret.toString().replace(/=/g, ''),
      'period': 30
    }});
  } catch (err) {
    return next(err);
  }
});

/* Route to login with totp */
// otp should be base64 encoded in db
router.post('/login-otp', 
  passport.authenticate('totp'),
  function(req, res) {
    req.session.secondFactor = 'totp';
    res.redirect(`/users/${req.user.id}`);
  }
);

/* Route to return currently loged in user details */
router.get('/user', async(req, res, next) => {
  return res.status(200).json({'data': {
    'id': req.user.id,
    'email': req.user.email,
    'firstname': req.user.firstname,
    'lastname': req.user.lastname,
    'active': req.user.active,
    'otp': req.user.otp ? true : false
  }});
})

/* Route to log out current users session */
router.get('/logout', async (req, res, next) => {
  req.logout();

  return res.status(200).send({'data': 'logout succesful'})
});

module.exports = router;