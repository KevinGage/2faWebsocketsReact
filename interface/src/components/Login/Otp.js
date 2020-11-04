import React, {useState, useContext} from 'react';
import QRious from "qrious";
import {OtpContext} from '../Auth/OtpProvider';
import axios from 'axios';

const Otp = () => {
  const [otpCode, setOtpCode] = useState('');
  const [otpSecret, setOtpSecret] = useState('');

  //const [otpConfigured, setOtpConfigured, otpAuthenticated, setOtpAuthenticated] = useContext(OtpContext);
  const otpConfigured = useContext(OtpContext)[0];
  const setOtpConfigured = useContext(OtpContext)[1];
  const setOtpAuthenticated = useContext(OtpContext)[3];

  const generateQR = async () => {
    try {
      const res = await axios.get('/auth/setup-totp');
      const app = res.data.data.app;
      const email = res.data.data.email;
      const secret = res.data.data.secret;
      const period = res.data.data.period;
      const otpUrl = `otpauth://totp/${app}:${email}?secret=${secret}&period=${period}`;

      if (res.status === 200) {
        new QRious({
          element: document.getElementById("qr-div"),
          value: otpUrl
        });
        setOtpSecret(() => secret)
        setOtpConfigured(() => true);
      } else {
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    //Login!!
    try {
      const res = await axios.post('/auth/login-otp', { 'code': otpCode})

      if (res.status === 200) {
        setOtpAuthenticated(() => true);
      } else {
        setOtpCode(() => '');
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {otpConfigured ? <form
        action='/auth/login-otp'
        method='post'
        onSubmit={handleSubmit}
      >
        <label>
          Enter 6 Digit Code
          <input
            type='text'
            value={otpCode}
            onChange={e => setOtpCode(e.target.value)}
          />
        </label>
        <input
          type='submit'
          value='Login'
        />
      </form> : null}
      <canvas id="qr-div" />
      {otpSecret}
      <br />
      <button onClick={generateQR}> Generate New QR </button>

    </div>
  );
}

export default Otp;