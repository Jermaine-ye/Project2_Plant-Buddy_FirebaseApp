// newsfeed
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
import ForumComments from './ForumComments';
import ForumComposer from './ForumComposer';

// top level folder name
const FORUM_FOLDER_NAME = 'forumTips'; // for ur case should be forumTips or forumTrade

export default function ForumNewsFeed(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  // const [titleInput, setTitleInput] = useState('');
  // const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

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
    onChildAdded(messagesRef, (data) => {
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
    // return () => {
    //   setMessages([]);
    // };
  }, []);

  //for listening to comments
  useEffect(() => {
    const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildChanged(messagesRef, (data) => {
      console.log('useEffectCA: ', messages);
      console.log('useEffectCASnapshot: ', data);

      setMessages((prevState) => {
        let newState = [...prevState];
        for (let post of newState) {
          if (post.key == data.key) {
            post.val = data.val();
          }
        }
        return newState;
      });
    });
  }, []);

  let messageCards = messages.map((element, i) => (
    <div key={element.key}>
      {/* <Link to={`/forumpost/${i}`}>
                <button
                  onClick={() => props.currentMessage(element, i)}
                >
                  Go To Post
                </button>
              </Link> */}
      <h4>{element.val.title}</h4> <h5>{element.val.message}</h5>
      <img src={element.val.imageLink} alt={element.val.title} width="400vw" />
      <h6>
        {element.val.date}
        <br />
        posted by: {element.val.user}
      </h6>
      <ForumComments messageItem={element} />
    </div>
  ));

  messageCards.reverse();

  return (
    <div>
      <button
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Forum
      </button>
      <br />
      <br />
      {messages && messages.length > 0
        ? messageCards
        : '=Welcome to plant tips='}
      <br />
      <br />
      <ForumComposer />
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={'/community'}>Community</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={'/forums'}>Forums</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={'/recommendations'}>Recommendations</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
