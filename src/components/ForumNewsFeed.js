import {
  onChildAdded,
  onChildChanged,
  ref as databaseRef,
} from 'firebase/database';
import { Input, Button, Card, Image, Text, Title } from '@mantine/core';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { buddyTheme } from '../Styles/Theme';

import tipsheader from '../images/TipsForum.png';
import tradeheader from '../images/TradingForum.png';

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

  const FORUM_FOLDER_NAME = topic;

  useEffect(() => {
    console.log('user:', user);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);

    onChildAdded(messagesRef, (data) => {
      setMessages((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  useEffect(() => {
    const messagesRef = databaseRef(database, FORUM_FOLDER_NAME);

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
      <div className="forum-messages" key={index} id={messages.key}>
        <Card
          class="forum-mesage-card"
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
        >
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
        <Card
          class="forum-mesage-card"
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
        >
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

  titleOnly.reverse();

  return (
    <div>
      {window.location.pathname.includes('/forumTips') ? (
        <Card
          class="tips-banner"
          p="0"
          sx={{ background: buddyTheme.colors.seashell[5] }}
        >
          <Image
            radius="md"
            width="40vw"
            src={tipsheader}
            alt="forum page header"
          />

          <Title
            class="forum-header"
            order={2}
            color="white"
            sx={{ margin: 'auto', paddingRight: '5px', paddingLeft: '5px' }}
          >
            Plant Care Tips
          </Title>
        </Card>
      ) : (
        <Card
          class="trading-banner"
          p="0"
          sx={{ background: buddyTheme.colors.tan[5] }}
        >
          <Image
            radius="md"
            width="40vw"
            src={tradeheader}
            alt="forum page header"
          />

          <Title
            class="forum-header"
            order={2}
            color="white"
            sx={{ margin: 'auto', paddingRight: '5px', paddingLeft: '5px' }}
          >
            Forum Trading
          </Title>
        </Card>
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
        <>
          <br />
          <Title order={5}>Welcome to the forum page </Title>
          <Text size="md">
            {' '}
            Please be respectful and practice kindness with our words :)
          </Text>
        </>
      ) : titleOnly.length > 0 && search.length == 0 ? (
        <div>{titleOnly}</div>
      ) : (
        <div>{searchList}</div>
      )}
      <br /> <br />
      <ForumComposer />
    </div>
  );
}
