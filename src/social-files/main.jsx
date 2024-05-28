import { Link } from "react-router-dom";
import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import LogIn from "./logIn";
import Signin from "./signIn";

function Main() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSigninVisivle, setSigninVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };

  const handleSigninClick = () => {
    setSigninVisible(true);
  };

  const handleCloseSign = () => {
    setSigninVisible(false);
  };
  
  const handleLoginSuccess = (user) => {
    console.log("Logged in as:", user.email);
    // Handle login success, maybe redirect to another page or update state
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
              <div className="signOrLogContainer">
                <button className="LogBtn" onClick={handleLoginClick}>
                  Log in
                </button>
                <button className="SignBtn" onClick={handleSigninClick}>
                  Sign Up
                </button>
              </div>
            </div>
            {isLoginVisible && <LogIn onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />}
            {isSigninVisivle && <Signin onClose={handleCloseSign} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
