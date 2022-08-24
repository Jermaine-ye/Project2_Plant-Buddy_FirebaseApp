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
  update,
} from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

// imports for components
import PlantInfo from "./PlantInfo";
import PlantCalendar from "./Calendar";

// imports from date-fns
import { format, parseISO } from "date-fns";

// folders in realtime database and storage
const USER_PLANT_FOLDER_NAME = "userPlants";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";

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
      setUserPlants((prevPostsState) => ({
        ...prevPostsState,
        [data.key]: data.val(),
      }));
    });

    return () => {
      setUserPlants({});
    };
  }, []);

  // update plantgarden if any value changes
  useEffect(() => {
    onChildChanged(userPlantRef, (data) => {
      setUserPlants((prevState) => ({
        ...prevState,
        [data.key]: data.val(),
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
    // delete image from storage

    const userPlantImagesRef = storageRef(
      storage,
      `${USER_PLANT_IMAGES_FOLDER_NAME}/${
        userPlants[Object.keys(userPlants)[0]].plantImageName
      }`
    );

    deleteObject(userPlantImagesRef)
      .then(() => {
        console.log("image deleted!");
      })
      .catch((error) => console.log(error));
  };

  // to render user's list of plants in dashboard view
  const plantCards = Object.entries(userPlants).map(
    ([plantEntryKey, plantData], index) => {
      return (
        <div className="plantCard" key={index} id={plantEntryKey}>
          <img
            alt={plantData.plantName}
            src={plantData.plantImageUrl}
            width="50%%"
          />

          <button
            onClick={() => {
              setSelectedPlantProfile({ [plantEntryKey]: plantData });
            }}
          >
            {plantData.plantFamily}
          </button>

          <p>Watering Schedule: Every {plantData.waterFreqDay} Days</p>
          <p>Sunlight Intensity: {plantData.sunlightReq} </p>
          {/* {console.log(plant[userPlantFamily])} */}
          {/* to show up if calendar prompts to water today */}
          {!plantWatered ? (
            <div>
              <p>Reminder to water today!</p>
              <p> Have you watered {plantData.plantName}?</p>
              <input
                id={index}
                type="checkbox"
                checked={
                  new Date().toLocaleDateString() ===
                  plantData.dateLastWateredCheck
                }
                disabled={plantWatered}
                onChange={(e, index) => {
                  const updatedData = {
                    ...plantData,
                    dateLastWatered: new Date(),
                    dateLastWateredCheck: new Date().toLocaleDateString(),
                  };
                  update(userPlantRef, { [plantEntryKey]: updatedData });
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
