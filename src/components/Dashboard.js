import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

// imports for firebase
import { auth, database } from "../DB/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as databaseRef, onChildAdded } from "firebase/database";

// imports for components
import WeatherModal from "./WeatherModal";
import PlantGarden from "./PlantGarden";
import PlantInfo from "./PlantInfo";

// imports for styling

import {
  Container,
  Title,
  Card,
  Paper,
  Button,
  Footer,
  Divider,
  Box,
} from "@mantine/core";
import { HeaderMiddle } from "../Styles/Header";

export default function Dashboard(props) {
  const navigate = useNavigate();

  //user info
  const user = useContext(UserContext);
  // navigate to login if there's no user data upon npm start/refresh
  if (!user) {
    localStorage.setItem("user", JSON.stringify({}));
  }

  // includes checking of auth status
  useEffect(() => {
    // for checking of user logged in status
    onAuthStateChanged(auth, (signedInUser) => {
      console.log(signedInUser);
      if (signedInUser) {
        const uid = signedInUser.uid;
      } else {
        console.log("user not signed in");
        navigate("/login");
      }
    });
  });

  ////// ----START OF RENDERING DISPLAY---- /////
  return (
    <div>
      {user ? <Title order={3}>Good morning, {user.displayName}</Title> : null}

      {/* <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button> */}

      {/* <WeatherModal /> */}

      <PlantGarden />

      <Footer height={60} p="md">
        <Link to={`/addnewplant`}>
          <Button>Add Plant to Garden!</Button>
        </Link>
      </Footer>
      {/* <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={"/community"}>Community</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/forums"}>Forums</Link>
          </li>
          <li className="navigationBarItem">
            <Link to={"/recommendations"}>Recommendations</Link>
          </li>
        </ul>
      </div> */}
    </div>
  );
}
