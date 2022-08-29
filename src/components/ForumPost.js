// postonly working
import {
  onChildAdded,
  onChildChanged,
  update,
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
  Title,
  useMantineTheme,
} from '@mantine/core';
import { database, auth } from '../DB/firebase';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ForumComments from './ForumComments';
// import ForumComposer from './ForumComposer';

export default function ForumPost(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { topic } = useParams();
  const FORUM_FOLDER_NAME = topic;

  const [messages, setMessages] = useState({
    key: '',
    val: {},
  });

  const { post } = useParams();
  const location = useLocation();

  useEffect(() => {
    let currentMessage = location.state.messages;
    setMessages(currentMessage);
  }, []);

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
    const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildChanged(messageListRef, (data) => {
      setMessages((prevState) => {
        let newState = { ...prevState };
        newState.val = data.val();
        return newState;
      });
      console.log('oCA');
    });
    console.log('render changed');
  });

  return (
    <div>
      {/* <input
        type="submit"
        value="Back to Feed"
        onClick={() => navigate(`/forums/${topic}`)}
      /> */}

      <Button
        color="tan"
        variant="filled"
        onClick={() => {
          navigate(`/forums/${topic}`);
        }}
      >
        Back to Feed
      </Button>

      <div className="forum-post-only">
        <br />
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={5} weight={500}>
            {messages.val.title}
          </Title>
          <br />
          <Card.Section>
            {messages.val.imageLink !== '' ? (
              <img
                src={messages.val.imageLink}
                alt={messages.val.title}
                height="350vh"
              />
            ) : null}
          </Card.Section>
          <br />
          <Text size="sm" color="dimmed">
            {messages.val.message}
          </Text>
          <br />
          <Text size="xs" color="dimmed">
            posted by: {messages.val.user} | {messages.val.date}
          </Text>
          <br />
          <hr />
          <br />
          <Title order={6} weight={400} color="dimmed">
            Comments:
          </Title>

          <ForumComments user={user} messages={messages} index={post} />

          <br />
        </Card>

        <br />
      </div>

      <Button
        color="moss"
        variant="filled"
        onClick={() => {
          navigate('/forums');
        }}
      >
        Back to Main Forum Site
      </Button>
    </div>
  );
}
