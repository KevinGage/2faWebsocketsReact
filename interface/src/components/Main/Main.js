import React, {useContext} from 'react';
import {AuthContext} from '../Auth/AuthProvider';
import {OtpContext} from '../Auth/OtpProvider';
import User from '../User/User';
import Login from '../Login/Login';
import LoginOtp from '../Login/Otp';
import Room from '../Room/Room';

const Main = () => {
  //const [authenticated, setAuthenticated, user, setUser] = useContext(AuthContext);
  const [authenticated] = useContext(AuthContext);

  //const [otpConfigured, setOtpConfigured, otpAuthenticated, setOtpAuthenticated] = useContext(OtpContext);
  const otpAuthenticated = useContext(OtpContext)[2];

  const routingLogic = () => {
    if (!authenticated) {
      return <Login />
    }
    if (!otpAuthenticated) {
      return <LoginOtp />
    }
    return <User />
  }

  return (
    <div>
      {routingLogic()}
      <Room />
    </div>
  );
}

export default Main;