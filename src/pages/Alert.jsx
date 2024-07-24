import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Alert.css"; // Import CSS

const Alert = () => {
  const [mbaList, setMbaList] = useState([]);
  const [selectedMbaId, setSelectedMbaId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [duLieuMap, setDuLieuMap] = useState({});

  useEffect(() => {
    axios
      .get("https://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMbaList(response.data);
        if (response.data.length > 0) {
          setSelectedMbaId(response.data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching MBA list:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedMbaId !== null) {
      axios
        .get("https://ngoctoan90.pythonanywhere.com/api/canh-bao/")
        .then((response) => {
          const alertsData = response.data;
          const duLieuIds = [
            ...new Set(alertsData.map((alert) => alert.du_lieu)),
          ];
          axios
            .get("https://ngoctoan90.pythonanywhere.com/api/du-lieu/")
            .then((response) => {
              const duLieuData = response.data.reduce((map, duLieu) => {
                map[duLieu.id] = duLieu.may_bien_ap;
                return map;
              }, {});
              setDuLieuMap(duLieuData);
              setAlerts(
                alertsData.filter(
                  (alert) => duLieuData[alert.du_lieu] === selectedMbaId
                )
              );
            })
            .catch((error) => {
              console.error("Error fetching du-lieu:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching alerts:", error);
        });
    }
  }, [selectedMbaId]);

  return (
    <div>
      <h1>Cảnh báo</h1>
      <div className="tab-container">
        {mbaList.map((mba) => (
          <button
            key={mba.id}
            className={`tab-button ${selectedMbaId === mba.id ? "active" : ""}`}
            onClick={() => setSelectedMbaId(mba.id)}
          >
            {mba.ten}
          </button>
        ))}
      </div>
      <div className="alerts-container">
        <table>
          <thead>
            <tr>
              <th>Nội dung</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.noi_dung}</td>
                <td>{alert.thoi_gian}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alert;
