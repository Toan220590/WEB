import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/overview">Tổng quan</Link>
        </li>
        <li>
          <Link to="/mba">MBA</Link>
        </li>
        <li>
          <Link to="/monitor">Giám sát</Link>
        </li>
        <li>
          <Link to="/alert">Cảnh báo</Link>
        </li>
        <li>
          <Link to="/control">Điều khiển</Link>
        </li>
        <li>
          <Link to="/settings">Cài đặt</Link>
        </li>
        <li>
          <Link to="/report">Báo cáo</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
