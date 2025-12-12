import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./MainApp.css";

// Тестовый компонент для проверки
const TestComponent = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>React App Works!</h1>
      <p>If you see this, routing is working.</p>
      <div style={{ marginTop: '20px' }}>
        <a href="#/" style={{ margin: '10px', color: 'blue' }}>Home</a>
        <a href="#/real-estate" style={{ margin: '10px', color: 'blue' }}>Real Estate</a>
      </div>
    </div>
  );
};

function MainApp() {
  return (
    <Router>
      <div className="MainApp">
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route path="/home" element={<TestComponent />} />
          <Route path="/real-estate" element={<TestComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainApp;