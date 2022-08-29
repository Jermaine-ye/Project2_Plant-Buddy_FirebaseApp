import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import plant from "../images/plant.png";
import rec from "../images/rec.png";

import {
  Card,
  Image,
  Text,
  Group,
  ActionIcon,
  Space,
  Stack,
  Anchor,
  Container,
} from "@mantine/core";

import { CurrentLocation } from "tabler-icons-react";

function PlantNurseries(props) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries: ["places"],
  });

  const initialMarkers = [
    {
      position: {
        lat: 1.338067,
        lng: 103.8373028,
      },
      name: "Candy Horticulture",
      imageUrl: "https://www.candy.com.sg/img/cms/Candy-Retail-Store.jpg",
      address: "",
    },
    {
      position: {
        lat: 1.3117354,
        lng: 103.9081898,
      },
      name: "Potta Planta",
      imageUrl:
        "https://tendergardener.b-cdn.net/wp-content/uploads/2020/05/20191029_152541-1024x671.jpg",
      address: "",
    },
    {
      position: {
        lat: 1.3208208,
        lng: 103.9250571,
      },
      name: "Lai Seng Nursery and Florist",
      imageUrl:
        "https://www.streetdirectory.com/stock_images/travel/simg_show/13140046690028/242761/lai_seng_florist/",
      address: "",
    },
  ];

  const nurseryInfo = props.nurseryList;
  const [map, setMap] = useState(/** @type window.google.maps.Map */ (null));
  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers, setMarkers] = useState(nurseryInfo);
  const [latitude, setLatitude] = useState(1.287953);
  const [longitude, setLongitude] = useState(103.851784);
  const [selectedLocation, setSelectedLocation] = useState();
  const [newCenter, setNewCenter] = useState();
  const [showNurseryCard, setShowNurseryCard] = useState(false);
  const [nursery, setNursery] = useState({
    "": {
      position: "",
      name: "",
      imageUrl: "",
      address: "",
    },
  });

  const nurseryName = Object.keys(nursery)[0];

  // render nursery info in a card
  const shopCards = (
    <>
      <Card withBorder radius="md" p={0}>
        <Group noWrap spacing={0}>
          <Image src={nursery[nurseryName].imageUrl} height={140} width={140} />
          <div>
            <Text
              mt="md"
              transform="uppercase"
              color="dimmed"
              weight={700}
              size="xs"
            >
              {nurseryName}
            </Text>
            <Text mt="xs" mb="xs">
              {nursery[nurseryName].address}
            </Text>
            <Text size="xs">{nursery[nurseryName].hours}</Text>

            <Text size="xs">{nursery[nurseryName].tel}</Text>

            <Anchor href={nursery[nurseryName].url}>
              <Text size="xs" color="dimmed" mb="md">
                {nursery[nurseryName].url}
              </Text>
            </Anchor>
          </div>
        </Group>
      </Card>
    </>
  );

  const containerStyle = {
    width: "100%",
    height: "30vh",
    color: "black",
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setActiveInfoWindow(false);
    setShowNurseryCard(false);
  };

  const markerClicked = (marker, nursery, index) => {
    setActiveInfoWindow(index);
    setShowNurseryCard(true);
    setNursery({ [marker]: nursery });
    console.log(nursery, index);
  };

  const markerDragEnd = (event) => {
    // setLatitude(event.latLng.lat());
    // setLongitude(event.latLng.lng());

    setNewCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    map.panTo(newCenter);
  };

  const handleGetCurrLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const renderMap = () => {
    return (
      <>
        <Container px={0}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={mapClicked}
            onLoad={(map) => setMap(map)}
          >
            {Object.keys(nurseryInfo).map((marker, index) => (
              <Marker
                key={index}
                position={{
                  lat: Number(nurseryInfo[marker].position.lat),
                  lng: Number(nurseryInfo[marker].position.lng),
                }}
                onClick={(event) => {
                  markerClicked(marker, nurseryInfo[marker], index);
                }}
                icon={{
                  url: plant,
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              >
                {activeInfoWindow === index && (
                  <InfoWindow
                    position={{
                      lat: Number(nurseryInfo[marker].position.lat),
                      lng: Number(nurseryInfo[marker].position.lng),
                    }}
                  >
                    <b>{marker}</b>
                  </InfoWindow>
                )}
              </Marker>
            ))}
            <Marker
              name="current-location"
              position={center}
              draggable={true}
              onDragEnd={(event) => {
                markerDragEnd(event);
              }}
            />
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                draggable={true}
                onClick={() => map.panTo(selectedLocation)}
                icon={{
                  url: rec,
                  scaledSize: new window.google.maps.Size(20, 20),
                }}
              />
            )}
          </GoogleMap>

          <ActionIcon onClick={() => map.panTo(center)}>
            <CurrentLocation />
          </ActionIcon>
        </Container>
        <Space h="xs" />

        {/* Shop Card */}
        {showNurseryCard ? shopCards : null}
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <div>loading</div>;
}

export default PlantNurseries;
