import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

import plant from "../images/plant.png";

export default function PlantNurseries(props) {
  const initialMarkers = [
    {
      position: {
        lat: 1.338067,
        lng: 103.8373028,
      },
      label: { color: "white", text: "P1" },
      name: "Candy Horticulture",
    },
    {
      position: {
        lat: 1.3117354,
        lng: 103.9081898,
      },
      label: { color: "white", text: "P2" },
      name: "Potta Planta",
    },
    {
      position: {
        lat: 1.3208208,
        lng: 103.9250571,
      },
      label: { color: "white", text: "P3" },
      name: "Lai Seng Nursery and Florist",
    },
    {
      position: {
        lat: 1.287953,
        lng: 103.851784,
      },
      label: { color: "white", text: "YOU" },
      draggable: true,
      name: "Current Location",
    },
  ];

  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers, setMarkers] = useState(initialMarkers);
  const [latitude, setLatitude] = useState(1.287953);
  const [longitude, setLongitude] = useState(103.851784);

  const containerStyle = {
    width: "100%",
    height: "50vh",
    color: "black",
  };

  const center = {
    lat: 1.287953,
    lng: 103.851784,
  };

  const currLocation = {};

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
  };

  const markerDragEnd = (event, index) => {
    console.log(event.latLng.lat());
    console.log(event.latLng.lng());
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
      console.log(position);

      let newMarkers = [...markers];
      newMarkers[3].position.lat = position.coords.latitude;
      newMarkers[3].position.lng = position.coords.longitude;

      console.log("new markers:", newMarkers);
      setMarkers(newMarkers);
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={mapClicked}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            label={marker.label}
            draggable={marker.draggable}
            onDragEnd={(event) => markerDragEnd(event, index)}
            onClick={(event) => markerClicked(marker, index)}
            // icon={{
            //   url: plant,
            //   // scaledSize: new window.google.maps.Size(45, 45),
            // }}
          >
            {activeInfoWindow === index && (
              <InfoWindow position={marker.position}>
                <b>
                  {marker.name}
                  <br />
                  {marker.position.lat}, {marker.position.lng}
                </b>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      <button onClick={handleGetCurrLocation}>Current Location</button>
    </LoadScript>
  );
}
