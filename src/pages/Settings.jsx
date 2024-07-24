import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Settings.css";

const Settings = () => {
  const [mbaList, setMbaList] = useState([]);
  const [canhBaoSettings, setCanhBaoSettings] = useState({});
  const [selectedMba, setSelectedMba] = useState(null);

  useEffect(() => {
    axios
      .get("https://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMbaList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching MBA list:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedMba) {
      axios
        .get(
          `https://ngoctoan90.pythonanywhere.com/api/thiet-lap-canh-bao/${selectedMba}/`
        )
        .then((response) => {
          setCanhBaoSettings(response.data);
        })
        .catch((error) => {
          console.error("Error fetching canh bao settings:", error);
        });
    }
  }, [selectedMba]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCanhBaoSettings({
      ...canhBaoSettings,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios
      .put(
        `https://ngoctoan90.pythonanywhere.com/api/thiet-lap-canh-bao/${selectedMba}/`,
        canhBaoSettings
      )
      .then((response) => {
        alert("Thiết lập cảnh báo đã được cập nhật");
      })
      .catch((error) => {
        console.error("Error updating canh bao settings:", error);
      });
  };

  return (
    <div className="settings-container">
      <h1>Cài đặt cảnh báo</h1>
      <div>
        <label>Chọn MBA:</label>
        <select
          onChange={(e) => setSelectedMba(e.target.value)}
          value={selectedMba}
        >
          <option value="">Chọn MBA</option>
          {mbaList.map((mba) => (
            <option key={mba.id} value={mba.id}>
              {mba.ten}
            </option>
          ))}
        </select>
      </div>
      {selectedMba && (
        <div className="settings-form">
          <label>
            Dòng cảnh báo:
            <input
              type="number"
              name="dong_canh_bao"
              value={canhBaoSettings.dong_canh_bao || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Điện áp thấp:
            <input
              type="number"
              name="dien_ap_thap"
              value={canhBaoSettings.dien_ap_thap || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Điện áp cao:
            <input
              type="number"
              name="dien_ap_cao"
              value={canhBaoSettings.dien_ap_cao || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Lưu</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
