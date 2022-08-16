import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../App";
export default function AddPost() {
  const navigate = useNavigate();
  const submitPost = () => {
    console.log("New Post Added");
    navigate("/community");
  };

  const user = useContext(UserContext);
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

  return (
    <div>
      <form>
        <input type="text" placeholder="Caption" />
        <input type="file" />
        <input
          type="submit"
          value="Add New Post"
          onClick={() => submitPost()}
        />
      </form>
    </div>
  );
}
