import React from "react";
import logo from "../assets/logo.jpg"; // Đường dẫn tới logo
import "./Header.css"; // Đường dẫn tới tệp CSS

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title">
        NGHIÊN CỨU, XÂY DỰNG HỆ THỐNG THU THẬP DỮ LIỆU VÀ GIÁM SÁT ĐIỆN NĂNG CHO
        LƯỚI HẠ ÁP
      </h1>
    </div>
  );
};

export default Header;
