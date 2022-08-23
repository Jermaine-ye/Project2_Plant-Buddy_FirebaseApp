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

// top level folder name
const FORUM_FOLDER_NAME = 'forumTips'; // for ur case should be forumTips or forumTrade

export default function ForumAddPost(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const [comment, setComment] = useState('');
  // const [newData, setNewData] = useState({});

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

  const createPost = (e) => {
    e.preventDefault();
    let timeStamp = new Date().toLocaleString();

    // declare folder path
    const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);

    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      title: titleInput,
      date: timeStamp,
      user: user.displayName,
      message: inputMessage,
      likes: [],
      comments: [{ text: '', user: '' }],
      // comments: [],
    });
    setInputMessage('');
    setTitleInput('');

    alert('new post added');
    console.log('New Post Added');
  };

  return (
    <div>
      <button
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Forum
      </button>

      <div className="message-box">
        {messages && messages.length > 0 ? (
          messages.map((element, i) => (
            <div key={element.key}>
              <h4>{element.val.title}</h4> <h5>{element.val.message}</h5>
              <h6>
                {element.val.date}
                <br />
                posted by: {element.val.user}
              </h6>
              {/* {element.val.likes.count > 0 ? element.val.likes : null} */}
            </div>
          ))
        ) : (
          <>
            <p>=no messages to display=</p>
          </>
        )}
      </div>

      <div className="comment-box">
        <form>
          <input
            type="text"
            placeholder="Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />

          <br />
          <textarea
            rows="8"
            cols="50"
            placeholder="What are your thoughts?"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          ></textarea>
          <br />
          <input
            type="submit"
            value="Add New Post"
            onClick={(e) => createPost(e)}
          />
        </form>
      </div>

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
