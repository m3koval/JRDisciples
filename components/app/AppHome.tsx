'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { lessonTopics } from '@/data/lessons'
import { lessonTopicsRu } from '@/data/lessons-ru'
import { useAppLessonProgress } from '@/lib/app-progress'
import styles from './AppHome.module.css'

const copy = {
  en: {
    eyebrow: 'Welcome back', title: 'Your next faithful step', stars: 'stars earned',
    continueLabel: 'Continue your lesson', continue: 'Continue', start: 'Start', completed: 'Completed',
    choose: 'Choose your next step', all: 'See all',
    learn: 'Meet Jesus', learnDesc: 'Stories and Bible lessons',
    quest: 'Start a Quest', questDesc: 'Faith adventures',
    play: 'Play & Practice', playDesc: 'Games and puzzles',
    remember: 'Remember Truth', rememberDesc: 'Scripture memory',
    today: 'Today’s Scripture', practice: 'Practice',
    verse: '“Trust in the LORD with all your heart, and do not lean on your own understanding.”',
    reference: 'Proverbs 3:5 · ESV', progress: 'Your progress', lessons: 'lessons completed',
  },
  ru: {
    eyebrow: 'С возвращением', title: 'Твой следующий верный шаг', stars: 'звёзд заработано',
    continueLabel: 'Продолжи урок', continue: 'Продолжить', start: 'Начать', completed: 'Завершено',
    choose: 'Выбери следующий шаг', all: 'Показать всё',
    learn: 'Узнавай Иисуса', learnDesc: 'Истории и библейские уроки',
    quest: 'Начни квест', questDesc: 'Приключения веры',
    play: 'Играй и учись', playDesc: 'Игры и головоломки',
    remember: 'Запоминай истину', rememberDesc: 'Стихи из Писания',
    today: 'Писание на сегодня', practice: 'Повторить',
    verse: '«Надейся на Господа всем сердцем твоим, и не полагайся на разум твой».',
    reference: 'Притчи 3:5 · Синодальный перевод', progress: 'Твой прогресс', lessons: 'уроков завершено',
  },
}

export default function AppHome() {
  const { language } = useLanguage()
  const text = copy[language]
  const topics = language === 'ru' ? lessonTopicsRu : lessonTopics
  const progress = useAppLessonProgress()
  const selectedIndex = lessonTopics.findIndex((topic) => topic.href === progress.lastLesson)
  const lesson = topics[selectedIndex >= 0 ? selectedIndex : 0]
  const lessonStars = progress.starsByHref[lesson.href] ?? 0

  const actions = [
    { href: '/lessons', icon: '✦', title: text.learn, desc: text.learnDesc, color: '#0d5f7c' },
    { href: '/quests', icon: '◇', title: text.quest, desc: text.questDesc, color: '#2f6a2d' },
    { href: '/games', icon: '▶', title: text.play, desc: text.playDesc, color: '#8a4d08' },
    { href: '/memory', icon: '⌁', title: text.remember, desc: text.rememberDesc, color: '#5b3f8f' },
  ]

  return (
    <main className={styles.home}>
      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <h1>{text.title}</h1>
        </div>
        <div className={styles.starTotal} aria-label={`${progress.totalStars} ${text.stars}`}>
          <span aria-hidden="true">★</span>
          <strong>{progress.totalStars}</strong>
          <small>{text.stars}</small>
        </div>
      </section>

      <div className={styles.dashboard}>
        <Link href={lesson.href} className={styles.continueCard}>
          <img src={lesson.image || '/images/jr/lessons-hero.png'} alt="" />
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.continueCopy}>
            <span className={styles.cardLabel}>{text.continueLabel}</span>
            <strong>{lesson.title}</strong>
            <span className={styles.lessonMeta}>
              <span>{lesson.sections} {language === 'ru' ? 'шагов' : 'steps'}</span>
              <span className={styles.stars} aria-label={`${lessonStars} of 3 stars`}>
                {[1, 2, 3].map((star) => <span key={star} className={lessonStars >= star ? styles.earned : ''}>★</span>)}
              </span>
            </span>
            <span className={styles.primaryAction}>{lessonStars ? text.continue : text.start} →</span>
          </span>
        </Link>

        <aside className={styles.sideColumn}>
          <Link href="/memory/proverbs-3-5-6" className={`${styles.panel} ${styles.versePanel}`}>
            <span className={styles.panelLabel}>{text.today}</span>
            <strong>{text.verse}</strong>
            <span>{text.reference}</span>
            <em>{text.practice} →</em>
          </Link>
          <Link href="/progress" className={styles.panel}>
            <span className={styles.panelLabel}>{text.progress}</span>
            <strong>{progress.completedLessons} / {topics.length}</strong>
            <span>{text.lessons}</span>
            <span className={styles.progressTrack}><i style={{ width: `${Math.round((progress.completedLessons / topics.length) * 100)}%` }} /></span>
          </Link>
        </aside>
      </div>

      <section className={styles.actionsSection}>
        <div className={styles.sectionHeading}>
          <h2>{text.choose}</h2>
          <Link href="/lessons">{text.all}</Link>
        </div>
        <div className={styles.actionGrid}>
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className={styles.actionCard} style={{ '--accent': action.color } as React.CSSProperties}>
              <span className={styles.actionIcon} aria-hidden="true">{action.icon}</span>
              <span><strong>{action.title}</strong><small>{action.desc}</small></span>
              <span className={styles.chevron} aria-hidden="true">›</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
