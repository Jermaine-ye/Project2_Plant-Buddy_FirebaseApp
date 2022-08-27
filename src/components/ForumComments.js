//forum comments working
import {
  onChildAdded,
  onChildChanged,
  update,
  set,
  push,
  ref as databaseRef,
} from 'firebase/database';
import { database, auth } from '../DB/firebase';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

export default function ForumComments(props) {
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const { topic } = useParams();

  console.log(props.messages);
  const messages = props.messages;

  const user = props.user;

  const FORUM_FOLDER_NAME = topic;
  const userName = user.displayName;
  const userMessagesFolder = `${userName + '-' + user.uid}`;

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
      // let msg = props.messages;

      const messageListRef = databaseRef(
        database,
        FORUM_FOLDER_NAME + '/' + userMessagesFolder
      );
      const updates = {};
      let newData = {
        title: messages.val.title,
        date: messages.val.date,
        user: messages.val.user,
        imageLink: messages.val.imageLink,
        message: messages.val.message,
        comments: [
          ...messages.val.comments,
          {
            text: comment,
            user: user.displayName,
            timestamp: new Date().toLocaleString(),
          },
        ],
      };
      updates[messages.key] = newData;
      update(messageListRef, updates).then(() => {
        console.log('reply added');
        setComment('');
      });
    }
  };

  let commentsList = [];
  let postComments = [];
  if (messages.val.comments !== undefined) {
    commentsList = messages.val.comments.filter(
      (comment) => comment.user !== ''
    );
    postComments = commentsList.map((comment, index) => (
      <h6 className="forumComments" key={index} id={comment.key}>
        {comment.user} : {comment.text}
        <br />
        {comment.timestamp}
      </h6>
    ));
  }

  return (
    <div>
      {postComments}

      <textarea
        rows="8"
        cols="50"
        placeholder="Comments here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <br />
      <input
        type="submit"
        value="comment"
        onClick={() => {
          addComment(comment);
        }}
      />
    </div>
  );
}
