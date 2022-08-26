// postonly working
import {
  onChildAdded,
  onChildChanged,
  update,
  set,
  push,
  ref as databaseRef,
} from 'firebase/database';
import { database, auth } from '../DB/firebase';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ForumComments from './ForumComments';
// import ForumComposer from './ForumComposer';

export default function ForumPost(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { topic } = useParams();
  const FORUM_FOLDER_NAME = topic;

  const [messages, setMessages] = useState({
    key: '',
    val: {},
    // val: { title: '', user: '', imageLink: '', messages: '' },
  });

  const { post } = useParams();
  const location = useLocation();

  useEffect(() => {
    let currentMessage = location.state.messages;
    setMessages(currentMessage);
  }, []);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildChanged(messagesRef, (data) => {
      setMessages((prevState) => {
        let newState = { ...prevState };
        newState.val = data.val();
        return newState;
      });
      console.log('oCA');
    });
    console.log('render changed');
  });

  return (
    <div>
      <input
        type="submit"
        value="Back to Feed"
        onClick={() => navigate(`/forums/${topic}`)}
      />

      <div>
        <h5>
          Title:
          <br />
          {messages.val.title}
          <br />
          Posted By: {messages.val.user} {messages.val.date}
        </h5>

        <h6>{messages.val.message}</h6>
        <br />
        <img
          src={messages.val.imageLink}
          alt={messages.val.title}
          width="400vw"
        />
        <br />
        <h5>Comments:</h5>
        <ForumComments user={user} messages={messages} index={post} />
        <br />
      </div>
      <button
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Main Forum Site
      </button>
    </div>
  );
}
