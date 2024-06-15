import React, { useRef, useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function LogIn({ onClose, onLoginSuccess }) {
  const buttonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
    if (email && password) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  }, [email, password]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    if (!allFieldsFilled) {
      setErrorMsg("* All fields are required.");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Call the success callback if provided
        if (onLoginSuccess) {
          // localStorage.setItem('isLogedIn', true);
          onLoginSuccess(user);
        }
        // Close the form
        onClose();
        setErrorMsg("");
        setAllFieldsFilled(true);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMsg(errorMessage);
      });
  };

  return (
    <div className="PopupContainer">
      <div className="popupBody">
        <div className="popUpexit">
          <HiX className="exitPopup" onClick={onClose} />
        </div>
        <div className="popupHeader">
          <h2>Log in to YumYard</h2>
        </div>
        <div className="popupForm">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={handleInputChange}
            />
            <label htmlFor="">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
            />
            <p className="errorMsg">{errorMsg}</p>
            <button
              type="submit"
              className={`btn${allFieldsFilled ? " btnSign" : ""}`}
            >
              Sign up
            </button>
          </form>
          <div className="footer"></div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
