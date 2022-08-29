import { UserContext } from "../App";

// imports for react
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// imports for firebase
import { auth } from "../DB/firebase";
import { onAuthStateChanged } from "firebase/auth";

// imports for components
// import PlantCalendar from "./Calendar"; // to be shifted to nest under plantgarden

import PlantGarden from "./PlantGarden";

// imports for styling

import { Title, Button, Footer, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.colors.seashell,
    }).background,
    borderBottom: 0,
  },
}));

export default function Dashboard(props) {
  const navigate = useNavigate();
  const { classes, cx } = useStyles();

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
      {/* {user ? <Title order={3}>Good morning, {user.displayName}</Title> : null} */}
      {/* <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button> */}
      {/* <WeatherModal /> */}
      <PlantGarden />
      <Footer
        height={60}
        p="xs"
        className={classes.footer}
        sx={{ background: "transparent", border: "0" }}
      >
        <Link to={`/addnewplant`}>
          {/* <Button> */}
          {/* <Title order={6}>Add Plant to Garden!</Title> */}
          <Button>
            <Title order={6}>Add Plant to Garden!</Title>
            <img
              alt="new-plant"
              src="https://img.icons8.com/carbon-copy/30/ffffff/potted-plant.png"
            />
          </Button>

          {/* </Button> */}
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
