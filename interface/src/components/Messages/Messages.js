import React, { useState, useEffect } from 'react';

function Messages(props) {
  const [messageCount, setMessageCount] = useState(0);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    props.socket.on('receive message', payload => {
      // console.log(`message: ${payload}`);
      setMessageCount(messageCount + 1);
    });
  });

  useEffect(() => {
    // console.log('received new message');
    document.title = `${messageCount} new messages have been emitted`;
  }, [messageCount]); //only re-run the effect if new message comes in

  const handleSetTheme = () => {
    let newTheme;
    (theme === 'light')
      ? newTheme = 'dark'
      : newTheme = 'light';

    console.log('new theme: ' + newTheme);
    setTheme(newTheme);
  }

  const handleNewMessage = () => {
    // console.log('emitting new message');
    props.socket.emit('new message', {
      room: 'test-room'
    });

    setMessageCount(messageCount + 1);
  }

  return(
    <div className={`App Theme-${theme}`}>

        <p>{messageCount} messages have been emitted</p>

        {props.inRoom &&
        <button onClick={() => handleNewMessage()}>
          Emit new message
        </button>
        }

        <button onClick={() => handleSetTheme()}>
          Toggle Theme
        </button>
    </div>
  );
}

export default Messages;