'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function TrailOfTruthPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const shell = useRef<HTMLDivElement>(null)
  const [fullscreenError, setFullscreenError] = useState(false)
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])
  async function enterFullscreen() {
    try {
      if (!shell.current?.requestFullscreen) { setFullscreenError(true); return }
      await shell.current.requestFullscreen()
      setFullscreenError(false)
    } catch { setFullscreenError(true) }
  }
  return (
    <div ref={shell} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#244b3b', display: 'flex', flexDirection: 'column', height: '100dvh', color: '#fff', boxSizing: 'border-box', paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(8px + env(safe-area-inset-top, 0px)) 14px 8px', minHeight: 48, flexShrink: 0, fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>
        <Link href="/games" style={{ color: '#ffe6a4', textDecoration: 'none', padding: '8px 0' }}>{isRu ? '← Все игры' : '← All games'}</Link>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15 }}>{isRu ? 'Тропа истины · Потерявшийся ягнёнок' : 'Trail of Truth · The Lost Lamb'}</span>
        <button type="button" onClick={enterFullscreen} style={{ border: '1px solid #98b4a0', borderRadius: 10, padding: '8px 12px', background: 'transparent', color: '#fff', cursor: 'pointer' }}>{isRu ? 'На весь экран' : 'Full screen'}</button>
      </header>
      {fullscreenError && <p role="status" style={{ margin: 0, padding: '4px 14px', fontSize: 13 }}>{isRu ? 'Полный экран недоступен. Можно играть здесь.' : 'Fullscreen is unavailable. You can still play here.'}</p>}
      <iframe
        src={`/games/trail-of-truth-block-adventure/build/index.html?lang=${language}`}
        title={isRu ? 'Тропа истины — трёхмерное приключение' : 'Trail of Truth — 3D adventure'}
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        style={{ display: 'block', flex: 1, width: '100%', minHeight: 0, border: 0 }}
      />
    </div>
  )
}
