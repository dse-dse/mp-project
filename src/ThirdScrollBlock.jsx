// ThirdScrollBlock.js
import React, { useState, useEffect, useRef } from "react";
import "./ThirdScrollBlock.css";

const ThirdScrollBlock = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [wasVisible, setWasVisible] = useState(false);
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
    let animationFrameId;
    
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Проверяем, виден ли блок на 40% экрана
      const isInView = rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4;
      
      if (isInView) {
        setIsVisible(true);
        setWasVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScrollThrottled = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    // Добавляем обработчик скролла
    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    window.addEventListener("resize", handleScrollThrottled);
    
    // Проверяем видимость сразу
    handleScroll();
    
    // Убираем обработчик при размонтировании
    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
      window.removeEventListener("resize", handleScrollThrottled);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Рассчитываем задержки для букв заголовка
  const getTitleLetterDelay = (index, isAppearing) => {
    if (!isAppearing) return 0;
    return index * 100;
  };

  // Рассчитываем задержки для букв в элементах списка
  const getItemLetterDelay = (itemIndex, letterIndex, isAppearing) => {
    if (!isAppearing) return 0;
    return itemIndex * 200 + letterIndex * 20;
  };

  // Рассчитываем задержки для букв кнопки
  const getButtonLetterDelay = (index, isAppearing) => {
    if (!isAppearing) return 0;
    return index * 40 + 1000;
  };

  // Задержки для элементов списка
  const getItemDelay = (index, isAppearing) => {
    if (!isAppearing) return 0;
    return index * 200 + 400;
  };

  // Определяем направление анимации для элементов
  const getItemTransform = (isAppearing) => {
    return isAppearing ? "translateX(0)" : "translateX(50px)";
  };

  const getTitleTransform = (isAppearing) => {
    return isAppearing ? "translateX(0)" : "translateX(-50px)";
  };

  const getButtonTransform = (isAppearing) => {
    return isAppearing ? "translateY(0)" : "translateY(30px)";
  };

  return (
    <section 
      className={`third-scroll-section ${isVisible ? 'section-visible' : ''}`} 
      ref={sectionRef}
    >
      {/* Линия сверху */}
      <div className="section-top-line"></div>
      
      <div className="third-scroll-container">
        {/* Левая часть - WE DO */}
        <div className="left-side">
          <div className="third-title-wrapper">
            <h2 className="third-title" style={{
              opacity: isVisible ? 1 : 0,
              transform: getTitleTransform(isVisible)
            }}>
              {title.split("").map((letter, index) => (
                <React.Fragment key={index}>
                  {letter === " " ? (
                    <span className="title-space"></span>
                  ) : (
                    <span
                      className="title-letter"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: getTitleTransform(isVisible),
                        transitionDelay: `${getTitleLetterDelay(index, isVisible)}ms`
                      }}
                    >
                      {letter}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h2>
          </div>
        </div>

        {/* Правая часть - Список элементов и кнопка */}
        <div className="right-side">
          {/* Список элементов */}
          <div className="items-container">
            <div className="third-items-list">
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className="third-item"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: getItemTransform(isVisible),
                    transitionDelay: `${getItemDelay(index, isVisible)}ms`
                  }}
                >
                  <span className="item-text">
                    {item.split("").map((letter, letterIndex) => (
                      <span
                        key={letterIndex}
                        className="item-letter"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transitionDelay: `${getItemLetterDelay(index, letterIndex, isVisible)}ms`
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопка VIEW ALL PROJECT под списком */}
          <div className="button-container">
            <div 
              className="third-button-wrapper"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: getButtonTransform(isVisible),
                transitionDelay: isVisible ? "1200ms" : "0ms"
              }}
            >
              <button className="third-button">
                {buttonText.split("").map((letter, index) => (
                  <React.Fragment key={index}>
                    {letter === " " ? (
                      <span className="button-space"></span>
                    ) : (
                      <span
                        key={index}
                        className="button-letter"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transitionDelay: `${getButtonLetterDelay(index, isVisible)}ms`
                        }}
                      >
                        {letter}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdScrollBlock;