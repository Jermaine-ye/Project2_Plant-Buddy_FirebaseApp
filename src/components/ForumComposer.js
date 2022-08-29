import { set, push, ref as databaseRef } from 'firebase/database';
import { TextInput, Button, FileInput, Textarea } from '@mantine/core';

import { IconUpload } from '@tabler/icons';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { database, storage } from '../DB/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

export default function ForumComposer(props) {
  const navigate = useNavigate();
  const { topic } = useParams();
  const user = useContext(UserContext);
  const [fileInputFile, setFileInputFile] = useState(null);

  const [titleInput, setTitleInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const FORUM_FOLDER_NAME = topic;
  const FORUM_IMAGES_FOLDER_NAME = 'forumImages';

  useEffect(() => {
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

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

  const uploadImage = (e, index) => {
    const imageName = fileInputFile.name;
    e.preventDefault();
    const fileRef = storageRef(
      storage,
      FORUM_IMAGES_FOLDER_NAME + '/' + imageName
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        alert('new post added');
        console.log('New Post Added');

        return submitPost(downloadUrl);
      });
    });
  };

  return (
    <div className="post-box">
      <TextInput
        label="Post your messages:"
        variant="filled"
        type="text"
        placeholder="Post Title"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
      />
      <br />

      <FileInput
        description="Click to add a photo:"
        variant="filled"
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
    </div>
  );
}
