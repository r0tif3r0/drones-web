import type { FC } from "react"
import styles from './ContactsTab.module.scss';

export const ContactsTab: FC = () => {

    return (
      <>
      <div className={styles.gradient}>
        <h1>Контакты</h1>
        <h3>Самые контачные</h3>
      </div>
      </>
    );
}