import React, { useState } from "react";
import { HiX } from "react-icons/hi";

function LogIn({ onClose }) {
  return (
    <div className="logInPopupContainer">
      <div className="popupBody">
        <div className="popUpexit">
          <HiX className="exitPopup" onClick={onClose} />
        </div>
        <div className="popupHeader">
          <h2>Log in to YumYard</h2>
        </div>
        <div className="popupForm">
          <form action="">
            <label htmlFor="">Username</label>
            <input type="text" />
            <label htmlFor="">Password</label>
            <input type="text" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
