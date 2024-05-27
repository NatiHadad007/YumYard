import React, { useState } from "react";
import { HiX } from "react-icons/hi";

function SignIn({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userSignIn, setuserSignIn] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = () => {
    if (password === confirmPassword) {
      console.log(firstName, lastName, email, password, confirmPassword);
      //   setuserSignIn(firstName, lastName, email, password, confirmPassword);
      setErrorMsg(""); // Clear error message on successful submit
      //   console.log(userSignIn);
    } else {
      setErrorMsg("* Confirm password and password needs to be equal.");
    }
  };

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
            <button type="submit" className="btn" onClick={handleSubmit}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
