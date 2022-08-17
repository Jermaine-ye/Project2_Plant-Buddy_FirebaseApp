import { UserContext } from "../App";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// imports related to realtime database
import { ref, child, get } from "firebase/database";
import { database } from "../DB/firebase";

export default function PlantInfo(props) {
  // const [state, setState] = useState(state)
  // const { id } = useParams();
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userName = user.displayName;
  const plant = props.selectedPlantProfile;

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (Object.keys(isLoggedIn) === 0) {
      navigate("/login");
    }
  });

  if (!props.selectedPlantProfile) return <p>TESTING</p>;

  return (
    <div>
      <h4>
        {userName}'s Plant: {plant.key}
        <p>Watering Schedule: Every {plant.val.waterFreqDay} Days</p>
        <p>Sunlight Intensity: {plant.val.sunlightReq} </p>
        <p>Plant Condition: {plant.val.plantCondition}</p>
        <p>Special Notes: {plant.val.plantNotes}</p>
      </h4>
      <button>Edit Plant Info</button>
      <br />

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
