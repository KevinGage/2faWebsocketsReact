module.exports = function(socket) {
  const session = socket.request.session;

  socket.on('authenticate', data => {
    if (data.token === 'im a legit jwt') {
      session.user = 'someone legit';
      session.save();
      console.log('socket logged in');
    } else {
      console.log('access denied');
    }
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });
};