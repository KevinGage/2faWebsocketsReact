var express = require('express');
const session = require("express-session");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const base32 = require('thirty-two');

/* import passport authentication package */
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const TotpStrategy = require('passport-totp').Strategy;

/* import database controller */
const db = require('./controllers/db');

/* Define routers */
const authRouter = require('./routes/auth');
// const usersRouter = require('./routes/users');

/* intialize web server */
var app = express();

/* configure passport authentication middleware */
const strategy = new localStrategy(
  async function(email, password, done) {
    let user;
    try {
      user = await db.users.login(email, password);

      if (!user) {
        return done(null, false, {message: 'Invalid Credentials'});
      }
    } catch (e) {
      return done(e);
    }

    return done(null, user);
  }
);

passport.use(strategy);

const totpStrategy = new TotpStrategy(
  //returns users key and validity period for key.
  async function(user, done){
    const key = base32.decode(user.otp);

    return done(null, key, 30);
  }
);

passport.use(totpStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const data = await db.users.selectId(id);
    const user = data.recordset[0];
    if (!user) {
      return done(new Error('User Not Found'));
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
});

/* Generate randon cookie secret */
const generateRandomString = (length) => (Array(length).fill(0).map(x => Math.random().toString(36).charAt(2)).join(''))
const cookieSecret = generateRandomString(32)

/* initialize middleware */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: cookieSecret }));
app.use(passport.initialize());
app.use(passport.session());

/* initialize routers */
app.use('/auth', authRouter);
// app.use('/users', usersRouter);

module.exports = app;
