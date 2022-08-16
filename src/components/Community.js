import { useNavigate, Link } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/"}>Dashboard</Link>
          </li>
        </ul>
      </div>
      <h1>Buddies!</h1>
      <ul>
        <li>Post 1</li>
        <li>Post 2</li>
        <li>Post 3</li>
        <li>Post 4</li>
      </ul>

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
