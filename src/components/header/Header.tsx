import type { FC } from "react"
import styles from './Header.module.scss';

export const Header: FC = () => {

    return (
      <>
      <div className={styles.header}>
          <div className={styles.container}>
            <div className={styles.glitch} data-text="ДРОЙДЕК">ДРОЙДЕК</div>
            <div className={styles.glow}>ДРОЙДЕК</div>
            <p className={styles.subtitle}>PRACTICAL DEVELOPMENT</p>
          </div>
          <div className={styles.scanlines}></div>
      </div>
      </>
    );
}