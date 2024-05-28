import React, { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { auth,database } from '../firebase';
import LogIn from "./logIn";
import { ref, push, child, update,set } from "firebase/database";
import {  createUserWithEmailAndPassword  } from "firebase/auth";

console.log('t')
function SignIn({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false); // State for redirecting to login

  useEffect(() => {
    // Check if all fields are filled
    if (firstName && lastName && email && password && confirmPassword) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  }, [firstName, lastName, email, password, confirmPassword]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    if (!allFieldsFilled) {
      setErrorMsg("* All fields are required.");
      setIsPasswordMatch(false);
      return;
    }

    if (password === confirmPassword) {
      setErrorMsg("");
      
      // let obj = {
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: email,
      //   password: password,
      //   confirmPassword: confirmPassword,
      // };
      // const newPostKey = push(child(ref(database), 'posts')).key;
      // const updates = {};
      // updates['/' + newPostKey] = obj;
      // update(ref(database), updates).then(() => {
      //   // Close the form after successful submission
      //   onClose();
      //   setRedirectToLogin(true); // Set redirect to login
      // }).catch(error => {
      //   // Handle the error here if needed
      //   setErrorMsg(error.message);
      // });
           createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userId = user.uid;

          // Save additional user info in Realtime Database
          set(ref(database, 'users/' + userId), {
            firstName: firstName,
            lastName: lastName,
            email: email
          }).then(() => {
            // Close the form and redirect to login
            onClose();
            setRedirectToLogin(true);
          }).catch((error) => {
            const errorMessage = error.message;
            setErrorMsg(errorMessage);
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErrorMsg(errorMessage);
        });

    } else {
      setErrorMsg("* Confirm password and password need to be equal.");
    }
    setIsPasswordMatch(true);
  };

  if (redirectToLogin) {
    return <LogIn />; // Render the LogIn component if redirectToLogin is true
  }

  return (
    <div className="logInPopupContainer">
      <div className="popupBody">
        <div className="popUpexit">
          <HiX className="exitPopup" onClick={onClose} />
        </div>
        <div className="popupHeader">
          <h2>Sign in to YumYard</h2>
        </div>
        <div className="form">
          <div className="form-body">
            <div className="username">
              <label className="form__label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="form__input"
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="lastname">
              <label className="form__label" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form__input"
                value={lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="email">
              <label className="form__label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form__input"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className="password">
              <label className="form__label" htmlFor="password">
                Password
              </label>
              <input
                className="form__input"
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <div className="confirm-password">
              <label className="form__label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="form__input"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
              />
              <p className="errorMsg">{errorMsg}</p>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className={`btn${allFieldsFilled ? ' btnSign' : ''}`} onClick={handleSubmit}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
