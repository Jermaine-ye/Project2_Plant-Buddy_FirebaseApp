import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// imports related to realtime database
import { ref, child, get } from "firebase/database";
import { database } from "../DB/firebase";

export default function PlantInfo(props) {
  // const [state, setState] = useState(state)
  const { id } = useParams();
  const navigate = useNavigate();

  // for testing purposes
  const userName = "abc";

  // plant data

  // get user's plants from realtime database

  useEffect(() => {});

  return (
    <div>
      <h4>Plant {id}</h4>
      <div>
        <h5>Info for Plant #{id}</h5>
        <p>Lorem Ipsum etc</p>
      </div>
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
