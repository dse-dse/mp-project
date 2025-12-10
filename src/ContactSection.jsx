import React, { useState } from "react";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    project: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState("");

  // Функция для копирования email
  const copyEmailToClipboard = (email, type) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedEmail(type);
        setTimeout(() => setCopiedEmail(""), 2000);
      })
      .catch(err => {
        console.error('Ошибка копирования: ', err);
      });
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы через ваш Formspree
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ВАШ Formspree endpoint
      const response = await fetch('https://formspree.io/f/xvgewwby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.project,
          _subject: `Новая заявка от ${formData.name}`,
          _replyto: formData.email,
          _to: "manatin306@gmail.com"
        }),
      });
      
      if (response.ok) {
        setMessageSent(true);
        setFormData({ name: "", phone: "", email: "", project: "" });
        
        // Сбрасываем сообщение об успехе через 5 секунд
        setTimeout(() => {
          setMessageSent(false);
        }, 5000);
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или напишите нам напрямую на hello@moviepatipero.com');
      console.error('Ошибка:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Левая колонка - 50% ширины */}
        <div className="left-column">
          {/* Верхняя часть - кнопки для копирования почты В ОДНУ СТРОКУ */}
          <div className="emails-section">
            <div className="email-row">
              <div className="email-item">
                <div className="email-label">WHAT TO BECOME OUR CLIENT?</div>
                <div 
                  className="email-value"
                  onClick={() => copyEmailToClipboard("info@novlepships.com", "client")}
                  title="Нажмите чтобы скопировать"
                >
                  info@novlepships.com
                  {copiedEmail === "client" && <span className="copy-notification">copied!</span>}
                </div>
              </div>
              
              <div className="email-item">
                <div className="email-label">WHAT TO WORK FOR US?</div>
                <div 
                  className="email-value"
                  onClick={() => copyEmailToClipboard("job@novlepships.com", "work")}
                  title="Нажмите чтобы скопировать"
                >
                  job@novlepships.com
                  {copiedEmail === "work" && <span className="copy-notification">copied!</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Нижняя часть - CHAT WITH US */}
          <div className="chat-section">
            <div className="chat-text">CHAT<br />WITH US</div>
          </div>
        </div>
        
        {/* Правая колонка - 50% ширины */}
        <div className="right-column">
          {/* Верхняя часть - текст */}
          <div className="text-section">
            <div className="contact-text">
              FEEL FREE TO WRITE AND CALL US.<br />
              WE REALLY LOVE TO COMMUNICATE WITH OUR CLIENTS
            </div>
          </div>
          
          {/* Нижняя часть - форма */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {messageSent && (
              <div className="success-message">
                ✓ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">YOUR NAME:*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder=""
              />
            </div>
            
            {/* Телефон и Email В ОДНУ СТРОКУ */}
            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="phone" className="form-label">PHONE NUMBER:*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder=""
                  pattern="[0-9+\-\s()]{10,}"
                  title="Введите корректный номер телефона"
                />
              </div>
              
              <div className="form-group form-group-half">
                <label htmlFor="email" className="form-label">EMAIL ADDRESS:*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder=""
                />
              </div>
            </div>
            
            {/* БЛОК TELL US ABOUT YOUR PROJECT - Исправлен на textarea */}
            <div className="form-group">
              <label htmlFor="project" className="form-label">TELL US ABOUT YOUR PROJECT</label>
              <textarea
                id="project"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                placeholder=""
                required
              />
              {/* Добавляем разделитель после поля проекта */}
              <div className="separator"></div>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "SEND"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;