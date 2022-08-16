import { useNavigate } from "react-router-dom";
export default function AddPost() {
  const navigate = useNavigate();
  const submitPost = () => {
    console.log("New Post Added");
    navigate("/community");
  };

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
