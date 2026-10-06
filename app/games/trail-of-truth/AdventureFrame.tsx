'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './trail.module.css'

type BootState = 'loading' | 'slow' | 'failed' | 'ready'
type RuntimeWindow = Window & { __trailBlock?: { ui?: unknown } }

// A keyed instance owns exactly one engine load. Retrying never clears game saves.
export default function AdventureFrame({ language }: { language: string }) {
  const isRu = language === 'ru'
  const iframe = useRef<HTMLIFrameElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [boot, setBoot] = useState<BootState>('loading')
  const [progress, setProgress] = useState<number | null>(null)
  const [entered, setEntered] = useState(false)
  const deadline = useRef(0)
  useEffect(() => {
    if (!entered) return
    deadline.current = Date.now() + 45000
    const timer = window.setInterval(() => {
      try {
        const frame = iframe.current
        const doc = frame?.contentDocument
        const runtime = frame?.contentWindow as RuntimeWindow | null
        // about:blank, a 404 page, or removal of the splash alone is NOT readiness.
        if (!doc || !runtime || !doc.querySelector('canvas#canvas')) {
          if (Date.now() >= deadline.current) setBoot('slow')
          return
        }
        const notice = doc.getElementById('status-notice')
        if (notice?.textContent?.trim() && runtime.getComputedStyle(notice).display !== 'none') {
          setBoot('failed')
          window.clearInterval(timer)
          return
        }
        if (runtime.__trailBlock?.ui && !doc.getElementById('status')) {
          setBoot('ready')
          window.clearInterval(timer)
          return
        }
        const bar = doc.querySelector<HTMLProgressElement>('#status-progress')
        setProgress(bar?.hasAttribute('value') && bar.max > 0 ? Math.min(100, Math.floor(bar.value / bar.max * 100)) : null)
        if (Date.now() >= deadline.current) setBoot('slow')
      } catch {
        // Navigation/access failures get a finite recovery path, never a crash.
        if (Date.now() >= deadline.current) setBoot('failed')
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [attempt, entered])
  function retry() {
    setBoot('loading')
    setProgress(null)
    setAttempt(value => value + 1)
  }
  function waitLonger() {
    deadline.current = Date.now() + 45000
    setBoot('loading')
  }
  const recovery = boot === 'failed' || boot === 'slow'
  if (!entered) return <section className={styles.entry}>
    <div className={styles.entryCard}>
      <p className={styles.chapter}>{isRu ? 'ПРИКЛЮЧЕНИЕ · ПОТЕРЯВШИЙСЯ ЯГНЁНОК' : 'ADVENTURE · THE LOST LAMB'}</p>
      <h1>{isRu ? 'Кто-то ждёт твоей помощи' : 'Someone is waiting for your help'}</h1>
      <p>{isRu ? 'Исследуй тропу, помогай друзьям и найди потерявшегося ягнёнка. Начни с задания в самой игре.' : 'Explore the trail, help your friends, and find the lost lamb. Begin with the mission inside the game.'}</p>
      <div className={styles.actions}><button type="button" onClick={() => setEntered(true)}>{isRu ? 'Открыть приключение' : 'Open adventure'} →</button></div>
      <p className={styles.entryHint}>{isRu ? 'На сенсорном экране используй игровые кнопки. На компьютере — WASD или стрелки. Загрузка не удаляет сохранённый путь.' : 'Use the in-game controls on touch screens; WASD or arrows on a keyboard. Loading does not erase your saved journey.'}</p>
    </div>
  </section>
  return <div className={styles.frame} data-boot-state={boot}>
    <iframe ref={iframe} key={attempt}
      src={`/games/trail-of-truth-block-adventure/build/index.html?lang=${language}&attempt=${attempt}`}
      title={isRu ? 'Тропа истины — трёхмерное приключение' : 'Trail of Truth — 3D adventure'}
      allow="autoplay; fullscreen; gamepad" allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      tabIndex={boot === 'ready' ? 0 : -1} aria-hidden={boot !== 'ready'}
      onError={() => setBoot('failed')} />
    {boot !== 'ready' && <div className={styles.cover}>
      <div className={styles.card}>
        <p className={styles.title}>{isRu ? 'Тропа истины' : 'Trail of Truth'}</p>
        <p role="status" aria-live="polite" className={styles.message}>
          {boot === 'failed'
            ? (isRu ? 'Не удалось открыть приключение. Попробуем ещё раз?' : 'The adventure could not open. Shall we try again?')
            : boot === 'slow'
              ? (isRu ? 'Загрузка идёт дольше обычного. Можно подождать или попробовать снова.' : 'Loading is taking longer than usual. You can wait or try again.')
              : (isRu ? 'Приключение загружается…' : 'Loading your adventure…')}
        </p>
        {!recovery && <div className={styles.progress}>
          <progress aria-label={isRu ? 'Загрузка приключения' : 'Adventure download'} max={100} value={progress ?? undefined} />
          <span>{progress === null ? (isRu ? 'Готовим тропу' : 'Preparing the trail') : progress === 100 ? (isRu ? 'Открываем тропу…' : 'Opening the trail…') : `${progress}%`}</span>
        </div>}
        {recovery && <div className={styles.actions}>
          <button type="button" onClick={retry}>{isRu ? 'Попробовать снова' : 'Try again'}</button>
          {boot === 'slow' && <button type="button" onClick={waitLonger}>{isRu ? 'Подождать' : 'Keep waiting'}</button>}
          <Link href="/games">{isRu ? 'Выбрать другую игру' : 'Choose another game'}</Link>
        </div>}
      </div>
    </div>}
  </div>
}
