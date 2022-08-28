import React, { useState } from "react";

export const authContext = React.createContext({
  token: "",
  isLoggedIn: false,
  logIn: (token) => {},
  logOut: () => {},
});
export const AuthProvider = (props) => {
  //   const [token, setToken] = useState(null);
  //   useEffect(() => {
  //     const tokent=localStorage.getItem('token')
  //     if(tokent){
  //         setToken(tokent)
  //     }
  //   }, [token]);
  //we dont need effect here because localStorage api is synchronous
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const isLoggedIn = !!token;
  console.log(isLoggedIn);
  const calculateRemTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    console.log(currentTime);
    const remainingDuration = expirationTime- currentTime;
    console.log(remainingDuration);
    return remainingDuration;
  };
  const logInHandler = (tokenId, expirationTime) => {
    setToken(tokenId);
    localStorage.setItem("token", tokenId);
    const remainingTime = calculateRemTime(expirationTime);
    setTimeout(logOutHandler,remainingTime)
  };
  const logOutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  const authValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    logIn: logInHandler,
    logOut: logOutHandler,
  };
  return (
    <authContext.Provider value={authValue}>
      {props.children}
    </authContext.Provider>
  );
};
export default authContext;
