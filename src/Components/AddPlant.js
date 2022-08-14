import React, { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  connectStorageEmulator,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

const USER_PLANT_PROFILES_FOLDER_NAME = "userPlantProfiles";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantImages";

const AddPlant = () => {
  const [plantName, setPlantName] = useState("");
  const [plantSpecies, setPlantSpecies] = useState("");
  const [sunRequirement, setSunRequirement] = useState("");
  const [waterFrequency, setWaterFrequency] = useState("");
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [plantCondition, setPlantCondition] = useState([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [notes, setNotes] = useState("");

  const [newPlantEntry, setNewPlantEntry] = useState({});

  const handleSubmitNewPlant = (e) => {
    e.preventDefault();

    const userPlantImagesRef = storageRef(
      storage,
      `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantPhotoFile.name}`
    );

    uploadBytes(userPlantImagesRef, plantPhotoFile)
      .then(() => {
        console.log("did this run?");
        getDownloadURL(userPlantImagesRef).then((url) => {
          const userPlantProfilesRef = databaseRef(
            database,
            USER_PLANT_PROFILES_FOLDER_NAME
          );

          const newProfileRef = push(userPlantProfilesRef);

          set(newProfileRef, {
            timestamp: new Date(),
            ...newPlantEntry,
            plantCondition: plantCondition,
            imageURL: url,
          });
          alert(JSON.stringify(newPlantEntry, "", 2));

          setPlantCondition("");
          setNewPlantEntry({});
        });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setNewPlantEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPlantCondition = (e) => {
    if (e.target.checked) {
      setPlantCondition((prev) => [...prev, e.target.id]);
    } else {
      setPlantCondition((prev) =>
        prev.filter((condition) => condition !== e.target.id)
      );
    }
  };

  return (
    <div>
      {/*  */}
      <p>Add New Plant</p>
      <form onSubmit={handleSubmitNewPlant}>
        <label>
          Plant Name:
          <input
            type="text"
            name="plantName"
            value={newPlantEntry.plantName || ""}
            onChange={handleChange}
            required
            placeholder="Plant Name"
            maxLength={24}
          />
        </label>
        <br />

        {/*  */}
        <label>
          Plant Type:
          <select
            name="plantSpecies"
            value={newPlantEntry.plantSpecies || "default"}
            onChange={handleChange}
            placeholder="Plant Species"
          >
            <option value="default" disabled hidden>
              Choose here
            </option>
            <option value="Snake Plant">Snake Plant</option>
            <option value="Begonia">Begonia</option>
            <option value="Monstera Deliciosa">Monstera Deliciosa</option>
            <option value="Spider Plant">Spider Plant</option>
          </select>
        </label>
        <br />

        {/*  */}
        <label>
          Watering Schedule:
          <select
            name="waterFrequency"
            placeholder="Water Frequency"
            value={waterFrequency}
            onChange={handleChange}
          >
            <option value="Select" disabled hidden>
              Choose here
            </option>
            <option value="once">once</option>
            <option value="twice">twice</option>
            <option value="thrice">thrice</option>
          </select>
          every
          <select
            name="waterFrequency"
            placeholder="Water Frequency"
            value={waterFrequency}
            onChange={handleChange}
          >
            <option value="Select" disabled hidden>
              Choose here
            </option>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="fortnight">fortnight</option>
            <option value="month">month</option>
          </select>
        </label>

        <br />

        {/*  */}
        <label>
          Sunlight Required:
          <input
            type="radio"
            name="sunRequirement"
            id="intense"
            value="Intense"
            onChange={handleChange}
          />
          <label htmlFor="intense">Intense</label>
          <input
            type="radio"
            name="sunRequirement"
            id="moderate"
            value="Moderate"
            onChange={handleChange}
          />
          <label htmlFor="moderate">Moderate</label>
          <input
            type="radio"
            name="sunRequirement"
            id="low"
            value="Low"
            onChange={handleChange}
          />
          <label htmlFor="moderate">Low</label>
        </label>
        <br />

        {/*  */}
        <label>
          Plant Condition
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
        <input
          type="file"
          value={plantPhotoValue}
          onChange={(e) => {
            setPlantPhotoFile(e.target.files[0]);
            setPlantPhotoValue(e.target.value);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <br />

        {/*  */}
        <label>
          Notes:
          <textarea
            name="notes"
            value={newPlantEntry.notes}
            onChange={handleChange}
            maxLength={256}
          />
        </label>
        <br />

        {/*  */}
        <button type="submit">Add Plant</button>
      </form>

      <img alt="" src={photoPreview} width="25%" />
    </div>
  );
};

export default AddPlant;
