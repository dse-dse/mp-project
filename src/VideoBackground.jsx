import React, { useState } from "react";
import "./VideoBackground.css";
import videoSrc from "./video/Brunello.mp4";
import logoImg from "./image/logo.png";
import taglineImg from "./image/tagline.png";
import awardsImg from "./image/awards.png";
import silverImg from "./image/silver.png";
import designfestivalImg from "./image/designfestival.png";

const VideoBackground = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="video-background-container">
      <div className="video-background-overlay"></div>
      
      <video autoPlay muted loop className="video-background">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* НАВИГАЦИЯ */}
      <nav className="navigation">
        {/* Десктопная навигация - ЛЕВАЯ ЧАСТЬ */}
        <div className="nav-left">
          <span className="nav-item directions">DIRECTIONS</span>
          <span className="nav-item projects">PROJECTS</span>
        </div>
        
        {/* Логотип */}
        <div className="logo">
          <img src={logoImg} alt="Logo" className="logo-image" />
        </div>
        
        {/* Десктопная навигация - ПРАВАЯ ЧАСТЬ */}
        <div className="nav-right">
          <span className="nav-item about">ABOUT</span>
          <button className="nav-item chat-button">CHAT WITH US</button>
        </div>
        
        {/* Мобильная навигация */}
        <button className="burger-menu" onClick={toggleMenu} aria-label="Open menu">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 11L0 9.16667H16V11H0ZM0 6.41667L0 4.58333H16V6.41667H0ZM0 1.83333L0 0L16 0V1.83333H0Z" fill="white"/>
          </svg>
        </button>
        
        <button className="mobile-chat-button" aria-label="Chat with us">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4 0H1.6C0.72 0 0 0.72 0 1.6V16L3.2 12.8H14.4C15.28 12.8 16 12.08 16 11.2V1.6C16 0.72 15.28 0 14.4 0ZM14.4 11.2H2.56L1.6 12.16V1.6H14.4V11.2Z" fill="white"/>
          </svg>
        </button>
        
        {/* Мобильное выпадающее меню (ТОЛЬКО навигация) */}
        <div className={`mobile-dropdown ${isMenuOpen ? 'active' : ''}`}>
          <span className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>DIRECTIONS</span>
          <span className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>PROJECTS</span>
          <span className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>ABOUT</span>
        </div>
      </nav>

      {/* КОНТЕНТ СНИЗУ */}
      <div className="content-wrapper">
        {/* НАГРАДЫ */}
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

        {/* КНОПКА VIEW PROJECT */}
        <button className="view-project-button">VIEW PROJECT</button>
      </div>
    </div>
  );
};

export default VideoBackground;