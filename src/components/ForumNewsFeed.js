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
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from '@radix-ui/react-icons';

import tipsheader from '../images/PC1.png';
import tradeheader from '../images/TR1.png';

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
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={5} weight={500}>
            {messages.val.title}
          </Title>
          <br />

          <Text size="sm" color="dimmed">
            {messages.val.message}
          </Text>
          <br />
          <Text size="xs" color="dimmed">
            posted by: {messages.val.user} | {messages.val.date}
          </Text>
          <Link to={`forumpost/${index}`} state={{ messages }}>
            <Button
              // leftIcon={<IconPlant2 />}
              variant="filled"
              color="seashell"
              size="xs"
              mt="md"
              radius="md"
              component="a"
            >
              Head to Post
            </Button>
          </Link>
        </Card>
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
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={5} weight={500}>
            {messages.val.title}
          </Title>
          <br />

          <Text size="sm" color="dimmed">
            {messages.val.message}
          </Text>
          <br />
          <Text size="xs" color="dimmed">
            posted by: {messages.val.user} | {messages.val.date}
          </Text>
          <Link to={`forumpost/${index}`} state={{ messages }}>
            <Button
              // leftIcon={<IconPlant2 />}
              variant="filled"
              color="seashell"
              size="xs"
              mt="md"
              radius="md"
              component="a"
            >
              Head to Post
            </Button>
          </Link>
        </Card>

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
      {window.location.pathname.includes('/forumTips') ? (
        <Image radius="md" src={tipsheader} alt="forum page header" />
      ) : (
        <Image radius="md" src={tradeheader} alt="forum page header" />
      )}
      <br />
      <Button
        color="moss"
        variant="filled"
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
        placeholder="Search Forum"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchTheFeed(e.target.value);
        }}
      />
      <br />
      {titleOnly.length == 0 && search.length == 0 ? (
        <div>
          <br />
          <Title order={5}>Welcome to the forum page </Title>
          <Text size="md">
            {' '}
            Please be respectful and practice kindness with our words :)
          </Text>
        </div>
      ) : titleOnly.length > 0 && search.length == 0 ? (
        <div>{titleOnly}</div>
      ) : (
        <div>{searchList}</div>
      )}
      {/* {titleOnly.length > 0 && search.length == 0 ? (
        <div>
          <ul>{titleOnly}</ul>
        </div>
      ) : (
        <div>
          <ul>{searchList}</ul>
        </div>
      )} */}
      <br /> <br />
      <ForumComposer />
    </div>
  );
}
