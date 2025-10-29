import type { FC } from "react"
import styles from './ProductTab.module.scss';
import cn from 'classnames';
import { Hyperspeed } from "../../backgrounds/hyperspeed/Hyperspeed";

export const ProductTab: FC = () => {

    return (
      <>
        <div className={styles.gradient}>
          <div className={styles.background}>
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => { },
              onSlowDown: () => { },
              distortion: 'turbulentDistortion',
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
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
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
            }}
          />
          </div>
          <div className={styles.product_info}>
            <div className={styles.glowing_border}>
              <h1 className={styles.title}>О ПРОЕКТЕ</h1>
              <p>Наш проект "Дрон-поводырь" — это инновационный шаг в области вспомогательных технологий. Мы создаем аппаратно-программный комплекс, призванный кардинально улучшить мобильность и качество жизни незрячих и слабовидящих людей.</p>
            </div>
          </div>
          <div className={cn(styles.glowing_border, styles.right)}>
            <h1 className={styles.title}>Какую проблему мы решаем?</h1>
            <p>Традиционные средства, такие как трость или собака-поводырь, имеют ограничения. Трость не предупреждает о препятствиях на уровне головы и туловища, а содержание собаки-поводыря требует значительных ресурсов. Наш дрон решает эту проблему, предоставляя трехмерное сканирование пространства и заблаговременное предупреждение о препятствиях с помощью звуковой обратной связи. Наш прототип — это первый шаг к тому, чтобы сделать передвижение по городу безопасным и независимым для каждого.</p>
          </div>
        </div>
      </>
    );
}