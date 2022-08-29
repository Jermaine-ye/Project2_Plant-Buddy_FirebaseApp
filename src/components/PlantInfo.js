import { UserContext } from "../App";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// imports related to realtime database
import { ref as databaseRef, update } from "firebase/database";
import {
  ref as storageRef,
  deleteObject,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../DB/firebase";

// imports for styling
import {
  Card,
  Image,
  ScrollArea,
  Title,
  Stack,
  Divider,
  Blockquote,
  Select,
  Grid,
  NumberInput,
  Space,
  Badge,
  Text,
  TextInput,
  Group,
  ActionIcon,
  Button,
  FileInput,
  MultiSelect,
  Textarea,
} from "@mantine/core";
import {
  EditCircle,
  Trash,
  DropletFilled2,
  Upload,
  CircuitGroundDigital,
} from "tabler-icons-react";

// folders in realtime database
const USER_PLANT_FOLDER_NAME = "userPlants";
const USER_PLANT_IMAGES_FOLDER_NAME = "userPlantsImages";

export default function PlantInfo(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const userName = user.displayName;
  const userFolder = `${user.displayName + "-" + user.uid}`;

  // selected plant pointer
  //data.key = realtime database entry key
  //data.val() = {plantFamily:"", sunlightReq:"", waterFreqDay:"", ...}
  const plant = props.selectedPlantProfile;
  const plantKey = Object.keys(plant)[0];
  const plantInfo = plant[plantKey];

  // plant info to be updated
  const [plantPhoto, setPlantPhoto] = useState(plantInfo.plantImageUrl);
  const [waterFrequency, setWaterFrequency] = useState(plantInfo.waterFreqDay);
  const [sunlightRequirement, setSunlightRequirement] = useState(
    plantInfo.sunlightReq
  );
  const [plantFamily, setPlantFamily] = useState(plantInfo.plantFamily);
  const [plantCondition, setPlantCondition] = useState(
    plantInfo.plantCondition
  );
  const [plantName, setPlantName] = useState(plantInfo.plantName);
  const [plantNotes, setPlantNotes] = useState(plantInfo.plantNotes);

  // for new photo upload
  const [uploadNewPhoto, setUploadNewPhoto] = useState(false);
  const [plantPhotoFile, setPlantPhotoFile] = useState(null);
  const [plantPhotoValue, setPlantPhotoValue] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const [editMode, setEditMode] = useState(false);
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
  // to render new edited info
  useEffect(() => {
    setPlantPhoto(plantInfo.plantImageUrl);
    setWaterFrequency(plantInfo.waterFreqDay);
    setSunlightRequirement(plantInfo.sunlightReq);
    setPlantFamily(plantInfo.plantFamily);
    setPlantCondition(plantInfo.plantCondition);
    setPlantName(plantInfo.plantName);
    setPlantNotes(plantInfo.plantNotes);
  }, [props]);

  const newPhotoUpload = (
    <Grid grow align="center">
      <Grid.Col span={8}>
        <FileInput
          variant="filled"
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
      </Grid.Col>
      <Grid.Col span={2}>
        <Button
          onClick={() => {
            setUploadNewPhoto(!uploadNewPhoto);
            setPlantPhotoFile(null);
            setPlantPhotoValue("");
            setPhotoPreview("");
          }}
        >
          Cancel
        </Button>
      </Grid.Col>
    </Grid>
  );

  const userPlantRef = databaseRef(
    database,
    USER_PLANT_FOLDER_NAME + "/" + userFolder
  );

  // submit changes to realtime database
  const handleSubmitChanges = (e) => {
    e.preventDefault();

    // if plantphoto changed, delete image in storage

    if (plantPhotoFile) {
      const oldPlantImageRef = storageRef(
        storage,
        `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantInfo.plantImageName}`
      );

      deleteObject(oldPlantImageRef).then(() => {
        const userPlantImagesRef = storageRef(
          storage,
          `${USER_PLANT_IMAGES_FOLDER_NAME}/${plantPhotoFile.name}`
        );

        uploadBytes(userPlantImagesRef, plantPhotoFile).then(() => {
          getDownloadURL(userPlantImagesRef).then((url) => {
            const updatedData = {
              ...plantInfo,
              plantImageUrl: url,
              plantImageName: plantPhotoFile.name,
              plantCondition: plantCondition,
              waterFreqDay: waterFrequency,
              sunlightReq: sunlightRequirement,
              plantName: plantName,
              plantNotes: plantNotes,
            };

            update(userPlantRef, { [plantKey]: updatedData });
          });
        });
      });
    } else {
      const updatedData = {
        ...plantInfo,
        plantCondition: plantCondition,
        waterFreqDay: waterFrequency,
        sunlightReq: sunlightRequirement,
        plantName: plantName,
        plantNotes: plantNotes,
      };

      update(userPlantRef, { [plantKey]: updatedData });
    }
  };

  // to revert all values to initial state
  const handleResetChanges = () => {
    setWaterFrequency(plantInfo.waterFreqDay);
    setSunlightRequirement(plantInfo.sunlightReq);
    setPlantFamily(plantInfo.plantFamily);
    setPlantCondition(plantInfo.plantCondition);
    setPlantName(plantInfo.plantName);
    setPlantNotes(plantInfo.plantNotes);
    setPlantPhoto(plantInfo.plantImageUrl);
  };

  // editable page
  const editProfile = (
    <>
      <Space h="xs" />

      {uploadNewPhoto ? (
        newPhotoUpload
      ) : (
        <Button
          onClick={() => {
            setUploadNewPhoto(!uploadNewPhoto);
            setPlantPhotoFile(null);
            setPlantPhotoValue("");
            setPhotoPreview("");
          }}
        >
          Upload New Photo
        </Button>
      )}
      <Space h="xs" />
      <TextInput
        variant="filled"
        name="plantName"
        label="Plant Name"
        id="plantName1"
        value={plantName}
        onChange={(e) => setPlantName(e.target.value)}
        required
        placeholder="Plant Name"
        maxLength={24}
      />
      <Grid>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
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
            variant="filled"
            label="Sunlight Requirement"
            name="sunlight"
            value={sunlightRequirement}
            data={["intense", "moderate", "low"]}
            onChange={(e) => setSunlightRequirement(e)}
            required
          />
        </Grid.Col>
      </Grid>
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
      {/*  */}
      <Space h="xs" />
      <Textarea
        name="notes"
        label="Notes"
        description="Max 256 characters"
        value={plantNotes}
        onChange={(e) => setPlantNotes(e.target.value)}
        maxLength={256}
      />
      <Space h="sm" />
      <Group grow>
        <Button onClick={handleSubmitChanges}>Update Changes</Button>
        <Button onClick={handleResetChanges}>Reset Changes</Button>
      </Group>
    </>
  );

  // read-only page
  const readOnlyProfile = (
    <>
      <Title order={3} align="center">
        {plantName}
      </Title>
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
            required
            min={0}
            icon={
              <img
                alt="watering-can"
                src="https://img.icons8.com/carbon-copy/30/000000/watering-can.png"
              />
            }
            disabled
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
            required
            disabled
          />
        </Grid.Col>
      </Grid>
      <Space h="xs" />
      <Divider label="Plant Condition" labelPosition="center" />
      <Space h="xs" />
      <Stack spacing="xs">
        {plantCondition ? (
          plantCondition.map((condition, index) => (
            <Badge key={index} variant="outline" color="seashell" size="md">
              {condition}
            </Badge>
          ))
        ) : (
          <Text align="center">No condition reported!</Text>
        )}
      </Stack>
      <Space h="xs" />
      <Divider label="Plant Notes" labelPosition="center" />
      <Space h="xs" />
      <Blockquote>
        {plantNotes ? plantNotes : <Text>Nothing here!</Text>}
      </Blockquote>
    </>
  );

  return (
    <>
      <Card>
        <Card.Section></Card.Section>
        <Card.Section>
          <Image
            src={!photoPreview ? plantPhoto : photoPreview}
            alt={plantName}
            height={200}
          />
          <Space h="xs" />
        </Card.Section>

        <Group position="right" spacing="xs">
          <ActionIcon onClick={() => setEditMode(!editMode)}>
            <EditCircle />
          </ActionIcon>
          <ActionIcon
            id={plantKey}
            onClick={(e) => {
              props.deletePlant(e, plantKey);
            }}
          >
            <Trash />
          </ActionIcon>
        </Group>

        <Text align="center" order={3}>
          {plantFamily.toLowerCase()}
        </Text>
        {editMode ? editProfile : readOnlyProfile}
      </Card>
    </>
  );
}
