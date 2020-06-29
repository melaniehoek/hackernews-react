import React, { useState, useEffect } from "react";

import { AUTH_TOKEN } from "../constants";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_TOKEN));

  useEffect(() => localStorage.setItem(AUTH_TOKEN, authToken), [authToken]);

  const removeAuthToken = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, removeAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
