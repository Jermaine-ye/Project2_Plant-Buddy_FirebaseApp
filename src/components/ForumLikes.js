// import React, { useEffect, useState } from 'react';
// import { ref, update } from 'firebase/database';
// import { database } from './firebase';

// const FORUM_FOLDER_NAME = 'forumTips';

// export default function Likes(props) {
//   const [newData, setNewData] = useState({});

//   const updateLikes = (msg, i) => {
//     const messageListRef = ref(database, FORUM_FOLDER_NAME);
//     const updates = {};
//     let updatedData = {
//       title: msg.val.titleInput,
//       date: msg.val.date,
//       user: msg.val.user,
//       likes: { count: msg.val.likes + 1, user: msg.val.user },
//       message: msg.val.message,
//       comments: msg.val.comments,
//     };
//     setNewData({ updatedData });
//     updates[msg.key] = updatedData;
//     update(messageListRef, updates).then(() => {
//       console.log(newData);
//       console.log('data updated!');
//     });
//   };

//   return (
//     <div>
//       <p>{props.likes} Likes</p>
//       <input
//         type="submit"
//         value="Like"
//         onClick={() => {
//           updateLikes(props.message, props.index);
//           let updatedData = {
//             date: props.message.val.date,
//             user: props.message.val.user,
//                  likes: props.count: message.val.likes + 1, user: msg.val.user },
//             message: props.message.val.message,
//             comments: props.message.val.comments,
//           };
//           props.handleClick(props.index, updatedData);
//         }}
//       />
//     </div>
//   );
// }
