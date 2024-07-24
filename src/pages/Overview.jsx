import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./Overview.css";

// Sử dụng icon mặc định cho marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "/marker-icon-red.png", // Đường dẫn tới icon màu đỏ
  shadowUrl: "/marker-shadow.png", // Đường dẫn tới shadow icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "/marker-icon-green.png", // Đường dẫn tới icon màu xanh
  shadowUrl: "/marker-shadow.png", // Đường dẫn tới shadow icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Overview = () => {
  const [markers, setMarkers] = useState([]);

  const fetchMarkers = () => {
    axios
      .get("https://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMarkers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchMarkers();

    // Thiết lập khoảng thời gian để làm mới dữ liệu
    const interval = setInterval(() => {
      fetchMarkers();
    }, 5000); // Làm mới mỗi 5 giây

    // Xóa khoảng thời gian khi component bị unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[13.758764, 109.217768]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.kinh_do, marker.vi_do]}
            icon={marker.su_co ? redIcon : greenIcon}
          >
            <Popup>{marker.ten}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Overview;
