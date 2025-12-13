// App.js - обновленная версия
import React from "react";
import VideoBackground from "./VideoBackground";
import ScrollTextAnimation from "./ScrollTextAnimation";
import ThirdScrollBlock from "./ThirdScrollBlock";
import FourthScrollBlock from "./FourthScrollBlock";
import ContactSection from "./ContactSection";
import ProjectsVideoSection from "./ProjectsVideoSection"; // Импортируем новый компонент
import MensSection from "./MensSection";
import Footer from "./Footer";
import "./App.css";

function  ProjectsPageApp() {
  return (
    <div className="App">
      <VideoBackground />
     
      
   
      {/* Добавляем новый блок с видео и сортировкой */}
      <ProjectsVideoSection />
    
 
      <ContactSection />
      <Footer />
    </div>
  );
}

export default ProjectsPageApp;