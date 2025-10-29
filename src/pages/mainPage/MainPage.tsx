import { type FC, useEffect, useRef, useState } from "react";
import styles from "./MainPage.module.scss";
import { Header } from "../../components/header/Header";

import { ProductTab } from "../../components/tabs/productTab/ProductTab";
import { CharacteristicTab } from "../../components/tabs/characteristicTab/CharacteristicTab";
import { ContactsTab } from "../../components/tabs/contactsTab/ContactsTab";
import { AboutTeamTab } from "../../components/tabs/adoutTeamTab/AdoutTeamTab";

export const MainPage: FC = () => {
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, setSliderStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 });
  const tabContainerHeight = 70;

  const tabs = [
    { id: "tab-1", title: "Продукт", component: <ProductTab/> },
    { id: "tab-3", title: "Характеристики", component: <CharacteristicTab/> },
    { id: "tab-4", title: "О Команде", component: <AboutTeamTab/> },
    { id: "tab-5", title: "Контакты", component: <ContactsTab/> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (tabContainerRef.current) {
        const heroSection = tabContainerRef.current.parentElement;
        const heroTop = heroSection?.offsetTop ?? 0;
        const heroHeight = heroSection?.clientHeight ?? 0;
        const offset = heroTop + heroHeight - tabContainerHeight;

        if (scrollY > offset) {
          tabContainerRef.current.classList.add(styles["et_hero_tabs_container__top"]);
        } else {
          tabContainerRef.current.classList.remove(styles["et_hero_tabs_container__top"]);
        }
      }

      let newActiveId: string | null = null;
      tabs.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - tabContainerHeight;
          const bottom = top + section.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            newActiveId = id;
          }
        }
      });

      if (newActiveId !== activeId && newActiveId) {
        setActiveId(newActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeId]);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop - tabContainerHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (activeId && tabRefs.current[activeId]) {
      const el = tabRefs.current[activeId];
      if (el) {
        setSliderStyle({ width: el.offsetWidth, left: el.offsetLeft });
      }
    }
  }, [activeId]);

  return (
    <>
      <section className={styles.et_hero_tabs}>
        <Header/>
        <div className={styles.et_hero_tabs_container} ref={tabContainerRef}>
          {tabs.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              className={`${styles.et_hero_tab} ${activeId === id ? styles.active : ""}`}
              onClick={(e) => handleTabClick(e, id)}
            >
              {title}
            </a>
          ))}
          <span
            className={styles.et_hero_tab_slider}
          ></span>
        </div>
      </section>

      <main className={styles.et_main}>
        {tabs.map(({ id, component }) => (
          <section key={id} className={styles.et_slide} id={id}>
            {component}
          </section>
        ))}
      </main>
    </>
  );
};
