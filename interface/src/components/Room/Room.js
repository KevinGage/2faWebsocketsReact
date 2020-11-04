import React, { useState, useEffect } from 'react';
import Messages from '../Messages/Messages';


const io = require('socket.io-client');
const socket = io('http://localhost:3001');

function Room() {
  const [inRoom, setInRoom] = useState(false);

   useEffect(() => {
    socket.on('join', payload => {
      if (!payload.success) {
        console.log('room authorization failed');
      }
      setInRoom(() => payload.success);
    });

    // cleanup when unmounting component
    return () => {
      if(inRoom) {
        console.log('leaving room');
        socket.emit('leave room', {
          room: 'test-room'
        })
      }
    }
  });

  const requestJoinRoom = () => {
    socket.emit('join room', {room: 'test-room'});
  }

  const authenticateSocket = () => {
    socket.emit('authenticate', {token: 'im a legit jwt'});
  }

 return(
  <div>
    <h1>
      {inRoom && `You Have Entered The Room` }
      {!inRoom && `Outside Room` }
    </h1>

    <button onClick={() => authenticateSocket()}>
      authenticate socket
    </button>

    <button onClick={() => requestJoinRoom()}>
      {inRoom && `Leave Room` }
      {!inRoom && `Enter Room` }
    </button>

    <Messages
      inRoom={inRoom}
      socket={socket}
    />
  </div>
  );
}

export default Room;