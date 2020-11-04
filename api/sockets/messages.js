module.exports = function(socket) {
  socket.on('new message', data => {
    //get message count from session and incriment it
    const session = socket.request.session;
    session.messageCount++;
    session.save();
    console.log(`new message: ${data.room}`);
    console.log(session.messageCount);

    //Broadcast something
    socket.broadcast
    .to(data.room)
    .emit('receive message', data)
  });
};