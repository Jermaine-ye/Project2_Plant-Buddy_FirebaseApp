//forum comments
import {
  onChildAdded,
  onChildChanged,
  update,
  set,
  push,
  ref as databaseRef,
} from 'firebase/database';
import { database, auth } from '../DB/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

export default function ForumComments(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [comment, setComment] = useState('');
  // const [newData, setNewData] = useState({});
  const [messages, setMessages] = useState(props);

  const FORUM_FOLDER_NAME = 'forumTips';

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    console.log(messages);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  const addComment = (comment) => {
    if (comment !== '') {
      let msg = props.messageItem;
      console.log(msg.val);
      const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);
      const updates = {};
      let newData = {
        title: msg.val.title,
        date: msg.val.date,
        user: msg.val.user,
        imageLink: msg.val.imageLink,
        message: msg.val.message,
        comments: [
          ...msg.val.comments,
          { text: comment, user: user.displayName },
        ],
      };
      updates[msg.key] = newData;
      update(messageListRef, updates).then(() => {
        console.log('reply added');
      });
    }
  };

  console.log(props.messageItem);
  let comments = props.messageItem.val.comments.filter(
    (comment) => comment.text.length > 0
  );

  return (
    <div className="comments-box">
      <p>Comments:</p>
      {comments && comments.length > 0
        ? comments.map((comment, key) => (
            <div className="user-comments" key={key}>
              <h6>
                {comment.user}: {comment.text}
              </h6>
            </div>
          ))
        : null}

      <input
        type="text"
        value={comment}
        placeholder="Comments"
        onChange={(e) => setComment(e.target.value)}
      />
      <input
        type="submit"
        value="comment"
        onClick={() => {
          addComment(comment);
          setComment('');
        }}
      />
    </div>
  );
}
