import React, { useMemo, useEffect, useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

import plant from "../images/plant.png";

export default function Nurseries() {
  const [latitude, setLatitude] = useState(1.287953);
  const [longitude, setLongitude] = useState(103.851784);

  const [selectedMarker, setSelectedMarker] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState({});

  const plantNurseries = [
    [{ lat: 1.338067, lng: 103.8373028 }, "Candy Horticulture"],
    [{ lat: 1.3117354, lng: 103.9081898 }, "Potta Planta"],
    [{ lat: 1.3208208, lng: 103.9250571 }, "Lai Seng Nursery and Florist"],
  ];

  const center = { lat: latitude, lng: longitude };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const handleGetCurrLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  const onMarkerClick = (e, marker) => {
    setShowInfoWindow(true);
    console.log("place");
  };

  const onClose = () => {
    if (showInfoWindow) {
      setShowInfoWindow(false);
    }
  };

  const iFrameUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=plant+nurseries+Singapore`;

  return (
    <div>
      {latitude && longitude ? (
        <div>
          <iframe
            title="maps"
            width="100%"
            height="500"
            frameBorder="0"
            // style="border:0"
            referrerPolicy="no-referrer-when-downgrade"
            src={iFrameUrl}
            allowFullScreen
          ></iframe>
          <GoogleMap
            zoom={12}
            center={center}
            mapContainerClassName="map-container"
          >
            <Marker position={center} />
            <Marker
              onClick={onMarkerClick}
              position={{ lat: 1.343746, lng: 103.8240449 }}
              icon={{
                url: plant,
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
            <InfoWindow
              position={center}
              marker={selectedMarker}
              visible={showInfoWindow}
              onClose={onClose}
            >
              <div>
                <h4>{selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </GoogleMap>
          <button onClick={handleGetCurrLocation}>Current Location</button>
        </div>
      ) : null}
    </div>
  );
}
