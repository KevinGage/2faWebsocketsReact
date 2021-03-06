module.exports = function(socket) {
  const session = socket.request.session;

  socket.on('join room', data => {
    if (session.user === undefined) {
      console.log('denied')
      socket.emit('join', {'room': data.room, 'success': false});
    } else {
      console.log('user joined room');
      console.log(session);
      console.log(`userId: ${session.user.id} userEmail: ${session.user.email} RoomName: ${data.room}`)
      socket.emit('join', {'room': data.room, 'success': true});
      socket.join(data.room);
    }
    // console.log('room join');
    // console.log(data);
    // socket.join(data.room);
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });
};