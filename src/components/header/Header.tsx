import { type FC, useEffect, useRef } from "react"
import styles from './Header.module.scss';

export const Header: FC = () => {
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Случайный выбор варианта анимации при монтировании
    if (glitchRef.current) {
      const variant = Math.floor(Math.random() * 4) + 1;
      glitchRef.current.setAttribute('data-variant', variant.toString());
    }
  }, []);

    return (
      <>
      <div className={styles.header}>
          <div className={styles.container}>
            <div 
              ref={glitchRef}
              className={styles.glitch} 
              data-text="ДРОЙДЕК"
            >
              ДРОЙДЕК
            </div>
            <div className={styles.glow}>ДРОЙДЕК</div>
            <p className={styles.subtitle}>PRACTICAL DEVELOPMENT</p>
          </div>
          <div className={styles.scanlines}></div>
      </div>
      </>
    );
}