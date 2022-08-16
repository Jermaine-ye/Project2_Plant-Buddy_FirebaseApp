import { useNavigate, Link } from "react-router-dom";

export default function Forums() {
  const navigate = useNavigate();
  const addPost = () => {
    console.log("redirecting to new post page");
  };

  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/"}>Dashboard</Link>
          </li>
        </ul>
      </div>
      <h1>Forums</h1>
      <ul>
        <li>Plant Care Tips (Link to Forum thread)</li>
        <li>Buy Sell Trade Corner (Link to Forum thread)</li>
        <li>Chit Chat (Link to Forum thread)</li>
      </ul>
      <button
        onClick={() => {
          addPost();
          navigate("/addnewforumpost");
        }}
      >
        Add Forum Post
      </button>
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
