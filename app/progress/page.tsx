'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { journeyUnits } from '@/data/journey'
import { useJourneyProgress } from '@/lib/journey-progress'
import styles from './page.module.css'

const copy = {
  en: { eyebrow: 'Your journey', title: 'Faithful progress', intro: 'See the road behind you and the one clear step ahead.', units: 'Units completed', steps: 'Steps completed', next: 'Continue Journey', complete: 'Badge earned', current: 'In progress', locked: 'Locked', open: 'View unit' },
  ru: { eyebrow: 'Твой путь', title: 'Верный прогресс', intro: 'Посмотри пройденный путь и один ясный следующий шаг.', units: 'Разделов завершено', steps: 'Шагов завершено', next: 'Продолжить путь', complete: 'Значок получен', current: 'В процессе', locked: 'Закрыто', open: 'Открыть раздел' },
}

export default function ProgressPage() {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const text = copy[lang]
  const progress = useJourneyProgress()
  const completedUnits = progress.unitProgress.filter((unit) => unit.complete).length

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className={styles.intro}>{text.intro}</p>

      <section className={styles.summary} aria-label={text.title}>
        <div><strong>{completedUnits}/{journeyUnits.length}</strong><span>{text.units}</span></div>
        <div><strong>{progress.completedRequired}/{progress.totalRequired}</strong><span>{text.steps}</span></div>
        <Link href={progress.nextStep ? `${progress.nextStep.href}?journey=1` : '/journey'}><strong>→</strong><span>{text.next}</span></Link>
      </section>

      <section className={styles.grid}>
        {journeyUnits.map((unit, index) => {
          const state = progress.unitProgress[index]
          const label = state.complete ? text.complete : state.unlocked ? text.current : text.locked
          return (
            <Link key={unit.id} href="/journey" className={`${styles.card} ${!state.unlocked ? styles.locked : ''}`} aria-disabled={!state.unlocked || undefined}>
              <img src={unit.image} alt="" />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.copy}>
                <small>{label}</small>
                <strong>{unit.title[lang]}</strong>
                <span className={styles.cardBottom}>
                  <span>{state.completed}/{state.total}</span>
                  <em>{state.unlocked ? `${text.open} →` : '🔒'}</em>
                </span>
              </span>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
