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
  const [tabContainerHeight, setTabContainerHeight] = useState(70);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const updateTabHeight = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      
      if (width <= 600) {
        setTabContainerHeight(0); // На мобильных навбар скрыт
      } else if (width <= 800) {
        setTabContainerHeight(60);
      } else {
        setTabContainerHeight(70);
      }
    };
    
    updateTabHeight();
    window.addEventListener('resize', updateTabHeight);
    return () => window.removeEventListener('resize', updateTabHeight);
  }, []);
  const lastActiveRef = useRef<string | null>(null);

  const tabs = [
    { id: "tab-1", title: "Продукт", component: <ProductTab/> },
    { id: "tab-3", title: "Характеристики", component: <CharacteristicTab/> },
    { id: "tab-4", title: "О Команде", component: <AboutTeamTab/> },
    { id: "tab-5", title: "Контакты", component: <ContactsTab/> },
  ];

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Throttle через requestAnimationFrame для лучшей производительности
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Обновляем состояние мобильного устройства
        const currentIsMobile = window.innerWidth <= 600;
        if (currentIsMobile !== isMobile) {
          setIsMobile(currentIsMobile);
          // Закрываем меню при изменении размера экрана
          if (!currentIsMobile) {
            setIsMobileMenuOpen(false);
          }
        }

        // Убрана логика переключения классов для sticky навбара

        // Оптимизированная логика определения активной секции
        // Проверяем секции в обратном порядке при скролле вниз для более быстрого определения
        const scrollingDown = scrollY > lastScrollY;
        lastScrollY = scrollY;

        let newActiveId: string | null = null;
        
        // Если скроллим вниз, проверяем секции в обратном порядке
        const tabsToCheck = scrollingDown ? [...tabs].reverse() : tabs;
        
        for (const { id } of tabsToCheck) {
          const section = document.getElementById(id);
          if (section) {
            const top = section.offsetTop - (isMobile ? 0 : tabContainerHeight);
            const bottom = top + section.offsetHeight;
            // Используем более точную проверку с учетом центра viewport
            const viewportCenter = scrollY + window.innerHeight / 2;
            if (viewportCenter >= top && viewportCenter < bottom) {
              newActiveId = id;
              break; // Прерываем цикл, как только нашли подходящую секцию
            }
          }
        }

        // Если не нашли по центру viewport, используем стандартную логику
        if (!newActiveId) {
          for (const { id } of tabs) {
            const section = document.getElementById(id);
            if (section) {
              const top = section.offsetTop - (isMobile ? 0 : tabContainerHeight);
              const bottom = top + section.offsetHeight;
              if (scrollY >= top && scrollY < bottom) {
                newActiveId = id;
                break;
              }
            }
          }
        }

        if (newActiveId && newActiveId !== lastActiveRef.current) {
          lastActiveRef.current = newActiveId;
          setActiveId(newActiveId);
        }
        
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile, tabContainerHeight, isMobileMenuOpen]);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    // Сразу устанавливаем активную секцию при клике для мгновенного обновления навбара
    setActiveId(id);
    lastActiveRef.current = id;
    
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop - (isMobile ? 0 : tabContainerHeight) + 1;
      window.scrollTo({ top, behavior: "smooth" });
      setIsMobileMenuOpen(false); // Закрываем меню после клика
    }
  };
  
  const handleMobileMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleMobileNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop;
      window.scrollTo({ top, behavior: "smooth" });
      setIsMobileMenuOpen(false);
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
      </section>
      
      {/* Десктопная навигация - вынесена за пределы секции для sticky */}
      {!isMobile && (
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
            style={{ 
              width: `${sliderStyle.width}px`, 
              left: `${sliderStyle.left + sliderStyle.width / 2}px` 
            }}
          ></span>
        </div>
      )}

      {/* Мобильная навигация - FAB с меню */}
      {isMobile && (
        <>
          <button
            className={`${styles.mobile_fab} ${isMobileMenuOpen ? styles.mobile_fab_open : ""}`}
            onClick={handleMobileMenuToggle}
            aria-label="Открыть меню навигации"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.mobile_fab_icon}>
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
          
          {isMobileMenuOpen && (
            <div 
              className={styles.mobile_menu_overlay} 
              onClick={(e) => {
                // Не закрываем меню, если клик был на FAB
                const target = e.target as HTMLElement;
                if (!target.closest(`.${styles.mobile_fab}`)) {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              <nav 
                className={styles.mobile_menu}
                onClick={(e) => e.stopPropagation()}
                role="navigation"
                aria-label="Мобильная навигация"
              >
                <div className={styles.mobile_menu_header}>
                  <h2>Навигация</h2>
                </div>
                <ul className={styles.mobile_menu_list}>
                  {tabs.map(({ id, title }) => (
                    <li key={id}>
                      <button
                        className={`${styles.mobile_menu_item} ${activeId === id ? styles.mobile_menu_item_active : ""}`}
                        onClick={() => handleMobileNavClick(id)}
                        aria-current={activeId === id ? "page" : undefined}
                      >
                        <span className={styles.mobile_menu_item_text}>{title}</span>
                        {activeId === id && (
                          <span className={styles.mobile_menu_item_indicator}>●</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

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
