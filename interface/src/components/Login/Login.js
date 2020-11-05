import React, {useState, useContext} from 'react';
import {AuthContext} from '../Auth/AuthProvider';
import {OtpContext} from '../Auth/OtpProvider';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //const [authenticated, setAuthenticated, user, setUser] = useContext(AuthContext);
  const setAuthenticated = useContext(AuthContext)[1];
  const setUser = useContext(AuthContext)[3];

  //const [otpConfigured, setOtpConfigured, otpAuthenticated, setOtpAuthenticated] = useContext(OtpContext);
  const setOtpConfigured = useContext(OtpContext)[1];

  const login = async () => {
    const result = await authenticate();
    if (result) {
      setUser(() => {return {username: result.username}});
      setAuthenticated(() => true);
      setOtpConfigured(() => result.totpConfigured);
    }
  }

  const authenticate = async () => {
    try {
      // Proxy option must be set in package.json
      const res = await axios.post('/auth/login', { username: username, password: password});

      if (res.status === 200) {
        return {
          'username': res.data.data.email,
          'totpConfigured': res.data.data.otp
        };
      } else {
        console.log(res);
        return false;
      }
    } catch(e) {
      if (e.response) {
        if (e.response.status === 401){
          // setError(() =>'Login Failed: Bad username or password');
          setUsername(() => '');
          setPassword(() => '');
        }
        console.log(e);
      }
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    login();
  };

  return (
    <div>
      <h3>Login Page</h3>
      <form
        action='/auth/login'
        method='post'
        onSubmit={handleSubmit}
      >
        <label>
          Email Address
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <input
          type='submit'
          value='Login'
        />
      </form>
    </div>
  );
}

export default Login;