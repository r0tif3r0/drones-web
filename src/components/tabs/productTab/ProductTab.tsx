import { type FC, useEffect, useState, useRef, useMemo } from "react"
import styles from './ProductTab.module.scss';
import cn from 'classnames';
import { Hyperspeed } from "../../backgrounds/hyperspeed/Hyperspeed";

export const ProductTab: FC = () => {
  const [allowMotion, setAllowMotion] = useState(true);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);

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
    if (!allowMotion) return;

    // Отключаем parallax на мобильных для лучшей производительности
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Throttle using requestAnimationFrame
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Skip if scroll hasn't changed significantly (performance optimization)
        if (Math.abs(scrollY - lastScrollY) < 1) {
          rafId = null;
          return;
        }
        
        lastScrollY = scrollY;
        
        const heroSection = document.getElementById('tab-1');
        if (!heroSection) {
          rafId = null;
          return;
        }

        const sectionTop = heroSection.offsetTop;
        const sectionHeight = heroSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within the section
        const scrollProgress = Math.min(
          Math.max((scrollY + viewportHeight - sectionTop) / (sectionHeight + viewportHeight), 0),
          1
        );

        // Apply parallax effect using transform for better performance (with GPU acceleration)
        if (firstCardRef.current) {
          const parallaxOffset = (scrollProgress - 0.5) * 40;
          firstCardRef.current.style.transform = `translateY(${parallaxOffset}px) translateZ(0)`;
        }

        if (secondCardRef.current) {
          const parallaxOffset = (scrollProgress - 0.5) * -40;
          secondCardRef.current.style.transform = `translateY(${parallaxOffset}px) translateZ(0)`;
        }
        
        rafId = null;
      });
    };

    // Initial call
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [allowMotion]);

  // Мемоизируем effectOptions, чтобы избежать пересоздания Hyperspeed при каждом рендере
  const hyperspeedOptions = useMemo(() => ({
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion' as const,
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
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],
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
  }), []);

    return (
      <>
        <div className={styles.gradient}>
          <div className={styles.background}>
          {allowMotion && (
            <Hyperspeed
              effectOptions={hyperspeedOptions}
            />
          )}
          </div>
          <div className={styles.content_wrapper}>
            <div 
              ref={firstCardRef}
              className={styles.glowing_border}
            >
              <h1 className={styles.title}>О ПРОЕКТЕ</h1>
              <p className={styles.description}>Наш проект "Дрон-поводырь" — это инновационный шаг в области вспомогательных технологий. Мы создаем аппаратно-программный комплекс, призванный кардинально улучшить мобильность и качество жизни незрячих и слабовидящих людей.</p>
            </div>
            <div 
              ref={secondCardRef}
              className={cn(
                styles.glowing_border,
                styles.right
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