import React, { useState, useContext } from "react";
import { HiX } from "react-icons/hi";
import { auth } from "../firebase.js"; // Adjust the import as per your file structure
import { AuthContext } from "../context/AuthProvider.jsx";
import { PostsContext } from "../context/PostsProvider.jsx";
function Posting({ onClose }) {
  const [userText, setUserText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { newPostCreated, toggleNewPostCreated } = useContext(AuthContext);
  const { createPost, editPostData, setEditPostData } =
    useContext(PostsContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setErrorMsg("");
    setUserText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (userText.trim() === "") {
      setErrorMsg("You must enter content text.");
      return;
    }
    if (!user) {
      setErrorMsg("User not authenticated.");
      return;
    }

    const postData = {
      content: userText,
      userId: user.uid, // Include the user ID
    };

    try {
      const newPostData = await createPost(user.uid, postData);
      if (newPostData) {
        setUserText("");
        onClose();
        setEditPostData("");
      }
    } catch (error) {
      console.error("Error creating post:", error.message);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="PopupContainer">
      <div className="popupBody userText">
        <div className="popUpexit">
          <HiX className="exitPopup" onClick={onClose} />
        </div>
        <div className="popupHeader recipeHeader">
          <h2>What kind of recipe are you thinking of?</h2>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          <form onSubmit={handleSubmit}>
            <textarea
              className="userTextArea"
              value={editPostData !== "" ? editPostData : userText}
              autoFocus
              onChange={handleInputChange}
              placeholder="Burger?, Pizza? or any new idea"
              rows="10"
              cols="30"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Posting;
