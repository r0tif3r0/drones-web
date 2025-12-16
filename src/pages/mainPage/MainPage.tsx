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
  const [sliderStyle, setSliderStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 });
  const tabContainerHeight = 70;
  const lastActiveRef = useRef<string | null>(null);

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

      if (newActiveId && newActiveId !== lastActiveRef.current) {
        lastActiveRef.current = newActiveId;
        setActiveId(newActiveId);
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c2617856-a908-4cbf-8d9f-ce50f9beef8c',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'pre-fix',
          hypothesisId:'A',
          location:'MainPage.tsx:handleScroll',
          message:'scroll processed',
          data:{scrollY,newActiveId,tabContainerHeight,heroTop:tabContainerRef.current?.parentElement?.offsetTop ?? null},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop - tabContainerHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c2617856-a908-4cbf-8d9f-ce50f9beef8c',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'B',
        location:'MainPage.tsx:handleTabClick',
        message:'tab click',
        data:{id,sectionFound:!!section},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
  };

  useEffect(() => {
    if (activeId && tabRefs.current[activeId]) {
      const el = tabRefs.current[activeId];
      if (el) {
        setSliderStyle({ width: el.offsetWidth, left: el.offsetLeft });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c2617856-a908-4cbf-8d9f-ce50f9beef8c',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            sessionId:'debug-session',
            runId:'pre-fix',
            hypothesisId:'C',
            location:'MainPage.tsx:sliderEffect',
            message:'slider updated',
            data:{activeId,width:el.offsetWidth,left:el.offsetLeft},
            timestamp:Date.now()
          })
        }).catch(()=>{});
        // #endregion
      }
    }
  }, [activeId]);

  return (
    <>
      <section className={styles.et_hero_tabs}>
        <Header/>
        <div
          className={styles.et_hero_tabs_container}
          ref={tabContainerRef}
          role="tablist"
          aria-label="Навигация по разделам"
        >
          {tabs.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              className={`${styles.et_hero_tab} ${activeId === id ? styles.active : ""}`}
              aria-current={activeId === id ? "page" : undefined}
              role="tab"
              onClick={(e) => handleTabClick(e, id)}
            >
              {title}
            </a>
          ))}
          <span
            className={styles.et_hero_tab_slider}
            style={{ width: `${sliderStyle.width}px`, left: `${sliderStyle.left}px` }}
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
