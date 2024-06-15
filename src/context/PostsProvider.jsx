// PostsContext.js
import React, { createContext, useState } from "react";
import {
  onValue,
  ref,
  set,
  push,
  query,
  orderByChild,
} from "firebase/database";
import { database } from "../firebase.js";

export const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPostData, setEditPostData] = useState(null);

  const createPost = async (userId, postData) => {
    try {
      const newPostRef = push(ref(database, `posts`));
      const postId = newPostRef.key;

      const newPostData = {
        postId: postId,
        ...postData,
        createdAt: new Date().toISOString(),
        userId: userId,
      };

      await set(newPostRef, newPostData);

      console.log("Post created successfully:", postId);
      return newPostData; // Return the newly created post data
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const fetchUser = (userId) => {
    return new Promise((resolve, reject) => {
      const userRef = ref(database, `users/${userId}`);
      onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve(data);
          } else {
            reject(`No user data for userId: ${userId}`);
          }
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  };

  const editPost = (userPostId) => {
    const postRef = ref(database, `posts/${userPostId}`);
    onValue(
      postRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEditPostData(data.content);
        }
      },
      (error) => {
        console.error("Error fetching posts:", error.message);
      }
    );
  };

  const fetchPosts = () => {
    console.log("fetching");
    setLoading(true);
    const postsRef = query(ref(database, "posts"), orderByChild("createdAt"));

    onValue(
      postsRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postEntries = Object.entries(data);
          const postsWithUserPromises = postEntries.map(
            async ([postId, post]) => {
              const userData = await fetchUser(post.userId);
              return { ...post, user: userData };
            }
          );

          const postsWithUserData = await Promise.all(postsWithUserPromises);
          postsWithUserData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          // console.log(postsWithUserData);
          setPosts(postsWithUserData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error.message);
        setLoading(false);
      }
    );
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        editPostData,
        setPosts,
        setLoading,
        fetchPosts,
        setEditPostData,
        fetchUser,
        editPost,
        createPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
export default PostsProvider;
