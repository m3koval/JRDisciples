'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { journeyUnits } from '@/data/journey'
import { useJourneyProgress } from '@/lib/journey-progress'
import styles from './page.module.css'

const copy = {
  en: { eyebrow: 'Practice what you learned', title: 'Practice with purpose', intro: 'These activities reinforce your current and completed journey units. Practice never replaces the next faithful step.', current: 'Current unit', replay: 'Practice again', none: 'Complete the first journey step to open matched practice.' },
  ru: { eyebrow: 'Закрепляй изученное', title: 'Практика со смыслом', intro: 'Эти задания укрепляют текущие и завершённые разделы пути. Практика не заменяет следующий верный шаг.', current: 'Текущий раздел', replay: 'Повторить', none: 'Заверши первый шаг пути, чтобы открыть подходящую практику.' },
}

export default function PracticePage() {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const text = copy[lang]
  const progress = useJourneyProgress()
  const availableUnits = journeyUnits.filter((_, index) => progress.unitProgress[index].unlocked)
  const practice = availableUnits.flatMap((unit, unitIndex) => unit.steps
    .filter((step) => ['scripture', 'practice', 'check', 'game'].includes(step.kind))
    .map((step) => ({ ...step, unit, unitIndex })))

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className={styles.intro}>{text.intro}</p>
      {practice.length === 0 ? <p className={styles.empty}>{text.none}</p> : (
        <section className={styles.grid}>
          {practice.map((item) => (
            <Link key={item.id} href={item.href} className={styles.card}>
              <img src={item.unit.image} alt="" />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.copy}>
                <small>{item.unitIndex === progress.currentUnitIndex ? text.current : item.unit.title[lang]}</small>
                <strong>{item.title[lang]}</strong>
                <em>{text.replay} →</em>
              </span>
            </Link>
          ))}
        </section>
      )}
    </main>
  )
}
