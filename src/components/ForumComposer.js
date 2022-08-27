// composer
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  update,
  remove,
  set,
  push,
  ref as databaseRef,
} from 'firebase/database';
import {
  Input,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  FileInput,
  Center,
  useMantineTheme,
} from '@mantine/core';

import { IconUpload } from '@tabler/icons';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import { database, storage } from '../DB/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

// import ForumComments from './ForumComments';

export default function ForumComposer(props) {
  const navigate = useNavigate();
  const { topic } = useParams();
  const user = useContext(UserContext);
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState('');

  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const FORUM_FOLDER_NAME = topic;
  const FORUM_IMAGES_FOLDER_NAME = 'forumImages';
  const userName = user.displayName;

  const userMessagesFolder = `${userName + '-' + user.uid}`;

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.value);
  };

  const submitPost = (downloadUrl) => {
    let timeStamp = new Date().toLocaleString();
    const messageListRef = databaseRef(
      database,
      FORUM_FOLDER_NAME + '/' + userMessagesFolder
    );
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

  const uploadImage = (e, index) => {
    const imageName = fileInputFile.name;
    e.preventDefault();
    const fileRef = storageRef(
      storage,
      FORUM_IMAGES_FOLDER_NAME + '/' + userMessagesFolder + '/' + imageName
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        alert('new post added');
        console.log('New Post Added');
        console.log(fileInputFile);
        console.log(fileInputFile.name);
        //  setFileInputFile(null);
        setFileInputValue('');
        return submitPost(downloadUrl);
      });
    });
  };

  return (
    <div className="post-box">
      <form>
        <Input
          centered
          // size="md"
          width={200}
          type="text"
          placeholder="Title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />

        {/* <input
          type="file"
          value={fileInputValue}
          onChange={handleFileInputChange}
        /> */}
        <div style={{ width: 200 }}>
          <FileInput
            label="Upload Photos"
            placeholder="Click to upload images"
            icon={<IconUpload size={14} />}
            // value={fileInputValue}
            onChange={handleFileInputChange}
          />
        </div>

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
