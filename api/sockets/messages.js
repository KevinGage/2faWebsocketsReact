module.exports = function(socket) {
  socket.on('new message', data => {
    console.log(`new message: ${data.room}`);

    //Broadcast something
    socket.broadcast
    .to(data.room)
    .emit('receive message', data)
  });
};