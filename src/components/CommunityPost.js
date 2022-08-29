import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { database } from "../DB/firebase";
import { ref as databaseRef, onChildChanged } from "firebase/database";
import Likes from "./CommunityLikes";
import Comments from "./CommunityComments";
import {
  Badge,
  Button,
  Card,
  CardSection,
  Grid,
  Image,
  Text,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

export default function Post(props) {
  // const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [render, setRender] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState([]);
  const user = useContext(UserContext);

  const navigate = useNavigate();
  const { index } = useParams();
  const location = useLocation();

  useEffect(() => {
    let currentPost = location.state.post;
    setPost(currentPost);
  }, []);

  const POSTS_FOLDER_NAME = "communityPosts";

  useEffect(() => {
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    onChildChanged(postListRef, (data) => {
      console.log("updated-data: ", data.val());
      setPost((prevState) => {
        let newState = { ...prevState };
        newState.val = data.val();
        return newState;
      });
    });
  });

  const handleShowCommentInput = (index) => {
    let comList = [...showCommentInput];
    console.log(comList);
    if (comList.includes(index)) {
      let i = comList.indexOf(index);
      comList.splice(i, 1);
      console.log("splicing");
    } else {
      comList.push(index);
    }
    setShowCommentInput(comList);
  };
  const { id } = useParams();

  const crumbs = [
    { title: "Community Feed", href: "/community" },
    { title: "Current Post", href: `/community/posts/${id}` },
  ].map((crumb, index) => {
    return (
      <Anchor href={crumb.href} key={index}>
        <Text size="xs"> {crumb.title}</Text>
      </Anchor>
    );
  });

  return Object.keys(post).length > 0 ? (
    <div>
      <Breadcrumbs>{crumbs}</Breadcrumbs>
      <br />
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        sx={{ width: "88vw", color: "#1f3b2c" }}
      >
        <li key={post.key} className="community-list-item">
          <CardSection p="xs">
            <Grid>
              <Grid.Col span={2}>
                <Badge color="teal" size="md" variant="dot">
                  <Text size="sm">{post.val.author}</Text>
                </Badge>
              </Grid.Col>
              <Grid.Col span={10}>
                <Text size="xs" weight="500" align="right">
                  {post.val.dateShort}
                </Text>
              </Grid.Col>
            </Grid>
            <br />

            <Image
              className="community-post-img"
              src={post.val.imageurl}
              alt={post.val.imageurl}
            />
          </CardSection>
          <Grid align="center">
            <Grid.Col span={9}>
              <Text size="sm" weight={500} align="left">
                {post.val.title}
              </Text>
            </Grid.Col>
            <Grid.Col span={1}>
              <Text size="sm" align="right">
                {post.val.likes}
              </Text>
            </Grid.Col>
            <Grid.Col span={1}>
              <Likes user={user} post={post} index={index} />
            </Grid.Col>
            <Grid.Col span={1}>
              <button
                type="submit"
                className="remove-button"
                onClick={() => {
                  handleShowCommentInput(index);
                }}
              >
                <ChatBubbleIcon />
              </button>
            </Grid.Col>
          </Grid>
          <br />

          <Comments
            showCommentInput={showCommentInput}
            handleShowCommentInput={handleShowCommentInput}
            user={user}
            post={post}
            index={index}
            // handleUpdates={() => handleUpdates()}
          />
          <br />
        </li>
      </Card>
      <br />
      {/* <Button
        variant="default"
        size="xs"
        compact
        onClick={() => {
          navigate("/community");
        }}
      >
        Back to Community
      </Button> */}
    </div>
  ) : null;
}
