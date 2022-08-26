// newsfeed working
import {
  onChildAdded,
  onChildChanged,
  ref as databaseRef,
} from 'firebase/database';
import { database } from '../DB/firebase';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

import ForumComposer from './ForumComposer';

export default function ForumNewsFeed(props) {
  const navigate = useNavigate();
  const { topic } = useParams();
  const user = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [searchFeed, setSearchFeed] = useState([]);
  const [messages, setMessages] = useState([]);

  //useParams to point to forumfoldername so it does not show empty state on back
  const FORUM_FOLDER_NAME = topic;

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

  const searchTheFeed = (search) => {
    console.log(search);
    console.log(messages);
    if (search.length > 0) {
      let searchItem = messages.filter((messages) => {
        return (
          messages.val.title.toLowerCase().includes(search.toLowerCase()) ||
          messages.val.user.toLowerCase().includes(search.toLowerCase())
        );
      });

      console.log(searchItem);
      setSearchFeed(searchItem);
    }
  };

  let searchList = searchFeed.map((messages, index) => {
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
        <h6>
          {messages.val.date}
          <br />
          posted by: {messages.val.user}
        </h6>
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
      {/* {messages && messages.length > 0 ? titleOnly : '=Welcome to plant tips='} */}
      <br />
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchTheFeed(e.target.value);
        }}
      />

      {titleOnly.length > 0 && search.length == 0 ? (
        <div>
          <ul>{titleOnly}</ul>
        </div>
      ) : (
        <div>
          <ul>{searchList}</ul>
        </div>
      )}

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
