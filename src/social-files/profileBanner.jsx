import React, { useState, useContext, useRef, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { BiSolidImageAdd } from "react-icons/bi";
import { onValue, ref, set } from "firebase/database";
import { AuthContext } from "../context/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { storage, auth, database } from "../firebase";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";

const ProfileBanner = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profileImageSrc, setProfileImageSrc] = useState(
    "https://cdn0.iconfinder.com/data/icons/actions-ono-system-core/30/account_circle-profile-profile_picture-default_picture-512.png"
  );
  const {
    profileBannerVisible,
    toggleProfileBanner,
    userData,
    userPostData,
    postLength,
  } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `users/${userId}/`);
      onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCoverImage(data.coverImage);
            console.log(data);
            setProfileImageSrc(data.profileImage);
          }
        },
        (error) => {
          console.error("Error fetching user data:", error.message);
        }
      );
    }
  }, [userId]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const fileInputRef = useRef(null);

  const handleClick = async (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const storageReference = storageRef(
        storage,
        `coverImages/${userId}/${file.name}`
      );

      try {
        const snapshot = await uploadBytes(storageReference, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const userRef = ref(database, `users/${userId}`);
        await set(userRef, {
          ...userData,
          coverImage: downloadURL,
        });

        setCoverImage(downloadURL);
        console.log(
          "Cover image uploaded and URL saved to database:",
          downloadURL
        );
      } catch (error) {
        console.error("Error uploading cover image:", error.message);
      }
    }
  };

  const isValidText = (content) => {
    const maxLength = 100;
    return content && content.length > maxLength
      ? `${content.slice(0, maxLength)}...`
      : content;
  };

  const isValidPostData = (postData) => {
    return postData && postData.post && typeof postData.post === "object";
  };

  return (
    <div
      className={`bannerContainer ${
        profileBannerVisible ? "slide-in" : "slide-out"
      }`}
    >
      <div className="bannerButtonsContainer">
        <div className="bannerButtons">
          <HiX className="exitBanner" onClick={toggleProfileBanner} />
          <input
            type="file"
            id="file-input"
            className="hidden"
            name="file1"
            onChange={handleClick}
            ref={fileInputRef}
          />
          <label htmlFor="file-input" className="custom-file-label">
            <BiSolidImageAdd className="addingCoverImageButton" />
          </label>
        </div>
      </div>
      <div className="bannerBody">
        <div className="profileCoverWrapper">
          <img
            src={
              coverImage ||
              "https://assets.trafficpointltd.com/app/uploads/sites/9/2024/06/05154745/menu-default-image_220606_web.png"
            }
            className="profileCover"
            alt="profileCover"
          />
        </div>
        <div className="profileInfoContainer">
          <div className="profileInfo">
            <img
              src={profileImageSrc}
              style={{ background: "#f3b7ac" }}
              className="profilePicture"
              alt="profilePicture"
              onLoad={handleImageLoad}
            />
            {userData && (
              <>
                <div className="profileDetails">
                  <div className="profileName">
                    <h2>{userData.firstName}</h2>
                  </div>
                  <div className="DishesFollowersContainer">
                    <div className="dishesSection divider">
                      <h2>{postLength}</h2>
                      <span>Dishes</span>
                    </div>
                    <div className="followersSection divider">
                      <h2>1K</h2>
                      <span>Followers</span>
                    </div>
                    <div className="followingSection">
                      <h2>250</h2>
                      <span>Following</span>
                    </div>
                  </div>
                  <div className="dishesContainer">
                    <div className="postsBody">
                      {Array.isArray(userPostData) &&
                      userPostData.length > 0 ? (
                        <>
                          <p>Your Recent Posts</p>
                          {userPostData.map((postData, index) =>
                            isValidPostData(postData) ? (
                              <div
                                key={postData.post.postId}
                                className="postItem bannerItem"
                              >
                                <p className="userText">
                                  {isValidText(postData.post.content)}
                                </p>
                                <span className="dateSpan">
                                  Posted on:{" "}
                                  {new Date(
                                    postData.post.createdAt
                                  ).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              ""
                            )
                          )}
                        </>
                      ) : (
                        <span>No posts available...</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
