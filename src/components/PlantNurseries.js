import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
  AutoComplete,
} from "@react-google-maps/api";

import axios from "axios";

import plant from "../images/plant.png";
import rec from "../images/rec.png";

function PlantNurseries() {
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

  const [map, setMap] = useState(/** @type window.google.maps.Map */ (null));
  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers, setMarkers] = useState(initialMarkers);
  const [latitude, setLatitude] = useState(1.287953);
  const [longitude, setLongitude] = useState(103.851784);
  const [selectedLocation, setSelectedLocation] = useState();
  const [newCenter, setNewCenter] = useState();

  const containerStyle = {
    width: "100%",
    height: "50vh",
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

    // axios
    //   .get(
    //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
    //     {
    //       headers: { "Access-Control-Allow-Origin": "*" },
    //       params: {
    //         location: `${latitude},${longitude}`,
    //         radius: 1500,
    //         type: `florist`,
    //         keyword: `plants`,
    //         key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
    //       },
    //     }
    // `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=1500&type=restaurant&keyword=cruise&rankby=key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    // )
    // .then((response) => console.log(response))
    // .catch((error) => console.log(error));
  };

  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
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
      console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const renderMap = () => {
    return (
      <div className="map-container">
        {/* <div position="absolute" left={0} top={0} height="100%" width="100%"> */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={mapClicked}
          onLoad={(map) => setMap(map)}
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
        {/* </div> */}

        <button position="absolute" onClick={() => map.panTo(center)}>
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
