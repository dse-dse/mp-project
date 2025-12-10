import React, { useEffect, useRef, useState } from "react";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Определяем направление скролла
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setDirection(1); // Скролл вниз
      } else if (currentScrollY < lastScrollY.current) {
        setDirection(-1); // Скролл вверх
      }
      lastScrollY.current = currentScrollY;

      // Прогресс видимости секции (0 = вверху экрана, 1 = внизу экрана)
      const viewportProgress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
      const normalizedProgress = Math.max(0, Math.min(1, viewportProgress * 2));
      
      setScrollProgress(normalizedProgress);

      // Получаем ширину каждого слова для точного позиционирования
      const wordWidths = wordsRef.current.map(word => 
        word ? word.offsetWidth : 0
      );

      wordsRef.current.forEach((word, index) => {
        if (!word) return;

        const wordWidth = wordWidths[index];
        let progress;
        let opacity;
        let translateX;
        let blurValue = 0;

        // Для скролла вниз
        if (direction > 0) {
          switch(index) {
            case 0: // "We have done" - справа налево
              progress = Math.max(0, Math.min(1, (normalizedProgress - 0.1) / 0.6));
              // Начинаем ЗА правой границей экрана (+100px запас)
              const startXRight = windowWidth + 100;
              // Заканчиваем на своей позиции
              const endX = 0;
              translateX = startXRight - progress * (startXRight - endX);
              opacity = progress < 0.2 ? 0 : 
                       progress > 0.8 ? (1 - progress) / 0.2 : 
                       Math.min(1, progress * 2);
              blurValue = progress < 0.3 ? 10 - (progress / 0.3 * 10) : 0;
              break;
            
            case 1: // "projects around" - слева направо
              progress = Math.max(0, Math.min(1, (normalizedProgress - 0.3) / 0.6));
              // Начинаем ЗА левой границей экрана (-ширина слова - 100px)
              const startXLeft = -wordWidth - 100;
              // Заканчиваем на своей позиции
              const endXCenter = 0;
              translateX = startXLeft + progress * (endXCenter - startXLeft);
              opacity = progress < 0.2 ? 0 : 
                       progress > 0.8 ? (1 - progress) / 0.2 : 
                       Math.min(1, progress * 1.5);
              blurValue = progress < 0.3 ? 8 - (progress / 0.3 * 8) : 0;
              break;
            
            case 2: // "the world" - справа налево с задержкой
              progress = Math.max(0, Math.min(1, (normalizedProgress - 0.5) / 0.6));
              const startXRight2 = windowWidth + 150;
              const endXRight = 0;
              translateX = startXRight2 - progress * (startXRight2 - endXRight);
              opacity = progress < 0.3 ? 0 : 
                       progress > 0.7 ? (1 - progress) / 0.3 : 
                       Math.min(1, progress * 1.8);
              blurValue = progress < 0.4 ? 12 - (progress / 0.4 * 12) : 0;
              break;
            default:
              return;
          }
        } else {
          // Для скролла вверх - обратная анимация
          const reverseProgress = 1 - normalizedProgress;
          
          switch(index) {
            case 0:
              progress = Math.max(0, Math.min(1, (reverseProgress - 0.1) / 0.6));
              const startXRightRev = windowWidth + 100;
              const endXRev = 0;
              // Обратное движение: из позиции уходит за правый край
              translateX = endXRev + progress * (startXRightRev - endXRev);
              opacity = progress < 0.2 ? (0.2 - progress) / 0.2 * 1 : 
                       progress > 0.8 ? 0 : 
                       Math.min(1, (1 - progress) * 2);
              blurValue = progress > 0.7 ? (progress - 0.7) / 0.3 * 10 : 0;
              break;
            
            case 1:
              progress = Math.max(0, Math.min(1, (reverseProgress - 0.3) / 0.6));
              const startXLeftRev = -wordWidth - 100;
              const endXCenterRev = 0;
              translateX = endXCenterRev - progress * (endXCenterRev - startXLeftRev);
              opacity = progress < 0.2 ? (0.2 - progress) / 0.2 * 1 : 
                       progress > 0.8 ? 0 : 
                       Math.min(1, (1 - progress) * 1.5);
              blurValue = progress > 0.7 ? (progress - 0.7) / 0.3 * 8 : 0;
              break;
            
            case 2:
              progress = Math.max(0, Math.min(1, (reverseProgress - 0.5) / 0.6));
              const startXRight2Rev = windowWidth + 150;
              const endXRightRev = 0;
              translateX = endXRightRev + progress * (startXRight2Rev - endXRightRev);
              opacity = progress < 0.3 ? (0.3 - progress) / 0.3 * 1 : 
                       progress > 0.7 ? 0 : 
                       Math.min(1, (1 - progress) * 1.8);
              blurValue = progress > 0.6 ? (progress - 0.6) / 0.4 * 12 : 0;
              break;
            default:
              return;
          }
        }

        if (word) {
          word.style.transform = `translateX(${translateX}px)`;
          word.style.opacity = opacity;
          word.style.filter = `blur(${blurValue}px)`;
          word.style.transition = 'none'; // Убираем transition для кадровой анимации
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(animate);

    // Также обновляем при resize
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [direction]);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-content">
        <div className="words-container">
          <div 
            className="word word-1" 
            ref={el => { wordsRef.current[0] = el; }}
            style={{ 
              opacity: 0, 
              transform: `translateX(${typeof window !== 'undefined' ? window.innerWidth + 100 : 1200}px)`,
              filter: 'blur(10px)'
            }}
          >
            We have done
          </div>
          <div 
            className="word word-2" 
            ref={el => { 
              wordsRef.current[1] = el; 
            }}
            style={{ 
              opacity: 0, 
              transform: 'translateX(-1000px)',
              filter: 'blur(8px)'
            }}
          >
            projects around
          </div>
          <div 
            className="word word-3" 
            ref={el => { wordsRef.current[2] = el; }}
            style={{ 
              opacity: 0, 
              transform: `translateX(${typeof window !== 'undefined' ? window.innerWidth + 150 : 1200}px)`,
              filter: 'blur(12px)'
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