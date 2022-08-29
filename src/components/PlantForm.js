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

import {
  Button,
  Title,
  Autocomplete,
  Breadcrumbs,
  Anchor,
  Container,
  Stack,
  Group,
  Grid,
  Divider,
  TextInput,
  Modal,
  Image,
  Card,
  Text,
  FileInput,
  Stepper,
  Space,
  NumberInput,
  Select,
  Switch,
  MultiSelect,
  Textarea,
  Badge,
  Blockquote,
  Alert,
} from "@mantine/core";

import { Plus, Upload } from "tabler-icons-react";

import glossary from "../styling/Drawkit Plants/Drawkit_05_Glossary.png";
import glossaryheader from "../styling/Drawkit Plants/Drawkit_05a_Glossary.png";
import { buddyTheme } from "../Styles/Theme";

const USER_PLANT_FOLDER_NAME = "userPlants/";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";
const PLANTS_FOLDER_NAME = "allPlants";

export default function PlantForm() {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userInfo = `${user.displayName + "-" + user.uid}`;

  // // for conditional rendering of form
  // const [showPlantForm, setShowPlantForm] = useState(false);
  const [chooseDefaultPlant, setChooseDefaultPlant] = useState(false);

  // for getting list of plants from realtime database
  const [plantList, setPlantList] = useState({});
  const allPlantFamily = Object.keys(plantList).map(
    (plantFamily) => plantFamily
  );
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

  /////////////// STYLING ///////////////

  // BREADCRUMBS
  const items = [
    { title: "Plant Garden", href: "/" },
    { title: "Add Plant", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  // MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [plantAddedModal, setPlantAddedModal] = useState(false);

  // STEPPER
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () => {
    if (plantPhotoFile === null && plantName === "") {
      alert("Upload a photo of your buddy and name your buddy to proceed!");
    } else if (plantPhotoFile === null && plantName !== "") {
      alert("Upload a photo of your buddy to proceed!");
    } else if (plantName === "" && plantPhotoFile !== null) {
      alert("Name your new buddy to proceed!");
    } else {
      setActiveStep((current) => (current < 2 ? current + 1 : current));
    }
  };
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  // MULTIESELECT
  const [plantConditionData, setPlantConditionData] = useState([
    { value: "glowing", label: "Glowing", group: "Healthy Traits" },
    { value: "new sprout", label: "New Sprout", group: "Healthy Traits" },
    { value: "wilting", label: "Wilting", group: "Unhealthy Traits" },
    {
      value: "infested by insects",
      label: "Infested By Insects",
      group: "Unhealthy Traits",
    },
    {
      value: "needs more sunlight",
      label: "Needs More Sunlight",
      group: "Healthy Traits",
    },
    { value: "white spots", label: "White Spots", group: "Unhealthy Traits" },
    { value: "need to repot", label: "Pending Repot", group: "Others" },
    {
      value: "require fertiliser",
      label: "Require Fertiliser",
      group: "Others",
    },
  ]);

  /////////////// USEEFFECTS HOOKS ///////////////

  // to check if user is logged in
  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));
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
      setPlantList((prevState) => ({
        ...prevState,
        [data.key]: data.val(),
      }));
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
          navigate("/");
        });
      })
      .catch((err) => console.log(err));
  };

  // to store user's selected plant for add plant entry
  const handleClickSelectedPlant = () => {
    if (searchTerm === "") {
      alert("Input is blank. Please type something...");
    } else {
      setModalOpen(true);

      if (allPlantFamily.includes(searchTerm)) {
        setSelectedPlant(plantList[searchTerm]);
        setWaterFrequency(plantList[searchTerm].waterFreqDay);
        setSunlightRequirement(plantList[searchTerm].sunlightReq);
        setPlantFamily(searchTerm);
        setChooseDefaultPlant(true);
      } else {
        setPlantFamily(searchTerm.toUpperCase());
        setWaterFrequency("");
        setSunlightRequirement("");
        setChooseDefaultPlant(false);
      }
    }
  };

  /////////////// RENDERING CONSTS ///////////////

  // generate some info on selected plant
  const plantSnippet = (
    <>
      <Card withBorder radius="md">
        <Card.Section>
          <Image
            src={
              allPlantFamily.includes(searchTerm)
                ? plantList[searchTerm].url
                : ""
            }
            height={180}
          />
        </Card.Section>

        <Title order={5}>
          {allPlantFamily.includes(searchTerm) ? searchTerm : ""}
        </Title>

        <Text size="sm" color="dimmed">
          {allPlantFamily.includes(searchTerm)
            ? plantList[searchTerm].description
            : ""}
        </Text>
      </Card>
    </>
  );

  // generate recommended care for selectedPlant in plantform
  const selectedPlantForm = (
    <>
      <Text size="lg" color="tan" weight={700}>
        Recommended Plant Care:
      </Text>
      <Space h="xs" />
      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            variant="unstyled"
            label="Watering Schedule"
            name="water"
            description="Frequency in Days"
            value={Number(waterFrequency)}
            onChange={(e) => {
              setWaterFrequency(e);
            }}
            disabled={acceptRecommended}
            required
            min={0}
            icon={
              <img
                alt="watering-can"
                src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
              />
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            variant="unstyled"
            label="Sunlight Requirement"
            name="sunlight"
            value={sunlightRequirement}
            data={["intense", "moderate", "low"]}
            onChange={(e) => setSunlightRequirement(e)}
            disabled={acceptRecommended}
            required
          />
        </Grid.Col>
      </Grid>
      <Space h="xs" />
      <Switch
        checked={acceptRecommended}
        onChange={(e) => {
          setAcceptRecommended(!acceptRecommended);
          setWaterFrequency(plantList[searchTerm].waterFreqDay);
          setSunlightRequirement(plantList[searchTerm].sunlightReq);
        }}
        label="Use Recommendation"
      />
    </>
  );

  // generate new plant species care routine if plant not in plantsDB
  const newPlantSpeciesForm = (
    <>
      <Text size="lg" color="tan" weight={700}>
        Your Plant Care Routine
      </Text>
      <Space h="xs" />
      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            label="Watering Schedule"
            name="water"
            description="Frequency in Days"
            value={Number(waterFrequency)}
            onChange={(e) => {
              setWaterFrequency(e);
            }}
            required
            min={0}
            icon={
              <img
                alt="watering-can"
                src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
              />
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Sunlight Requirement"
            name="sunlight"
            value={sunlightRequirement}
            data={["intense", "moderate", "low"]}
            onChange={(e) => setSunlightRequirement(e)}
            required
          />
        </Grid.Col>
      </Grid>
      <Space h="xs" />
    </>
  );

  // generate shared portion of the form regardless of new plant species or selectedPlant
  const sharedForm = (
    <>
      <Space h="xs" />
      <Text size="lg" color="tan" weight={700}>
        More Info on {plantName.toUpperCase()}
      </Text>
      <Space h="xs" />

      {/*  */}
      <MultiSelect
        label="Plant Condition"
        placeholder="Pick all that applies"
        data={plantConditionData}
        value={plantCondition}
        onChange={(e) => {
          setPlantCondition(e);
        }}
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query, group: "Custom" };
          setPlantConditionData((current) => [...current, item]);
          return item;
        }}
      />
      <Space h="xs" />
      <Textarea
        name="notes"
        label="Notes"
        description="Max 256 characters"
        value={plantNotes}
        onChange={(e) => setPlantNotes(e.target.value)}
        maxLength={256}
      />
    </>
  );

  const sharedTopForm = (
    <>
      <FileInput
        required
        type="file"
        label="Upload Plant Photo"
        placeholder="Choose photo"
        icon={<Upload size={14} />}
        onChange={(e) => {
          setPlantPhotoFile(e);
          setPlantPhotoValue(e.name);
          setPhotoPreview(URL.createObjectURL(e));
        }}
      />
      <img alt="" src={photoPreview} width="100%" />
      <Space h="md" />
      <TextInput
        name="plantName"
        label="Buddy's Name"
        value={plantName}
        onChange={(e) => {
          setPlantName(e.target.value);
        }}
        required
        placeholder="Plant Name"
        maxLength={24}
      />
    </>
  );

  const plantProfile = (
    <>
      <Title order={3} align="center">
        {plantName}
      </Title>
      <img alt="" src={photoPreview} width="100%" />
      <Space h="xs" />
      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            variant="unstyled"
            label="Watering Schedule"
            name="water"
            description="Frequency in Days"
            value={Number(waterFrequency)}
            onChange={(e) => {
              setWaterFrequency(e);
            }}
            disabled={acceptRecommended}
            required
            min={0}
            icon={
              <img
                alt="watering-can"
                src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
              />
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            variant="unstyled"
            label="Sunlight Requirement"
            name="sunlight"
            value={sunlightRequirement}
            data={["intense", "moderate", "low"]}
            onChange={(e) => setSunlightRequirement(e)}
            disabled={acceptRecommended}
            required
          />
        </Grid.Col>
      </Grid>
      <Space h="xs" />
      <Divider label="Plant Condition" labelPosition="center" />
      <Space h="xs" />
      <Stack spacing="xs">
        {plantCondition.map((condition, index) => (
          <Badge key={index} variant="outline" color="seashell" size="md">
            {condition}
          </Badge>
        ))}
      </Stack>
      <Space h="xs" />
      <Divider label="Plant Notes" labelPosition="center" />
      <Space h="xs" />
      <Blockquote>{plantNotes}</Blockquote>
    </>
  );

  const crumbs = [
    { title: "Plant Garden", href: "/" },
    { title: "Add Plant", href: "/addnewplant" },
  ].map((crumb, index) => {
    return (
      <Anchor href={crumb.href} key={index}>
        <Text size="xs"> {crumb.title}</Text>
      </Anchor>
    );
  });

  return (
    <div className="addplantform">
      <div>
        <Breadcrumbs separator=">">{crumbs}</Breadcrumbs>
      </div>
      <Container sx={{ paddingLeft: "0", paddingRight: "10px" }}>
        <br />
        <Stack>
          <div>
            <Card p="0" sx={{ background: buddyTheme.colors.seashell[5] }}>
              <div className="community-dashboard-banner">
                <Image
                  radius="md"
                  width="40vw"
                  src={glossaryheader}
                  alt={glossaryheader}
                />
                <Title
                  order={2}
                  color="white"
                  sx={{
                    margin: "auto",
                    paddingRight: "5px",
                    paddingLeft: "5px",
                  }}
                >
                  New Plant Buddy
                </Title>
              </div>
            </Card>
          </div>
          {/* <img className="community-header-img" src={glossary} alt={glossary} /> */}
          {/* <Title order={3}>New Plant Buddy</Title> */}
          <Grid grow gutter="xs">
            <Grid.Col span={9}>
              <Autocomplete
                placeholder="Search plant family"
                data={Object.keys(plantList).map((plantFamily) => plantFamily)}
                value={searchTerm}
                limit={plantList.length}
                onChange={setSearchTerm}
                nothingFound={
                  <p>
                    Plant family unknown. <br />
                    But continue typing, we will add it as a new plant family!
                    😀
                  </p>
                }
              />
            </Grid.Col>
            <Grid.Col span={3} sx={{ paddingRight: "0" }}>
              <Button onClick={() => handleClickSelectedPlant()}>
                <Plus size={20} strokeWidth={2} color={"white"} />
              </Button>
            </Grid.Col>
          </Grid>
          {allPlantFamily.includes(searchTerm) ? plantSnippet : null}
        </Stack>
      </Container>
      <Modal
        size="90%"
        centered
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Title order={4}>
            ADDING {user.displayName.toUpperCase()}'s NEW {plantFamily}
          </Title>
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        overlayColor={buddyTheme.colors["deep-green"]}
        overflow="inside"
      >
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          // breakpoint="sm"
          orientation="horizontal"
        >
          <Stepper.Step>
            Firstly, set a profile photo and name your new buddy!
            <Space h="md" />
            <Divider />
            <Space h="md" />
            {sharedTopForm}
          </Stepper.Step>
          <Stepper.Step>
            Lastly, record your plant care methods!
            <Space h="md" />
            <Divider />
            <Space h="md" />
            {!chooseDefaultPlant ? newPlantSpeciesForm : selectedPlantForm}
            {sharedForm}
          </Stepper.Step>

          <Stepper.Completed>
            All done, click add Buddy to the Plant Garden now or back to edit!
            <Space h="md" />
            <Divider />
            <Space h="md" />
            {plantProfile}
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          {activeStep > 0 ? (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          ) : null}
          {activeStep < 2 ? (
            <Button onClick={nextStep}>Next step</Button>
          ) : (
            <Button
              onClick={(e) => {
                handleSubmitNewPlant(e);
                setPlantAddedModal(true);
              }}
            >
              Add Buddy
            </Button>
          )}
        </Group>
      </Modal>
      <Modal
        opened={plantAddedModal}
        onClose={() => {
          setPlantAddedModal(false);
        }}
      >
        <div className="delete-modal">
          <Title order={6}>Added New Plant!</Title>
        </div>
      </Modal>
    </div>
  );
}
