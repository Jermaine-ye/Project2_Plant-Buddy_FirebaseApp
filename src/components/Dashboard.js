import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// imports for firebase
import { auth, database } from "../DB/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as databaseRef, onChildAdded } from "firebase/database";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants/";

export default function Dashboard(props) {
  // const [user, setUser] = useState(null);
  const user = useContext(UserContext);
  let plantsInfo = [1, 2, 3, 4, 5, 6]; // REPLACE THIS WITH DATABASE PLANT PROFILES

  const [userPlants, setUserPlants] = useState([]);

  const navigate = useNavigate();

  // for testing purpose
  const userEmail = "abc@abc.com";
  const userName = "def";

  // includes checking of auth status and load user's plants from realtime database
  useEffect(() => {
    // for checking of user logged in status
    onAuthStateChanged(auth, (signedInUser) => {
      if (signedInUser) {
        const uid = signedInUser.uid;
      } else {
        console.log("user not signed in");
        navigate("/login");
      }
    });

    const userPlantRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userName
    );

    onChildAdded(userPlantRef, (data) => {
      const species = Object.keys(data.val())[0];
      const speciesInfo = data.val()[species];
      setUserPlants((prevPostsState) => [
        ...prevPostsState,
        { key: species, val: speciesInfo },
      ]);
    });

    return () => {
      setUserPlants([]);
    };
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  // to render user's list of plants

  const plantCard = userPlants.map((plant, index) => (
    <div key={index}> {plant.key} </div>
  ));

  return (
    <div>
      {/* DO NOT TOUCH */}
      <div>
        {user ? <h2>Good morning, {user.email}</h2> : null}
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

      {/* TO EDIT: list user's plants */}
      <div>
        Plant Profiles
        {plantCard}
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
