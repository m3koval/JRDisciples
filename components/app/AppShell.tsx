'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { rememberLesson } from '@/lib/app-progress'
import { allJourneySteps, journeyManualLessonHrefs } from '@/data/journey'
import { JourneyLessonAdvance } from './JourneyLessonAdvance'
import { JourneyNextAction } from './JourneyNextAction'
import styles from './AppShell.module.css'

type IconName = 'home' | 'journey' | 'practice' | 'progress' | 'explore'

function Icon({ name }: { name: IconName }) {
  const common = { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'home') return <svg {...common}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>
  if (name === 'journey') return <svg {...common}><path d="M4 19V5l5-2 6 2 5-2v14l-5 2-6-2Z"/><path d="M9 3v14M15 5v14"/></svg>
  if (name === 'practice') return <svg {...common}><path d="M9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  if (name === 'progress') return <svg {...common}><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>
  return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4Z"/></svg>
}

const copy = {
  en: { today: 'Today', journey: 'Journey', practice: 'Practice', progress: 'Progress', explore: 'Explore', language: 'Change language' },
  ru: { today: 'Сегодня', journey: 'Путь', practice: 'Практика', progress: 'Прогресс', explore: 'Обзор', language: 'Сменить язык' },
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const routePath = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname
  const { language, setLanguage } = useLanguage()
  const text = copy[language]
  const isGame = routePath.startsWith('/games/')
  const isJourneyContent = allJourneySteps.some((step) => step.href === routePath)

  useEffect(() => { rememberLesson(routePath) }, [routePath])

  const items: Array<{ href: string; label: string; icon: IconName; active: boolean }> = [
    { href: '/', label: text.today, icon: 'home', active: routePath === '/' },
    { href: '/journey', label: text.journey, icon: 'journey', active: routePath.startsWith('/journey') || isJourneyContent },
    { href: '/practice', label: text.practice, icon: 'practice', active: routePath.startsWith('/practice') },
    { href: '/progress', label: text.progress, icon: 'progress', active: routePath.startsWith('/progress') },
    { href: '/explore', label: text.explore, icon: 'explore', active: routePath.startsWith('/explore') },
  ]

  if (isGame) return <div className={styles.gameShell}>{children}</div>

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">JD</span>
          <span>Junior Disciples</span>
        </Link>
        <div className={styles.topActions}>
          <span className={styles.offlineBadge}>{language === 'ru' ? 'Работает офлайн' : 'Works offline'}</span>
          <button
            type="button"
            className={styles.languageButton}
            aria-label={`${language === 'en' ? 'EN' : 'РУ'} — ${text.language}`}
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
          >
            {language === 'en' ? 'EN' : 'РУ'}
          </button>
        </div>
      </header>

      <nav className={styles.navigation} aria-label={language === 'ru' ? 'Навигация приложения' : 'App navigation'}>
        <Link href="/" className={styles.railBrand} aria-label={language === 'ru' ? 'JD Junior Disciples — главная' : 'JD Junior Disciples home'}>
          <span className={styles.mark} aria-hidden="true">JD</span>
        </Link>
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.active ? styles.active : ''}`} aria-current={item.active ? 'page' : undefined}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.content}>
        {children}
        {journeyManualLessonHrefs.has(routePath) && (
          <section className={styles.manualCompletion}>
            <JourneyNextAction currentHref={routePath} />
          </section>
        )}
      </div>
      <JourneyLessonAdvance pathname={routePath} />
    </div>
  )
}
