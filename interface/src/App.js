import React from 'react';
import logo from './logo.svg';
import './App.css';
import Room from './components/Room/Room';

function App() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Room />
      </header>
    </div>
  );
}

export default App;
