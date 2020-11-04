import React, {useState, createContext} from 'react';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({username: ''});

  return (
    <AuthContext.Provider value={[authenticated, setAuthenticated, user, setUser]}>
      {props.children}
    </AuthContext.Provider>
  );
}