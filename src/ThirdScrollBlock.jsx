import React, { useState, useEffect, useRef } from "react";
import "./ThirdScrollBlock.css";

const ThirdScrollBlock = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);

  // Текст блока
  const title = "WE DO";
  const items = [
    "COMMERCIAL VIDEO",
    "HYPE & MARKETING", 
    "BRANDING",
    "EVENTS / LAUNCHES",
    "CELEBRITY APPEARANCES",
    "3D"
  ];
  const buttonText = "VIEW ALL PROJECT";

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
      
      // Рассчитываем прогресс видимости
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionCenter = sectionTop + sectionHeight / 2;
      const windowCenter = windowHeight / 2;
      
      // Прогресс от 0 до 1, где 0.5 - центр секции в центре экрана
      const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
      const maxDistance = windowHeight / 2 + sectionHeight / 2;
      const rawProgress = 1 - (distanceFromCenter / maxDistance);
      
      setScrollProgress(Math.max(0, Math.min(1, rawProgress * 2)));
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

  // Функция для расчета видимости элемента
  const getItemVisibility = (itemIndex, totalItems) => {
    const itemDelay = itemIndex * 0.1;
    
    if (isScrollingDown) {
      // При скролле вниз: появляется
      return Math.max(0, Math.min(1, (scrollProgress - 0.3 - itemDelay) * 4));
    } else {
      // При скролле вверх: исчезает
      return Math.max(0, Math.min(1, (1 - scrollProgress - itemDelay) * 4));
    }
  };

  // Видимость заголовка
  const titleVisibility = isScrollingDown 
    ? Math.max(0, Math.min(1, (scrollProgress - 0.2) * 5))
    : Math.max(0, Math.min(1, (1 - scrollProgress - 0.2) * 5));

  // Видимость кнопки
  const buttonVisibility = isScrollingDown
    ? Math.max(0, Math.min(1, (scrollProgress - 0.9) * 10))
    : Math.max(0, Math.min(1, (1 - scrollProgress - 0.9) * 10));

  return (
    <section className="third-scroll-section" ref={sectionRef}>
      <div className="third-scroll-container">
        {/* Заголовок */}
        <div className="third-title-wrapper">
          <h2 
            className="third-title"
            style={{ 
              opacity: titleVisibility,
              transform: `translateY(${(1 - titleVisibility) * 30}px)`
            }}
          >
            {title.split("").map((letter, index) => (
              <span
                key={index}
                className="title-letter"
                style={{
                  opacity: titleVisibility,
                  transform: `translateY(${(1 - titleVisibility) * 30}px)`,
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {letter}
              </span>
            ))}
          </h2>
        </div>

        {/* Список элементов */}
        <div className="third-items-list">
          {items.map((item, index) => {
            const visibility = getItemVisibility(index, items.length);
            
            return (
              <div 
                key={index} 
                className="third-item"
                style={{ 
                  opacity: visibility,
                  transform: `translateX(${(1 - visibility) * (index % 2 === 0 ? -30 : 30)}px)`
                }}
              >
                <span className="item-text">
                  {item.split("").map((letter, letterIndex) => (
                    <span
                      key={letterIndex}
                      className="item-letter"
                      style={{
                        opacity: visibility,
                        transitionDelay: `${(index * 100) + (letterIndex * 30)}ms`
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>

        {/* Кнопка */}
        <div 
          className="third-button-wrapper"
          style={{ opacity: buttonVisibility }}
        >
          <button className="third-button">
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default ThirdScrollBlock;