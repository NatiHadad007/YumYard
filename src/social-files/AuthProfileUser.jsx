import React, { useState, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import LogIn from "./logIn";
import { MdLogout } from "react-icons/md";
import Signin from "./signIn";
import Banner from "./profileBanner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../context/AuthProvider";
function AuthProfileUser() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSigninVisible, setIsSigninVisible] = useState(false);
  const { toggleProfileBanner, userData, updateUserData } =
    useContext(AuthContext);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleLogoutClick = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("userData");
        updateUserData(undefined);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };

  const handleSigninClick = () => {
    setIsSigninVisible(true);
  };

  const handleCloseSign = () => {
    setIsSigninVisible(false);
  };

  const handleLoginSuccess = (user, img) => {
    const auth = getAuth();
    const database = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(database, "users/" + userId);

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const userDataInfo = {
                firstName: userData.firstName,
                profileImage: userData.profileImage,
                email: userData.email,
              };
              localStorage.setItem("userData", JSON.stringify(userDataInfo));
              updateUserData(userDataInfo);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
    // Update the profile image URL state
    setIsLoginVisible(false); // Close the login modal on successful login
  };
  return (
    <div className="profileDetailsSection">
      <div className={`signOrLogContainer${isLoginVisible ? "Logged" : ""}`}>
        {userData ? (
          <>
            <p className="logedUserName" onClick={toggleProfileBanner}>
              {userData.firstName}
            </p>
            <img
              className="profileImage"
              onClick={toggleProfileBanner}
              src={
                userData.profileImage ||
                "https://cdn0.iconfinder.com/data/icons/actions-ono-system-core/30/account_circle-profile-profile_picture-default_picture-512.png" || (
                  <Skeleton />
                )
              }
              alt="profile_image"
            />
            <button className="LogBtn" onClick={handleLogoutClick}>
              <MdLogout className="logOutIcon" />
            </button>
          </>
        ) : (
          <>
            <button className="LogBtn" onClick={handleLoginClick}>
              Log in
            </button>
            <button className="SignBtn" onClick={handleSigninClick}>
              Sign Up
            </button>
          </>
        )}
        {isLoginVisible && (
          <LogIn
            onClose={handleCloseLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {isSigninVisible && (
          <Signin
            onClose={handleCloseSign}
            onSigninSuccess={handleLoginSuccess}
          />
        )}
        <Banner />
      </div>
    </div>
  );
}

export default AuthProfileUser;
