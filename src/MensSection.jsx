import React, { useEffect, useRef } from "react";
import "./MensSection.css";
import mensPhoto from "./image/mens.png";

const MensSection = () => {
  const sectionRef = useRef(null);
  const photoContainerRef = useRef(null);
  const dateTextRef = useRef(null);
  const textContainerRef = useRef(null);
  const secondaryContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !sectionRef.current ||
        !photoContainerRef.current ||
        !dateTextRef.current ||
        !textContainerRef.current ||
        !secondaryContainerRef.current
      )
        return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      let progress = (windowCenter - sectionCenter) / (windowHeight / 2);
      progress = Math.max(-1, Math.min(1, progress));

      const normalizedProgress = (progress + 1) / 2;
      const smoothProgress = normalizedProgress < 0.5
        ? 2 * normalizedProgress * normalizedProgress
        : 1 - Math.pow(-2 * normalizedProgress + 2, 2) / 2;

      // Анимация ширины фото
      const minPhotoWidth = 30;
      const centerPhotoWidth = 50;
      const maxPhotoWidth = 80;
      let photoWidth;
      if (smoothProgress < 0.5) {
        photoWidth = minPhotoWidth + (smoothProgress * 2 * (centerPhotoWidth - minPhotoWidth));
      } else {
        photoWidth = centerPhotoWidth + ((smoothProgress - 0.5) * 2 * (maxPhotoWidth - centerPhotoWidth));
      }
      photoContainerRef.current.style.width = `${photoWidth}%`;

      // Позиционирование текста относительно фото
      const textRightPosition = `calc(${photoWidth}% + 187px)`;
      dateTextRef.current.style.right = textRightPosition;
      textContainerRef.current.style.right = textRightPosition;
      secondaryContainerRef.current.style.right = `calc(${photoWidth}% + 147px)`;
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="mens-section" ref={sectionRef}>
      <div className="mens-sticky">
        <div className="mens-content">
          {/* Дата */}
          <div className="mens-date-container" ref={dateTextRef}>
            <p className="mens-date">
              Founded in 2013 by Fedor Balvanovich and Stanislav Kasatov, Movie Park aims <br /> to make a lasting mark in the industry by bringing bold ideas to life and turning <br /> them into powerful visual stories that inspire and endure.
            </p>
          </div>

          {/* Основной текст */}
          <div className="mens-text-container" ref={textContainerRef}>
            <p className="mens-text-bold">
              Movie Park is an international production <br />studio creating unique visual solutions <br />  across video, marketing, and event industries. <br /> Our portfolio spans commercial and creative <br /> projects for brands, private clients, and <br /> major companies.
            </p>
          </div>

          {/* Кнопка */}
          <div className="mens-secondary-container" ref={secondaryContainerRef}>
            <button className="mens-button">
              READ MORE
            </button>
          </div>

          {/* Фото */}
          <div className="mens-photo-container" ref={photoContainerRef}>
            <img src={mensPhoto} alt="Movie Park team" className="mens-photo" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MensSection;
