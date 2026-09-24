'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { allJourneySteps, journeyUnits } from '@/data/journey'
import { useJourneyProgress } from '@/lib/journey-progress'
import styles from './AppHome.module.css'

const copy = {
  en: {
    eyebrow: 'Today', title: 'One faithful step at a time', journey: 'Disciple Journey',
    next: 'Your next step', begin: 'Begin step', continue: 'Continue', unit: 'Unit', of: 'of',
    journeyProgress: 'Journey progress', complete: 'required steps complete',
    scripture: 'Truth for today', upcoming: 'Coming next', path: 'View the full Journey', explore: 'Explore the optional library',
  },
  ru: {
    eyebrow: 'Сегодня', title: 'Один верный шаг за другим', journey: 'Путь ученика',
    next: 'Твой следующий шаг', begin: 'Начать шаг', continue: 'Продолжить', unit: 'Раздел', of: 'из',
    journeyProgress: 'Прогресс пути', complete: 'обязательных шагов завершено',
    scripture: 'Истина на сегодня', upcoming: 'Дальше по пути', path: 'Открыть весь Путь', explore: 'Открыть дополнительную библиотеку',
  },
}

export default function AppHome() {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const text = copy[lang]
  const progress = useJourneyProgress()
  const unit = journeyUnits[progress.currentUnitIndex] ?? journeyUnits[0]
  const next = progress.nextStep ?? allJourneySteps[allJourneySteps.length - 1]
  const nextIndex = allJourneySteps.findIndex((step) => step.id === next.id)
  const upcoming = allJourneySteps.slice(nextIndex + 1).filter((step) => step.required !== false).slice(0, 3)
  const percent = progress.totalRequired ? (progress.completedRequired / progress.totalRequired) * 100 : 0

  return (
    <main className={styles.home}>
      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <h1>{text.title}</h1>
        </div>
        <Link href="/journey" className={styles.unitChip}>
          <strong>{progress.currentUnitIndex + 1}</strong>
          <span>{text.unit} {text.of} {journeyUnits.length}</span>
        </Link>
      </section>

      <div className={styles.dashboard}>
        <Link href={`${next.href}?journey=1`} className={styles.continueCard}>
          <Image src={unit.image} alt="" fill sizes="(max-width: 620px) 100vw, 50vw" />
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.continueCopy}>
            <span className={styles.cardLabel}>{text.next}</span>
            <small>{unit.title[lang]}</small>
            <strong>{next.title[lang]}</strong>
            <span className={styles.lessonMeta}>
              <span>{text.journey}</span>
              <span>{progress.unitProgress[progress.currentUnitIndex]?.completed ?? 0}/{progress.unitProgress[progress.currentUnitIndex]?.total ?? 0}</span>
            </span>
            <span className={styles.primaryAction}>{text.begin} →</span>
          </span>
        </Link>

        <aside className={styles.sideColumn}>
          <Link href="/journey" className={styles.panel}>
            <span className={styles.panelLabel}>{text.journeyProgress}</span>
            <strong>{progress.completedRequired} / {progress.totalRequired}</strong>
            <span>{text.complete}</span>
            <span className={styles.progressTrack}><i style={{ width: `${percent}%` }} /></span>
          </Link>
          <div className={`${styles.panel} ${styles.versePanel}`}>
            <span className={styles.panelLabel}>{text.scripture}</span>
            <strong>{unit.truth[lang]}</strong>
          </div>
        </aside>
      </div>

      <section className={styles.upcomingSection}>
        <div className={styles.sectionHeading}>
          <h2>{text.upcoming}</h2>
          <Link href="/journey">{text.path}</Link>
        </div>
        <ol className={styles.upcomingList}>
          {upcoming.map((step, index) => (
            <li key={step.id}>
              <span>{index + 2}</span>
              <div><strong>{step.title[lang]}</strong><small>{journeyUnits[step.unitIndex].title[lang]}</small></div>
            </li>
          ))}
        </ol>
        <Link href="/explore" className={styles.exploreLink}>{text.explore} →</Link>
      </section>
    </main>
  )
}
