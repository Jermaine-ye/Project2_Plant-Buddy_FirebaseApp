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
  TextInput,
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
  Textarea,
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
  // const [fileInputValue, setFileInputValue] = useState('');

  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const FORUM_FOLDER_NAME = topic;
  const FORUM_IMAGES_FOLDER_NAME = 'forumImages';
  const userName = user.displayName;

  // const userMessagesFolder = `${userName + '-' + user.uid}`;

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  // const handleFileInputChange = (event) => {
  //   setFileInputFile(event.target.files[0]);
  //   setFileInputValue(event.target.value);
  // };

  const submitPost = (downloadUrl) => {
    let timeStamp = new Date().toLocaleString();
    const messageListRef = databaseRef(
      database,
      FORUM_FOLDER_NAME
      // FORUM_FOLDER_NAME + '/' + userMessagesFolder
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
      FORUM_IMAGES_FOLDER_NAME + '/' + imageName
      // FORUM_IMAGES_FOLDER_NAME + '/' + userMessagesFolder + '/' + imageName
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        alert('new post added');
        console.log('New Post Added');

        //  setFileInputFile(null);
        // setFileInputValue('');
        return submitPost(downloadUrl);
      });
    });
  };

  return (
    <div className="post-box">
      <TextInput
        // size="md"
        label="Post your messages:"
        variant="filled"
        type="text"
        placeholder="Post Title"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
      />
      <br />

      {/* <input
          type="file"
          value={fileInputValue}
          onChange={handleFileInputChange}
        /> */}

      <FileInput
        // placeholder={fileInputValue}
        description="Click to add a photo:"
        variant="filled"
        // label="Upload Photos"
        icon={<IconUpload size={14} />}
        value={fileInputFile}
        onChange={setFileInputFile}
      />

      <br />

      <Textarea
        placeholder="What are your thoughts?"
        variant="filled"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        autosize
        minRows={2}
      />

      <Button
        variant="filled"
        color="tan"
        size="sm"
        mt="md"
        radius="md"
        onClick={(e) => {
          fileInputFile ? uploadImage(e) : submitPost('');
          setFileInputFile('');
        }}
      >
        Submit
      </Button>
      {/* <input
          type="submit"
          value="Add New Post"
          onClick={(e) => {
            fileInputFile ? uploadImage(e) : submitPost('');
          }}
          disabled={!inputMessage}
        /> */}
    </div>
  );
}
