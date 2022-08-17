import { auth } from "../DB/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function Dashboard(props) {
  // const [user, setUser] = useState(null);
  const user = useContext(UserContext);
  let plantsInfo = [1, 2, 3, 4, 5, 6]; // REPLACE THIS WITH DATABASE PLANT PROFILES

  const navigate = useNavigate();
  const logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");

      // localStorage.setItem("user", JSON.stringify({}));
      // console.log(JSON.parse(localStorage.getItem("user")));
      navigate("/login");
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (signedInUser) => {
      if (signedInUser) {
        const uid = signedInUser.uid;
      } else {
        console.log("user not signed in");
        navigate("/login");
      }
    });
  });

  return (
    <div>
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
      <div>
        Plant Profiles
        <ul>
          {plantsInfo.map((id) => {
            return (
              <li>
                <Link to={`/plantprofile/${id}`}>Plant {id}</Link>
              </li>
            );
          })}
        </ul>
      </div>
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
