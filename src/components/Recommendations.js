import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
export default function Recommendations() {
  const user = useContext(UserContext);
  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/"}>Dashboard</Link>
          </li>
          <li>{user ? <p>{user.email}</p> : null}</li>
        </ul>
      </div>
      <h1>Recommendations!</h1>
      <ul>
        <li>
          <div>
            <h3>Popular Nurseries Near You!</h3>
            <p>Google Maps API here</p>
          </div>
        </li>
        <li>
          <div>
            <p>Recommendations</p>
          </div>
        </li>
        <li>
          <div>
            <p>More Recommendations</p>
          </div>
        </li>
        <li>
          <div>
            <p>Even More Recommendations</p>
          </div>
        </li>
      </ul>
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
