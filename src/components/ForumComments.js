import { update, ref as databaseRef } from 'firebase/database';
import { Button, Text, Textarea } from '@mantine/core';

import { database, auth } from '../DB/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ForumComments(props) {
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const { topic } = useParams();

  console.log(props.messages);
  const messages = props.messages;

  const user = props.user;

  const FORUM_FOLDER_NAME = topic;

  useEffect(() => {
    console.log('user:', user);
    console.log(messages);
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn:', isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate('/login');
    }
  }, []);

  const addComment = (comment) => {
    if (comment !== '') {
      const messageListRef = databaseRef(database, FORUM_FOLDER_NAME);
      const updates = {};
      let newData = {
        title: messages.val.title,
        date: messages.val.date,
        user: messages.val.user,
        imageLink: messages.val.imageLink,
        message: messages.val.message,
        comments: [
          ...messages.val.comments,
          {
            text: comment,
            user: user.displayName,
            timestamp: new Date().toLocaleString(),
          },
        ],
      };
      updates[messages.key] = newData;
      update(messageListRef, updates).then(() => {
        console.log('reply added');
        setComment('');
      });
    }
  };

  let commentsList = [];
  let postComments = [];
  if (messages.val.comments !== undefined) {
    commentsList = messages.val.comments.filter(
      (comment) => comment.user !== ''
    );
    postComments = commentsList.map((comment) => (
      <Text size="sm" color="dimmed">
        <br />
        <div className="forum-comments" key={comment.key}>
          {comment.user} : {comment.text}
          <br />
          <Text size="xs" color="dimmed">
            {comment.timestamp}
          </Text>
        </div>
        <br />
      </Text>
    ));
  }

  return (
    <div>
      {postComments}

      <Textarea
        placeholder="What are your thoughts?"
        variant="filled"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        autosize
        minRows={2}
      />

      <Button
        variant="filled"
        color="seashell"
        size="xs"
        mt="md"
        radius="md"
        onClick={(e) => {
          addComment(comment);
        }}
      >
        Submit
      </Button>
    </div>
  );
}
