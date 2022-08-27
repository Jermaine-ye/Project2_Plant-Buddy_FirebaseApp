// composer
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
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
// import ForumComments from './ForumComments';

export default function ForumComposer(props) {
  const navigate = useNavigate();
  const { topic } = useParams();
  const user = useContext(UserContext);
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState('');
  // const [imagesArray, setImagesArray] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  // const [messages, setMessages] = useState([]);

  const FORUM_FOLDER_NAME = topic;
  const FORUM_IMAGES_FOLDER_NAME = 'images';

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  // useEffect(() => {
  //   const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);
  //   // onChildAdded will return data for every child at the reference and every subsequent new child
  //   onChildAdded(messagesRef, (data) => {
  //     setMessages((prev) => [...prev, { key: data.key, val: data.val() }]);
  //   });
  //   return () => {
  //     setMessages([]);
  //   };
  // }, []);

  // useEffect(() => {
  //   const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);

  //   // onChildAdded will return data for every child at the reference and every subsequent new child
  //   onChildChanged(messagesRef, (data) => {
  //     console.log('useEffectCA: ', messages);
  //     console.log('useEffectCASnapshot: ', data);

  //     setMessages((prevState) => {
  //       let newState = [...prevState];
  //       for (let post of newState) {
  //         if (post.key == data.key) {
  //           post.val = data.val();
  //         }
  //       }
  //       return newState;
  //     });
  //   });
  // }, []);

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.value);
  };

  const submitPost = (downloadUrl) => {
    let timeStamp = new Date().toLocaleString();
    const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      title: titleInput,
      date: timeStamp,
      imageLink: downloadUrl,
      user: user.displayName,
      message: inputMessage,
      comments: [{ text: '', user: '' }],
    });
    setInputMessage('');
    setTitleInput('');
  };

  const uploadImage = (e) => {
    e.preventDefault();
    const fileRef = storageRef(
      storage,
      FORUM_IMAGES_FOLDER_NAME + '/' + fileInputFile.name
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        alert('new post added');
        console.log('New Post Added');
        setFileInputFile(null);
        setFileInputValue('');
        return submitPost(downloadUrl);
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
        <input
          type="file"
          value={fileInputValue}
          onChange={handleFileInputChange}
        />
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
          onClick={(e) => {
            fileInputFile ? uploadImage(e) : submitPost('');
          }}
          disabled={!inputMessage}
        />
      </form>
    </div>
  );
}
