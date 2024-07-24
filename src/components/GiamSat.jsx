import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./GiamSat.css";

const GiamSat = () => {
  const [mbaList, setMbaList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("summary");
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMbaList(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedTab) {
      axios
        .get("https://ngoctoan90.pythonanywhere.com/api/du-lieu/")
        .then((response) => {
          const filteredData =
            selectedTab === "summary"
              ? response.data
              : response.data.filter(
                  (item) => item.may_bien_ap === parseInt(selectedTab)
                );
          setData(filteredData);
        });
    }
  }, [selectedTab]);

  const getChartData = (data, key) => {
    const labels = data.map((item) =>
      new Date(item.thoi_gian).toLocaleString()
    );
    const values = data.map((item) => item[key]);

    return {
      labels,
      datasets: [
        {
          label: key,
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    };
  };

  return (
    <div>
      <div className="tab-bar">
        <button onClick={() => setSelectedTab("summary")}>Tổng hợp</button>
        {mbaList.map((mba) => (
          <button
            key={mba.id}
            onClick={() => setSelectedTab(mba.id.toString())}
          >
            {mba.ten}
          </button>
        ))}
      </div>
      {data.length > 0 && (
        <div>
          <div className="grid-container">
            <div className="chart-container">
              <h5>Điện áp pha A</h5>
              <Line data={getChartData(data, "dien_ap_pha_a")} />
            </div>
            <div className="chart-container">
              <h5>Điện áp pha B</h5>
              <Line data={getChartData(data, "dien_ap_pha_b")} />
            </div>
            <div className="chart-container">
              <h5>Điện áp pha C</h5>
              <Line data={getChartData(data, "dien_ap_pha_c")} />
            </div>
            <div className="chart-container">
              <h5>Dòng pha A</h5>
              <Line data={getChartData(data, "dong_pha_a")} />
            </div>
            <div className="chart-container">
              <h5>Dòng pha B</h5>
              <Line data={getChartData(data, "dong_pha_b")} />
            </div>
            <div className="chart-container">
              <h5>Dòng pha C</h5>
              <Line data={getChartData(data, "dong_pha_c")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiamSat;
