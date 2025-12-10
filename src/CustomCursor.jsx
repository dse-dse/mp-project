import React, { useState, useEffect } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('dark');

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Определяем цвет фона под курсором
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
      if (elementUnderCursor) {
        const bgColor = window.getComputedStyle(elementUnderCursor).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
          const [r, g, b] = rgb.map(Number);
          // Определяем яркость фона
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          setBackgroundColor(brightness < 128 ? 'dark' : 'light');
        }
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.classList.contains('nav-item') ||
          e.target.classList.contains('chat-button') ||
          e.target.classList.contains('view-project-button') ||
          e.target.classList.contains('third-button') ||
          e.target.classList.contains('mens-button')) {
        setIsPointer(true);
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsPointer(false);
      setIsHovering(false);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    
    // Изначально определяем цвет фона
    const initialElement = document.elementFromPoint(0, 0);
    if (initialElement) {
      const bgColor = window.getComputedStyle(initialElement).backgroundColor;
      const rgb = bgColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setBackgroundColor(brightness < 128 ? 'dark' : 'light');
      }
    }

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        className={`custom-cursor ${isPointer ? 'pointer' : ''} ${isHovering ? 'hovering' : ''} ${backgroundColor}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="cursor-glass">
          <div className="cursor-ring"></div>
          <div className="cursor-center"></div>
        </div>
      </div>
      <div 
        className="cursor-trail"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CustomCursor;