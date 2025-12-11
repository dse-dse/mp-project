import React, { useEffect, useRef, useState } from "react";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [wordProgress, setWordProgress] = useState([0, 0, 0]);

  useEffect(() => {
    // Проверяем, является ли устройство мобильным
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Рассчитываем прогресс видимости секции
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Насколько секция видна на экране (0-1)
      let visibility = 0;
      
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Секция видна хотя бы частично
        const visibleTop = Math.max(0, -sectionTop);
        const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
        const visibleHeight = visibleBottom - visibleTop;
        visibility = visibleHeight / windowHeight;
      }
      
      // Для мобильных: последовательное появление слов
      if (isMobile) {
        // Показываем слова с задержкой по мере скролла
        const newProgress = [0, 0, 0];
        
        if (visibility > 0.2) newProgress[0] = Math.min(1, (visibility - 0.2) / 0.4);
        if (visibility > 0.4) newProgress[1] = Math.min(1, (visibility - 0.4) / 0.4);
        if (visibility > 0.6) newProgress[2] = Math.min(1, (visibility - 0.6) / 0.4);
        
        setWordProgress(newProgress);
      }
    };

    // Для десктопа - оригинальная логика
    const handleDesktopScroll = () => {
      if (!sectionRef.current || isMobile) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Прогресс скролла внутри секции
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      let visibility = 0;
      
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        const visibleTop = Math.max(0, -sectionTop);
        const visibleBottom = Math.min(sectionHeight, windowHeight - sectionTop);
        const visibleHeight = visibleBottom - visibleTop;
        visibility = visibleHeight / windowHeight;
      }
      
      // Применяем анимацию к словам для десктопа
      wordsRef.current.forEach((word, index) => {
        if (!word) return;
        
        // Рассчитываем прогресс для каждого слова с задержкой
        let wordVisibility = Math.max(0, visibility - index * 0.2);
        wordVisibility = Math.min(1, wordVisibility * 2);
        
        const translateX = isMobile ? 0 : 200 * (1 - wordVisibility);
        const opacity = isMobile ? wordVisibility : Math.min(1, wordVisibility * 2);
        
        word.style.transform = isMobile 
          ? `translateY(${20 * (1 - wordVisibility)}px)`
          : `translateX(${translateX}vw)`;
        word.style.opacity = opacity;
      });
    };

    const scrollHandler = isMobile ? handleScroll : handleDesktopScroll;
    
    window.addEventListener('scroll', scrollHandler);
    
    // Инициализируем начальное состояние
    setTimeout(() => {
      scrollHandler();
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isMobile]);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-content">
        <div className="words-container">
          <div 
            className="word word-1"
            ref={el => wordsRef.current[0] = el}
            style={{
              transform: isMobile ? `translateY(20px)` : `translateX(200vw)`,
              opacity: isMobile ? 0 : 0,
              transition: isMobile ? 'transform 0.6s ease, opacity 0.6s ease' : 'none'
            }}
          >
            We have done
          </div>
          <div 
            className="word word-2"
            ref={el => wordsRef.current[1] = el}
            style={{
              transform: isMobile ? `translateY(20px)` : `translateX(200vw)`,
              opacity: isMobile ? 0 : 0,
              transition: isMobile ? 'transform 0.6s ease, opacity 0.6s ease' : 'none'
            }}
          >
            projects around
          </div>
          <div 
            className="word word-3"
            ref={el => wordsRef.current[2] = el}
            style={{
              transform: isMobile ? `translateY(20px)` : `translateX(200vw)`,
              opacity: isMobile ? 0 : 0,
              transition: isMobile ? 'transform 0.6s ease, opacity 0.6s ease' : 'none'
            }}
          >
            the world
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;