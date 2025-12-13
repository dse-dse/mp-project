import React, { useState, useEffect, useRef } from "react";
import "./ScrollTextAnimation.css";

const ScrollTextAnimation = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [wordStates, setWordStates] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [number1Visible, setNumber1Visible] = useState(false);
  const [number2Visible, setNumber2Visible] = useState(false);
  const wrapperRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isTransitioningRef = useRef(false);

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
      number: "01",
      lines: [
        ["WE", "BRING", "IDEAS", "TO", "LIFE"],
        ["THROUGH", "BRANDING,", "VISUALS", "AND", "HYPE"]
      ]
    },
    {
      number: "02",
      lines: [
        ["EVERY", "PROJECT", "SUCCEEDS"]
      ]
    }
  ];

  const getWordKey = (sectionIdx, lineIdx, wordIdx) =>
    `${sectionIdx}-${lineIdx}-${wordIdx}`;

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);

      if (mobile) {
        const initialWordStates = {};
        mobileSections.forEach((section, sectionIdx) => {
          section.lines.forEach((line, lineIdx) => {
            line.forEach((_, wordIdx) => {
              const key = getWordKey(sectionIdx, lineIdx, wordIdx);
              initialWordStates[key] = (sectionIdx === 0);
            });
          });
        });
        setWordStates(initialWordStates);
        setActiveSection(0);
      } else {
        const initialWordStates = {};
        sections.forEach((section, sectionIdx) => {
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

  // Обработчик скролла для мобильных устройств
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    let lastScrollY = window.scrollY;
    let lastDirection = 0;

    const handleScroll = () => {
      if (!wrapperRef.current || isTransitioningRef.current) return;

      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 1 : -1;
      lastScrollY = currentScrollY;

      const directionChanged = lastDirection !== 0 && lastDirection !== direction;
      lastDirection = direction;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const wrapper = wrapperRef.current;
          const rect = wrapper.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top > windowHeight || rect.bottom < 0) {
            ticking = false;
            return;
          }

          const wrapperTop = wrapper.offsetTop;
          const wrapperHeight = wrapper.offsetHeight;
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollPosition = Math.max(0, scrollTop - wrapperTop);
          const maxScroll = Math.max(1, wrapperHeight - windowHeight);
          const progress = Math.min(1, Math.max(0, scrollPosition / maxScroll));

          let newActiveSection = progress < 0.5 ? 0 : 1;

          if (newActiveSection !== activeSection && !directionChanged) {
            isTransitioningRef.current = true;
            setActiveSection(newActiveSection);

            const newWordStates = {};
            mobileSections.forEach((section, sectionIdx) => {
              section.lines.forEach((line, lineIdx) => {
                line.forEach((_, wordIdx) => {
                  const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                  newWordStates[key] = (sectionIdx === newActiveSection);
                });
              });
            });

            setWordStates(newWordStates);

            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 300);
          }

          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, activeSection]);

  // Десктопная анимация
  useEffect(() => {
    if (isMobile) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

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
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

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

      if (newActiveSection === 0) {
        const firstWordKey = getWordKey(0, 0, 0);
        const isFirstWordActive = wordStates[firstWordKey] || false;
        setNumber1Visible(isFirstWordActive);
        setNumber2Visible(false);
      } else {
        setNumber1Visible(false);
        const secondWordKey = getWordKey(1, 0, 0);
        const isSecondWordActive = wordStates[secondWordKey] || false;
        setNumber2Visible(isSecondWordActive);
      }

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

      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    animationFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile, activeSection, wordStates]);

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

  // Рендер мобильного блока
  const renderMobileBlock = (sectionIdx) => {
    const section = mobileSections[sectionIdx];
    const isActive = sectionIdx === activeSection;

    return (
      <div
        key={`mobile-block-${sectionIdx}`}
        className={`mobile-block ${isActive ? 'active' : 'inactive'}`}
        data-section-index={sectionIdx}
        style={{ zIndex: sectionIdx === 0 ? 2 : 1 }}
      >
        <div className="mobile-number">
          {section.number}
        </div>

        <div className="mobile-text-content">
          {section.lines.map((line, lineIdx) => (
            <div key={`mobile-line-${lineIdx}`} className="mobile-line">
              {line.map((word, wordIdx) => {
                const key = getWordKey(sectionIdx, lineIdx, wordIdx);
                const isWordActive = wordStates[key] || false;

                return (
                  <React.Fragment key={`mobile-word-${key}`}>
                    <span
                      className={`mobile-word ${isWordActive ? 'active' : ''}`}
                    >
                      {word}
                    </span>

                    {wordIdx < line.length - 1 && (
                      <span className="mobile-word-space"> </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="scroll-text-animation-wrapper" ref={wrapperRef}>
      <div className="scroll-text-fixed-container">
        <div className="scroll-text-content">
          {/* Десктопная версия */}
          {!isMobile && (
            <>
              <div className={`text-number number-1 ${number1Visible ? 'active' : ''}`}>
                01
              </div>
              {sections.map((_, idx) => renderDesktopSection(idx))}
            </>
          )}

          {/* Мобильная версия */}
          {isMobile && (
            <div className="mobile-container">
              {mobileSections.map((_, idx) => renderMobileBlock(idx))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollTextAnimation;
