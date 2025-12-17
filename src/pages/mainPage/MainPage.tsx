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
  
  // Кэш для DOM элементов секций
  const sectionElementsRef = useRef<Record<string, HTMLElement | null>>({});
  // Кэш для размеров окна
  const windowSizeRef = useRef<{ width: number; height: number }>({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  const lastActiveRef = useRef<string | null>(null);

  const tabs = [
    { id: "tab-1", title: "Продукт", component: <ProductTab/> },
    { id: "tab-3", title: "Характеристики", component: <CharacteristicTab/> },
    { id: "tab-4", title: "О Команде", component: <AboutTeamTab/> },
    { id: "tab-5", title: "Контакты", component: <ContactsTab/> },
  ];

  useEffect(() => {
    // Функция для обновления кэша секций
    const updateSectionCache = () => {
      tabs.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          sectionElementsRef.current[id] = element;
        }
      });
    };

    // Кэшируем DOM элементы секций при монтировании
    updateSectionCache();
    
    // Обновляем кэш при изменении размера окна с debounce
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        windowSizeRef.current = { width, height };
        setIsMobile(width <= 600);
        
        if (width <= 600) {
          setTabContainerHeight(0); // На мобильных навбар скрыт
        } else if (width <= 800) {
          setTabContainerHeight(60);
        } else {
          setTabContainerHeight(70);
        }
        
        // Обновляем кэш секций после ресайза
        updateSectionCache();
        resizeTimeout = null;
      }, 150); // Debounce для resize
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  useEffect(() => {
    // Функция для обновления кэша секций
    const updateSectionCache = () => {
      tabs.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          sectionElementsRef.current[id] = element;
        }
      });
    };

    // Обновляем кэш секций перед созданием observer
    updateSectionCache();

    // Используем IntersectionObserver для определения активной секции
    const observerOptions = {
      root: null,
      rootMargin: `-${tabContainerHeight}px 0px -50% 0px`, // Учитываем высоту навбара и проверяем центр viewport
      threshold: [0, 0.1, 0.5, 1]
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Находим секцию с наибольшей видимостью в центре viewport
      let maxIntersection = 0;
      let newActiveId: string | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersection) {
          maxIntersection = entry.intersectionRatio;
          newActiveId = entry.target.id;
        }
      });

      // Если IntersectionObserver не определил активную секцию, используем fallback
      if (!newActiveId) {
        const scrollY = window.scrollY;
        const viewportCenter = scrollY + windowSizeRef.current.height / 2;
        const currentIsMobile = windowSizeRef.current.width <= 600;
        
        for (const { id } of tabs) {
          const section = sectionElementsRef.current[id];
          if (section) {
            const top = section.offsetTop - (currentIsMobile ? 0 : tabContainerHeight);
            const bottom = top + section.offsetHeight;
            if (viewportCenter >= top && viewportCenter < bottom) {
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
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Подписываемся на все секции
    tabs.forEach(({ id }) => {
      const section = sectionElementsRef.current[id];
      if (section) {
        observer.observe(section);
      }
    });

    // Fallback scroll handler с улучшенным throttling для случаев, когда IntersectionObserver не срабатывает
    let rafId: number | null = null;
    let throttleTimeout: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        // Дополнительный throttle через setTimeout для мобильных устройств
        if (throttleTimeout !== null) {
          clearTimeout(throttleTimeout);
        }

        // Динамически определяем задержку на основе текущего размера экрана
        const currentIsMobile = windowSizeRef.current.width <= 600;
        const THROTTLE_DELAY = currentIsMobile ? 150 : 50;

        throttleTimeout = window.setTimeout(() => {
          const scrollY = window.scrollY;
          
          if (currentIsMobile !== isMobile) {
            setIsMobile(currentIsMobile);
            if (!currentIsMobile) {
              setIsMobileMenuOpen(false);
            }
          }

          // Используем кэшированные элементы
          let newActiveId: string | null = null;
          const viewportCenter = scrollY + windowSizeRef.current.height / 2;

          for (const { id } of tabs) {
            const section = sectionElementsRef.current[id];
            if (section) {
              const top = section.offsetTop - (currentIsMobile ? 0 : tabContainerHeight);
              const bottom = top + section.offsetHeight;
              if (viewportCenter >= top && viewportCenter < bottom) {
                newActiveId = id;
                break;
              }
            }
          }

          if (newActiveId && newActiveId !== lastActiveRef.current) {
            lastActiveRef.current = newActiveId;
            setActiveId(newActiveId);
          }

          rafId = null;
          throttleTimeout = null;
        }, THROTTLE_DELAY);
      });
    };

    // Используем scroll handler только как fallback
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Инициализация

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (throttleTimeout !== null) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [isMobile, tabContainerHeight]);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    // Сразу устанавливаем активную секцию при клике для мгновенного обновления навбара
    setActiveId(id);
    lastActiveRef.current = id;
    
    // Используем кэшированный элемент
    const section = sectionElementsRef.current[id] || document.getElementById(id);
    if (section) {
      // Обновляем кэш, если элемент не был закэширован
      if (!sectionElementsRef.current[id]) {
        sectionElementsRef.current[id] = section;
      }
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
    // Используем кэшированный элемент
    const section = sectionElementsRef.current[id] || document.getElementById(id);
    if (section) {
      // Обновляем кэш, если элемент не был закэширован
      if (!sectionElementsRef.current[id]) {
        sectionElementsRef.current[id] = section;
      }
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
                  <h2>Дройдек</h2>
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
