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

      return res.redirect('/auth/user');
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
// example 1
// app.post('/login-otp', 
//   passport.authenticate('totp', { failureRedirect: '/login-otp', failureFlash: true }),
//   function(req, res) {
//     req.session.secondFactor = 'totp';
//     res.redirect('/');
//   });

// example 2
// app.post('/login-otp', passport.authenticate('totp', {
//   failureRedirect: '/login',
//   successRedirect: `/users/${req.user.id}`
// }));

// my attempt.
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