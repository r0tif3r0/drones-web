import { type FC, useEffect, useState, useRef } from "react"
import styles from './ProductTab.module.scss';
import cn from 'classnames';
import { Hyperspeed } from "../../backgrounds/hyperspeed/Hyperspeed";

export const ProductTab: FC = () => {
  const [allowMotion, setAllowMotion] = useState(true);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const [isFirstVisible, setIsFirstVisible] = useState(false);
  const [isSecondVisible, setIsSecondVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setAllowMotion(!(media?.matches));
    };

    updateMotionPreference();

    if (media?.addEventListener) {
      media.addEventListener("change", updateMotionPreference);
      return () => media.removeEventListener("change", updateMotionPreference);
    }

    return undefined;
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === firstCardRef.current) {
            setIsFirstVisible(true);
          } else if (entry.target === secondCardRef.current) {
            setIsSecondVisible(true);
          }
        }
      });
    }, observerOptions);

    if (firstCardRef.current) {
      observer.observe(firstCardRef.current);
    }
    if (secondCardRef.current) {
      observer.observe(secondCardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!allowMotion) return;
    
    // Отключаем parallax на мобильных для лучшей производительности
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById('tab-1');
      if (!heroSection) return;

      const sectionTop = heroSection.offsetTop;
      const sectionHeight = heroSection.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress within the section
      const scrollProgress = Math.min(
        Math.max((scrollY + viewportHeight - sectionTop) / (sectionHeight + viewportHeight), 0),
        1
      );

      // Apply parallax effect using CSS custom properties (reduced on mobile)
      if (firstCardRef.current) {
        const parallaxOffset = (scrollProgress - 0.5) * 40;
        firstCardRef.current.style.setProperty('--parallax-y', `${parallaxOffset}px`);
      }

      if (secondCardRef.current) {
        const parallaxOffset = (scrollProgress - 0.5) * -40;
        secondCardRef.current.style.setProperty('--parallax-y', `${parallaxOffset}px`);
      }
    };

    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allowMotion]);

    return (
      <>
        <div className={styles.gradient}>
          <div className={styles.background}>
          {allowMotion && (
            <Hyperspeed
              effectOptions={{
                onSpeedUp: () => { },
                onSlowDown: () => { },
                distortion: 'turbulentDistortion',
                length: 400,
                roadWidth: 10,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.03, 400 * 0.2],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0xFFFFFF,
                  brokenLines: 0xFFFFFF,
                  leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                  rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                  sticks: 0x03B3C3,
                }
              }}
            />
          )}
          </div>
          <div className={styles.content_wrapper}>
            <div 
              ref={firstCardRef}
              className={cn(
                styles.glowing_border,
                styles.fade_in_up,
                { [styles.visible]: isFirstVisible }
              )}
            >
              <h1 className={styles.title}>О ПРОЕКТЕ</h1>
              <p className={styles.description}>Наш проект "Дрон-поводырь" — это инновационный шаг в области вспомогательных технологий. Мы создаем аппаратно-программный комплекс, призванный кардинально улучшить мобильность и качество жизни незрячих и слабовидящих людей.</p>
            </div>
            <div 
              ref={secondCardRef}
              className={cn(
                styles.glowing_border,
                styles.right,
                styles.fade_in_up,
                { [styles.visible]: isSecondVisible }
              )}
            >
              <h1 className={styles.title}>Какую проблему мы решаем?</h1>
              <p className={styles.description}>Традиционные средства, такие как трость или собака-поводырь, имеют ограничения. Трость не предупреждает о препятствиях на уровне головы и туловища, а содержание собаки-поводыря требует значительных ресурсов. Наш дрон решает эту проблему, предоставляя трехмерное сканирование пространства и заблаговременное предупреждение о препятствиях с помощью звуковой обратной связи. Наш прототип — это первый шаг к тому, чтобы сделать передвижение по городу безопасным и независимым для каждого.</p>
            </div>
          </div>
        </div>
      </>
    );
}