import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ref as databaseRef, update } from "firebase/database";
import { database } from "../DB/firebase";

export default function Likes(props) {
  const [like, setLike] = useState(props.likes);
  // state to check if user has liked the post already
  const [postLike, setPostLike] = useState(false);
  const [newData, setNewData] = useState({});

  const user = props.user;
  const navigate = useNavigate();
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (Object.keys(isLoggedIn).length === 0) {
      navigate("/login");
    }
  });

  const POSTS_FOLDER_NAME = "communityPosts";
  let post = props.post;
  let index = props.index;

  const updateLikes = (post) => {
    const updates = {};
    console.log(props.index);
    console.log(post);
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    let updatedData = {
      date: post.val.date,
      title: post.val.title,
      imageurl: post.val.imageurl,
      likes: post.val.userLikes.includes(user.displayName)
        ? post.val.likes - 1
        : post.val.likes + 1,
      author: post.val.author,
      comments: post.val.comments,
      userLikes: post.val.userLikes.includes(user.displayName)
        ? post.val.userLikes.filter(function (name) {
            return name !== user.displayName;
          })
        : [...post.val.userLikes, user.displayName],
    };
    setNewData(updatedData);
    updates[post.key] = updatedData;
    console.log(updates);
    update(postListRef, updates).then(() => {
      console.log("data updated");
    });
  };
  return (
    <div>
      <input
        type="submit"
        value="Like"
        onClick={() => updateLikes(props.post)}
      />
    </div>
  );
}
