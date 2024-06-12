import React, { useState, useContext } from "react";
import { HiX } from "react-icons/hi";
import { BiSolidImageAdd } from "react-icons/bi";
import { AuthContext } from "../context/AuthProvider";
const ProfileBanner = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const { profileBannerVisible, toggleProfileBanner, userData } =
    useContext(AuthContext);

  const handleImageLoad = () => {
    setImageLoaded(true);
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
          <BiSolidImageAdd className="addingCoverImageButton" />
        </div>
      </div>
      <div className="bannerBody">
        <img
          src="https://assets.trafficpointltd.com/app/uploads/sites/9/2024/06/05154745/menu-default-image_220606_web.png"
          className="profileCover"
          alt="profileCover"
        />
        <div className="profileInfoContainer">
          <div className="profileInfo">
            {!isImageLoaded && <div className="loader"></div>}
            {userData && (
              <>
                <img
                  src={userData.profileImage}
                  className="profilePicture"
                  alt="profilePicture"
                  onLoad={handleImageLoad}
                  style={{ display: isImageLoaded ? "block" : "none" }}
                />
                <div className="profileDetails">
                  <div className="profileName">
                    <h2>{userData.firstName}</h2>
                  </div>
                  <div className="DishesFollowersContainer">
                    <div className="dishesSection divider">
                      <h2>20</h2>
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
                    <h4>Your Top Dishes</h4>
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
