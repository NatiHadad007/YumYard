import React, { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import Posting from "./posting";
import Navbar from "./navbar";
import { PostsContext } from "../context/PostsProvider.jsx";
function Main() {
  const [isPostVisible, setIsPostVisible] = useState(false);
  const [user, setUser] = useState(null);
  const { posts, setPosts, loading, setLoading, fetchPosts } =
    useContext(PostsContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPosts();
      } else {
        console.log("not auth");
        setUser(null);
        setLoading(false); // Stop loading if not authenticated
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleLoginClick = () => {
    setIsPostVisible(true);
  };

  const handleClosePost = () => {
    setIsPostVisible(false);
  };

  return (
    <section className="main">
      <div className="container">
        <Navbar />
        {user ? (
          <div className="dashboard">
            <div className="dashboardBody">
              <h2>Stories</h2>
              <span>no stories available...</span>
              <div className="dashboardPosts">
                <h2>Recent Posts</h2>
                <span className="PostBar" onClick={handleLoginClick}>
                  What a delicious recipe are you thinking of?
                </span>
                {loading ? (
                  <div>Loading posts...</div>
                ) : (
                  <div className="postsBody">
                    {posts.length > 0 ? (
                      posts.map((postData) => (
                        <div key={postData.postId} className="postItem">
                          <div className="userNameAndImg">
                            <img
                              className="profileImage"
                              src={postData.user.profileImage}
                              alt="user-profile-images"
                            />
                            <h3>{postData.user.firstName}</h3>
                          </div>
                          <p className="userText">{postData.content}</p>
                          <span className="dateSpan">
                            Posted on:{" "}
                            {new Date(postData.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span>No posts available...</span>
                    )}
                  </div>
                )}
              </div>
              {isPostVisible && <Posting onClose={handleClosePost} />}
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <h2>Please log in to view the posts and share your recipes.</h2>
          </div>
        )}
      </div>
    </section>
  );
}

export default Main;
