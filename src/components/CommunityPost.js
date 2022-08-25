import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { database } from "../DB/firebase";
import {
  ref as databaseRef,
  onChildAdded,
  onChildChanged,
} from "firebase/database";
import Likes from "./CommunityLikes";
import Comments from "./CommunityComments";

export default function Post(props) {
  // const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [render, setRender] = useState(false);
  const user = useContext(UserContext);

  const navigate = useNavigate();
  const { id } = useParams();
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
      console.log(data.key);
      console.log(data.val());
      setPost((prevState) => {
        console.log(prevState);
        let newState = { ...prevState };
        newState.val = data.val();
        return newState;
      });
      console.log("oCA");
    });
    console.log("render changed");
  });

  return (
    <div>
      {Object.keys(post).length > 0 ? (
        <div>
          Title: {post.val.title} | By: {post.val.author} | Likes:
          {post.val.likes}
          <Likes user={user} post={post} index={id} />
          <br />
          <img
            className="community-post-img"
            src={post.val.imageurl}
            alt={post.val.imageurl}
          />
          <br />
          Comments:{" "}
          <Comments
            user={user}
            post={post}
            index={id}
            render={render}
            handleRender={setRender}
            // handleUpdates={() => handleUpdates()}
          />
          <br />
        </div>
      ) : null}
      <input
        type="submit"
        value="Back to Feed"
        onClick={() => navigate("/community")}
      />
    </div>
  );
}
