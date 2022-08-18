import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";

// imports for firebase
import { database } from "../DB/firebase";
import {
  ref as databaseRef,
  onChildAdded,
  onChildChanged,
} from "firebase/database";
import PlantInfo from "./PlantInfo";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants";

export default function PlantGarden(props) {
  const user = useContext(UserContext);

  //user info
  const userName = user.displayName;
  const userPlantFolder = `${userName + "-" + user.uid}`;
  const [userPlants, setUserPlants] = useState({});

  // load user's plants from realtime database
  useEffect(() => {
    console.log("plantgarden:", user);

    // for retrieving user's plants and storing in state
    const userPlantRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userPlantFolder
    );

    onChildAdded(userPlantRef, (data) => {
      const plantEntryKey = data.key;
      const plantDetails = data.val();
      setUserPlants((prevPostsState) => ({
        ...prevPostsState,
        [plantEntryKey]: plantDetails,
      }));
    });

    console.log("user plants info:", userPlants);

    return () => {
      setUserPlants({});
    };
  }, []);

  useEffect(() => {
    // for retrieving user's plants and storing in state
    const userPlantRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userPlantFolder
    );
    onChildChanged(userPlantRef, (data) => {
      console.log("Testing:", data);
      const plantEntryKey = data.key;
      const plantDetails = data.val();
      setUserPlants((prevPostsState) => ({
        ...prevPostsState,
        [plantEntryKey]: plantDetails,
      }));
    });
  }, []);

  //selected plant info for modal
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({});

  // reminder
  const [showReminder, setShowReminder] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);

  // to render user's list of plants in dashboard view
  const plantCard = Object.entries(userPlants).map(
    ([plantEntryKey, plant], index) => {
      const userPlantSpecies = Object.keys(plant)[0];
      const userPlantInfo = plant[userPlantSpecies];

      return (
        <div className="plantCard" key={index}>
          <img
            alt={userPlantInfo.plantName}
            src={userPlantInfo.plantImageUrl}
            width="50%%"
          />

          <button
            onClick={() => {
              setSelectedPlantProfile({ [plantEntryKey]: plant });
            }}
          >
            {userPlantSpecies}
          </button>

          <p>Watering Schedule: Every {userPlantInfo.waterFreqDay} Days</p>
          <p>Sunlight Intensity: {userPlantInfo.sunlightReq} </p>
          {/* to show up if calendar prompts to water today */}
          {!plantWatered ? (
            <div>
              <p>Reminder to water today!</p>
              <p> Have you watered {userPlantInfo.plantName}?</p>
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
      );
    }
  );

  return (
    <div>
      <h3>Plant Profiles</h3>
      <div className="plantList">{plantCard}</div>

      {Object.keys(selectedPlantProfile).length > 0 ? (
        <PlantInfo selectedPlantProfile={selectedPlantProfile} />
      ) : null}
    </div>
  );
}
