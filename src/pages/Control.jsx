import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Control.css";

const Control = () => {
  const [mbaList, setMbaList] = useState([]);
  const [selectedMba, setSelectedMba] = useState(null);
  const [devices, setDevices] = useState([]);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [editDevice, setEditDevice] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    axios
      .get("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMbaList(response.data);
        if (response.data.length > 0) {
          setSelectedMba(response.data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedMba) {
      fetchDevices();
    }
  }, [selectedMba]);

  const fetchDevices = () => {
    axios
      .get(
        `http://ngoctoan90.pythonanywhere.com/api/thiet-bi/?may_bien_ap=${selectedMba}`
      )
      .then((response) => {
        setDevices(response.data);
      });
  };

  const toggleDeviceStatus = (id) => {
    const device = devices.find((d) => d.id === id);
    axios
      .patch(`http://ngoctoan90.pythonanywhere.com/api/thiet-bi/${id}/`, {
        trang_thai: !device.trang_thai,
      })
      .then((response) => {
        setDevices(devices.map((d) => (d.id === id ? response.data : d)));
      });
  };

  const handleCreateDevice = () => {
    if (newDeviceName) {
      axios
        .post("http://ngoctoan90.pythonanywhere.com/api/thiet-bi/", {
          ten: newDeviceName,
          trang_thai: false,
          may_bien_ap: selectedMba,
        })
        .then((response) => {
          setDevices([...devices, response.data]);
          setNewDeviceName("");
          setIsFormVisible(false);
        });
    }
  };

  const handleEditDevice = (device) => {
    setEditDevice(device);
    setNewDeviceName(device.ten);
    setIsFormVisible(true);
  };

  const handleUpdateDevice = () => {
    if (editDevice && newDeviceName) {
      axios
        .put(
          `http://ngoctoan90.pythonanywhere.com/api/thiet-bi/${editDevice.id}/`,
          {
            ten: newDeviceName,
            trang_thai: editDevice.trang_thai,
            may_bien_ap: selectedMba,
          }
        )
        .then((response) => {
          setDevices(
            devices.map((d) => (d.id === editDevice.id ? response.data : d))
          );
          setEditDevice(null);
          setNewDeviceName("");
          setIsFormVisible(false);
        });
    }
  };

  const handleDeleteDevice = (id) => {
    axios
      .delete(`http://ngoctoan90.pythonanywhere.com/api/thiet-bi/${id}/`)
      .then(() => {
        setDevices(devices.filter((d) => d.id !== id));
      });
  };

  const openForm = () => {
    setNewDeviceName("");
    setEditDevice(null);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div>
      <div className="tab-bar">
        {mbaList.map((mba) => (
          <button
            key={mba.id}
            onClick={() => setSelectedMba(mba.id)}
            className={selectedMba === mba.id ? "active" : ""}
          >
            {mba.ten}
          </button>
        ))}
      </div>
      {devices.length > 0 && (
        <div>
          <h3>Thiết bị</h3>
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Bật/Tắt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.ten}</td>
                  <td>{device.trang_thai ? "Bật" : "Tắt"}</td>
                  <td>
                    <button onClick={() => toggleDeviceStatus(device.id)}>
                      {device.trang_thai ? "Tắt" : "Bật"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEditDevice(device)}>
                      Chỉnh sửa
                    </button>
                    <button onClick={() => handleDeleteDevice(device.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={openForm}>Thêm thiết bị mới</button>
      {isFormVisible && (
        <div className="form-container">
          <h3>{editDevice ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}</h3>
          <input
            type="text"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            placeholder="Tên thiết bị"
          />
          <button
            onClick={editDevice ? handleUpdateDevice : handleCreateDevice}
          >
            {editDevice ? "Cập nhật" : "Tạo mới"}
          </button>
          <button onClick={closeForm}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default Control;
