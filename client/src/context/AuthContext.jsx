import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    console.log("setting user")
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("verifyOTP", String(verifyOTP));
  }, [user, isAuthenticated, verifyOTP]);

  const save = (user, token) => {
    setIsAuthenticated(true);
    if (user) setUser(user)
    if (token) {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    }
  };

  const remove = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken("");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        verifyOTP,
        setVerifyOTP,
        save,
        remove,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
