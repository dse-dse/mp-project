import React from "react";
import "./HomeSection.css";
import logo from "../image/logo.png";

const HomeSection = () => {
  return (
    <section className="home-section">
      <div className="home-section-background">
        {/* Фоновое изображение будет через CSS */}
      </div>
      
      <div className="home-section-content">
        <div className="home-logo">
          <img src={logo} alt="Home Logo" />
        </div>
        
        <div className="home-text">
          <h1 className="home-title">Complex work for a real<br />estate developers in Dubai</h1>
        
          <button className="read-more-button">READ MORE</button>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;