import { useNavigate } from "react-router-dom";
export default function AddForumPost() {
  const navigate = useNavigate();
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
