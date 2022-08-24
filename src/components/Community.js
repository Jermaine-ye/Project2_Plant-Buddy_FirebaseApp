import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

//firebase imports
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../DB/firebase";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    console.log(user);
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (Object.keys(isLoggedIn).length === 0) {
      navigate("/login");
    }
  });
  const POSTS_FOLDER_NAME = "communityPosts";
  useEffect(() => {
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    let postList = [];
    onChildAdded(postListRef, (data) => {
      console.log(data);
      postList.push({ key: data.key, val: data.val() });
      // setPosts([...posts, { key: data.key, val: data.val() }]);
      console.log(postList);
    });
    setPosts(postList);
  }, []);

  const postFeed = posts.map((post, index) => (
    // console.log(post);
    <div>
      <li key={post.key}>
        Title: {post.val.title} | By: {post.val.author} | Likes:{" "}
        {post.val.likes}
        <br />
        <img
          className="community-post-img"
          src={post.val.imageurl}
          alt={post.val.imageurl}
        />
        <br />
        Comments: TBI
        <br />
      </li>
    </div>
  ));

  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/"}>Dashboard</Link>
          </li>
          <li>{user ? <p>{user.displayName}</p> : null}</li>
        </ul>
      </div>
      <h1>Buddies!</h1>
      {postFeed.length > 0 ? <ul>{postFeed}</ul> : null}

      <div>
        <button
          onClick={() => {
            navigate("/addnewpost");
          }}
        >
          Add to Community Feed!
        </button>
      </div>
      <div>
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
      </div>
    </div>
  );
}
