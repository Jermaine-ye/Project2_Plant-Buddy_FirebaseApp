import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";
export default function AddForumPost() {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });
  const submitPost = () => {
    console.log("New Post Added");
    navigate("/forums");
  };

  return (
    <div>
      <form>
        <input type="text" placeholder="Title" />

        <br />
        <textarea rows="8" cols="50">
          Your message here
        </textarea>
        <br />
        <input
          type="submit"
          value="Add New Post"
          onClick={() => submitPost()}
        />
      </form>
    </div>
  );
}
