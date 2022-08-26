import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import communityheader from "../styling/Drawkit Plants/Drawkit_02_Community.png";

//styling imports
import {
  Button,
  ActionIcon,
  Card,
  CardSection,
  Image,
  Text,
  Grid,
  Badge,
  Modal,
  Input,
} from "@mantine/core";
import {
  ChatBubbleIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
//firebase imports
import {
  onChildAdded,
  onChildChanged,
  ref as databaseRef,
} from 'firebase/database';
import { database } from '../DB/firebase';



//child components
import Likes from './CommunityLikes';
import Comments from './CommunityComments';
import { parseWithOptions } from 'date-fns/fp';
import AddPost from "./AddPost";


export default function Community(props) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFeed, setSearchFeed] = useState([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [showCommentInput, setShowCommentInput] = useState([]);
  const [addPost, setAddPost] = useState(false);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    const isLoggedIn = JSON.parse(localStorage.getItem('user'));
    if (Object.keys(isLoggedIn).length === 0) {
      navigate('/login');
    }
  });
  const POSTS_FOLDER_NAME = 'communityPosts';
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
      console.log('updated-data: ', data.val());
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
      console.log('oCC');
    });
  });

  const postFeed = posts.map((post, index) => {
    return (
      <div>
<<<<<<< HEAD
        <li key={post.key}>
          Title: {post.val.title} | By: {post.val.author} | Likes:{' '}
          {post.val.likes}|{' '}
          <Link to={`posts/${index}`} state={{ post }}>
            Go To Post
          </Link>
          <Likes user={user} post={post} index={index} />
          <br />
          <img
            className="community-post-img"
            src={post.val.imageurl}
            alt={post.val.imageurl}
          />
          <br />
          Comments:{' '}
          <Comments
            user={user}
            post={post}
            index={index}
            // handleUpdates={() => handleUpdates()}
          />
          <br />
        </li>
=======
        <Card
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
          sx={{ width: "85vw", color: "#1f3b2c" }}
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
>>>>>>> main
      </div>
    );
  });
  const searchTheFeed = (search) => {
    let list = [];
    if (search.length > 0) {
      let searchItem = posts.filter((post) => {
        return (
          post.val.title.toLowerCase().includes(search.toLowerCase()) ||
          post.val.author.toLowerCase().includes(search.toLowerCase())
        );
      });
<<<<<<< HEAD

      console.log(searchItem);
=======
>>>>>>> main
      setSearchFeed(searchItem);
    }
  };
  const closeModal = () => {
    setAddPost(false);
  };

  const searchList = searchFeed.map((post, index) => {
    return (
      <div>
<<<<<<< HEAD
        <li key={post.key}>
          Title: {post.val.title} | By: {post.val.author} | Likes:{' '}
          {post.val.likes}|{' '}
          <Link to={`posts/${index}`} state={{ post }}>
            {console.log(post)}
            Go To Post
          </Link>
          <Likes user={user} post={post} index={index} />
          <br />
          <img
            className="community-post-img"
            src={post.val.imageurl}
            alt={post.val.imageurl}
          />
          <br />
          Comments:{' '}
          <Comments
            user={user}
            post={post}
            index={index}
            // handleUpdates={() => handleUpdates()}
          />
          <br />
        </li>
=======
        <Card
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
          sx={{ width: "85vw", color: "#1f3b2c" }}
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
>>>>>>> main
      </div>
    );
  });

  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={'/'}>Dashboard</Link>
          </li>
          <li>{user ? <p>{user.displayName}</p> : null}</li>
        </ul>
      </div>
      <h1>Buddies!</h1>
      <img
        className="community-header-img"
        src={communityheader}
        alt={communityheader}
      />
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

      <div>
        <Button
          variant="default"
          size="xs"
          compact
          onClick={() => {
<<<<<<< HEAD
            navigate('/addnewpost');
=======
            setAddPost(true);
>>>>>>> main
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
      </div>
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
