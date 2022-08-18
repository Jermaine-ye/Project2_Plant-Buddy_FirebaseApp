import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// imports for firebase
import { auth, database } from "../DB/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as databaseRef, onChildAdded } from "firebase/database";
import PlantInfo from "./PlantInfo";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants";

export default function Dashboard(props) {
  // const [user, setUser] = useState(null);
  // KIV TO DELETE - let plantsInfo = [1, 2, 3, 4, 5, 6]; // REPLACE THIS WITH DATABASE PLANT PROFILES

  const navigate = useNavigate();

  //user info
  const user = useContext(UserContext);
  const userName = user.displayName;
  const userPlantFolder = `${userName + "-" + user.uid}`;
  const [userPlants, setUserPlants] = useState([]);

  //selected plant info for modal
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({});

  // reminder
  const [showReminder, setShowReminder] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

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

    // for retrieving user's plants and storing in state
    const userPlantRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userPlantFolder
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

  // to render user's list of plants in dashboard view
  const plantCard = userPlants.map((plant, index) => (
    <div className="plantCard" key={index}>
      <img
        alt={plant.val.plantName}
        src={plant.val.plantImageUrl}
        width="50%%"
      />
      {/* <Link to={`/plantprofile`}> */}
      <button
        onClick={() => {
          setSelectedPlantProfile(plant);
          console.log("selected:", selectedPlantProfile);
        }}
      >
        {plant.key}
      </button>
      {/* </Link> */}

      <p>Watering Schedule: Every {plant.val.waterFreqDay} Days</p>
      <p>Sunlight Intensity: {plant.val.sunlightReq} </p>
      {/* to show up if calendar prompts to water today */}
      {!plantWatered ? (
        <div>
          <p>Reminder to water today!</p>
          <p> Have you watered {plant.val.plantName}?</p>
          <input
            id={index}
            type="checkbox"
            checked={plantWatered}
            onChange={(e, index) => {
              setPlantWatered(e.target.value);
            }}
          />
        </div>
      ) : null}
    </div>
  ));

  return (
    <div>
      {/* DO NOT TOUCH */}
      <div>
        {user ? <h2>Good morning, {userName}</h2> : null}
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
        <h3>Plant Profiles</h3>
        <div className="plantList">{plantCard}</div>
        {/* KIV IF TO REMOVE AFTER IMPLEMENTING PLANT INFO MODAL */}
        {/* <ul>
          {plantsInfo.map((id) => {
            return (
              <li>
                <Link to={`/plantprofile/${id}`}>Plant {id}</Link>
              </li>
            );
          })}
        </ul> */}
      </div>

      {Object.keys(selectedPlantProfile).length > 0 ? (
        <PlantInfo selectedPlantProfile={selectedPlantProfile} />
      ) : null}

      {/* DO NOT TOUCH - TO COMMENT AFTER DONE WITH PLANT INFO*/}
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
