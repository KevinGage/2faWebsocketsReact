import React, {useState, createContext} from 'react';

export const OtpContext = createContext();

export const OtpProvider = props => {
  const [otpConfigured, setOtpConfigured] = useState(false);
  const [otpAuthenticated, setOtpAuthenticated] = useState(false);

  return (
    <OtpContext.Provider value={[otpConfigured, setOtpConfigured, otpAuthenticated, setOtpAuthenticated]}>
      {props.children}
    </OtpContext.Provider>
  );
}