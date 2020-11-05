import React, { useState, useEffect, useContext } from 'react';
import Messages from '../Messages/Messages';
import {OtpContext} from '../Auth/OtpProvider';
import axios from 'axios';

const io = require('socket.io-client');
const socket = io('http://localhost:3001');

function Room() {
  //const [otpConfigured, setOtpConfigured, otpAuthenticated, setOtpAuthenticated] = useContext(OtpContext);
  const otpAuthenticated = useContext(OtpContext)[2];

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

  useEffect(() => {
    const authenticateSocket = () => {
      // This function is wrapped to be anonymous
      // This ensures other javascript can't access the local jwt variable
      (async () => {try {
        const res = await axios.get('/auth/jwt');

        if (res.status === 200) {
          console.log(res.data);
          const jwt = res.data;
        socket.emit('authenticate', {token: jwt});
        } else {
          console.log('socket authentication failed');
          console.log(res);
        }

        
      } catch (e) {
        console.log(e);
      }})()
    }
    if (otpAuthenticated) {
      // 2fa authentication is complete for http session
      // get jwt and authenticate socket
      console.log('going to authenticate socket');
      authenticateSocket();
    }
  }, [otpAuthenticated]);

  const requestJoinRoom = () => {
    socket.emit('join room', {room: 'test-room'});
  }

 return(
  <div>
    <h1>
      {inRoom && `You Have Entered The Room` }
      {!inRoom && `Outside Room` }
    </h1>

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