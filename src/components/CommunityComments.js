import { useState, useEffect } from "react";
import { database } from "../DB/firebase";
import { ref as databaseRef, update } from "firebase/database";
import { format } from "date-fns";

//import styling
import { Badge, Grid, Text } from "@mantine/core";
import { PlusIcon } from "@radix-ui/react-icons";

export default function Comments(props) {
  const [inputMessage, setInputMessage] = useState("");

  const post = props.post;
  const index = props.index;
  const user = props.user;

  const POSTS_FOLDER_NAME = "communityPosts";
  const postListRef = databaseRef(database, POSTS_FOLDER_NAME);

  const submitComment = () => {
    if (inputMessage !== "") {
      const updates = {};
      let newData = {
        date: post.val.date,
        dateShort: post.val.dateShort,
        title: post.val.title,
        imageurl: post.val.imageurl,
        likes: post.val.likes,
        author: post.val.author,
        comments: [
          ...post.val.comments,
          {
            text: inputMessage,
            user: user.displayName,
            timestamp: new Date().toLocaleString(),
            timestampShort: format(new Date(), "dd MMM"),
          },
        ],
        userLikes: post.val.userLikes,
      };
      updates[post.key] = newData;
      update(postListRef, updates).then(() => {
        console.log("comment added!");
        setInputMessage("");
      });
    }
  };
  let commentsList = [];
  let postComments = [];
  if (post.val.comments !== undefined) {
    commentsList = post.val.comments.filter((comment) => comment.user !== "");
    postComments = commentsList.map((comment, index) => (
      <div key={`comments-${index}`}>
        <Grid>
          <Grid.Col span={3}>
            <Badge color="gray" size="xs">
              <Text size="xs" weight="400" align="left">
                {comment.user}
              </Text>
            </Badge>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" align="left">
              {comment.text}
            </Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text size="xs" align="right" weight="200">
              {comment.timestampShort}
            </Text>
          </Grid.Col>
        </Grid>
      </div>
    ));
  }

  return (
    <div>
      {props.showCommentInput.includes(index) ? (
        <div>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Comment"
          />
          <button
            type="submit"
            className="remove-button"
            onClick={() => {
              submitComment();
              props.handleShowCommentInput(index);
            }}
          >
            <PlusIcon />
          </button>
        </div>
      ) : null}
      {postComments}
    </div>
  );
}
