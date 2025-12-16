import { type FC, useEffect, useRef, useState } from "react"
import styles from './CharacteristicTab.module.scss';
import cn from 'classnames';

interface Characteristic {
  id: string;
  icon: string;
  title: string;
  value: string;
  description: string;
  color: 'primary' | 'secondary' | 'primary-variant';
}

const characteristics: Characteristic[] = [
  {
    id: 'range',
    icon: '📡',
    title: 'Дальность действия',
    value: 'до 50 м',
    description: 'Эффективная дальность обнаружения препятствий с высокой точностью',
    color: 'primary'
  },
  {
    id: 'speed',
    icon: '⚡',
    title: 'Скорость полета',
    value: 'до 15 м/с',
    description: 'Оптимальная скорость для комфортного сопровождения пользователя',
    color: 'secondary'
  },
  {
    id: 'battery',
    icon: '🔋',
    title: 'Время работы',
    value: 'до 18 мин',
    description: 'Продолжительность автономной работы на одном заряде',
    color: 'primary-variant'
  },
  {
    id: 'weight',
    icon: '⚖️',
    title: 'Вес',
    value: 'менее 150 г',
    description: 'Легкий и компактный дизайн для удобства транспортировки',
    color: 'primary'
  },
  {
    id: 'sensors',
    icon: '👁️',
    title: 'Система датчиков',
    value: 'AI-камеры',
    description: 'Комплексная система трехмерного сканирования пространства',
    color: 'secondary'
  },
  {
    id: 'connectivity',
    icon: '📶',
    title: 'Связь',
    value: 'Wi-Fi + Bluetooth',
    description: 'Надежное беспроводное соединение с мобильным приложением',
    color: 'primary-variant'
  },
  {
    id: 'accuracy',
    icon: '🎯',
    title: 'Точность',
    value: '±5 см',
    description: 'Высокая точность определения расстояния до препятствий',
    color: 'primary'
  },
  {
    id: 'weather',
    icon: '🌦️',
    title: 'Устойчивость к ветру',
    value: 'до 8 м/с',
    description: 'Способен выдержать скорость ветра до 8 м/с',
    color: 'secondary'
  }
];

export const CharacteristicTab: FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

    // Observe all cards after a short delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      Object.values(cardRefs.current).forEach(ref => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

    return (
      <>
        <div className={styles.gradient}>
          <div className={styles.content_wrapper}>
            <div className={styles.header}>
              <h1 className={styles.title}>Характеристики</h1>
              <p className={styles.subtitle}>Технические параметры дрона-поводыря</p>
            </div>
            
            <div className={styles.cards_grid}>
              {characteristics.map((char, index) => (
                <div
                  key={char.id}
                  id={char.id}
                  ref={(el) => {
                    cardRefs.current[char.id] = el;
                  }}
                  className={cn(
                    styles.card,
                    styles[`card_${char.color}`],
                    styles.fade_in_up,
                    { [styles.visible]: visibleCards.has(char.id) }
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={styles.card_icon}>{char.icon}</div>
                  <div className={styles.card_content}>
                    <h3 className={styles.card_title}>{char.title}</h3>
                    <div className={styles.card_value}>{char.value}</div>
                    <p className={styles.card_description}>{char.description}</p>
                  </div>
                  <div className={styles.card_glow}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
}