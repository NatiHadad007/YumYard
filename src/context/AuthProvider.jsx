import React, { useState, useEffect, createContext } from "react";
import {
  onValue,
  ref,
  set,
  push,
  query,
  orderByChild,
} from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // import onAuthStateChanged
import { database, auth } from "../firebase.js"; // make sure to import auth
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [profileBannerVisible, setProfileBannerVisible] = useState(false);
  const [userData, setUserData] = useState();
  const [userPostData, setUserPostData] = useState([]);
  const [postLength, setPostLength] = useState();
  const [userId, setUserId] = useState(null); // state to store the userId

  const toggleProfileBanner = () => {
    setProfileBannerVisible((prevState) => !prevState);
  };

  const updateUserData = (userData) => {
    setUserData(userData);
  };

  const fetchPosts = (userId) => {
    const postsRef = query(ref(database, "posts"), orderByChild("createdAt"));
    onValue(
      postsRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postEntries = Object.entries(data);
          let count = 0;
          const postsWithUserPromises = postEntries.map(
            async ([postId, post]) => {
              if (userId === post.userId) {
                count++;
                return { post: post };
              }
            }
          );

          const postsWithUserData = await Promise.all(postsWithUserPromises);
          const filteredPosts = postsWithUserData.filter(
            (post) => post !== undefined
          );

          filteredPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setUserPostData(filteredPosts);
          setPostLength(count);
        }
      },
      (error) => {
        console.error("Error fetching posts:", error.message);
      }
    );
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData"); // replace with firebase auth.currentUser
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    const unsubscribe = onAuthStateChanged(auth, (posts) => {
      if (posts) {
        setUserId(posts.uid);
        fetchPosts(posts.uid);
      } else {
        setUserId(null);
        setUserData(null);
      }
    });
  }, []);

  const value = {
    profileBannerVisible,
    userData,
    userPostData,
    postLength,
    setUserPostData,
    updateUserData,
    toggleProfileBanner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
