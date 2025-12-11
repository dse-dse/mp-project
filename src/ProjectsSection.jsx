import React, { useEffect, useRef, useState } from "react";
import "./ProjectsSection.css";

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const containerRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const animationStateRef = useRef({
    word1: { progress: 0, targetProgress: 0 },
    word2: { progress: 0, targetProgress: 0 },
    word3: { progress: 0, targetProgress: 0 }
  });
  const isMountedRef = useRef(true);
  const hasStartedRef = useRef(false);
  const startScrollYRef = useRef(0);
  const sectionTopRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleWords, setVisibleWords] = useState([false, false, false]);
  const [wordOpacities, setWordOpacities] = useState([0, 0, 0]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const handleScroll = () => {
      if (!sectionRef.current || !isMountedRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Проверяем, видна ли секция
      const isSectionInView = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(isSectionInView);

      // Логика для мобильных устройств
      if (isMobile) {
        // Рассчитываем прогресс скролла внутри секции
        const sectionTop = rect.top;
        const sectionHeight = section.offsetHeight;
        const windowCenter = windowHeight / 2;
        
        // Прогресс от 0 до 1, где:
        // 0 - когда центр секции на 1.5 высоты окна ниже центра экрана
        // 1 - когда центр секции на 1.5 высоты окна выше центра экрана
        const startOffset = windowHeight * 1.5; // начинаем раньше
        const endOffset = windowHeight * 1.5; // заканчиваем раньше
        
        const startPosition = windowCenter + startOffset;
        const endPosition = windowCenter - endOffset;
        const totalDistance = startPosition - endPosition;
        
        // Текущая позиция центра секции
        const sectionCenter = sectionTop + (sectionHeight / 2);
        let progress = (startPosition - sectionCenter) / totalDistance;
        
        progress = Math.max(0, Math.min(1, progress));
        
        // Ускоряем анимацию - слова появляются быстрее
        const word1Progress = Math.max(0, Math.min(1, progress * 1.5)); // Быстрее
        const word2Progress = Math.max(0, Math.min(1, (progress - 0.25) * 1.5)); // Сдвигаем ближе
        const word3Progress = Math.max(0, Math.min(1, (progress - 0.5) * 1.5)); // Сдвигаем ближе
        
        // Функция для плавного появления и исчезновения
        const calculateOpacity = (p) => {
          if (p <= 0) return 0;
          if (p <= 0.2) return p / 0.2; // Быстрее появляемся
          if (p >= 0.8) return 1 - ((p - 0.8) / 0.2); // Быстрее исчезаем
          return 1;
        };
        
        const opacities = [
          calculateOpacity(word1Progress),
          calculateOpacity(word2Progress),
          calculateOpacity(word3Progress)
        ];
        
        setWordOpacities(opacities);
        
        // Обновляем видимость для CSS классов
        const newVisibleWords = opacities.map(opacity => opacity > 0);
        setVisibleWords(newVisibleWords);
        
        return;
      }

      // Оригинальная логика для ПК и планшетов
      const currentScrollY = window.scrollY;
      
      if (!hasStartedRef.current) {
        sectionTopRef.current = section.offsetTop;
        hasStartedRef.current = true;
        startScrollYRef.current = currentScrollY;
      }
      
      const sectionHeight = section.offsetHeight;
      const sectionScroll = currentScrollY - sectionTopRef.current;
      let progress = sectionScroll / sectionHeight;
      
      progress = Math.max(0, Math.min(1, progress));
      const adjustedProgress = Math.max(0, progress - 0.1) / 0.8;
      
      scrollProgressRef.current = Math.max(0, Math.min(1, adjustedProgress));
      
      const baseProgress = scrollProgressRef.current;
      animationStateRef.current.word1.targetProgress = baseProgress;
      animationStateRef.current.word2.targetProgress = Math.max(0, baseProgress - 0.15);
      animationStateRef.current.word3.targetProgress = Math.max(0, baseProgress - 0.3);
    };

    const easeOutCubic = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animateWord = (word, index, targetProgress) => {
      if (!word || isMobile) return;
      
      const currentState = animationStateRef.current[`word${index + 1}`];
      currentState.progress = lerp(currentState.progress, targetProgress, 0.06);
      
      const wordWidth = word.offsetWidth;
      const windowWidth = window.innerWidth;
      
      let translateX = 0;
      let opacity = 0;
      let scale = 1;
      
      const progress = currentState.progress;
      
      if (progress < 0) {
        translateX = windowWidth * 1.5;
        opacity = 0;
        scale = 0.9;
      } else if (progress < 1) {
        const easedProgress = easeOutCubic(progress);
        const startX = windowWidth * 1.5;
        const endX = -windowWidth * 1.5;
        translateX = startX + easedProgress * (endX - startX);
        
        if (progress < 0.25) {
          opacity = progress / 0.25;
        } else if (progress > 0.75) {
          opacity = 1 - ((progress - 0.75) / 0.25);
        } else {
          opacity = 1;
        }
        
        if (progress < 0.5) {
          scale = 0.95 + (progress / 0.5) * 0.05;
        } else {
          scale = 1 - ((progress - 0.5) / 0.5) * 0.05;
        }
      } else {
        translateX = -windowWidth * 1.5;
        opacity = 0;
        scale = 0.9;
      }

      word.style.transform = `translateX(${translateX}px) scale(${scale})`;
      word.style.opacity = opacity;
      word.style.transition = 'none';
    };

    const animate = () => {
      if (!isMountedRef.current || isMobile) {
        if (isMobile) return;
      }

      wordsRef.current.forEach((word, index) => {
        if (!word) return;
        
        const stateKey = `word${index + 1}`;
        animateWord(word, index, animationStateRef.current[stateKey].targetProgress);
      });

      if (!isMobile) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking && isMountedRef.current) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    const handleResize = () => {
      if (sectionRef.current && !isMobile) {
        sectionTopRef.current = sectionRef.current.offsetTop;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    handleResize();
    scrollHandler();
    
    if (!isMobile) {
      rafIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isMobile]);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-content" style={isMobile && isInView ? { position: 'fixed', top: '50%' } : {}}>
        <div className="words-container" ref={containerRef}>
          <div 
            className={`word word-1 ${visibleWords[0] ? 'visible' : ''}`}
            ref={el => { if (isMountedRef.current) wordsRef.current[0] = el; }}
            style={!isMobile ? { 
              opacity: 0,
              transform: `translateX(200vw)`,
              willChange: 'transform, opacity'
            } : { 
              opacity: wordOpacities[0],
              transform: 'translateY(0)',
              transition: 'opacity 0.4s ease' // Быстрее
            }}
          >
            We have done
          </div>
          <div 
            className={`word word-2 ${visibleWords[1] ? 'visible' : ''}`}
            ref={el => { if (isMountedRef.current) wordsRef.current[1] = el; }}
            style={!isMobile ? { 
              opacity: 0,
              transform: `translateX(200vw)`,
              willChange: 'transform, opacity'
            } : { 
              opacity: wordOpacities[1],
              transform: 'translateY(0)',
              transition: 'opacity 0.4s ease' // Быстрее
            }}
          >
            projects around
          </div>
          <div 
            className={`word word-3 ${visibleWords[2] ? 'visible' : ''}`}
            ref={el => { if (isMountedRef.current) wordsRef.current[2] = el; }}
            style={!isMobile ? { 
              opacity: 0,
              transform: `translateX(200vw)`,
              willChange: 'transform, opacity'
            } : { 
              opacity: wordOpacities[2],
              transform: 'translateY(0)',
              transition: 'opacity 0.4s ease' // Быстрее
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