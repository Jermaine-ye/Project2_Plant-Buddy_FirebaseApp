import { useState, useEffect } from "react";
import { database } from "../DB/firebase";
import { ref as databaseRef, update } from "firebase/database";

export default function Comments(props) {
  const [inputMessage, setInputMessage] = useState("");

  const post = props.post;
  const index = props.index;
  const user = props.user;

  const POSTS_FOLDER_NAME = "communityPosts";
  const postListRef = databaseRef(database, POSTS_FOLDER_NAME);

  let timeStamp = new Date().toLocaleString();
  const submitComment = () => {
    if (inputMessage !== "") {
      const updates = {};
      let newData = {
        date: post.val.date,
        title: post.val.title,
        imageurl: post.val.imageurl,
        likes: post.val.likes,
        author: post.val.author,
        comments: [
          ...post.val.comments,
          {
            text: inputMessage,
            user: user.displayName,
            timestamp: new Date().toLocaleString(),
          },
        ],
        userLikes: post.val.userLikes,
      };
      updates[post.key] = newData;
      update(postListRef, updates).then(() => {
        console.log("comment added!");
      });
      props.handleRender(!props.render);
    }
  };
  let commentsList = [];
  let postComments = [];
  if (post.val.comments !== undefined) {
    commentsList = post.val.comments.filter((comment) => comment.user !== "");
    postComments = commentsList.map((comment) => (
      <div>
        <li>
          {comment.timestamp}, {comment.user} : {comment.text}
        </li>
      </div>
    ));
  }
  // const submitComment = (inputMessage) => {
  //   const updates = {};
  //   let updatedData = {
  //     date: post.val.date,
  //     title: post.val.title,
  //     imageurl: post.val.imageurl,
  //     likes: post.val.likes,
  //     author: post.val.author,
  //     comments: [
  //       ...post.val.comments,
  //       {
  //         text: inputMessage,
  //         user: user.displayName,
  //         // timeStamp: new Date().toLocaleString,
  //       },
  //     ],
  //     userLikes: post.val.userLikes,
  //   };
  //   updates[post.key] = updatedData;
  //   update(postListRef, updates)
  //     .then(() => {
  //       console.log("comment added");
  //     })
  //     .catch((err) => console.log(err));
  //   setInputMessage("");
  // };

  return (
    <div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Comment"
      />
      <input
        type="submit"
        value="Add Comment"
        onClick={() => {
          submitComment();
          // let newData = {
          //   date: post.val.date,
          //   title: post.val.title,
          //   imageurl: post.val.imageurl,
          //   likes: post.val.likes,
          //   author: post.val.author,
          //   comments: [
          //     ...post.val.comments,
          //     {
          //       text: inputMessage,
          //       user: user.displayName,
          //       timestamp: new Date().toLocaleString(),
          //     },
          //   ],
          //   userLikes: post.val.userLikes,
          // };
          // props.handleUpdate(newData, index);
        }}
      />

      <ul>{postComments}</ul>
    </div>
  );
}
