'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { lessonTopics } from '@/data/lessons'
import { lessonTopicsRu } from '@/data/lessons-ru'
import { useAppLessonProgress } from '@/lib/app-progress'
import styles from './page.module.css'

const copy = {
  en: { eyebrow: 'Your journey', title: 'Faithful progress', intro: 'See what you finished, celebrate what you learned, and choose one clear next step.', lessons: 'Lessons completed', stars: 'Stars earned', next: 'Continue next', complete: 'Completed', begin: 'Not started', open: 'Open lesson' },
  ru: { eyebrow: 'Твой путь', title: 'Верный прогресс', intro: 'Посмотри, что завершено, порадуйся изученному и выбери один ясный следующий шаг.', lessons: 'Уроков завершено', stars: 'Звёзд заработано', next: 'Продолжить', complete: 'Завершено', begin: 'Не начато', open: 'Открыть урок' },
}

export default function ProgressPage() {
  const { language } = useLanguage()
  const text = copy[language]
  const topics = language === 'ru' ? lessonTopicsRu : lessonTopics
  const progress = useAppLessonProgress()
  const lastIndex = lessonTopics.findIndex((topic) => topic.href === progress.lastLesson)
  const nextLesson = topics[lastIndex >= 0 ? lastIndex : 0]

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className={styles.intro}>{text.intro}</p>

      <section className={styles.summary} aria-label={text.title}>
        <div><strong>{progress.completedLessons}</strong><span>{text.lessons}</span></div>
        <div><strong>{progress.totalStars}</strong><span>{text.stars}</span></div>
        <Link href={nextLesson.href}><strong>→</strong><span>{text.next}</span></Link>
      </section>

      <section className={styles.grid}>
        {topics.map((topic) => {
          const stars = progress.starsByHref[topic.href] ?? 0
          return (
            <Link key={topic.href} href={topic.href} className={styles.card}>
              <img src={topic.image || '/images/jr/lessons-hero.png'} alt="" />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.copy}>
                <small>{stars ? text.complete : text.begin}</small>
                <strong>{topic.title}</strong>
                <span className={styles.cardBottom}>
                  <span className={styles.stars} aria-label={`${stars} of 3 stars`}>
                    {[1, 2, 3].map((star) => <span key={star} className={stars >= star ? styles.earned : ''}>★</span>)}
                  </span>
                  <em>{text.open} →</em>
                </span>
              </span>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
