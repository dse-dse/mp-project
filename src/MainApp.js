import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageApp from "./homePage/App";
import RealEstatePageApp from "./realEstatePage/App";
import "./MainApp.css";

function MainApp() {
  return (
    <Router>
      <div className="MainApp">
        <Routes>
          <Route path="/" element={<HomePageApp />} />
          <Route path="/home" element={<HomePageApp />} />
          <Route path="/real-estate" element={<RealEstatePageApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainApp;