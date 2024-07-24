import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import MBA from "./pages/MBA";
import Monitor from "./pages/Monitor";
import Alert from "./pages/Alert";
import Control from "./pages/Control";
import Settings from "./pages/Settings";
import Report from "./pages/Report";
import "./App.css"; // Đảm bảo rằng CSS được áp dụng

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" />} />{" "}
              {/* Thêm dòng này */}
              <Route path="/overview" element={<Overview />} />
              <Route path="/mba" element={<MBA />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/alert" element={<Alert />} />
              <Route path="/control" element={<Control />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/report" element={<Report />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
