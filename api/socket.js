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
  // get session and add a property to it
  const session = socket.request.session;
  session.messageCount = 0;
  session.save();

  console.log('a user connected');

  socket.on('disconnect', reason => {
    console.log('user disconnected');
  });

  socket.on('join room', data => {
    console.log('room join');
    console.log(data);
    socket.join(data.room);
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });

  require('./sockets/messages')(socket);
});

socketApi.io = io;
module.exports = socketApi;