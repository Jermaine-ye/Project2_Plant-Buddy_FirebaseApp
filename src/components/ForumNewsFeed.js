// newsfeed working
import {
  onChildAdded,
  onChildChanged,
  ref as databaseRef,
} from 'firebase/database';
import { database } from '../DB/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

import ForumComposer from './ForumComposer';

const FORUM_FOLDER_NAME = 'forumTips';

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

  // let messageCards = messages.map((messages, i) => {
  //   return (
  //     <div key={messages.key}>
  //       {/* <Link to={`forumpost/${i}`} state={{ messages}}>
  //         {console.log(messages)}
  //         Go To Post
  //       </Link> */}
  //       {console.log('e.val', messages.val)}
  //       <h4>{messages.val.title}</h4> <h5>{messages.val.message}</h5>
  //       <img
  //         src={messages.val.imageLink}
  //         alt={messages.val.title}
  //         width="400vw"
  //       />
  //       <h6>
  //         {messages.val.date}
  //         <br />
  //         posted by: {messages.val.user}
  //       </h6>
  //       <ForumComments messageItem={messages} />
  //     </div>
  //   );
  // });

  let titleOnly = messages.map((messages, index) => {
    return (
      <div key={messages.key}>
        <button>
          <Link to={`forumpost/${index}`} state={{ messages }}>
            {console.log(messages)}
            Go To Post
          </Link>
        </button>
        {console.log('e.val', messages.val)}
        <h5>{messages.val.title}</h5> <h5>{messages.val.message}</h5>
        {/* <img
            src={messages.val.imageLink}
            alt={messages.val.title}
            width="400vw"
          /> */}
        <h6>
          {messages.val.date}
          <br />
          posted by: {messages.val.user}
        </h6>
        {/* <ForumComments user={user} messages={messages} index={index} /> */}
      </div>
    );
  });

  titleOnly.reverse();

  return (
    <div>
      <button
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Main Forum Site
      </button>
      <br />

      {/* {messages && messages.length > 0
        ? messageCards
        : '=Welcome to plant tips='} */}
      {messages && messages.length > 0 ? titleOnly : '=Welcome to plant tips='}
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
