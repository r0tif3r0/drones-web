import { type FC, useEffect, useRef, useState } from "react"
import styles from './AboutTeamTab.module.scss';
import cn from 'classnames';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  initials: string;
  color: 'primary' | 'secondary' | 'primary-variant';
}

const teamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Мария Репина',
    role: 'Team Lead',
    description: 'Руководитель проекта, отвечает за общую координацию команды и стратегическое планирование разработки дрона-поводыря.',
    initials: 'МР',
    color: 'primary'
  },
  {
    id: 'member-2',
    name: 'Кирилл Марков',
    role: 'Software Developer',
    description: 'Разработчик программного обеспечения, создает алгоритмы обработки данных с датчиков и систему управления дроном.',
    initials: 'КМ',
    color: 'secondary'
  },
  {
    id: 'member-3',
    name: 'Анастасия Григорьева',
    role: 'Hardware Engineer',
    description: 'Специалист по разработке аппаратной части, проектированию датчиков и интеграции систем навигации.',
    initials: 'АГ',
    color: 'primary-variant'
  }
];

export const AboutTeamTab: FC = () => {
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
            <h1 className={styles.title}>О Команде</h1>
            <p className={styles.subtitle}>Знакомьтесь с нашими специалистами, которые создают будущее</p>
          </div>
          
          <div className={styles.cards_grid}>
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                id={member.id}
                ref={(el) => {
                  cardRefs.current[member.id] = el;
                }}
                className={cn(
                  styles.card,
                  styles[`card_${member.color}`],
                  styles.fade_in_up,
                  { [styles.visible]: visibleCards.has(member.id) }
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.card_avatar}>
                  <div className={styles.avatar_circle}>
                    <span className={styles.avatar_initials}>{member.initials}</span>
                  </div>
                  <div className={styles.avatar_glow}></div>
                </div>
                <div className={styles.card_content}>
                  <h3 className={styles.card_name}>{member.name}</h3>
                  <div className={styles.card_role}>{member.role}</div>
                  <p className={styles.card_description}>{member.description}</p>
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