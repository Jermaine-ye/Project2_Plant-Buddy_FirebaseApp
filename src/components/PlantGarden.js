import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";

// imports for firebase
import { database, storage } from "../DB/firebase";
import {
  ref as databaseRef,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  remove,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

// imports for components
import PlantInfo from "./PlantInfo";
import PlantCalendar from "./Calendar";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants";

export default function PlantGarden(props) {
  const user = useContext(UserContext);

  //user info
  const userName = user.displayName;
  const userPlantFolder = `${userName + "-" + user.uid}`;
  const [userPlants, setUserPlants] = useState({});
  const userPlantRef = databaseRef(
    database,
    USER_PLANT_FOLDER_NAME + "/" + userPlantFolder
  );

  // load user's plants from realtime database
  useEffect(() => {
    onChildAdded(userPlantRef, (data) => {
      const plantEntryKey = data.key;
      const plantDetails = data.val();
      setUserPlants((prevPostsState) => ({
        ...prevPostsState,
        [plantEntryKey]: plantDetails,
      }));
    });

    return () => {
      setUserPlants({});
    };
  }, []);

  // update plantgarden if any value changes
  useEffect(() => {
    onChildChanged(userPlantRef, (data) => {
      const plantEntryKey = data.key;
      const plantDetails = data.val();
      setUserPlants((prevState) => ({
        ...prevState,
        [plantEntryKey]: plantDetails,
      }));
    });
  }, []);

  // update plantgarden if plant gets removed
  useEffect(() => {
    onChildRemoved(userPlantRef, (data) =>
      setUserPlants((prevState) => {
        let newState = { ...prevState };
        delete newState[data.key];

        return newState;
      })
    );
  }, []);

  //selected plant info for modal
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({});

  // reminder
  const [showReminder, setShowReminder] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);

  const handleDeletePlant = (e, id) => {
    const plantEntry = e.target.id;

    //delete from realtime database
    const plantEntryRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userPlantFolder + "/" + plantEntry
    );

    remove(plantEntryRef);
    //delete image from storage
  };

  // to render user's list of plants in dashboard view
  const plantCards = Object.entries(userPlants).map(
    ([plantEntryKey, plant], index) => {
      const userPlantSpecies = Object.keys(plant)[0];
      const userPlantInfo = plant[userPlantSpecies];

      return (
        <div className="plantCard" key={index} id={plantEntryKey}>
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
          <button
            id={plantEntryKey}
            onClick={(e, id) => {
              handleDeletePlant(e, id);
            }}
          >
            delete plant
          </button>
        </div>
      );
    }
  );

  return (
    <div>
      <PlantCalendar plantData={userPlants} />
      <h3>Plant Profiles</h3>
      <div className="plantList">{plantCards}</div>

      {Object.keys(selectedPlantProfile).length > 0 ? (
        <PlantInfo selectedPlantProfile={selectedPlantProfile} />
      ) : null}
    </div>
  );
}
