import type { FC } from "react"
import styles from './AboutTeamTab.module.scss';

export const AboutTeamTab: FC = () => {

    return (
      <>
        <div className={styles.gradient}>
          <h1>Команда</h1>
          <h3>Ну такая</h3>
        </div>
      </>
    );
}