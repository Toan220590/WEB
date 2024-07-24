import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./MapView.css"; // Import file CSS

const MapView = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios
      .get("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMarkers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[13.758764, 109.217768]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.kinh_do, marker.vi_do]}>
            <Popup>{marker.ten}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
