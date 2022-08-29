import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

// imports for firebase
import { onChildAdded, ref as databaseRef, get } from "firebase/database";
import { database } from "../DB/firebase";

// imports for components
import PlantNurseries from "./PlantNurseries";
import { NewPlantCard } from "../Styles/NewPlant";

// imports for styling

import {
  Card,
  Title,
  Stack,
  Container,
  Space,
  Grid,
  Button,
} from "@mantine/core";

import { ArrowsShuffle } from "tabler-icons-react";

const PLANTS_FOLDER_NAME = "allPlants";
const NURSERY_FOLDER_NAME = "nurseryInfo";

export default function Recommendations() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // for getting list of plants from realtime database
  const [plantList, setPlantList] = useState([]);
  const [nurseryList, setNurseryList] = useState({});
  const [randomPlants, setRandomPlants] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

  const getRandomPlants = (plantData) => {
    let allPlants = Object.keys(plantData);

    let randomList = [];
    while (randomList.length < 3) {
      let randomNumber = Math.floor(
        Math.random() * (Object.keys(plantData).length + 1)
      );

      if (!randomList.includes(allPlants[randomNumber])) {
        randomList.push(allPlants[randomNumber]);
      }
    }
    setRandomPlants(randomList);
  };

  // // to render all plants in firebase
  useEffect(() => {
    const plantsRef = databaseRef(database, PLANTS_FOLDER_NAME);
    get(plantsRef)
      .then((snapshot) => {
        setPlantList(snapshot.val());
        getRandomPlants(snapshot.val());
      })

      .catch((error) => console.error(error));
  }, []);

  // to render all nuseries in firebase
  useEffect(() => {
    const nurseryRef = databaseRef(database, NURSERY_FOLDER_NAME);
    onChildAdded(nurseryRef, (data) => {
      setNurseryList((prevState) => ({
        ...prevState,
        [data.key]: data.val(),
      }));
    });

    return () => {
      setNurseryList([]);
    };
  }, []);

  const randomRecommendations = randomPlants.map((plant, index) => (
    <>
      <NewPlantCard
        key={index}
        plantInfo={plantList[plant]}
        image={plantList[plant].url}
        plantFamily={plant}
        description={plantList[plant].description}
        link="https://tumbleweedplants.com/"
      />
    </>
  ));

  return (
    <Grid>
      <Grid.Col>
        <Title order={3}>Popular Nurseries!</Title>
      </Grid.Col>
      <Grid.Col>
        <PlantNurseries nurseryList={nurseryList} />
      </Grid.Col>
      <Grid.Col>
        <Title order={3}>Plants You May Like</Title>
      </Grid.Col>
      <Grid.Col>
        <Button
          rightIcon={<ArrowsShuffle size={14} />}
          onClick={() => getRandomPlants(plantList)}
        >
          Get New Recommendations!
        </Button>
      </Grid.Col>
      <Grid.Col>
        <Stack>
          {plantList && Object.keys(plantList).length > 0
            ? randomRecommendations
            : null}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
