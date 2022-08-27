// newsfeed working
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  update,
  remove,
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
  useMantineTheme,
} from '@mantine/core';
import {
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { database, storage } from '../DB/firebase';
import { useNavigate, Link, useParams } from 'react-router-dom';
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

  useEffect(() => {
    const messageListRef = databaseRef(
      database,
      FORUM_FOLDER_NAME + '/' + userMessagesFolder
    );
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messageListRef, (data) => {
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  //for listening to comments
  useEffect(() => {
    const messageListRef = databaseRef(
      database,
      FORUM_FOLDER_NAME + '/' + userMessagesFolder
    );

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildChanged(messageListRef, (data) => {
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

  // useEffect(() => {
  //   const messageListRef = databaseRef(
  //     database,
  //     FORUM_FOLDER_NAME + '/' + userMessagesFolder
  //   );
  //   onChildRemoved(messageListRef, (data) =>
  //     setMessages((prevState) => {
  //       let newState = { ...prevState };
  //       delete newState[data.key];

  //       return newState;
  //     })
  //   );
  // }, []);

  let titleOnly = messages.map((messages, index) => {
    return (
      <div className="forumMessages" key={index} id={messages.key}>
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
        {/* <button
          id={messages.key}
          onClick={(e, id) => {
            props.handleDeleteMessage(e, index, id);
          }}
        >
          delete Post
        </button> */}
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
      <div className="forumMessages" key={index} id={messages.key}>
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
        {/* <button
          id={messages.key}
          onClick={(e, id) => {
            props.handleDeleteMessage(e, index, id);
          }}
        >
          delete Post
        </button> */}
      </div>
    );
  });

  // const handleDeleteMessage = (e, index, id) => {
  //   // //delete from realtime database
  //   // const plantEntryRef = databaseRef(
  //   //   database,
  //   //   USER_PLANT_FOLDER_NAME + '/' + userPlantFolder + '/' + plantEntry
  //   // );
  //   const messageEntry = e.target.id;
  //   const messageListRef = databaseRef(
  //     database,
  //     FORUM_FOLDER_NAME + '/' + userMessagesFolder + '/' + messageEntry
  //   );

  //   remove(messageListRef);
  //   // delete image from storage

  //   const fileRef = storageRef(
  //     storage,
  //     FORUM_IMAGES_FOLDER_NAME +
  //       '/' +
  //       userMessagesFolder +
  //       '/' +
  //       props.imageName
  //   );

  //   deleteObject(fileRef)
  //     .then(() => {
  //       console.log(props.fileInputFile);
  //       console.log('image deleted!');
  //     })
  //     .catch((error) => console.log(error));
  // };

  titleOnly.reverse();

  return (
    <div>
      <Button
        color="pink"
        // variant="light"
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Main Forum Site
      </Button>
      <br />

      <br />

      <Input
        icon={<MagnifyingGlassIcon />}
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
