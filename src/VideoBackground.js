import React from "react";
import "./VideoBackground.css";
import videoSrc from "./video/Brunello.mp4";
import logoImg from "./image/logo.png";
import taglineImg from "./image/tagline.png";
import awardsImg from "./image/awards.png";
import silverImg from "./image/silver.png";
import designfestivalImg from "./image/designfestival.png";

const VideoBackground = () => {
  return (
    <div className="video-background-container">
      <video autoPlay muted loop className="video-background">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <nav className="navigation">
        <div className="nav-left">
          <span className="nav-item directions">DIRECTIONS</span>
          <span className="nav-item projects">PROJECTS</span>
        </div>
        
        <div className="logo">
          <img src={logoImg} alt="Logo" className="logo-image" />
        </div>
        
        <div className="nav-right">
          <span className="nav-item about">ABOUT</span>
          <span className="nav-item chat-button">CHAT WITH US</span>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="awards-row">
          <div className="award-item">
            <div className="award-icon-container icon-1">
              <img src={taglineImg} alt="Tagline" className="award-icon" />
            </div>
            <p className="award-text">1X GOLD<br />Best video</p>
          </div>
          <div className="award-item">
            <div className="award-icon-container icon-2">
              <img src={awardsImg} alt="Awards" className="award-icon" />
            </div>
            <p className="award-text">4X SILVER<br />Efficiency in business</p>
          </div>
          <div className="award-item">
            <div className="award-icon-container icon-3">
              <img src={silverImg} alt="Mercury" className="award-icon" />
            </div>
            <p className="award-text">2X BRONZE<br />Situational marketing</p>
          </div>
          <div className="award-item">
            <div className="award-icon-container icon-4">
              <img src={designfestivalImg} alt="Festival" className="award-icon" />
            </div>
            <p className="award-text">3X SHORTLIST<br />Visual solutions in video advertising</p>
          </div>
        </div>

        <button className="view-project-button">VIEW PROJECT</button>
      </div>
    </div>
  );
};

export default VideoBackground;