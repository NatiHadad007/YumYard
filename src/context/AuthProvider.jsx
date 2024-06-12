import React, { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [profileBannerVisible, setProfileBannerVisible] = useState(false);
  const [userData, setUserData] = useState();

  const toggleProfileBanner = () => {
    setProfileBannerVisible((prevState) => !prevState);
  };

  const updateUserData = (userData) => {
    setUserData(userData);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData"); // replace with firebase auth.currentUser
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const value = {
    profileBannerVisible,
    userData,
    updateUserData,
    toggleProfileBanner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
