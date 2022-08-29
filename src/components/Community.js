import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import communityheader from "../styling/Drawkit Plants/Drawkit_02_Community.png";

//styling imports
import {
  Button,
  Card,
  CardSection,
  Image,
  Text,
  Grid,
  Badge,
  Modal,
  Input,
  Title,
  Footer,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import {
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { buddyTheme } from "../Styles/Theme";

//firebase imports
import {
  onChildAdded,
  onChildChanged,
  ref as databaseRef,
} from "firebase/database";
import { database } from "../DB/firebase";

//child components

import Likes from "./CommunityLikes";
import Comments from "./CommunityComments";
import AddPost from "./AddPost";

export default function Community(props) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchFeed, setSearchFeed] = useState([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [showCommentInput, setShowCommentInput] = useState([]);
  const [addPost, setAddPost] = useState(false);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (Object.keys(isLoggedIn).length === 0) {
      navigate("/login");
    }
  });
  const POSTS_FOLDER_NAME = "communityPosts";
  useEffect(() => {
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    // let postList = [];
    onChildAdded(postListRef, (data) => {
      setPosts((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

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

  // check if this causes long reload times
  useEffect(() => {
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    onChildChanged(postListRef, (data) => {
      console.log("updated-data: ", data.val());
      console.log(data.key);
      setPosts((prevState) => {
        let newState = [...prevState];
        for (let post of newState) {
          if (post.key == data.key) {
            post.val = data.val();
          }
        }
        return newState;
      });
      console.log("oCC");
    });
  });
  const postsReverse = [...posts].reverse();
  const postFeed = postsReverse.map((post, index) => {
    return (
      <div>
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

              <Link to={`posts/${index}`} state={{ post }}>
                <Image
                  className="community-post-img"
                  src={post.val.imageurl}
                  alt={post.val.imageurl}
                />
              </Link>
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
      </div>
    );
  });
  const searchTheFeed = (search) => {
    let list = [];
    if (search.length > 0) {
      let searchItem = postsReverse.filter((post) => {
        return (
          post.val.title.toLowerCase().includes(search.toLowerCase()) ||
          post.val.author.toLowerCase().includes(search.toLowerCase())
        );
      });

      setSearchFeed(searchItem);
    }
  };
  const closeModal = () => {
    setAddPost(false);
  };

  const searchList = searchFeed.map((post, index) => {
    return (
      <div>
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

              <Link to={`posts/${index}`} state={{ post }}>
                <Image
                  className="community-post-img"
                  src={post.val.imageurl}
                  alt={post.val.imageurl}
                />
              </Link>
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
      </div>
    );
  });
  return (
    <div>
      <Card p="0" sx={{ background: buddyTheme.colors.tan[5] }}>
        <div className="community-dashboard-banner">
          <Image
            radius="md"
            width="40vw"
            src={communityheader}
            alt={communityheader}
          />
          <Title
            order={2}
            color="white"
            sx={{ margin: "auto", paddingRight: "5px", paddingLeft: "5px" }}
          >
            Connect with your buddies, {user.displayName}
          </Title>
        </div>
      </Card>
      <br />
      <Input
        icon={<MagnifyingGlassIcon />}
        placeholder="Search Community"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchTheFeed(e.target.value);
        }}
      />
      <h2>Latest Community Posts</h2>
      {postFeed.length > 0 && search.length == 0 ? (
        <div>{postFeed}</div>
      ) : (
        <div>{searchList}</div>
      )}

      {/* <div>
        <Button
          variant="default"
          size="xs"
          compact
          onClick={() => {
            setAddPost(true);
          }}
        >
          Add to Community Feed!
        </Button>
        <Modal
          opened={addPost}
          onClose={() => {
            setAddPost(false);
          }}
          title="Add New Community Post"
        >
          <AddPost closeModal={closeModal} />
        </Modal>
      </div> */}
      {/* <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/community"}>Community</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/forums"}>Forums</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/recommendations"}>Recommendations</Link>
          </li>
        </ul>
      </div> */}

      <Footer
        height={60}
        p="xs"
        sx={{ border: "0", background: "transparent" }}
      >
        <Button
          onClick={() => {
            setAddPost(true);
          }}
          sx={{ margin: "auto" }}
        >
          <Title order={6}>Add to Community Feed!</Title>
        </Button>
        <Modal
          opened={addPost}
          onClose={() => {
            setAddPost(false);
          }}
          title="Add New Community Post"
        >
          <AddPost closeModal={closeModal} />
        </Modal>
      </Footer>
    </div>
  );
}
