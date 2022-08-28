import classes from "./ProfileForm.module.css";
import { useContext, useRef } from "react";
import authContext from "../store/auth-context";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const history=useHistory()
  const ctx=useContext(authContext)
  const token =ctx.token
  const passwordChange = useRef();
  const passwordSubmitHandler = async (e) => {
    e.preventDefault();
    //add va;idation to check password like length,special characters etc
    const newPassword = passwordChange.current.value;
    console.log(newPassword);
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAz7x-RU9rYXPNZR_-1DvAzKbIKjFEV0Ww",
        {method:'POST',
        body:JSON.stringify({  idToken:token,
          password:newPassword,
        returnSecureToken:false}),
        headers:{
          'Content-Type':'application/json'
        }
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      history.replace('/')
      } else {
        const data = await response.json();
        let errorMessage = '"request failed"';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      alert(err.message);
    }

    passwordChange.current.value = "";
  };
  return (
    <form className={classes.form} onSubmit={passwordSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={passwordChange} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
