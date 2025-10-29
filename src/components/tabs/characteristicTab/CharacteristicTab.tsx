import type { FC } from "react"
import styles from './CharacteristicTab.module.scss';

export const CharacteristicTab: FC = () => {

    return (
      <>
        <div className={styles.gradient}>
          <h1>Характеристики</h1>
          <h3>Самые передовые</h3>
        </div>
      </>
    );
}