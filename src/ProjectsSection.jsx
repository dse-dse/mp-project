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

  useEffect(() => {
    isMountedRef.current = true;

    const handleScroll = () => {
      if (!sectionRef.current || !isMountedRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      
      // Сохраняем начальную позицию секции при первом скролле
      if (!hasStartedRef.current) {
        sectionTopRef.current = section.offsetTop;
        hasStartedRef.current = true;
        startScrollYRef.current = currentScrollY;
      }
      
      // Прогресс скролла внутри секции (от 0 до 1)
      const sectionHeight = section.offsetHeight;
      const sectionScroll = currentScrollY - sectionTopRef.current;
      let progress = sectionScroll / sectionHeight;
      
      // Нормализуем прогресс от 0 до 1
      progress = Math.max(0, Math.min(1, progress));
      
      // Увеличиваем зону видимости для более раннего начала
      const adjustedProgress = Math.max(0, progress - 0.1) / 0.8;
      
      scrollProgressRef.current = Math.max(0, Math.min(1, adjustedProgress));
      
      // Устанавливаем целевой прогресс для каждого слова с задержкой
      const baseProgress = scrollProgressRef.current;
      animationStateRef.current.word1.targetProgress = baseProgress;
      animationStateRef.current.word2.targetProgress = Math.max(0, baseProgress - 0.15);
      animationStateRef.current.word3.targetProgress = Math.max(0, baseProgress - 0.3);
    };

    // Плавная easing функция
    const easeOutCubic = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };

    // Функция интерполяции с плавностью
    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animateWord = (word, index, targetProgress) => {
      if (!word) return;
      
      const currentState = animationStateRef.current[`word${index + 1}`];
      
      // Плавное обновление прогресса
      currentState.progress = lerp(currentState.progress, targetProgress, 0.06);
      
      const wordWidth = word.offsetWidth;
      const windowWidth = window.innerWidth;
      
      let translateX = 0;
      let opacity = 0;
      let scale = 1;
      
      const progress = currentState.progress;
      
      if (progress < 0) {
        // До начала анимации - СПРАВА за экраном (изменено направление)
        translateX = windowWidth * 1.5; // Положительное значение = справа
        opacity = 0;
        scale = 0.9;
      } else if (progress < 1) {
        // Движение через экран СПРАВА НАЛЕВО
        const easedProgress = easeOutCubic(progress);
        
        // Начальная позиция: правее экрана (с запасом)
        const startX = windowWidth * 1.5;
        // Конечная позиция: левее экрана (с запасом)
        const endX = -windowWidth * 1.5;
        
        // Вычисляем позицию X - движение справа налево
        translateX = startX + easedProgress * (endX - startX);
        
        // Плавное появление и исчезновение
        if (progress < 0.25) {
          opacity = progress / 0.25;
        } else if (progress > 0.75) {
          opacity = 1 - ((progress - 0.75) / 0.25);
        } else {
          opacity = 1;
        }
        
        // Легкое масштабирование
        if (progress < 0.5) {
          scale = 0.95 + (progress / 0.5) * 0.05;
        } else {
          scale = 1 - ((progress - 0.5) / 0.5) * 0.05;
        }
      } else {
        // После окончания анимации - СЛЕВА за экраном (изменено направление)
        translateX = -windowWidth * 1.5; // Отрицательное значение = слева
        opacity = 0;
        scale = 0.9;
      }

      // Применяем стили
      word.style.transform = `translateX(${translateX}px) scale(${scale})`;
      word.style.opacity = opacity;
      word.style.transition = 'none';
    };

    const animate = () => {
      if (!isMountedRef.current) return;

      // Анимируем каждое слово с индивидуальными параметрами
      wordsRef.current.forEach((word, index) => {
        if (!word) return;
        
        const stateKey = `word${index + 1}`;
        animateWord(word, index, animationStateRef.current[stateKey].targetProgress);
      });

      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Оптимизированный обработчик скролла с дебаунсом
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

    // Ресайз хендлер
    const handleResize = () => {
      // При ресайзе сбрасываем начальные позиции
      if (sectionRef.current) {
        sectionTopRef.current = sectionRef.current.offsetTop;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Инициализация
    handleResize();
    scrollHandler();
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-content">
        <div className="words-container" ref={containerRef}>
          <div 
            className="word word-1" 
            ref={el => { if (isMountedRef.current) wordsRef.current[0] = el; }}
            style={{ 
              opacity: 0,
              transform: `translateX(200vw)`, // Изменено: начинаем справа
              willChange: 'transform, opacity'
            }}
          >
            We have done
          </div>
          <div 
            className="word word-2" 
            ref={el => { if (isMountedRef.current) wordsRef.current[1] = el; }}
            style={{ 
              opacity: 0,
              transform: `translateX(200vw)`, // Изменено: начинаем справа
              willChange: 'transform, opacity'
            }}
          >
            projects around
          </div>
          <div 
            className="word word-3" 
            ref={el => { if (isMountedRef.current) wordsRef.current[2] = el; }}
            style={{ 
              opacity: 0,
              transform: `translateX(200vw)`, // Изменено: начинаем справа
              willChange: 'transform, opacity'
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