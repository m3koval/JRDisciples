'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import AdventureFrame from './AdventureFrame'
import styles from './trail.module.css'

export default function TrailOfTruthPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const shell = useRef<HTMLDivElement>(null)
  const [fullscreenError, setFullscreenError] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === shell.current)
    document.addEventListener('fullscreenchange', changed)
    return () => document.removeEventListener('fullscreenchange', changed)
  }, [])
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])
  async function enterFullscreen() {
    try {
      if (document.fullscreenElement === shell.current) {
        await document.exitFullscreen()
        setFullscreenError(false)
        return
      }
      if (!shell.current?.requestFullscreen) { setFullscreenError(true); return }
      await shell.current.requestFullscreen()
      setFullscreenError(false)
    } catch { setFullscreenError(true) }
  }
  return (
    <div ref={shell} className={styles.shell}>
      <header className={styles.header}>
        <Link href="/games">{isRu ? '← Все игры' : '← All games'}</Link>
        <span>{isRu ? 'Тропа истины · Потерявшийся ягнёнок' : 'Trail of Truth · The Lost Lamb'}</span>
        <button type="button" aria-pressed={fullscreen} onClick={enterFullscreen}>{fullscreen ? (isRu ? 'Выйти из полного экрана' : 'Exit full screen') : (isRu ? 'На весь экран' : 'Full screen')}</button>
      </header>
      {fullscreenError && <p role="status" className={styles.fullscreenNote}>{isRu ? 'Полный экран недоступен. Можно играть здесь.' : 'Fullscreen is unavailable. You can still play here.'}</p>}
      <AdventureFrame key={language} language={language} />
    </div>
  )
}
