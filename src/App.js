import React from "react";
import VideoBackground from "./VideoBackground";
import ScrollTextAnimation from "./ScrollTextAnimation";
import ThirdScrollBlock from "./ThirdScrollBlock";
import FourthScrollBlock from "./FourthScrollBlock";
import ContactSection from "./ContactSection"; // Импортируем новый компонент
import HomeSection from "./HomeSection";
import ProjectsSection from "./ProjectsSection";
import MensSection from "./MensSection";
// import CustomCursor from "./CustomCursor";
import Footer from "./Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <CustomCursor /> */}
      <VideoBackground />
        <div style={{height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      </div>
      
      <ScrollTextAnimation />
         <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      </div>
      <ThirdScrollBlock />
      <HomeSection />
      <MensSection />
      <ProjectsSection />
       <FourthScrollBlock />
       <ContactSection />
         <Footer />
    </div>
  );
}

export default App;