import React from 'react';
import './App.css';
import {AuthProvider} from './components/Auth/AuthProvider';
import {OtpProvider} from './components/Auth/OtpProvider';
import Main from './components/Main/Main';

function App() {
  return (
    <div>
      <header className="App-header">
        <AuthProvider>
          <OtpProvider>
            <Main />
          </OtpProvider>
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
