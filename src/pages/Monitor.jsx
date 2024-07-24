import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./Monitor.css";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Monitor = () => {
  const [mbaList, setMbaList] = useState([]);
  const [expandedMbaId, setExpandedMbaId] = useState(null);
  const [monitoringData, setMonitoringData] = useState({});
  const [latestData, setLatestData] = useState({});
  const [timeRange, setTimeRange] = useState(1);

  useEffect(() => {
    axios
      .get("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setMbaList(response.data);
        console.log("MBA List:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (expandedMbaId) {
        fetchMonitoringData(expandedMbaId);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [expandedMbaId]);

  const fetchMonitoringData = (mbaId) => {
    axios
      .get(
        `http://ngoctoan90.pythonanywhere.com/api/du-lieu/may-bien-ap/${mbaId}/`
      )
      .then((response) => {
        const data = response.data;
        console.log(`Data for MBA ID ${mbaId}:`, data);
        setMonitoringData((prevState) => ({
          ...prevState,
          [mbaId]: data,
        }));
        setLatestData((prevState) => ({
          ...prevState,
          [mbaId]: data.length ? data[data.length - 1] : null,
        }));
      })
      .catch((error) => {
        console.error("Error fetching monitoring data:", error);
      });
  };

  const toggleMba = (mbaId) => {
    if (expandedMbaId === mbaId) {
      setExpandedMbaId(null);
    } else {
      setExpandedMbaId(mbaId);
      if (!monitoringData[mbaId]) {
        fetchMonitoringData(mbaId);
      }
    }
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(parseInt(event.target.value));
  };

  const filterDataByTimeRange = (data) => {
    const now = new Date();
    return data.filter((d) => {
      const dataTime = new Date(d.thoi_gian);
      return (now - dataTime) / 1000 / 60 <= timeRange;
    });
  };

  const renderChart = (data, field, label, color) => {
    const filteredData = filterDataByTimeRange(data);
    return (
      <div className="chart-container">
        <Line
          data={{
            labels: filteredData.map((d) => new Date(d.thoi_gian)),
            datasets: [
              {
                label: label,
                data: filteredData.map((d) => d[field]),
                borderColor: color,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "minute",
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 20,
                  source: "data",
                },
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: true,
              },
            },
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <h1>Giám sát</h1>
      <div>
        <label htmlFor="timeRange">Chọn khoảng thời gian: </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
        >
          <option value={1}>1 phút</option>
          <option value={5}>5 phút</option>
          <option value={10}>10 phút</option>
          <option value={30}>30 phút</option>
          <option value={60}>60 phút</option>
          <option value={1440}>1 ngày</option>
        </select>
      </div>
      {mbaList.map((mba) => (
        <div key={mba.id}>
          <button onClick={() => toggleMba(mba.id)}>{mba.ten}</button>
          {expandedMbaId === mba.id && (
            <div className="expanded-container">
              {latestData[mba.id] ? (
                <div className="latest-data-container">
                  <div className="grid-container">
                    <div className="grid-item">
                      <h3>Điện áp pha A</h3>
                      <p>{latestData[mba.id].dien_ap_pha_a} V</p>
                    </div>
                    <div className="grid-item">
                      <h3>Điện áp pha B</h3>
                      <p>{latestData[mba.id].dien_ap_pha_b} V</p>
                    </div>
                    <div className="grid-item">
                      <h3>Điện áp pha C</h3>
                      <p>{latestData[mba.id].dien_ap_pha_c} V</p>
                    </div>
                    <div className="grid-item">
                      <h3>Dòng pha A</h3>
                      <p>{latestData[mba.id].dong_pha_a} A</p>
                    </div>
                    <div className="grid-item">
                      <h3>Dòng pha B</h3>
                      <p>{latestData[mba.id].dong_pha_b} A</p>
                    </div>
                    <div className="grid-item">
                      <h3>Dòng pha C</h3>
                      <p>{latestData[mba.id].dong_pha_c} A</p>
                    </div>
                    <div className="grid-item">
                      <h3>Công suất tác dụng pha A</h3>
                      <p>{latestData[mba.id].cong_suat_tac_dung_a} kW</p>
                    </div>
                    <div className="grid-item">
                      <h3>Công suất tác dụng pha B</h3>
                      <p>{latestData[mba.id].cong_suat_tac_dung_b} kW</p>
                    </div>
                    <div className="grid-item">
                      <h3>Công suất tác dụng pha C</h3>
                      <p>{latestData[mba.id].cong_suat_tac_dung_c} kW</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Đang tải dữ liệu...</p>
              )}
              <div className="charts-container">
                <div className="chart-row">
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dong_pha_a",
                    "Dòng pha A",
                    "red"
                  )}
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dong_pha_b",
                    "Dòng pha B",
                    "blue"
                  )}
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dong_pha_c",
                    "Dòng pha C",
                    "green"
                  )}
                </div>
                <div className="chart-row">
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dien_ap_pha_a",
                    "Điện áp pha A",
                    "orange"
                  )}
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dien_ap_pha_b",
                    "Điện áp pha B",
                    "purple"
                  )}
                  {renderChart(
                    monitoringData[mba.id] || [],
                    "dien_ap_pha_c",
                    "Điện áp pha C",
                    "brown"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Monitor;
