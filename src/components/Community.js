import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

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

export default function Community(props) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFeed, setSearchFeed] = useState([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);

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

  // const handleUpdates = (newData, index) => {
  //   let postsData = posts;
  //   postsData[index].val = newData;
  //   setPosts(postsData);
  // };
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
      </div>
    );
  });
  const searchTheFeed = (search) => {
    let list = [];
    console.log(search);
    console.log(posts);
    if (search.length > 0) {
<<<<<<< HEAD
      let searchItem = posts.filter((post) =>
        post.val.title.toLowerCase().includes(search)
      );
=======
      let searchItem = posts.filter((post) => {
        return (
          post.val.title.toLowerCase().includes(search.toLowerCase()) ||
          post.val.author.toLowerCase().includes(search.toLowerCase())
        );
      });
>>>>>>> main
      console.log(searchItem);
      setSearchFeed(searchItem);
    }
  };

  const searchList = searchFeed.map((post, index) => {
    return (
      <div>
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
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchTheFeed(e.target.value);
        }}
      />
      {postFeed.length > 0 && search.length == 0 ? (
        <div>
          <ul>{postFeed}</ul>
        </div>
      ) : (
        <div>
          <ul>{searchList}</ul>
        </div>
      )}

      <div>
        <button
          onClick={() => {
            navigate('/addnewpost');
          }}
        >
          Add to Community Feed!
        </button>
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
