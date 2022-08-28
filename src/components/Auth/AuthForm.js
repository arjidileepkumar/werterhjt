import { useRef, useState,useContext } from "react";
import authContext from "../store/auth-context";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";


const AuthForm = () => {
  const history=useHistory()
  const ctx=useContext(authContext)
  const enteredEmail = useRef();
  const enteredPassword = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const signUpHandler = async (e) => {
    e.preventDefault();
    const email = enteredEmail.current.value;
    const password = enteredPassword.current.value;
    //validation
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAz7x-RU9rYXPNZR_-1DvAzKbIKjFEV0Ww";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAz7x-RU9rYXPNZR_-1DvAzKbIKjFEV0Ww";
    }
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.expiresIn)
        const expirationTime=new Date((new Date().getTime()+(+data.expiresIn*1000))).getTime()
        console.log(expirationTime)
        const token = data.idToken;
        ctx.logIn(token,expirationTime)  
        history.replace('/')
      } else {
        const data = await response.json();
        let errorMessage = '"authentication failed"';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      alert(err.message);
    }
    setIsLoading(false);
    enteredEmail.current.value=''
    enteredPassword.current.value=''
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={signUpHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" ref={enteredEmail} id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" ref={enteredPassword} id="password" required />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
