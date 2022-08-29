import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";

import Nurseries from "./Map";

import PlantNurseries from "./PlantNurseries";
import { Card } from "@mantine/core";

export default function Recommendations() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });
  return (
    <div>
      <h1>Recommendations!</h1>
      <div>
        <h3>Popular Nurseries Near You!</h3>

        <PlantNurseries />
        <Nurseries />
      </div>
      <ul>
        <li>
          <div>
            <p>Recommendations</p>
          </div>
        </li>
        <li>
          <div>
            <p>More Recommendations</p>
          </div>
        </li>
        <li>
          <div>
            <p>Even More Recommendations</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
