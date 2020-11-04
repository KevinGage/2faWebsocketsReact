const authorize = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send();
  }
  next();
};

const authorizeSecondFactor = async (req, res, next) => {
  if (req.session.secondFactor == 'totp') { return next(); }
  // res.redirect('/login-otp')
  return res.status(401).send();
}

// module.exports = authorize
exports.authorize =  authorize;
exports.authorizeSecondFactor = authorizeSecondFactor;