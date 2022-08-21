import React, { useMemo, useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Nurseries() {
  const [latitude, setLatitude] = useState(1.287953);
  const [longitude, setLongitude] = useState(103.851784);
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

  return (
    <div>
      {latitude && longitude ? (
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerClassName="map-container"
        >
          <Marker position={center} />
        </GoogleMap>
      ) : null}
    </div>
  );
}
