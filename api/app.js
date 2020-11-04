var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Define routers */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* Generate randon cookie secret */
const generateRandomString = (length) => (Array(length).fill(0).map(x => Math.random().toString(36).charAt(2)).join(''))
const cookieSecret = generateRandomString(32)

/* initialize middleware */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: cookieSecret }));
app.use(express.static(path.join(__dirname, 'public')));

/* initialize routers */
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
