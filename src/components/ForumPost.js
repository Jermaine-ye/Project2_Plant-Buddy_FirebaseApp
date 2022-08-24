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
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ForumComments from './ForumComments';

// top level folder name
const FORUM_FOLDER_NAME = 'forumTips'; // for ur case should be forumTips or forumTrade

export default function ForumPost(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { id } = useParams();
  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
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

  return (
    <div>
      <button
        onClick={() => {
          navigate('/forumnewsfeed');
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
              <ForumComments messageItem={element} />
            </div>
          ))
        ) : (
          <>
            <p>=no messages to display=</p>
          </>
        )}
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
