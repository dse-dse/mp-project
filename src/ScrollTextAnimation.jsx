import React, { useState, useEffect, useRef } from "react";
import "./ScrollTextAnimation.css";

const ScrollTextAnimation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const animationFrameRef = useRef();

  const textSections = [
    [
      "WE BRING IDEAS TO LIFE THROUGH",
      "BRANDING, VISUALS AND HYPE"
    ],
    [
      "EVERY PROJECT SUCCEEDS"
    ]
  ];

  // Состояния для каждой буквы каждого раздела
  const [letterStates, setLetterStates] = useState(
    textSections.map(section => 
      section.map(line => 
        Array(line.length).fill({ 
          opacity: 0, 
          scale: 0.9,
          translateY: 20
        })
      )
    )
  );

  // Настройки анимации
  const animationConfig = {
    fadeInDuration: 0.6,
    fadeOutDuration: 0.4,
    staggerDelay: 0.01,
    scaleRange: [0.9, 1],
    translateRange: [20, 0],
    sectionThreshold: 0.3,
  };

  useEffect(() => {
    const updateAnimation = () => {
      if (!sectionRef.current || !containerRef.current || !textContainerRef.current) return;

      const section = sectionRef.current;
      const container = containerRef.current;
      const textContainer = textContainerRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Проверяем, находится ли секция в viewport
      const isVisible = rect.top <= windowHeight && rect.bottom >= 0;
      setIsInViewport(isVisible);
      
      if (!isVisible) {
        setScrollProgress(0);
        setActiveSection(0);
        
        // Сбрасываем все буквы
        const resetStates = textSections.map(section => 
          section.map(line => 
            Array(line.length).fill({ 
              opacity: 0, 
              scale: 0.9,
              translateY: 20
            })
          )
        );
        setLetterStates(resetStates);
        return;
      }

      // Рассчитываем прогресс скролла внутри секции
      // Начинаем, когда верх секции достигает верха экрана
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Прогресс от 0 до 1, когда секция проходит через экран
      let progress = 0;
      if (sectionTop <= 0) {
        // Секция начала уходить за верх экрана
        const scrolledPast = Math.abs(sectionTop);
        const maxScroll = sectionHeight - windowHeight;
        progress = Math.min(1, scrolledPast / maxScroll);
      }
      
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);

      // Определяем активную секцию на основе прогресса
      const totalSections = textSections.length;
      const sectionWidth = 0.8; // 80% скролла на первую секцию, 20% на вторую
      
      let currentSection = 0;
      if (progress < sectionWidth) {
        currentSection = 0;
      } else {
        currentSection = 1;
      }
      
      setActiveSection(currentSection);

      // Прогресс внутри текущей секции
      let internalProgress = 0;
      if (currentSection === 0) {
        internalProgress = Math.min(1, progress / sectionWidth);
      } else {
        internalProgress = Math.min(1, (progress - sectionWidth) / (1 - sectionWidth));
      }

      // Обновляем состояния букв
      const updatedLetterStates = [...letterStates];
      
      textSections.forEach((section, sectionIdx) => {
        const isActive = sectionIdx === currentSection;
        const isPrevious = sectionIdx < currentSection;
        
        section.forEach((line, lineIdx) => {
          const lettersInLine = line.length;
          
          line.split('').forEach((_, letterIdx) => {
            if (isActive) {
              // Активная секция - буквы появляются
              const letterStartPoint = (letterIdx / lettersInLine) * 0.5;
              let letterProgress = 0;
              
              if (internalProgress > letterStartPoint) {
                letterProgress = Math.min(1, (internalProgress - letterStartPoint) * 2);
              }
              
              // Для первой секции - обычное появление
              // Для второй секции - начинаем появляться, когда первая исчезла
              if (sectionIdx === 1 && currentSection === 1) {
                const firstSectionDisappearProgress = Math.max(0, (progress - 0.5) * 2);
                letterProgress = Math.min(letterProgress, firstSectionDisappearProgress);
              }
              
              updatedLetterStates[sectionIdx][lineIdx][letterIdx] = {
                opacity: letterProgress,
                scale: animationConfig.scaleRange[0] + 
                      (animationConfig.scaleRange[1] - animationConfig.scaleRange[0]) * letterProgress,
                translateY: animationConfig.translateRange[0] + 
                          (animationConfig.translateRange[1] - animationConfig.translateRange[0]) * letterProgress
              };
            } else if (isPrevious) {
              // Предыдущая секция - исчезает
              let fadeOutProgress = 1;
              if (currentSection === 1 && sectionIdx === 0) {
                fadeOutProgress = Math.max(0, 1 - (progress - 0.5) * 2);
              }
              
              updatedLetterStates[sectionIdx][lineIdx][letterIdx] = {
                opacity: fadeOutProgress,
                scale: 1,
                translateY: 0
              };
            } else {
              // Будущие секции - скрыты
              updatedLetterStates[sectionIdx][lineIdx][letterIdx] = {
                opacity: 0,
                scale: animationConfig.scaleRange[0],
                translateY: animationConfig.translateRange[0]
              };
            }
          });
        });
      });

      setLetterStates(updatedLetterStates);
    };

    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Инициализация
    updateAnimation();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [textSections.length]);

  // Рендер текстовой строки
  const renderTextLine = (line, lineIdx, sectionIdx) => {
    const isActive = sectionIdx === activeSection;
    const isPrevious = sectionIdx < activeSection;
    
    return (
      <div 
        key={`section-${sectionIdx}-line-${lineIdx}`} 
        className="text-line"
        data-section={sectionIdx}
        data-active={isActive}
        data-previous={isPrevious}
      >
        {line.split('').map((char, letterIdx) => {
          const state = letterStates[sectionIdx][lineIdx][letterIdx];
          const delay = letterIdx * animationConfig.staggerDelay;
          
          // Разные transition для разных состояний
          let transition = '';
          if (isActive && isInViewport) {
            transition = `opacity ${animationConfig.fadeInDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s,
                         transform ${animationConfig.fadeInDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
          } else if (isPrevious && isInViewport) {
            transition = `opacity ${animationConfig.fadeOutDuration}s cubic-bezier(0.22, 0.61, 0.36, 1),
                         transform ${animationConfig.fadeOutDuration}s cubic-bezier(0.22, 0.61, 0.36, 1)`;
          }
          
          return (
            <span
              key={`section-${sectionIdx}-line-${lineIdx}-letter-${letterIdx}`}
              className="letter"
              style={{
                opacity: state.opacity,
                transform: `translateY(${state.translateY}px) scale(${state.scale})`,
                transition: transition,
                willChange: 'opacity, transform',
                display: 'inline-block',
                whiteSpace: 'pre'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    );
  };

  // Рендер всей секции текста
  const renderTextSection = (section, sectionIdx) => {
    const shouldBeVisible = isInViewport && (sectionIdx <= activeSection);
    
    return (
      <div
        key={`text-section-${sectionIdx}`}
        className="text-section"
        data-section-index={sectionIdx}
        style={{
          opacity: shouldBeVisible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: textSections.length - sectionIdx
        }}
      >
        <div className="text-block">
          {section.map((line, lineIdx) => 
            renderTextLine(line, lineIdx, sectionIdx)
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="scroll-text-section" ref={sectionRef}>
      <div className="scroll-container" ref={containerRef}>
        <div className="sticky-text-container" ref={textContainerRef}>
          {textSections.map((section, idx) => renderTextSection(section, idx))}
        </div>
      </div>
    </section>
  );
};

export default ScrollTextAnimation;