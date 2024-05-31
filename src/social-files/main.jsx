import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import LogIn from "./logIn";
import Signin from "./signIn";

function Main() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSigninVisible, setIsSigninVisible] = useState(false);
  const [isUserName, setUserName] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };
  
  const handleLogoutClick = () => {
    localStorage.removeItem('username');
    setUserName("");
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

  const handleLoginSuccess = (user) => {
    localStorage.setItem('username', user.displayName);
    setUserName(user.displayName);
    setIsLoginVisible(false); // Close the login modal on successful login
  };

  return (
    <section className="main">
      <div className="container">
        <div className="navBar">
          <div className="navElementWrapper">
            <Link className="siteName-link" to="/">
              <h1 className="siteName">YumYard</h1>
            </Link>
            <div className="searchInputContainer">
              <BiSearchAlt className="searchIcon" />
              <input
                className="searchInput"
                type="text"
                placeholder="Search..."
              />
            </div>
            <div className="profileDetailsSection">
              <div className={`signOrLogContainer${isLoginVisible ? "Logged" : ""}`}>
                {isUserName ? (
                  <>
                    <p className="logedUserName">{isUserName}</p>
                    <button className="LogBtn" onClick={handleLogoutClick}>
                      Log Out
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
              </div>
            </div>
            {isLoginVisible && (
              <LogIn
                onClose={handleCloseLogin}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            {isSigninVisible && <Signin onClose={handleCloseSign} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
