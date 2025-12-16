import { type FC, useEffect, useRef, useState } from "react"
import styles from './ContactsTab.module.scss';
import cn from 'classnames';

interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'social';
  icon: string;
  label: string;
  value: string;
  link: string;
  color: 'primary' | 'secondary' | 'primary-variant';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const contactInfo: ContactInfo[] = [
  {
    id: 'email',
    type: 'email',
    icon: '✉️',
    label: 'Email',
    value: 'sputnik.doveriya.info@yandex.ru',
    link: 'mailto:sputnik.doveriya.info@yandex.ru',
    color: 'primary'
  },
  {
    id: 'phone',
    type: 'phone',
    icon: '📞',
    label: 'Телефон',
    value: '+7 (980) 802-93-64',
    link: 'tel:+79808029364',
    color: 'secondary'
  },
  {
    id: 'telegram',
    type: 'social',
    icon: '💬',
    label: 'Telegram',
    value: '@sputnik_doveriya',
    link: 'https://t.me/sputnik_doveriya',
    color: 'primary-variant'
  }
];

export const ContactsTab: FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const cardRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setVisibleCards(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      Object.values(cardRefs.current).forEach(ref => {
        if (ref) {
          observer.observe(ref);
        }
      });
      if (formRef.current) {
        observer.observe(formRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const formatPhoneNumber = (value: string): string => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Если начинается с 8, заменяем на 7
    let formatted = numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers;
    
    // Если не начинается с 7, добавляем 7
    if (formatted && !formatted.startsWith('7')) {
      formatted = '7' + formatted;
    }
    
    // Ограничиваем до 11 цифр (7 + 10)
    formatted = formatted.slice(0, 11);
    
    // Форматируем в +7 (XXX) XXX-XX-XX
    if (formatted.length === 0) {
      return '';
    } else if (formatted.length <= 1) {
      return `+${formatted}`;
    } else if (formatted.length <= 4) {
      return `+${formatted.slice(0, 1)} (${formatted.slice(1)}`;
    } else if (formatted.length <= 7) {
      return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4)}`;
    } else if (formatted.length <= 9) {
      return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`;
    } else {
      return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email адрес';
    }

    if (formData.phone.trim()) {
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length < 11 || !phoneNumbers.startsWith('7')) {
        newErrors.phone = 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Применяем маску для телефона
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.gradient}>
        <div className={styles.content_wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Контакты</h1>
            <p className={styles.subtitle}>Свяжитесь с нами для получения дополнительной информации</p>
          </div>
          
          <div className={styles.content_grid}>
            {/* Contact Info Cards */}
            <div className={styles.contacts_section}>
              <h2 className={styles.section_title}>Способы связи</h2>
              <div className={styles.cards_grid}>
                {contactInfo.map((contact, index) => (
                  <a
                    key={contact.id}
                    href={contact.link}
                    target={contact.type === 'social' ? '_blank' : undefined}
                    rel={contact.type === 'social' ? 'noopener noreferrer' : undefined}
                    className={cn(
                      styles.contact_card,
                      styles[`card_${contact.color}`],
                      styles.fade_in_up,
                      { [styles.visible]: visibleCards.has(contact.id) }
                    )}
                    id={contact.id}
                    ref={(el) => {
                      cardRefs.current[contact.id] = el;
                    }}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={styles.card_icon}>{contact.icon}</div>
                    <div className={styles.card_content}>
                      <div className={styles.card_label}>{contact.label}</div>
                      <div className={styles.card_value}>{contact.value}</div>
                    </div>
                    <div className={styles.card_glow}></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.form_section}>
              <h2 className={styles.section_title}>Форма обратной связи</h2>
              <form
                ref={formRef}
                className={cn(
                  styles.contact_form,
                  styles.fade_in_up,
                  { [styles.visible]: visibleCards.has('contact-form') }
                )}
                id="contact-form"
                onSubmit={handleSubmit}
              >
                <div className={styles.form_group}>
                  <label htmlFor="name" className={styles.form_label}>
                    Имя <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={cn(styles.form_input, { [styles.input_error]: errors.name })}
                    placeholder="Введите ваше имя"
                  />
                  {errors.name && <span className={styles.error_message}>{errors.name}</span>}
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="email" className={styles.form_label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={cn(styles.form_input, { [styles.input_error]: errors.email })}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className={styles.error_message}>{errors.email}</span>}
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="phone" className={styles.form_label}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text');
                      const formatted = formatPhoneNumber(pastedText);
                      setFormData(prev => ({ ...prev, phone: formatted }));
                    }}
                    className={cn(styles.form_input, { [styles.input_error]: errors.phone })}
                    placeholder="+7 (999) 123-45-67"
                  />
                  {errors.phone && <span className={styles.error_message}>{errors.phone}</span>}
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="message" className={styles.form_label}>
                    Сообщение <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={cn(styles.form_textarea, { [styles.input_error]: errors.message })}
                    placeholder="Расскажите нам о вашем вопросе или предложении..."
                    rows={5}
                  />
                  {errors.message && <span className={styles.error_message}>{errors.message}</span>}
                </div>

                {submitStatus === 'success' && (
                  <div className={styles.success_message}>
                    ✓ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={styles.error_message_general}>
                    ✗ Произошла ошибка при отправке. Пожалуйста, попробуйте позже.
                  </div>
                )}

                <button
                  type="submit"
                  className={cn(styles.submit_button, {
                    [styles.button_loading]: isSubmitting
                  })}
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Отправка...' : 'Отправить сообщение'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
