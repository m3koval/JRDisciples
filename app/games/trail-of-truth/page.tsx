'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function TrailOfTruthPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const shell = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [fullscreenError, setFullscreenError] = useState(false)
  const [gameReady, setGameReady] = useState(false)
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])
  useEffect(() => {
    // The Godot web build shows its own boot splash (id="status") inside the
    // iframe and removes that element once the engine finishes loading. We
    // watch for that removal (same-origin) to know when to drop our hero
    // video cover and reveal the game underneath.
    const interval = window.setInterval(() => {
      const doc = iframeRef.current?.contentDocument
      if (doc && doc.readyState === 'complete' && !doc.getElementById('status')) {
        setGameReady(true)
        window.clearInterval(interval)
      }
    }, 200)
    return () => window.clearInterval(interval)
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
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <iframe
          ref={iframeRef}
          src={`/games/trail-of-truth-block-adventure/build/index.html?lang=${language}`}
          title={isRu ? 'Тропа истины — трёхмерное приключение' : 'Trail of Truth — 3D adventure'}
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          style={{ display: 'block', width: '100%', height: '100%', border: 0 }}
        />
        {!gameReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#244b3b', overflow: 'hidden' }}>
            <video
              src="/videos/hero-main.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
            />
            <div style={{ position: 'relative', textAlign: 'center', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 800, padding: '0 24px' }}>
              <p style={{ fontSize: 18, margin: '0 0 10px' }}>{isRu ? 'Тропа истины' : 'Trail of Truth'}</p>
              <p style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, margin: 0 }}>{isRu ? 'Приключение загружается…' : 'Loading your adventure…'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
