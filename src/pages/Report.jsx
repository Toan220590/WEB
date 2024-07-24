import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Report.css"; // Import file CSS

const Report = () => {
  const [mode, setMode] = useState("Thủ công");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mbaList, setMbaList] = useState([]);
  const [selectedMBA, setSelectedMBA] = useState("all");
  const [selectedDataOptions, setSelectedDataOptions] = useState({
    dien_ap_pha_a: true,
    dien_ap_pha_b: true,
    dien_ap_pha_c: true,
    dong_pha_a: true,
    dong_pha_b: true,
    dong_pha_c: true,
    cong_suat_tac_dung_a: true,
    cong_suat_tac_dung_b: true,
    cong_suat_tac_dung_c: true,
    canh_bao: true,
    thiet_bi_dieu_khien: true,
  });

  useEffect(() => {
    axios
      .get("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMbaList(response.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the MBA list!", error);
      });
  }, []);

  const handleSubmit = () => {
    const dataOptions = Object.keys(selectedDataOptions).filter(
      (key) => selectedDataOptions[key]
    );

    let mbaIds =
      selectedMBA === "all" ? mbaList.map((mba) => mba.id) : [selectedMBA];

    axios
      .post(
        "http://ngoctoan90.pythonanywhere.com/api/export-data/",
        {
          mode,
          startDate,
          endDate,
          selectedMBA: mbaIds,
          selectedDataOptions: dataOptions,
        },
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("There was an error exporting the data!", error);
      });
  };

  return (
    <div className="report-container">
      <h2>Báo cáo</h2>
      <div className="form-group">
        <label>Chọn chế độ:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="Thủ công">Thủ công</option>
          <option value="Tự động">Tự động</option>
        </select>
      </div>
      <div className="form-group">
        <label>Chọn thời gian bắt đầu:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>
      <div className="form-group">
        <label>Chọn thời gian kết thúc:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>
      <div className="form-group">
        <label>Chọn MBA:</label>
        <select
          value={selectedMBA}
          onChange={(e) => setSelectedMBA(e.target.value)}
        >
          <option value="all">Tất cả máy</option>
          {mbaList.map((mba) => (
            <option key={mba.id} value={mba.id}>
              {mba.ten}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Chọn dữ liệu xuất:</label>
        <fieldset>
          <legend>Dữ liệu</legend>
          {Object.keys(selectedDataOptions).map((key) => (
            <div key={key} className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedDataOptions[key]}
                  onChange={() =>
                    setSelectedDataOptions({
                      ...selectedDataOptions,
                      [key]: !selectedDataOptions[key],
                    })
                  }
                />
                {key.replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </fieldset>
      </div>
      <button onClick={handleSubmit}>Xuất báo cáo</button>
    </div>
  );
};

export default Report;
