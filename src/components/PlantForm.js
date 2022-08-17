import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

const USER_PLANT_FOLDER_NAME = "userPlants/";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";
const PLANTS_FOLDER_NAME = "allPlants";

export default function PlantForm() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  // for testing purposes
  const userEmail = "abc@abc.com";
  const userName = "def";

  // for conditional rendering of form
  const [showPlantForm, setShowPlantForm] = useState(false);

  // for getting list of plants from realtime database
  const [plantList, setPlantList] = useState([]);

  // for data to be added to realtime database upon form submission
  const [selectedPlant, setSelectedPlant] = useState({});
  const [waterFrequency, setWaterFrequency] = useState("");
  const [sunlightRequirement, setSunlightRequirement] = useState("");
  const [plantSpecies, setPlantSpecies] = useState("");
  const [plantCondition, setPlantCondition] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [plantNotes, setPlantNotes] = useState("");

  //
  const [acceptRecommended, setAcceptRecommended] = useState(true);
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    // if (Object.keys(user) == 0) {
    //   navigate("/login");
    // }

    // to get list of plants in database
    const plantsRef = databaseRef(database, PLANTS_FOLDER_NAME);
    onChildAdded(plantsRef, (data) => {
      const species = Object.keys(data.val())[0];
      const speciesInfo = data.val()[species];

      setPlantList((prevState) => [
        ...prevState,
        { key: species, val: speciesInfo },
      ]);
    });

    return () => {
      setPlantList([]);
    };
  }, []);

  // submit plant entry to realtime database and navigate back to dashboard
  const handleSubmitNewPlant = (e) => {
    e.preventDefault();

    const userPlantImagesRef = storageRef(
      storage,
      `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantPhotoFile.name}`
    );

    uploadBytes(userPlantImagesRef, plantPhotoFile)
      .then(() => {
        getDownloadURL(userPlantImagesRef).then((url) => {
          const userPlantRef = databaseRef(
            database,
            USER_PLANT_FOLDER_NAME + "/" + userName
          );
          const newPlantRef = push(userPlantRef);

          if (plantSpecies) {
            set(newPlantRef, {
              [plantSpecies]: {
                waterFrequency: waterFrequency,
                sunlightRequirement: sunlightRequirement,
                plantName: plantName,
                plantCondition: plantCondition,
                plantImageUrl: url,
                plantNotes: plantNotes,
              },
            });
          } else {
            set(newPlantRef, {
              [selectedPlant.key]: {
                ...selectedPlant.val,
                plantName: plantName,
                plantCondition: plantCondition,
                plantImageUrl: url,
                plantNotes: plantNotes,
              },
            });
          }

          setSelectedPlant({});
          setWaterFrequency("");
          setSunlightRequirement("");
          setPlantSpecies("");
          setPlantCondition([]);
          setPlantName("");
          setPlantNotes("");
          setPlantCondition("");

          alert("Plant successfully added");

          navigate("/");
        });
      })
      .catch((err) => console.log(err));
  };

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

  // to store user's selected plant for add plant entry
  const handleClickSelectedPlant = (event, plant, index) => {
    setSelectedPlant(plant);
    setWaterFrequency(plant.val.waterFreqDay);
    setSunlightRequirement(plant.val.sunlightReq);
    setShowPlantForm(true);
  };

  // list of plant choices for user to select for recommended plant care
  const plantsDB = plantList.map((plant, index) => (
    <button
      key={index}
      onClick={(e) => {
        handleClickSelectedPlant(e, plant, index);
      }}
    >
      {plant.key}
    </button>
  ));

  // generate recommended care for selectedPlant in plantform
  const selectedPlantForm = (
    <div>
      <h3>
        {userName}'s {selectedPlant.key}
      </h3>
      <h5>Recommended Care:</h5>
      <label>
        Watering Schedule: Every
        <input
          type="number"
          name="water"
          value={waterFrequency}
          onChange={(e) => setWaterFrequency(e.target.value)}
          disabled={acceptRecommended}
        />
        Days
      </label>
      <br />
      <label>
        Sunlight Required:
        <select
          name="sunlight"
          value={sunlightRequirement}
          onChange={(e) => setSunlightRequirement(e.target.value)}
          disabled={acceptRecommended}
        >
          <option value="intense">intense</option>
          <option value="moderate">moderate</option>
          <option value="low">low</option>
        </select>
      </label>
      <br />
      <label>
        Keep Recommendation
        <input
          type="checkbox"
          name="recommendation"
          checked={acceptRecommended}
          onChange={(e) => setAcceptRecommended(!acceptRecommended)}
        />
      </label>
    </div>
  );

  // generate new plant species care routine if plant not in plantsDB
  const newPlantSpeciesForm = (
    <div>
      <h3>
        {userName}'s {plantSpecies ? plantSpecies : "New Buddy"}
      </h3>
      <label>
        Plant Species:
        <input
          type="text"
          name="species"
          value={plantSpecies}
          onChange={(e) => setPlantSpecies(e.target.value)}
          required
          placeholder="Plant Species"
          maxLength={24}
        />
      </label>
      <h5>Plant Care Routine:</h5>
      <label>
        Watering Schedule: Every
        <input
          type="number"
          name="water"
          value={waterFrequency}
          onChange={(e) => setWaterFrequency(e.target.value)}
        />
        Days
      </label>
      <br />
      <label>
        Sunlight Required:
        <select
          name="sunlight"
          value={sunlightRequirement || "default"}
          onChange={(e) => setSunlightRequirement(e.target.value)}
        >
          <option value="low" hidden>
            choose intensity
          </option>
          <option value="intense">intense</option>
          <option value="moderate">moderate</option>
          <option value="low">low</option>
        </select>
      </label>
    </div>
  );

  // generate shared portion of the form regardless of new plant species or selectedPlant
  const sharedForm = (
    <div>
      <h5>Other Attributes:</h5>
      <form onSubmit={handleSubmitNewPlant}>
        <label>
          Plant Name:
          <input
            type="text"
            name="plantName"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            required
            placeholder="Plant Name"
            maxLength={24}
          />
        </label>
        <br />

        {/*  */}
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
          Upload a photo:
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
        <br />

        {/*  */}
        <label>
          Notes:
          <textarea
            name="notes"
            value={plantNotes}
            onChange={(e) => setPlantNotes(e.target.value)}
            maxLength={256}
          />
        </label>
        <br />

        {/*  */}
        <button type="submit">Add Plant</button>
      </form>
    </div>
  );

  return (
    <div>
      {/* FIRST SECTION FOR USERS TO CHOOSE PLANT FROM DATABASE */}
      <h1>New Plant Buddy</h1>
      <input type="text" placeholder="Search for plant" />
      <br />
      {plantsDB}
      <br />
      <button
        onClick={(e) => {
          setSelectedPlant({});
          setWaterFrequency("");
          setSunlightRequirement("");
          setShowPlantForm(true);
        }}
      >
        Add New Species
      </button>
      <br />

      {/* SECOND SECTION FOR USERS TO CHOOSE PLANT FROM DATABASE */}
      <hr />

      {!Object.keys(selectedPlant).length &&
      !showPlantForm ? null : !Object.keys(selectedPlant).length &&
        showPlantForm ? (
        <div>
          {newPlantSpeciesForm} {sharedForm}
        </div>
      ) : (
        <div>
          {selectedPlantForm} {sharedForm}
        </div>
      )}

      <img alt="" src={photoPreview} width="25%" />
    </div>
  );
}
