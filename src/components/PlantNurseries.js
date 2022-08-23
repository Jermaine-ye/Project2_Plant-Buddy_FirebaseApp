import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import plant from "../images/plant.png";

// const options = {
//   zoomControlOptions: {
//     position: window.google.maps.ControlPosition.RIGHT_CENTER, // 'right-center' ,
//     // ...otherOptions
//   },
// };

function PlantNurseries() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const initialMarkers = [
    {
      position: {
        lat: 1.338067,
        lng: 103.8373028,
      },
      name: "Candy Horticulture",
    },
    {
      position: {
        lat: 1.3117354,
        lng: 103.9081898,
      },
      name: "Potta Planta",
    },
    {
      position: {
        lat: 1.3208208,
        lng: 103.9250571,
      },
      name: "Lai Seng Nursery and Florist",
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
    lat: latitude,
    lng: longitude,
  };

  const currLocation = {};

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
  };

  const markerDragEnd = (event) => {
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
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
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const renderMap = () => {
    return (
      <div>
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
              onClick={(event) => markerClicked(marker, index)}
              icon={{
                url: plant,
                scaledSize: new window.google.maps.Size(45, 45),
              }}
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
          <Marker
            position={center}
            draggable={true}
            onDragEnd={(event) => {
              markerDragEnd(event);
            }}
          />
        </GoogleMap>
        <button onClick={handleGetCurrLocation}>
          Reset to Current Location
        </button>
      </div>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <div>loading</div>;
}

export default PlantNurseries;
