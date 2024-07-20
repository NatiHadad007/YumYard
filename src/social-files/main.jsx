import React, { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import Posting from "./posting";
import Navbar from "./navBar";
import { PostsContext } from "../context/PostsProvider.jsx";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { ref, remove } from "firebase/database";
import { database } from "../firebase.js";

function Main() {
  const [isPostVisible, setIsPostVisible] = useState(false);
  const [user, setUser] = useState(null);
  const {
    posts,
    loading,
    setLoading,
    fetchPosts,
    editPost,
    setEditPostData,
    isPostImage,
  } = useContext(PostsContext);
  const [currentUserId, setcurrentUserId] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setcurrentUserId(currentUser.uid);
        setUser(currentUser);
        fetchPosts();
      } else {
        setUser(null);
        setLoading(false); // Stop loading if not authenticated
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleInputClick = () => {
    setIsPostVisible(true);
    setEditPostData("");
  };

  const handleClosePost = () => {
    setIsPostVisible(false);
  };

  const handleTrashClick = async (postId, e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      const postRef = ref(database, `posts/${postId}`);
      try {
        await remove(postRef);
        console.log(`Post with ID ${postId} deleted successfully`);
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error.message);
      }
    } else {
      console.log("Post deletion canceled");
    }
  };

  const handleEditClick = async (postId, e) => {
    editPost(postId);
    e.preventDefault();
    setIsPostVisible(true);
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
                <div className="inputContainer">
                  <span className="PostBar" onClick={handleInputClick}>
                    What a delicious recipe are you thinking of?
                  </span>
                </div>

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
                              src={
                                postData.user.profileImage
                                  ? postData.user.profileImage
                                  : "https://cdn0.iconfinder.com/data/icons/actions-ono-system-core/30/account_circle-profile-profile_picture-default_picture-512.png"
                              }
                              alt="user-profile-images"
                            />
                            <h3>{postData.user.firstName}</h3>
                          </div>
                          <p className="userText">{postData.content}</p>
                          {postData.postImages && (
                            <div className="postImageContainer">
                              <img
                                src={postData.postImages}
                                className="postImage"
                                alt="post-image"
                              />
                            </div>
                          )}
                          <span className="dateSpan">
                            Posted on:{" "}
                            {new Date(postData.createdAt).toLocaleString()}
                          </span>
                          {postData.userId === currentUserId && (
                            <div className="trashIconContainer">
                              <FaRegTrashAlt
                                className="trashIcon"
                                onClick={(e) =>
                                  handleTrashClick(postData.postId, e)
                                }
                              />
                              <RiEditLine
                                className="editIcon"
                                onClick={(e) =>
                                  handleEditClick(postData.postId, e)
                                }
                              />
                            </div>
                          )}
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
            <h2>
              Please log in first to view the posts and share your recipes.
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}

export default Main;
