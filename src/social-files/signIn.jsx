import React, { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { storage, auth, database } from "../firebase";
import LogIn from "./logIn";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref as storageRef,uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

function SignIn({ onClose, onSigninSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    // Check if all fields are filled
    if (firstName && lastName && email && password && confirmPassword) {
      setAllFieldsFilled(true);
      // if (firstName.length < 6 && lastName.length < 6 && password < 15) {
      // }
    } else {
      setAllFieldsFilled(false);
    }
  }, [firstName, lastName,profileImage, email , password, confirmPassword]);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
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
      case "profileImage":
        setProfileImage(files[0]);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (!allFieldsFilled) {
      setErrorMsg("* All fields are required.");
      setIsPasswordMatch(false);
      return;
    }

    if (password === confirmPassword) {
      setErrorMsg("");
      createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
          const user = userCredential.user;
          const userId = user.uid;
          let profileImageUrl = "";
              if (profileImage != null) {
                const imageRef = storageRef(storage, `profileImages/${profileImage.name + v4()}`);
                await uploadBytes(imageRef, profileImage);
                profileImageUrl = await getDownloadURL(imageRef);
              }
          updateProfile(user, {
            //if you want to display the first & last name:displayName: `${firstName} ${lastName}`,
            displayName: `${firstName}`,
            photoURL: profileImageUrl
          })
            .then(() => {
              if (onSigninSuccess) {
                onSigninSuccess(user, profileImageUrl);
                }
              // Save additional user info in Realtime Database
              set(ref(database, "users/" + userId), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                profileImage: profileImageUrl,
              })
                .then(() => {
                  // Close the form and redirect to login
                  onClose();
                  setRedirectToLogin(true);
                })
                .catch((error) => {
                  const errorMessage = error.message;
                  setErrorMsg(errorMessage);
                });
            })
            .catch((error) => {
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
    <div className="PopupContainer">
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
             <div className="confirm-profile-picture">
              <label className="form__label" htmlFor="profileImage">
                Chose your profile image (Adittional)
              </label>
              <input
                className="form__input"
                type="file"
                id="profileImage"
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
            <button
              type="submit"
              className={`btn${allFieldsFilled ? " btnSign" : ""}`}
              onClick={handleSubmit}
            > Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
