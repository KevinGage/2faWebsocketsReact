module.exports = function(socket) {
  socket.on('new message', data => {
    console.log(`new message: ${data.room}`);
    socket.broadcast
    .to(data.room)
    .emit('receive message', data)
  });
};