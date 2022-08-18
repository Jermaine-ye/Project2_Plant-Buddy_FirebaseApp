import { UserContext } from "../App";

// imports for react
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// imports for firebase
import { auth } from "../DB/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// imports for components
import PlantGarden from "./PlantGarden";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  // create empty user object if no user data exists upon npm start/refresh so as to navigate to login first
  if (!user) {
    localStorage.setItem("user", JSON.stringify({}));
  }

  // includes checking of auth status
  useEffect(() => {
    // for checking of user logged in status
    onAuthStateChanged(auth, (signedInUser) => {
      console.log(signedInUser);
      if (signedInUser) {
        const uid = signedInUser.uid;
      } else {
        console.log("user not signed in");
        navigate("/login");
      }
    });
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  return (
    <div>
      {/* DO NOT TOUCH */}
      <div>
        {user ? <h2>Good morning, {user.displayName}</h2> : null}
        <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
      <h1>DASHBOARD</h1>
      <div>
        <h3>Calendar placeholder</h3>
      </div>
      <div>
        <h3>Weather API placeholder</h3>
      </div>

      {/* WIP PLANT PROFILE: list user's plants */}
      <div>
        <PlantGarden />
      </div>

      {/* DO NOT TOUCH */}
      <Link to={`/addnewplant`}>
        <button>Add A New Plant!</button>
      </Link>
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
