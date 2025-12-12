import React, { useState, useEffect, useRef } from "react";
import "./ScrollTextAnimation.css";

const ScrollTextAnimation = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [wordStates, setWordStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef(null);
  
  // ДВА ПРЕДЛОЖЕНИЯ
  const sections = [
    // ПЕРВОЕ - сверху слева
    {
      lines: [
        ["WE", "BRING", "IDEAS", "TO", "LIFE", "THROUGH"],
        [ "BRANDING,", "VISUALS", "AND", "HYPE"]
      ],
      position: "top-left"
    },
    // ВТОРОЕ - снизу справа
    {
      lines: [
        ["EVERY", "PROJECT", "SUCCEEDS"]
      ],
      position: "bottom-right"
    }
  ];
  
  // Мобильная версия с переносами
  const mobileSections = [
    // Первое предложение с переносами
    {
      lines: [
        ["WE", "BRING", "IDEAS"],
        ["TO", "LIFE", "THROUGH"],
        ["BRANDING,", "VISUALS"],
        ["AND", "HYPE"]
      ],
      position: "center"
    },
    // Второе предложение
    {
      lines: [
        ["EVERY", "PROJECT"],
        ["SUCCEEDS"]
      ],
      position: "center"
    }
  ];
  
  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Функция для получения ключа слова
  const getWordKey = (sectionIdx, lineIdx, wordIdx) => 
    `${sectionIdx}-${lineIdx}-${wordIdx}`;
  
  // Обработчик скролла - упрощенный
  useEffect(() => {
    let rafId = null;
    let lastScrollY = window.scrollY;
    
    const updateAnimation = () => {
      if (!wrapperRef.current) return;
      
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Проверяем видимость
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (!isVisible) {
        // Сбрасываем при выходе
        if (activeSection !== 0 || Object.keys(wordStates).length > 0) {
          setActiveSection(0);
          setWordStates({});
        }
        return;
      }
      
      if (isMobile) {
        // Для мобильной версии: весь текст сразу появляется в центре
        const newWordStates = {};
        
        mobileSections.forEach((section, sectionIdx) => {
          section.lines.forEach((line, lineIdx) => {
            line.forEach((_, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              newWordStates[key] = true;
            });
          });
        });
        
        // Активируем все слова
        setWordStates(newWordStates);
        
        // Переключаем секции при скролле для мобильной версии
        const progress = Math.abs(rect.top) / (rect.height - windowHeight);
        let newActiveSection = 0;
        
        if (progress > 0.5) {
          newActiveSection = 1;
        }
        
        if (newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
        }
        
        return;
      }
      
      // Рассчитываем прогресс (0-1) - только для десктоп версии
      let progress = 0;
      if (rect.top <= 0) {
        const scrolled = Math.abs(rect.top);
        const maxScroll = rect.height - windowHeight;
        if (maxScroll > 0) {
          progress = Math.min(1, scrolled / maxScroll);
        }
      }
      
      // Определяем активную секцию
      // Первая секция - 60%, вторая - 40%
      let newActiveSection = 0;
      let sectionProgress = 0;
      
      if (progress < 0.6) {
        newActiveSection = 0;
        sectionProgress = progress / 0.6;
      } else {
        newActiveSection = 1;
        sectionProgress = (progress - 0.6) / 0.4;
      }
      
      // Обновляем активную секцию
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
      
      // Активируем слова в активной секции
      const activeSectionData = sections[newActiveSection];
      const totalWords = activeSectionData.lines.flat().length;
      
      // БОЛЬШЕ СЛОВ АКТИВИРУЕМ БЫСТРЕЕ - множитель 2.0
      const wordsToActivate = Math.min(
        totalWords,
        Math.floor(sectionProgress * totalWords * 2.0)
      );
      
      // Обновляем состояния слов
      const newWordStates = { ...wordStates };
      
      let wordIndex = 0;
      activeSectionData.lines.forEach((line, lineIdx) => {
        line.forEach((_, wordIdx) => {
          const key = getWordKey(newActiveSection, lineIdx, wordIdx);
          
          if (wordIndex < wordsToActivate) {
            newWordStates[key] = true;
          } else {
            // Деактивируем если не должно быть видно
            newWordStates[key] = false;
          }
          
          wordIndex++;
        });
      });
      
      // Деактивируем слова из неактивной секции
      const inactiveSectionIdx = newActiveSection === 0 ? 1 : 0;
      sections[inactiveSectionIdx].lines.forEach((line, lineIdx) => {
        line.forEach((_, wordIdx) => {
          const key = getWordKey(inactiveSectionIdx, lineIdx, wordIdx);
          newWordStates[key] = false;
        });
      });
      
      setWordStates(newWordStates);
      
      rafId = requestAnimationFrame(updateAnimation);
    };
    
    rafId = requestAnimationFrame(updateAnimation);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      lastScrollY = currentScrollY;
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateAnimation);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Инициализация
    updateAnimation();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeSection, wordStates, sections, isMobile, mobileSections]);
  
  // Рендер секции
  const renderSection = (sectionIdx) => {
    const currentSections = isMobile ? mobileSections : sections;
    const section = currentSections[sectionIdx];
    const isActive = sectionIdx === activeSection;
    
    return (
      <div 
        key={`section-${sectionIdx}`}
        className={`text-section ${isActive ? 'active' : ''} ${isMobile ? 'mobile-section' : ''}`}
        data-section-index={sectionIdx}
      >
        {section.lines.map((line, lineIdx) => (
          <div key={`line-${lineIdx}`} className={`text-line ${isMobile ? 'mobile-line' : ''}`}>
            {line.map((word, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              const isWordActive = wordStates[key] || false;
              
              return (
                <React.Fragment key={`word-${key}`}>
                  <span 
                    className={`text-word ${isWordActive ? 'active' : ''} ${isMobile ? 'mobile-word' : ''}`}
                    style={{
                      // МЕНЬШАЯ ЗАДЕРЖКА ДЛЯ БЫСТРОГО ПОЯВЛЕНИЯ
                      transitionDelay: isMobile ? '0s' : `${(lineIdx * line.length + wordIdx) * 0.03}s`
                    }}
                  >
                    {word}
                  </span>
                  
                  {wordIdx < line.length - 1 && (
                    <span className={`word-space ${isMobile ? 'mobile-space' : ''}`}> </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="scroll-text-animation-wrapper" ref={wrapperRef}>
      <div className="scroll-text-fixed-container">
        <div className="scroll-text-content">
          {(isMobile ? mobileSections : sections).map((_, idx) => renderSection(idx))}
        </div>
      </div>
    </div>
  );
};

export default ScrollTextAnimation;