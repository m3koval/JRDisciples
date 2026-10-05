'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { SCENES } from './scenes'
import { findAt, initialState, reducer, SAVE_KEY } from './game'
import styles from './spot.module.css'

export default function SpotTheDifferencePage() {
  const { language } = useLanguage()
  const ru = language === 'ru'
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [picture, setPicture] = useState<'before' | 'objects'>('objects')
  const [hint, setHint] = useState(0)
  const [message, setMessage] = useState<'miss' | 'found' | ''>('')
  const [saveFailed, setSaveFailed] = useState(false)
  const [failedImage, setFailedImage] = useState(false)
  const [cursor, setCursor] = useState({ x: 384, y: 512, visible: false })
  const down = useRef<{ id: number; x: number; y: number } | null>(null)
  const scene = SCENES[state.scene]
  const remaining = scene.differences.find(d => !state.found.includes(d.id))
  const title = ru ? scene.titleRu : scene.titleEn
  useEffect(() => {
    const boot = window.requestAnimationFrame(() => {
      try { dispatch({ type: 'restore', value: JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') }) } catch { /* fresh in-memory run */ }
      setReady(true)
    })
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const interrupt = () => { down.current = null; setPaused(true) }
    const hidden = () => { if (document.hidden) interrupt() }
    window.addEventListener('blur', interrupt)
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('orientationchange', interrupt)
    return () => { window.cancelAnimationFrame(boot); document.body.style.overflow = previous; window.removeEventListener('blur', interrupt); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('orientationchange', interrupt) }
  }, [])
  useEffect(() => {
    if (!ready) return
    let failed = false
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)) } catch { failed = true }
    const report = window.requestAnimationFrame(() => setSaveFailed(failed))
    return () => window.cancelAnimationFrame(report)
  }, [state, ready])
  const tap = (x: number, y: number) => {
    if (paused || state.phase !== 'play' || failedImage) return
    const id = findAt(state, x, y)
    if (id !== null) { dispatch({ type: 'find', id }); setMessage('found'); setHint(0) }
    else setMessage('miss')
  }
  const next = () => { dispatch({ type: 'next' }); setHint(0); setMessage(''); setFailedImage(false); setPicture('objects') }
  const picturePanel = (variant: 'before' | 'objects') => <div key={`${scene.id}-${variant}`} className={`${styles.picture} ${picture !== variant ? styles.mobileHidden : ''}`}>
    <div className={styles.pictureLabel}>{ru ? 'Картина' : 'Picture'} {variant === 'before' ? 'A' : 'B'}</div>
    <div className={styles.art} data-picture={variant} tabIndex={state.phase === 'play' && !paused ? 0 : -1} role="button"
      aria-label={ru ? `Картина ${variant === 'before' ? 'A' : 'B'}. Стрелки — двигать указатель, Enter — проверить.` : `Picture ${variant === 'before' ? 'A' : 'B'}. Arrow keys move the pointer; Enter checks a spot.`}
      onKeyDown={e => {
        if (paused || state.phase !== 'play') return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(cursor.x, cursor.y); return }
        const delta = e.shiftKey ? 4 : 24
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); setCursor(c => ({ visible: true, x: Math.max(4,Math.min(764,c.x+(e.key==='ArrowLeft'?-delta:e.key==='ArrowRight'?delta:0))), y: Math.max(4,Math.min(1020,c.y+(e.key==='ArrowUp'?-delta:e.key==='ArrowDown'?delta:0))) })) }
      }}
      onPointerDown={e => { if (down.current || paused || state.phase !== 'play') return; down.current = { id: e.pointerId, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerCancel={() => { down.current = null }} onLostPointerCapture={() => { down.current = null }}
      onPointerUp={e => {
        const start = down.current
        if (!start || start.id !== e.pointerId) return
        down.current = null
        if (Math.hypot(e.clientX-start.x,e.clientY-start.y)>18) return
        const b=e.currentTarget.getBoundingClientRect()
        tap((e.clientX-b.left)/b.width*768,(e.clientY-b.top)/b.height*1024)
      }}>
      <img src={`/images/jr/games/spot/spot-${scene.id}-${variant}.png`} alt={title} draggable={false} onError={() => setFailedImage(true)} />
      <svg viewBox="0 0 768 1024" aria-hidden="true">
        {scene.differences.filter(d => state.found.includes(d.id)).map(d => <g key={d.id} transform={`translate(${d.anchor[0]} ${d.anchor[1]})`}><circle r="33" fill="#133e2bda" stroke="#fff5ae" strokeWidth="5"/><path d="M-15 0 L-3 12 L17 -13" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></g>)}
        {hint > 1 && remaining && <circle cx={remaining.anchor[0]} cy={remaining.anchor[1]} r="80" fill="none" stroke="#ffe6a4" strokeDasharray="12 10" strokeWidth="5"/>}
        {cursor.visible && <g transform={`translate(${cursor.x} ${cursor.y})`}><circle r="22" fill="none" stroke="white" strokeWidth="4"/><circle r="5" fill="#ffcf62"/></g>}
      </svg>
    </div>
  </div>
  return <main className={styles.shell} data-phase={state.phase} data-scene={scene.id} data-found={state.found.length}>
    <header className={styles.header}>
      <Link href="/games">{ru ? '← Игры' : '← Games'}</Link>
      <div><strong>{ru ? 'Найди отличия' : 'Spot the Difference'}</strong><small>{ru ? 'История' : 'Story'} {state.scene+1} / {SCENES.length}</small></div>
      <button type="button" onClick={() => { down.current = null; setPaused(true) }}>{ru ? 'Пауза' : 'Pause'}</button>
    </header>
    {!ready ? <p>{ru ? 'Загрузка…' : 'Loading…'}</p> : <>
    <section className={styles.stage}>
      {state.phase === 'play' ? <>
        <div className={styles.objective}><h1>{title}</h1><span>{ru ? 'Найдено' : 'Found'} {state.found.length} / {scene.differences.length}</span></div>
        <div className={styles.switcher} aria-label={ru ? 'Сравнить картины' : 'Compare pictures'}>
          <button aria-pressed={picture === 'before'} onClick={() => setPicture('before')}>{ru ? 'Картина A' : 'Picture A'}</button>
          <button aria-pressed={picture === 'objects'} onClick={() => setPicture('objects')}>{ru ? 'Картина B' : 'Picture B'}</button>
        </div>
        <div className={styles.pictures}>{picturePanel('before')}{picturePanel('objects')}</div>
        {failedImage && <div className={styles.imageError} role="alert">{ru ? 'Не удалось открыть картину. Проверь соединение и обнови страницу — найденное сохранится, если память доступна.' : 'The picture could not load. Check your connection and reload; discoveries are kept when storage is available.'}</div>}
      </> : <div className={styles.chapter}>
        <img className={styles.chapterArt} src={`/images/jr/games/spot/spot-${scene.id}-before.png`} alt={title}/>
        <div className={styles.card}>
          <p className={styles.eyebrow}>{state.phase === 'story' ? (ru ? 'Посмотри внимательно' : 'Look closely') : (ru ? 'Ты заметил!' : 'You noticed!')}</p>
          <h1>{state.phase === 'done' ? (ru ? 'Все восемь историй пройдены!' : 'All eight stories explored!') : title}</h1>
          {state.phase === 'story' ? <><p>{ru ? scene.storyRu : scene.storyEn}</p><p className={styles.instruction}>{ru ? 'Сравни две картины. Найди три предмета другого цвета. Нажимай на любой картине.' : 'Compare two pictures. Find three objects with different colors. Tap either picture.'}</p><button className={styles.primary} onClick={() => dispatch({ type: 'start' })}>{ru ? 'Найти отличия' : 'Find the differences'}</button></> : <>
            <blockquote>{ru ? scene.verseRu : scene.verseEn}<cite>{ru ? `${scene.refRu} · Синодальный` : `${scene.refEn} · ESV`}</cite></blockquote>
            {state.phase === 'reward' ? <><ul>{scene.differences.map(d => <li key={d.id}>✓ {ru ? d.nameRu : d.nameEn}</li>)}</ul><button className={styles.primary} onClick={next}>{state.scene === SCENES.length-1 ? (ru ? 'Завершить' : 'Finish') : (ru ? 'Следующая история' : 'Next story')}</button></> : <><p>{ru ? 'Ты замечал детали и узнавал, что сделал Бог.' : 'You explored the details and learned what God has done.'}</p><button className={styles.primary} onClick={() => { dispatch({ type: 'reset' }); setMessage(''); setHint(0) }}>{ru ? 'Играть снова' : 'Play again'}</button><Link className={styles.more} href="/games">{ru ? 'Все игры' : 'All games'}</Link></>}
          </>}
        </div>
      </div>}
    </section>
    {state.phase === 'play' && <footer className={styles.footer}>
      <p role="status" aria-live="polite">{hint && remaining ? `${ru ? 'Присмотрись: ' : 'Look at: '}${ru ? remaining.nameRu : remaining.nameEn}` : message === 'miss' ? (ru ? 'Здесь одинаково. Сравни цвета предметов ещё раз.' : 'That spot matches. Compare the object colors again.') : message === 'found' ? (ru ? 'Верно! Найди следующее отличие.' : 'Found it! Look for the next difference.') : (ru ? 'Найди три предмета другого цвета.' : 'Find three objects with different colors.')}</p>
      <button onClick={() => setHint(h => Math.min(h+1,2))}>{hint ? (ru ? 'Показать область' : 'Show an area') : (ru ? 'Подсказка' : 'Hint')}</button>
    </footer>}
    {saveFailed && <p className={styles.saveNotice} role="status">{ru ? 'Можно играть. Прогресс не сохранится после закрытия.' : 'You can keep playing. Progress will not survive closing this page.'}</p>}
    </>}
    {paused && <div className={styles.veil}><section className={styles.pause} role="dialog" aria-modal="true" aria-label={ru ? 'Пауза' : 'Paused'}><h2>{ru ? 'Пауза' : 'Paused'}</h2><p>{ru ? 'Твои находки остаются на месте.' : 'Your discoveries stay right here.'}</p><button autoFocus className={styles.primary} onClick={() => setPaused(false)}>{ru ? 'Продолжить' : 'Continue'}</button><Link href="/games">{ru ? 'Выйти к играм' : 'Exit to games'}</Link></section></div>}
  </main>
}
