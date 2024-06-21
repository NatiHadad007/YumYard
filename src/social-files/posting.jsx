import React, { useState, useContext, useRef, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { auth } from "../firebase.js"; // Adjust the import as per your file structure
import { AuthContext } from "../context/AuthProvider.jsx";
import { PostsContext } from "../context/PostsProvider.jsx";
import { FaImage } from "react-icons/fa";

function Posting({ onClose }) {
  const [errorMsg, setErrorMsg] = useState("");
  const { newPostCreated } = useContext(AuthContext); // assuming toggleNewPostCreated isn't used
  const [postsImages, setPostsImages] = useState("");
  const {
    createPost,
    editPostData,
    setEditPostData,
    isEditPost,
    setIsEditPost,
    updatePost,
    isPostImage,
    postImages,
  } = useContext(PostsContext);
  const [userText, setUserText] = useState("");

  useEffect(() => {
    if (isEditPost && editPostData) {
      setUserText(editPostData.content);
    }
  }, [isEditPost, editPostData]);

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
      userId: user.uid,
    };

    try {
      if (isEditPost && editPostData) {
        await updatePost(editPostData.postId, postData);
      } else {
        const newPostData = await createPost(user.uid, postData);
        if (newPostData) {
          setUserText("");
        }
      }
      onClose();
      setEditPostData(null);
      setIsEditPost(false);
    } catch (error) {
      console.error("Error creating/updating post:", error.message);
      setErrorMsg(error.message);
    }
  };

  const fileInputRef = useRef(null);

  const handleClick = async (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      try {
        const imageUrl = await postImages(files[0]);
        setPostsImages(imageUrl); // Store the URL instead of the file
      } catch (error) {
        console.error("Error uploading image:", error.message);
        setErrorMsg("Failed to upload image.");
      }
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
              value={userText}
              autoFocus
              onChange={handleInputChange}
              placeholder="Burger?, Pizza? or any new idea"
              rows="10"
              cols="30"
            />
            <div className="submitingContainer">
              <input
                type="file"
                id="post-image-input"
                className="hidden"
                name="file1"
                onChange={handleClick}
                ref={fileInputRef}
              />
              {isPostImage ? (
                <div className="postImageContainer">
                  <img
                    src={isPostImage}
                    className="postImage"
                    alt="post-image"
                  />
                </div>
              ) : (
                <FaImage className="addingPostImageButton" />
              )}
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Posting;
