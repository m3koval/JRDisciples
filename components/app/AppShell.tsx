'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { rememberLesson } from '@/lib/app-progress'
import styles from './AppShell.module.css'

type IconName = 'home' | 'learn' | 'play' | 'quest' | 'progress'

function Icon({ name }: { name: IconName }) {
  const common = { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'home') return <svg {...common}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>
  if (name === 'learn') return <svg {...common}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22Z"/></svg>
  if (name === 'play') return <svg {...common}><path d="M8 5v14l11-7Z"/><circle cx="12" cy="12" r="10"/></svg>
  if (name === 'quest') return <svg {...common}><path d="M4 19V5l5-2 6 2 5-2v14l-5 2-6-2Z"/><path d="M9 3v14M15 5v14"/></svg>
  return <svg {...common}><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>
}

const copy = {
  en: { home: 'Home', learn: 'Learn', play: 'Play', quests: 'Quests', progress: 'Progress', language: 'Change language' },
  ru: { home: 'Главная', learn: 'Учиться', play: 'Играть', quests: 'Квесты', progress: 'Прогресс', language: 'Сменить язык' },
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const text = copy[language]
  const isGame = pathname.startsWith('/games/')

  useEffect(() => { rememberLesson(pathname) }, [pathname])

  const items: Array<{ href: string; label: string; icon: IconName; active: boolean }> = [
    { href: '/', label: text.home, icon: 'home', active: pathname === '/' },
    { href: '/lessons', label: text.learn, icon: 'learn', active: pathname.startsWith('/lessons') || pathname.startsWith('/stories') || pathname.startsWith('/quiz') || pathname.startsWith('/memory') },
    { href: '/games', label: text.play, icon: 'play', active: pathname.startsWith('/games') || pathname.startsWith('/puzzles') || pathname.startsWith('/rebus') },
    { href: '/quests', label: text.quests, icon: 'quest', active: pathname.startsWith('/quest') },
    { href: '/progress', label: text.progress, icon: 'progress', active: pathname.startsWith('/progress') },
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

      <div className={styles.content}>{children}</div>
    </div>
  )
}
