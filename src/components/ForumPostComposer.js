// newsfeed
import {
  onChildAdded,
  onChildChanged,
  update,
  set,
  push,
  ref as databaseRef,
} from 'firebase/database';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { database, storage } from '../DB/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
// import ForumComments from './ForumComments';

// top level folder name
const FORUM_FOLDER_NAME = 'forumTips'; // for ur case should be forumTips or forumTrade
const FORUM_IMAGES_FOLDER_NAME = 'images';

export default function ForumComposer(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState('');
  // const [imagesArray, setImagesArray] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [forumNameInput, setforumNameInput] = useState('');
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  const submitPost = (e) => {
    e.preventDefault();
    let timeStamp = new Date().toLocaleString();

    // declare folder path
    //     const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);
    // const newMessageRef = push(messageListRef);
    const fileRef = storageRef(
      storage,
      forumNameInput + '/' + fileInputFile.name
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messageListRef = databaseRef(database, forumNameInput);
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
          title: titleInput,
          date: timeStamp,
          imageLink: downloadUrl,
          user: user.displayName,
          message: inputMessage,
          comments: [{ text: '', user: '' }],
        });

        alert('new post added');
        console.log('New Post Added');
        setFileInputFile(null);
        setFileInputValue('');
        setInputMessage('');
        setTitleInput('');
      });
    });
  };

  return (
    <div className="post-box">
      <form>
        <input
          type="text"
          placeholder="Title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
        <br />

        <br />
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
          onClick={(e) => submitPost(e)}
          disabled={!inputMessage}
        />
      </form>
    </div>
  );
}
