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

const USER_PLANT_PROFILES_FOLDER_NAME = "userPlantProfiles/users";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantImages";
const PLANTS_FOLDER_NAME = "allPlants";
const USER_ID = "user1";

export default function PlantForm() {
  const navigate = useNavigate();

  const [plantList, setPlantList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState({});
  // const [showSelectedPlantForm, setShowSelectedPlantForm] = useState(false);
  const [waterFrequency, setWaterFrequency] = useState("");
  const [sunlightRequirement, setSunlightRequirement] = useState("");
  const [acceptRecommended, setAcceptRecommended] = useState(true);
  const [plantSpecies, setPlantSpecies] = useState("");
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [plantCondition, setPlantCondition] = useState([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [newPlantEntry, setNewPlantEntry] = useState({});

  useEffect(() => {
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
            user: {
              plant1: {
                name: "testing",
                sun: "low",
              },
              plant2: {
                name: "testing",
                sun: "low",
              },
            },
          });
          alert(JSON.stringify(newPlantEntry, "", 2));

          setPlantCondition("");
          setNewPlantEntry({});
        });
      })
      .catch((err) => console.log(err));
  };
  const user = useContext(UserContext);
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

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

  // to store user's selected plant for add plant entry
  const handleClickSelectedPlant = (event, plant, index) => {
    setSelectedPlant(plant);
    setWaterFrequency(plant.val.waterFreqDay);
    setSunlightRequirement(plant.val.sunlightReq);
  };

  // selectedPlantForm
  const selectedPlantForm = (
    <div>
      <h3>User's {selectedPlant.key}</h3>
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

  const newPlantSpeciesForm = (
    <div>
      <h3>User's New Buddy</h3>
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
      <h5>Your Plant Care Recommendation:</h5>
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

  const sharedForm = (
    <div>
      <h5>Buddy's Attributes:</h5>
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
            value={newPlantEntry.notes}
            onChange={handleChange}
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

      <label>
        Find Plant:
        <input type="text" placeholder="Enter plant name" />
      </label>
      <br />
      {plantsDB}

      <button
        onClick={(e) => {
          setSelectedPlant({});
          setWaterFrequency("");
          setSunlightRequirement("");
        }}
      >
        Add New Species
      </button>
      <br />

      {/* SECOND SECTION FOR USERS TO CHOOSE PLANT FROM DATABASE */}
      <hr />

      {!Object.keys(selectedPlant).length
        ? newPlantSpeciesForm
        : selectedPlantForm}
      {sharedForm}

      <img alt="" src={photoPreview} width="25%" />
    </div>
  );
}
