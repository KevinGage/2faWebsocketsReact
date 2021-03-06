const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const session = require('express-session');

// Initialize sessions for sockets
/* Generate randon cookie secret */
const generateRandomString = (length) => (Array(length).fill(0).map(x => Math.random().toString(36).charAt(2)).join(''));
const cookieSecret = generateRandomString(32);

const sessionMiddleware = session({ secret: cookieSecret, cookie: { maxAge: 60000 }});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
  // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
  // connections, as 'socket.request.res' will be undefined in that case
});

io.on('connection', socket => {
  console.log('a new session connected');

  socket.on('disconnect', reason => {
    console.log('session disconnected');
  });

  require('./sockets/auth')(socket);
  require('./sockets/rooms')(socket);
  require('./sockets/messages')(socket);
});

socketApi.io = io;
module.exports = socketApi;