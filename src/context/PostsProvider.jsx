// PostsContext.js
import React, { createContext, useState } from "react";
import {
  onValue,
  ref,
  update,
  set,
  push,
  query,
  orderByChild,
} from "firebase/database";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { database, storage } from "../firebase.js";
import { v4 } from "uuid";

export const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPostData, setEditPostData] = useState(null);
  const [isEditPost, setIsEditPost] = useState(false);
  const [isPostImage, setIsPostImage] = useState("");

  const createPost = async (userId, postData) => {
    try {
      const newPostRef = push(ref(database, `posts`));
      const postId = newPostRef.key;
      const newPostData = {
        postId: postId,
        ...postData,
        createdAt: new Date().toISOString(),
        userId: userId,
        postImages: isPostImage,
      };

      await set(newPostRef, newPostData);

      console.log("Post created successfully:", postId);
      setIsPostImage("");
      return newPostData; // Return the newly created post data
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const postImages = async (postsImages) => {
    let PostImageUrl = "";
    if (postsImages != null) {
      const metadata = {
        contentType: postsImages.type,
      };
      const uniqueImageName = `${postsImages.name}_${v4()}`;
      const imageRef = storageRef(storage, `PostImageUrl/${uniqueImageName}`);
      await uploadBytes(imageRef, postsImages, metadata);
      PostImageUrl = await getDownloadURL(imageRef);
      setIsPostImage(PostImageUrl);
      console.log(PostImageUrl);
    }
    return PostImageUrl;
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

  const editPost = (postId) => {
    setIsEditPost(true);
    const postRef = ref(database, `posts/${postId}`);
    onValue(
      postRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEditPostData({ ...data, postId });
        }
      },
      (error) => {
        console.error("Error fetching posts:", error.message);
      }
    );
  };

  const updatePost = async (postId, postData) => {
    try {
      const postRef = ref(database, `posts/${postId}`);
      await update(postRef, postData);
      console.log("Post updated successfully:", postId);
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
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
        isEditPost,
        isPostImage,
        setPosts,
        updatePost,
        setIsEditPost,
        postImages,
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
