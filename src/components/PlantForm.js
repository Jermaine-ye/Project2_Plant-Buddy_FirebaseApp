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

import { Button, Title, Autocomplete, ScrollArea } from "@mantine/core";

const USER_PLANT_FOLDER_NAME = "userPlants/";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";
const PLANTS_FOLDER_NAME = "allPlants";

export default function PlantForm() {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userInfo = `${user.displayName + "-" + user.uid}`;

  // for conditional rendering of form
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [chooseDefaultPlant, setChooseDefaultPlant] = useState(false);

  // for getting list of plants from realtime database
  const [plantList, setPlantList] = useState([]);

  // for data to be added to realtime database upon form submission
  const [selectedPlant, setSelectedPlant] = useState({
    plantInfo: "",
  });
  const [waterFrequency, setWaterFrequency] = useState("");
  const [sunlightRequirement, setSunlightRequirement] = useState("");
  const [plantFamily, setPlantFamily] = useState("");
  const [plantCondition, setPlantCondition] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [plantNotes, setPlantNotes] = useState("");

  //
  const [acceptRecommended, setAcceptRecommended] = useState(true);
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState("");

  /////////////// USEEFFECTS HOOKS ///////////////

  // to check if user is logged in
  useEffect(() => {
    console.log("user:", user);
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    console.log("isLoggedIn:", isLoggedIn);
    if (Object.keys(isLoggedIn) === 0) {
      navigate("/login");
    }
  }, []);

  // to get list of plants in database
  //data.key = realtime database entry key
  //data.val() = {plantFamily:"", sunlightReq:"", waterFreqDay:""}
  useEffect(() => {
    const plantsRef = databaseRef(database, PLANTS_FOLDER_NAME);
    onChildAdded(plantsRef, (data) => {
      setPlantList((prevState) => [
        ...prevState,
        { plantFamily: data.key, plantInfo: data.val() },
      ]);
    });

    return () => {
      setPlantList([]);
    };
  }, []);

  /////////////// FUNCTIONS THAT HANDLE EVENTS ///////////////

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
            USER_PLANT_FOLDER_NAME + "/" + userInfo
          );
          const newPlantRef = push(userPlantRef);

          set(newPlantRef, {
            plantFamily: plantFamily,
            plantName: plantName,
            plantCondition: plantCondition,
            plantImageUrl: url,
            plantNotes: plantNotes,
            dateAdded: new Date().toLocaleDateString(),
            dateFirstWatered: "",
            dateLastWatered: "null",
            waterFreqDay: waterFrequency,
            sunlightReq: sunlightRequirement,
            plantImageName: plantPhotoFile.name,
          });

          setSelectedPlant({});
          setWaterFrequency("");
          setSunlightRequirement("");
          setPlantFamily("");
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
    setWaterFrequency(plant.plantInfo.waterFreqDay);
    setSunlightRequirement(plant.plantInfo.sunlightReq);
    setShowPlantForm(true);
    setChooseDefaultPlant(true);
    setPlantFamily(plant.plantFamily);
  };

  // to search list of available plant family
  const handleSearchPlantFamily = (e) => {
    let search = e.target.value.toUpperCase();
    setSearchTerm(search);
  };

  /////////////// RENDERING CONSTS ///////////////

  // list of plant results based on search term
  const searchPlantResults = plantList
    .filter((plant) => plant.plantFamily.includes(searchTerm))
    .map((plant, index) => (
      <Button
        color="moss"
        key={index}
        onClick={(e) => {
          console.log(plant);
          handleClickSelectedPlant(e, plant, index);
        }}
      >
        {plant.plantFamily}
      </Button>
    ));

  // list of plant choices for user to select for recommended plant care
  // const plantsDB = plantList.map((plant, index) => (
  //   <Button
  //     color="seashell"
  //     key={index}
  //     onClick={(e) => {
  //       console.log(plant);
  //       handleClickSelectedPlant(e, plant, index);
  //     }}
  //   >
  //     {plant.plantFamily}
  //   </Button>
  // ));

  // generate recommended care for selectedPlant in plantform
  const selectedPlantForm = (
    <div>
      <Title order={3}>
        {user.displayName}'s {!selectedPlant ? null : selectedPlant.plantFamily}
      </Title>
      <h5>Recommended Care:</h5>
      <p>{selectedPlant.plantInfo["Possible Issues"]}</p>
      <img alt={selectedPlant.plantFamily} src={selectedPlant.plantInfo.url} />

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
      <Title order={3}>
        {user.displayName}'s {plantFamily ? plantFamily : "New Buddy"}
      </Title>
      <label>
        Plant Family:
        <input
          type="text"
          name="species"
          value={plantFamily}
          onChange={(e) => setPlantFamily(e.target.value)}
          required
          placeholder="Plant Family"
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
              console.log(e.target.files[0].name);
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
        <Button type="submit">Add Plant</Button>
      </form>
    </div>
  );

  return (
    <div>
      {/* FIRST SECTION FOR USERS TO CHOOSE PLANT FROM DATABASE */}
      <Button
        color="seashell"
        onClick={() => {
          navigate("/");
        }}
      >
        Back to Dashboard
      </Button>

      <h1>New Plant Buddy</h1>
      <input
        type="text"
        placeholder="Search for plant"
        onChange={(e) => {
          handleSearchPlantFamily(e);
        }}
      />
      <Autocomplete
        label="Enter plant family"
        placeholder="Search from our library"
        data={plantList.map((plant) => plant.plantFamily)}
        value={searchTerm}
        limit={plantList.length}
        onChange={setSearchTerm}
      />
      {/* <br />
      {!searchTerm ? (
        plantsDB
      ) : searchPlantResults.length > 0 ? (
        searchPlantResults
      ) : (
        <p>No plants found!</p>
      )} */}
      <br />
      <Button
        onClick={(e) => {
          setPlantFamily("");
          setWaterFrequency("");
          setSunlightRequirement("");
          setShowPlantForm(true);
          setChooseDefaultPlant(false);
        }}
      >
        Add New Plant Family
      </Button>
      <br />

      {/* SECOND SECTION FOR USERS TO CHOOSE PLANT FROM DATABASE */}
      <hr />

      {!chooseDefaultPlant && !showPlantForm ? null : !chooseDefaultPlant &&
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
