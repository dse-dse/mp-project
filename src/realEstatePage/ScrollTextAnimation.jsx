import React, { useState, useEffect, useRef } from "react";
import "./ScrollTextAnimation.css";

const ScrollTextAnimation = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [wordStates, setWordStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [number1Visible, setNumber1Visible] = useState(false);
  const [number2Visible, setNumber2Visible] = useState(false);
  const [prevScrollProgress, setPrevScrollProgress] = useState(0);
  const wrapperRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Данные для текста - ДЕСКТОП
  const sections = [
    {
      lines: [
        ["WE", "BRING", "IDEAS", "TO", "LIFE", "THROUGH"],
        ["BRANDING,", "VISUALS", "AND", "HYPE"]
      ],
      number: 1
    },
    {
      lines: [
        ["EVERY", "PROJECT", "SUCCEEDS"]
      ],
      number: 2
    }
  ];

  // Данные для текста - МОБИЛЬНАЯ ВЕРСИЯ
  const mobileSections = [
    {
      lines: [
        ["WE", "BRING", "IDEAS"],
        ["TO", "LIFE", "THROUGH"],
        ["BRANDING,", "VISUALS"],
        ["AND", "HYPE"]
      ],
      number: 1
    },
    {
      lines: [
        ["EVERY", "PROJECT"],
        ["SUCCEEDS"]
      ],
      number: 2
    }
  ];

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);
      
      if (mobile) {
        // Для мобильных инициализируем все слова как неактивные
        const initialWordStates = {};
        mobileSections.forEach((section, sectionIdx) => {
          section.lines.forEach((line, lineIdx) => {
            line.forEach((_, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              initialWordStates[key] = false;
            });
          });
        });
        setWordStates(initialWordStates);
        setActiveSection(0);
        setNumber1Visible(false);
        setNumber2Visible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getWordKey = (sectionIdx, lineIdx, wordIdx) =>
    `${sectionIdx}-${lineIdx}-${wordIdx}`;

  // Обработчик скролла
  useEffect(() => {
    const updateAnimation = () => {
      if (!wrapperRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
        return;
      }
      
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (!isVisible) {
        if (!isMobile) {
          setActiveSection(0);
          setNumber1Visible(false);
          setNumber2Visible(false);
          
          const resetWordStates = {};
          sections.forEach((section, sectionIdx) => {
            section.lines.forEach((line, lineIdx) => {
              line.forEach((_, wordIdx) => {
                const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                resetWordStates[key] = false;
              });
            });
          });
          setWordStates(resetWordStates);
        }
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
        return;
      }
      
      if (isMobile) {
        // МОБИЛЬНАЯ ВЕРСИЯ
        const scrollTop = Math.max(0, -rect.top);
        const totalHeight = rect.height - windowHeight;
        const scrollProgress = totalHeight > 0 ? Math.min(1, scrollTop / totalHeight) : 0;
        
        // Определяем активную секцию на основе прогресса
        let newActiveSection = 0;
        let sectionProgress = 0;
        
        if (scrollProgress < 0.5) {
          newActiveSection = 0;
          sectionProgress = scrollProgress / 0.5; // 0-1 в пределах первой секции
        } else {
          newActiveSection = 1;
          sectionProgress = (scrollProgress - 0.5) / 0.5; // 0-1 в пределах второй секции
        }
        
        // Обновляем активную секцию если изменилась
        if (newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
        }
        
        // Управление цифрами
        setNumber1Visible(newActiveSection === 0 && sectionProgress > 0.1);
        setNumber2Visible(newActiveSection === 1 && sectionProgress > 0.1);
        
        // Обновляем состояния слов для обеих секций
        const newWordStates = { ...wordStates };
        
        // Обрабатываем все секции
        mobileSections.forEach((section, sectionIdx) => {
          const isCurrentSectionActive = sectionIdx === newActiveSection;
          let currentSectionProgress = 0;
          
          if (sectionIdx === 0) {
            currentSectionProgress = scrollProgress < 0.5 
              ? scrollProgress / 0.5 
              : 0;
          } else {
            currentSectionProgress = scrollProgress >= 0.5
              ? (scrollProgress - 0.5) / 0.5
              : 0;
          }
          
          // Для активной секции активируем слова постепенно
          if (isCurrentSectionActive) {
            let totalActivatedWords = 0;
            const totalWordsInSection = section.lines.flat().length;
            const targetActivatedWords = Math.floor(currentSectionProgress * totalWordsInSection * 1.5);
            
            section.lines.forEach((line, lineIdx) => {
              line.forEach((_, wordIdx) => {
                const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                const wordActivationIndex = section.lines
                  .slice(0, lineIdx)
                  .reduce((acc, l) => acc + l.length, 0) + wordIdx;
                
                newWordStates[key] = wordActivationIndex < targetActivatedWords;
                if (newWordStates[key]) totalActivatedWords++;
              });
            });
          } else {
            // Для неактивной секции деактивируем все слова
            section.lines.forEach((line, lineIdx) => {
              line.forEach((_, wordIdx) => {
                const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                newWordStates[key] = false;
              });
            });
          }
        });
        
        setWordStates(newWordStates);
        setPrevScrollProgress(scrollProgress);
        
      } else {
        // ДЕСКТОП И ПЛАНШЕТ ВЕРСИЯ
        let progress = 0;
        if (rect.top <= 0) {
          const scrolled = Math.abs(rect.top);
          const maxScroll = rect.height - windowHeight;
          if (maxScroll > 0) {
            progress = Math.min(1, scrolled / maxScroll);
          }
        }
        
        let newActiveSection = 0;
        let sectionProgress = 0;
        
        if (progress < 0.6) {
          newActiveSection = 0;
          sectionProgress = progress / 0.6;
        } else {
          newActiveSection = 1;
          sectionProgress = (progress - 0.6) / 0.4;
        }
        
        if (newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
        }
        
        const firstWordKey = getWordKey(0, 0, 0);
        const isFirstWordActive = wordStates[firstWordKey] || false;
        
        setNumber1Visible(isFirstWordActive);
        setNumber2Visible(newActiveSection === 1);
        
        const activeSectionData = sections[newActiveSection];
        const totalWords = activeSectionData.lines.flat().length;
        const wordsToActivate = Math.min(
          totalWords,
          Math.floor(sectionProgress * totalWords * 2.0)
        );
        
        const newWordStates = { ...wordStates };
        
        let wordIndex = 0;
        activeSectionData.lines.forEach((line, lineIdx) => {
          line.forEach((_, wordIdx) => {
            const key = getWordKey(newActiveSection, lineIdx, wordIdx);
            newWordStates[key] = (wordIndex < wordsToActivate);
            wordIndex++;
          });
        });
        
        const inactiveSectionIdx = newActiveSection === 0 ? 1 : 0;
        sections[inactiveSectionIdx].lines.forEach((line, lineIdx) => {
          line.forEach((_, wordIdx) => {
            const key = getWordKey(inactiveSectionIdx, lineIdx, wordIdx);
            newWordStates[key] = false;
          });
        });
        
        setWordStates(newWordStates);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateAnimation);
    
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };
    
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeSection, wordStates, sections, isMobile, mobileSections, prevScrollProgress]);

  // Рендер секции для десктопа/планшета
  const renderDesktopSection = (sectionIdx) => {
    const section = sections[sectionIdx];
    const isActive = sectionIdx === activeSection;

    if (sectionIdx === 1) {
      return (
        <div
          key={`section-${sectionIdx}`}
          className={`text-section ${isActive ? 'active' : ''}`}
          data-section-index={sectionIdx}
        >
          <div className="section-content-wrapper">
            <div className={`text-number number-2 ${number2Visible ? 'active' : ''}`}>
              02
            </div>
            
            {section.lines.map((line, lineIdx) => (
              <div key={`line-${lineIdx}`} className="text-line">
                {line.map((word, wordIdx) => {
                  const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                  const isWordActive = wordStates[key] || false;

                  return (
                    <React.Fragment key={`word-${key}`}>
                      <span
                        className={`text-word ${isWordActive ? 'active' : ''}`}
                        style={{
                          transitionDelay: `${(lineIdx * line.length + wordIdx) * 0.03}s`
                        }}
                      >
                        {word}
                      </span>

                      {wordIdx < line.length - 1 && (
                        <span className="word-space"> </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={`section-${sectionIdx}`}
        className={`text-section ${isActive ? 'active' : ''}`}
        data-section-index={sectionIdx}
      >
        {section.lines.map((line, lineIdx) => (
          <div key={`line-${lineIdx}`} className="text-line">
            {line.map((word, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              const isWordActive = wordStates[key] || false;

              return (
                <React.Fragment key={`word-${key}`}>
                  <span
                    className={`text-word ${isWordActive ? 'active' : ''}`}
                    style={{
                      transitionDelay: `${(lineIdx * line.length + wordIdx) * 0.03}s`
                    }}
                  >
                    {word}
                  </span>

                  {wordIdx < line.length - 1 && (
                    <span className="word-space"> </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Рендер секции для мобильных
  const renderMobileSection = (sectionIdx) => {
    const section = mobileSections[sectionIdx];
    const isActive = sectionIdx === activeSection;

    return (
      <div
        key={`mobile-section-${sectionIdx}`}
        className={`text-section mobile-section ${isActive ? 'active' : ''}`}
        data-section-index={sectionIdx}
      >
        {section.lines.map((line, lineIdx) => (
          <div key={`mobile-line-${lineIdx}`} className="text-line mobile-line">
            {line.map((word, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              const isWordActive = wordStates[key] || false;

              return (
                <React.Fragment key={`mobile-word-${key}`}>
                  <span
                    className={`text-word mobile-word ${isWordActive ? 'active' : ''}`}
                  >
                    {word}
                  </span>

                  {wordIdx < line.length - 1 && (
                    <span className="word-space mobile-space"> </span>
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
          {!isMobile && (
            <div className={`text-number number-1 ${number1Visible ? 'active' : ''}`}>
              01
            </div>
          )}

          {isMobile && (
            <>
              <div className={`text-number mobile-number number-1 ${number1Visible ? 'active' : ''}`}>
                01
              </div>
              <div className={`text-number mobile-number number-2 ${number2Visible ? 'active' : ''}`}>
                02
              </div>
            </>
          )}

          {isMobile
            ? mobileSections.map((_, idx) => renderMobileSection(idx))
            : sections.map((_, idx) => renderDesktopSection(idx))
          }
        </div>
      </div>
    </div>
  );
};

export default ScrollTextAnimation;