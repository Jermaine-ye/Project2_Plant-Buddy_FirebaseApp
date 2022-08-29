import { UserContext } from "../App";

// imports for react
import { useContext, useEffect, useState } from "react";

// imports for firebase
import { database, storage } from "../DB/firebase";
import {
  ref as databaseRef,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  remove,
  update,
} from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

// imports for components
import PlantInfo from "./PlantInfo";
import PlantCalendar from "./Calendar";

//imports for styling
import dashboard from "../styling/Drawkit Plants/Drawkit_04_Dashboard.png";
import dashboardCropped from "../styling/Drawkit Plants/Drawkit_04a_DashboardCropped.png";
import { ArticleCardVertical } from "../Styles/PlantCard";
import {
  Stack,
  Divider,
  Title,
  Card,
  Image,
  Box,
  Drawer,
  ScrollArea,
} from "@mantine/core";
import { buddyTheme } from "../Styles/Theme";

// folders in realtime database and storage
const USER_PLANT_FOLDER_NAME = "userPlants";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";

export default function PlantGarden(props) {
  const user = useContext(UserContext);

  //user info
  const userName = user.displayName;
  const userPlantFolder = `${userName + "-" + user.uid}`;
  const [userPlants, setUserPlants] = useState({});
  const userPlantRef = databaseRef(
    database,
    USER_PLANT_FOLDER_NAME + "/" + userPlantFolder
  );

  // load user's plants from realtime database
  useEffect(() => {
    onChildAdded(userPlantRef, (data) => {
      setUserPlants((prevPostsState) => ({
        ...prevPostsState,
        [data.key]: data.val(),
      }));
    });

    return () => {
      setUserPlants({});
    };
  }, []);

  // update plantgarden if any value changes
  useEffect(() => {
    onChildChanged(userPlantRef, (data) => {
      setUserPlants((prevState) => ({
        ...prevState,
        [data.key]: data.val(),
      }));
    });
  }, []);

  // update plantgarden if plant gets removed
  useEffect(() => {
    onChildRemoved(userPlantRef, (data) =>
      setUserPlants((prevState) => {
        let newState = { ...prevState };
        delete newState[data.key];

        return newState;
      })
    );
  }, []);

  //selected plant info for modal
  const [selectedPlantProfile, setSelectedPlantProfile] = useState({});

  // reminder
  const [showReminder, setShowReminder] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDeletePlant = (e, id) => {
    const plantEntry = id;
    console.log("delete entry:", id);

    //delete from realtime database
    const plantEntryRef = databaseRef(
      database,
      USER_PLANT_FOLDER_NAME + "/" + userPlantFolder + "/" + plantEntry
    );

    remove(plantEntryRef);
    // delete image from storage

    const userPlantImagesRef = storageRef(
      storage,
      `${USER_PLANT_IMAGES_FOLDER_NAME}/${
        userPlants[Object.keys(userPlants)[0]].plantImageName
      }`
    );

    deleteObject(userPlantImagesRef)
      .then(() => {
        console.log("image deleted!");
      })
      .catch((error) => console.log(error));

    setDrawerOpen(false);
  };

  // to render user's list of plants in dashboard view
  const plantCards = Object.entries(userPlants).map(
    ([plantEntryKey, plantData], index) => {
      return (
        <Box
          key={index}
          onClick={() => {
            setSelectedPlantProfile({ [plantEntryKey]: plantData });
            setDrawerOpen(true);
          }}
        >
          <ArticleCardVertical
            image={plantData.plantImageUrl}
            plantFamily={plantData.plantFamily}
            plantName={plantData.plantName}
            dateAdded={plantData.dateAdded}
            dateLastWatered={plantData.dateLastWateredCheck}
          />
        </Box>
      );
    }
  );

  return (
    <>
      <Card p="0" sx={{ background: buddyTheme.colors.tan[5] }}>
        <div className="dashboard-banner">
          <Image
            radius="md"
            width="40vw"
            src={dashboardCropped}
            alt={dashboardCropped}
          />
          {user ? (
            <Title order={2} color="white">
              Welcome Back, <br />
              {user.displayName}
            </Title>
          ) : null}
        </div>
      </Card>
      <PlantCalendar plantData={userPlants} user={user} />
      {/* <img className="community-header-img" src={dashboard} alt={dashboard} /> */}

      <Stack spacing="xs">{plantCards.reverse()}</Stack>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedPlantProfile.plantName}
        padding="0"
        size="90%"
        position="bottom"
        withCloseButton={false}
        trapFocus={false}
      >
        <PlantInfo
          selectedPlantProfile={selectedPlantProfile}
          deletePlant={handleDeletePlant}
          closeDrawer={() => setDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
}
