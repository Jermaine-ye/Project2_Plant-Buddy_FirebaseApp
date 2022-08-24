import { UserContext } from "../App";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// imports related to realtime database
import { ref as databaseRef, update } from "firebase/database";
import {
  ref as storageRef,
  deleteObject,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";

export default function PlantInfo(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userName = user.displayName;
  const userFolder = `${user.displayName + "-" + user.uid}`;

  // selected plant pointer
  //data.key = realtime database entry key
  //data.val() = {plantFamily:"", sunlightReq:"", waterFreqDay:"", ...}
  const plant = props.selectedPlantProfile;
  const plantKey = Object.keys(plant)[0];
  const plantInfo = plant[plantKey];
  const [plantModal, setPlantModal] = useState(false);

  // plant info to be updated
  const [plantPhoto, setPlantPhoto] = useState(plantInfo.plantImageUrl);
  const [waterFrequency, setWaterFrequency] = useState(plantInfo.waterFreqDay);
  const [sunlightRequirement, setSunlightRequirement] = useState(
    plantInfo.sunlightReq
  );
  const [plantFamily, setPlantFamily] = useState(plantInfo.plantFamily);
  const [plantCondition, setPlantCondition] = useState(
    plantInfo.plantCondition
  );
  const [plantName, setPlantName] = useState(plantInfo.plantName);
  const [plantNotes, setPlantNotes] = useState(plantInfo.plantNotes);

  // for new photo upload
  const [uploadNewPhoto, setUploadNewPhoto] = useState(false);
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  // set edit state for respective input fields
  const [nameDisabled, setNameDisabled] = useState(true);
  const [waterDisabled, setWaterDisabled] = useState(true);
  const [sunlightDisabled, setSunlightDisabled] = useState(true);
  const [notesDisabled, setNotesDisabled] = useState(true);

  // to render new edited info
  useEffect(() => {
    console.log("plantinfo:", plantInfo);
    setPlantPhoto(plantInfo.plantImageUrl);
    setWaterFrequency(plantInfo.waterFreqDay);
    setSunlightRequirement(plantInfo.sunlightReq);
    setPlantFamily(plantInfo.plantFamily);
    setPlantCondition(plantInfo.plantCondition);
    setPlantName(plantInfo.plantName);
    setPlantNotes(plantInfo.plantNotes);
  }, [props]);

  // for user to custom their plant condition/health
  const handleAddPlantCondition = (e) => {
    if (e.target.checked) {
      setPlantCondition((prev) => [...prev, e.target.id]);
    } else {
      setPlantCondition((prev) =>
        prev.filter((condition) => condition !== e.target.id)
      );
    }
  };

  const newPhotoUpload = (
    <div>
      <label>
        Upload New photo:
        <input
          type="file"
          value={plantPhotoValue}
          onChange={(e) => {
            setPlantPhotoFile(e.target.files[0]);
            setPlantPhotoValue(e.target.value);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
      </label>
    </div>
  );

  const userPlantRef = databaseRef(
    database,
    USER_PLANT_FOLDER_NAME + "/" + userFolder
  );

  // submit changes to realtime database
  const handleSubmitChanges = (e) => {
    e.preventDefault();

    // if plantphoto changed, delete image in storage

    if (plantPhotoFile) {
      const oldPlantImageRef = storageRef(
        storage,
        `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantInfo.plantImageName}`
      );

      deleteObject(oldPlantImageRef).then(() => {
        const userPlantImagesRef = storageRef(
          storage,
          `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantPhotoFile.name}`
        );

        uploadBytes(userPlantImagesRef, plantPhotoFile).then(() => {
          getDownloadURL(userPlantImagesRef).then((url) => {
            const updatedData = {
              ...plantInfo,
              plantImageUrl: url,
              plantImageName: plantPhotoFile.name,
              // plantCondition: plantCondition,
              waterFreqDay: waterFrequency,
              sunlightReq: sunlightRequirement,
              plantName: plantName,
              plantNotes: plantNotes,
            };

            update(userPlantRef, { [plantKey]: updatedData });
          });
        });
      });
    } else {
      const updatedData = {
        ...plantInfo,
        // plantCondition: plantCondition,
        waterFreqDay: waterFrequency,
        sunlightReq: sunlightRequirement,
        plantName: plantName,
        plantNotes: plantNotes,
      };

      update(userPlantRef, { [plantKey]: updatedData });
    }
    setNameDisabled(true);
    setWaterDisabled(true);
    setSunlightDisabled(true);
    setNotesDisabled(true);
  };

  // to revert all values to initial state
  const handleResetChanges = () => {
    setWaterFrequency(plantInfo.waterFreqDay);
    setSunlightRequirement(plantInfo.sunlightReq);
    setPlantFamily(plantInfo.plantFamily);
    setPlantCondition(plantInfo.plantCondition);
    setPlantName(plantInfo.plantName);
    setPlantNotes(plantInfo.plantNotes);
    setPlantPhoto(plantInfo.plantImageUrl);
  };

  // check / uncheck box

  return (
    <div>
      <h4>
        {/* plant name */}
        {userName}'s {plantFamily} :
        <input
          type="text"
          name="plantName"
          id="plantName1"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          required
          placeholder="Plant Name"
          maxLength={24}
          disabled={nameDisabled}
        />
        <button onClick={() => setNameDisabled(!nameDisabled)}>Edit</button>
      </h4>
      {/* PLANT PHOTO */}
      <img
        alt={plantName}
        src={!photoPreview ? plantPhoto : photoPreview}
        width="30%"
      />
      <button
        onClick={() => {
          setUploadNewPhoto(!uploadNewPhoto);
          setPlantPhotoFile(null);
          setPlantPhotoValue("");
          setPhotoPreview("");
        }}
      >
        Edit
      </button>
      {uploadNewPhoto ? newPhotoUpload : null}
      <br />
      {/*  */}
      <label>
        Watering Schedule: Every
        <input
          type="number"
          name="water"
          value={waterFrequency}
          onChange={(e) => setWaterFrequency(e.target.value)}
          disabled={waterDisabled}
        />
        Days
      </label>
      <button onClick={() => setWaterDisabled(!waterDisabled)}>Edit</button>
      <br />
      {/*  */}
      <label>
        Sunlight Required:
        <select
          name="sunlight"
          value={sunlightRequirement}
          onChange={(e) => setSunlightRequirement(e.target.value)}
          disabled={sunlightDisabled}
        >
          <option value="intense">intense</option>
          <option value="moderate">moderate</option>
          <option value="low">low</option>
        </select>
      </label>
      <button onClick={() => setSunlightDisabled(!sunlightDisabled)}>
        Edit
      </button>
      <br />
      {/*  */}
      Plant Condition: {plantCondition} <button>Edit</button>
      <br />
      <label>
        Plant Condition:
        <input
          type="checkbox"
          name="plantCondition"
          id="healthy"
          value="healthy"
          onChange={(e) => {
            handleAddPlantCondition(e);
          }}
        />
        <label htmlFor="plantCondition">Healthy</label>
        <input
          type="checkbox"
          name="plantCondition"
          id="white-spots"
          value="white spots"
          onChange={(e) => {
            handleAddPlantCondition(e);
          }}
        />
        <label htmlFor="plantCondition">White Spots</label>
      </label>
      <br />
      {/*  */}
      <label>
        Notes:
        <textarea
          name="notes"
          value={plantNotes}
          onChange={(e) => setPlantNotes(e.target.value)}
          maxLength={256}
          disabled={notesDisabled}
        />
      </label>
      <button onClick={() => setNotesDisabled(!notesDisabled)}>Edit</button>
      <br />
      {/*  */}
      <button onClick={handleSubmitChanges}>Update Changes</button>
      <br />
      <button onClick={handleResetChanges}>Reset Changes</button>
      <hr />
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
