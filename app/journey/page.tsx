'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { journeyUnits } from '@/data/journey'
import { useJourneyProgress } from '@/lib/journey-progress'
import styles from './page.module.css'

const copy = {
  en: { eyebrow: 'The Disciple Journey', title: 'Grow one faithful step at a time', intro: 'Stories, Scripture, lessons, practice, and missions now build on one another.', current: 'Current unit', locked: 'Complete the previous unit to open', complete: 'Unit complete', steps: 'steps', next: 'Next step', optional: 'Optional practice' },
  ru: { eyebrow: 'Путь ученика', title: 'Расти шаг за шагом в верности', intro: 'Истории, Писание, уроки, практика и миссии теперь связаны друг с другом.', current: 'Текущий раздел', locked: 'Заверши предыдущий раздел', complete: 'Раздел завершён', steps: 'шагов', next: 'Следующий шаг', optional: 'Дополнительная практика' },
}

export default function JourneyPage() {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const text = copy[lang]
  const progress = useJourneyProgress()

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className={styles.intro}>{text.intro}</p>

      <section className={styles.overall}>
        <div><strong>{progress.completedRequired}</strong><span>/ {progress.totalRequired} {text.steps}</span></div>
        <div className={styles.track}><i style={{ width: `${progress.totalRequired ? (progress.completedRequired / progress.totalRequired) * 100 : 0}%` }} /></div>
        {progress.nextStep && <Link href={`${progress.nextStep.href}?journey=1`}>{text.next}: {progress.nextStep.title[lang]} →</Link>}
      </section>

      <section className={styles.units}>
        {journeyUnits.map((unit, unitIndex) => {
          const state = progress.unitProgress[unitIndex]
          const isCurrent = unitIndex === progress.currentUnitIndex && state.unlocked && !state.complete
          return (
            <article key={unit.id} className={`${styles.unit} ${!state.unlocked ? styles.locked : ''} ${isCurrent ? styles.current : ''}`}>
              <div className={styles.unitHero}>
                <img src={unit.image} alt="" />
                <span aria-hidden="true" />
                <div>
                  <small>{state.complete ? text.complete : isCurrent ? text.current : `${state.completed}/${state.total} ${text.steps}`}</small>
                  <h2>{unit.title[lang]}</h2>
                  <p>{unit.truth[lang]}</p>
                </div>
              </div>

              {!state.unlocked ? (
                <p className={styles.lockedNote}>🔒 {text.locked}</p>
              ) : (
                <ol className={styles.stepList}>
                  {unit.steps.map((step, stepIndex) => {
                    const done = progress.completedIds.has(step.id)
                    const requiredBefore = unit.steps.slice(0, stepIndex).filter((candidate) => candidate.required !== false)
                    const accessible = step.required === false || requiredBefore.every((candidate) => progress.completedIds.has(candidate.id))
                    const content = (
                      <>
                        <span className={`${styles.stepState} ${done ? styles.done : ''}`}>{done ? '✓' : stepIndex + 1}</span>
                        <span><strong>{step.title[lang]}</strong><small>{step.required === false ? text.optional : step.kind}</small></span>
                        <em aria-hidden="true">›</em>
                      </>
                    )
                    return <li key={step.id}>{accessible ? <Link href={`${step.href}?journey=1`}>{content}</Link> : <div className={styles.blocked}>{content}</div>}</li>
                  })}
                </ol>
              )}
            </article>
          )
        })}
      </section>
    </main>
  )
}
