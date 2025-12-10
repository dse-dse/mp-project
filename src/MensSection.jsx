import React, { useState, useEffect, useRef } from "react";
import "./MensSection.css";

// Импортируем изображение (предположим, что оно есть в папке images)
import mensPhoto from "./image/mens.png";

const MensSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);

  // Текст блока
  const paragraphs = [
    "Founded in 2013 by Fedor Blakeworthy and Stanislav Klasslov, Movie Park aims to make a lasting focus in the industry for bringing both ideas to life and turning them into powerful visual stories that inspire and endure.",
    "MOVIE PARK IS AN INTERNATIONAL PRODUCTION STUDIO CREATING UNIQUE VISUAL SOLUTIONS ACROSS VIDEO, MARKETING, AND EVENT INDUSTRIES. OUR PORTFOLIO SPANS COMMERCIAL AND CREATIVE PROJECTS FOR BRANDS, PRIVATE CLIENTS, AND MAJOR COMPANIES."
  ];

  const buttonText = "READ MORE";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Определяем направление скролла
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsScrollingDown(false);
      }
      lastScrollY.current = currentScrollY;
      
      // Рассчитываем прогресс видимости центра секции
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionCenter = sectionTop + sectionHeight / 2;
      const windowCenter = windowHeight / 2;
      
      // Прогресс от 0 до 1, где 0.5 - центр секции в центре экрана
      const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
      const maxVisibleDistance = windowHeight * 0.8; // 80% высоты окна
      const progress = Math.max(0, 1 - (distanceFromCenter / maxVisibleDistance));
      
      setScrollProgress(progress);
    };

    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    window.addEventListener("resize", handleScrollThrottled);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
      window.removeEventListener("resize", handleScrollThrottled);
    };
  }, []);

  // Функция для расчета видимости элементов
  const getElementVisibility = (elementDelay = 0) => {
    if (isScrollingDown) {
      // При скролле вниз: появляется справа
      return Math.max(0, Math.min(1, (scrollProgress - 0.3 - elementDelay) * 3));
    } else {
      // При скролле вверх: уходит налево (инвертированная анимация)
      return Math.max(0, Math.min(1, (1 - scrollProgress - elementDelay) * 3));
    }
  };

  // Функция для расчета трансформации
  const getElementTransform = (visibility, isPhoto = false) => {
    if (isScrollingDown) {
      // При скролле вниз: выдвигается справа
      const translateX = (1 - visibility) * 100;
      return `translateX(${translateX}px)`;
    } else {
      // При скролле вверх: уходит налево
      const translateX = -(1 - visibility) * 100;
      return `translateX(${translateX}px)`;
    }
  };

  // Видимость фото
  const photoVisibility = getElementVisibility(0);
  const photoTransform = getElementTransform(photoVisibility, true);

  // Видимость первого параграфа
  const firstParagraphVisibility = getElementVisibility(0.1);
  const firstParagraphTransform = getElementTransform(firstParagraphVisibility);

  // Видимость второго параграфа
  const secondParagraphVisibility = getElementVisibility(0.2);
  const secondParagraphTransform = getElementTransform(secondParagraphVisibility);

  // Видимость кнопки
  const buttonVisibility = getElementVisibility(0.3);
  const buttonTransform = getElementTransform(buttonVisibility);

  return (
    <section className="mens-section" ref={sectionRef}>
      <div className="mens-container">
        {/* Фото (справа) */}
        <div 
          className="mens-photo-container"
          style={{
            opacity: photoVisibility,
            transform: photoTransform,
          }}
        >
          <div className="mens-photo-placeholder">
            {/* Замените на реальное изображение */}
            <div className="photo-mock">
            
              <div className="photo-frame">
                <div className="photo-content">
                  {/* Здесь будет изображение */}
                </div>
              </div>
            </div>
           
            <img src={mensPhoto} alt="Mens" className="mens-photo" />
         
          </div>
        </div>

        {/* Текст (слева) */}
        <div className="mens-content">
          {/* Первый параграф */}
          <div 
            className="mens-paragraph"
            style={{
              opacity: firstParagraphVisibility,
              transform: firstParagraphTransform,
            }}
          >
            <p className="paragraph-text">
              {paragraphs[0].split("").map((letter, index) => (
                <span
                  key={index}
                  className="paragraph-letter"
                  style={{
                    opacity: firstParagraphVisibility,
                    transitionDelay: `${index * 10}ms`
                  }}
                >
                  {letter}
                </span>
              ))}
            </p>
          </div>

          {/* Второй параграф */}
          <div 
            className="mens-paragraph"
            style={{
              opacity: secondParagraphVisibility,
              transform: secondParagraphTransform,
            }}
          >
            <p className="paragraph-text paragraph-bold">
              {paragraphs[1].split("").map((letter, index) => (
                <span
                  key={index}
                  className="paragraph-letter"
                  style={{
                    opacity: secondParagraphVisibility,
                    transitionDelay: `${index * 10}ms`
                  }}
                >
                  {letter}
                </span>
              ))}
            </p>
          </div>

          {/* Кнопка */}
          <div 
            className="mens-button-container"
            style={{
              opacity: buttonVisibility,
              transform: buttonTransform,
            }}
          >
            <button className="mens-button">
              <span className="button-text">
                {buttonText.split("").map((letter, index) => (
                  <span
                    key={index}
                    className="button-letter"
                    style={{
                      opacity: buttonVisibility,
                      transitionDelay: `${index * 30}ms`
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              <span className="button-arrow">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MensSection;