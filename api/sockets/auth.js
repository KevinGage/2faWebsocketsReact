module.exports = function(socket) {
  const session = socket.request.session;
  const jwt = require("jsonwebtoken");
  const db = require('../controllers/db');

  socket.on('authenticate', data => {
    if (data.token) {
      jwt.verify(data.token, process.env.JTW_SECRET, async (err, decoded) => {
        if (err) {
          console.log('jwt verification failed');
          console.log(err)
          socket.emit('authenticate', {'success': false});
        } else {
          if (decoded) {
            const userId = decoded.id;
            const data = await db.users.selectId(userId);
            const user = data.recordset[0];
            session.user = {
              'id': user.id,
              'email': user.email
            };
            session.save();
            socket.emit('authenticate', {'success': true});
          }
        }
      });
    }
    socket.emit('authenticate', {'success': false});
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });
};