'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { SCENES } from './scenes'
import { findAt, initialState, reducer, SAVE_KEY } from './game'
import { AREA_LABELS, areaFor, inspectionView, moveCursor, picturePoint } from './inspection'
import styles from './spot.module.css'

export default function SpotTheDifferencePage() {
  const { language } = useLanguage()
  const ru = language === 'ru'
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [picture, setPicture] = useState<'before' | 'objects'>('objects')
  const [detail, setDetail] = useState(false)
  const [compare, setCompare] = useState(false)
  const [discovery, setDiscovery] = useState<number | null>(null)
  const [area, setArea] = useState(4)
  const [hint, setHint] = useState(0)
  const [message, setMessage] = useState<'miss' | 'found' | ''>('')
  const [saveFailed, setSaveFailed] = useState(false)
  const [failedImage, setFailedImage] = useState(false)
  const [cursor, setCursor] = useState({ x: 384, y: 512, visible: false })
  const down = useRef<{ id: number; x: number; y: number } | null>(null)
  const pendingTap = useRef<{ x: number; y: number } | null>(null)
  const resumeFocus = useRef<HTMLElement | null>(null)
  const pauseDialog = useRef<HTMLElement | null>(null)
  const view = inspectionView(detail, area)
  const scene = SCENES[state.scene]
  const remaining = scene.differences.find(d => !state.found.includes(d.id))
  const title = ru ? scene.titleRu : scene.titleEn
  const openPause = () => {
    if (document.activeElement instanceof HTMLElement && !pauseDialog.current?.contains(document.activeElement)) resumeFocus.current = document.activeElement
    down.current = null; pendingTap.current = null; setCompare(false); setPaused(true)
  }
  const closePause = () => {
    setPaused(false)
    window.requestAnimationFrame(() => {
      if (resumeFocus.current?.isConnected) resumeFocus.current.focus()
      else document.querySelector<HTMLElement>('[data-picture]:not([tabindex="-1"])')?.focus()
    })
  }
  useEffect(() => {
    const boot = window.requestAnimationFrame(() => {
      try { dispatch({ type: 'restore', value: JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') }) } catch { /* fresh in-memory run */ }
      setReady(true)
    })
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const interrupt = () => {
      if (document.activeElement instanceof HTMLElement && !pauseDialog.current?.contains(document.activeElement)) resumeFocus.current = document.activeElement
      down.current = null; pendingTap.current = null; setCompare(false); setPaused(true)
    }
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
    if (paused || compare || state.phase !== 'play' || failedImage) return
    const id = findAt(state, x, y)
    if (id !== null) { dispatch({ type: 'find', id }); setMessage('found'); setHint(0); setDiscovery(id) }
    else setMessage('miss')
  }
  const next = () => { dispatch({ type: 'next' }); setHint(0); setMessage(''); setFailedImage(false); setPicture('objects'); setCompare(false); setDiscovery(null); setDetail(false); setArea(4); setCursor({ x:384,y:512,visible:false }) }
  const inspectArea = (index: number) => {
    down.current = null; pendingTap.current = null
    const nextArea = (index + 9) % 9
    setArea(nextArea)
    const target = inspectionView(true, nextArea)
    setCursor({ x:target.x + target.width/2, y:target.y + target.height/2, visible:false })
  }
  const picturePanel = (variant: 'before' | 'objects') => <div key={`${scene.id}-${variant}`} className={`${styles.picture} ${picture !== variant ? styles.mobileHidden : ''}`}>
    <div className={styles.pictureLabel}>{ru ? 'Картина' : 'Picture'} {variant === 'before' ? 'A' : 'B'}</div>
    <div className={styles.art} data-picture={variant} data-view={`${view.x},${view.y},${view.width},${view.height}`} tabIndex={state.phase === 'play' && !paused ? 0 : -1} role="button"
      aria-label={ru ? `Картина ${variant === 'before' ? 'A' : 'B'}. Стрелки — двигать указатель, Enter — проверить.` : `Picture ${variant === 'before' ? 'A' : 'B'}. Arrow keys move the pointer; Enter checks a spot.`}
      onFocus={e => { if (e.currentTarget.matches(':focus-visible')) setCursor(c => ({ ...moveCursor(c, '', false, view), visible:true })) }}
      onKeyDown={e => {
        if (paused || state.phase !== 'play') return
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(cursor.x, cursor.y); return }
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); setCursor(c => moveCursor(c,e.key,e.shiftKey,view)) }
      }}
      onPointerDown={e => { if (down.current || paused || state.phase !== 'play') return; setCursor(c=>({...c,visible:false})); pendingTap.current = null; down.current = { id: e.pointerId, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerCancel={e => { if (down.current?.id === e.pointerId) { down.current = null; pendingTap.current = null } }} onLostPointerCapture={e => { if (down.current?.id === e.pointerId) down.current = null }}
      onPointerUp={e => {
        const start = down.current
        if (!start || start.id !== e.pointerId) return
        down.current = null
        if (Math.hypot(e.clientX-start.x,e.clientY-start.y)>18) return
        const b=e.currentTarget.getBoundingClientRect()
        pendingTap.current = picturePoint((e.clientX-b.left)/b.width,(e.clientY-b.top)/b.height,view)
      }}
      onClick={e => {
        // Finish the gesture before replacing the board. Replacing it on pointerup
        // lets touch's compatibility click hit the newly revealed Next story button.
        e.preventDefault()
        e.stopPropagation()
        const point = pendingTap.current
        pendingTap.current = null
        if (point) tap(point.x, point.y)
      }}>
      <div className={styles.imageLayer} style={{ width:`${768/view.width*100}%`, height:`${1024/view.height*100}%`, left:`${-view.x/view.width*100}%`, top:`${-view.y/view.height*100}%` }}>
      <img src={`/images/jr/games/spot/spot-${scene.id}-${compare ? 'before' : variant}.png`} alt={title} draggable={false} onError={() => setFailedImage(true)} />
      <svg viewBox="0 0 768 1024" aria-hidden="true">
        {scene.differences.filter(d => state.found.includes(d.id)).map(d => <g className={d.id === discovery ? styles.discovery : undefined} key={d.id} transform={`translate(${d.anchor[0]} ${d.anchor[1]})`}><circle r="33" fill="#133e2bda" stroke="#fff5ae" strokeWidth="5"/><path d="M-15 0 L-3 12 L17 -13" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></g>)}
        {hint > 1 && remaining && <circle cx={remaining.anchor[0]} cy={remaining.anchor[1]} r="80" fill="none" stroke="#ffe6a4" strokeDasharray="12 10" strokeWidth="5"/>}
        {cursor.visible && <g transform={`translate(${cursor.x} ${cursor.y})`}><circle r="22" fill="none" stroke="white" strokeWidth="4"/><circle r="5" fill="#ffcf62"/></g>}
      </svg>
      </div>
    </div>
  </div>
  return <main className={styles.shell} data-phase={state.phase} data-scene={scene.id} data-found={state.found.length} data-detail={detail} onKeyDown={e => {
    if (e.key === 'Escape') { e.preventDefault(); if (paused) closePause(); else openPause() }
    if (paused && e.key === 'Tab') {
      const controls = pauseDialog.current?.querySelectorAll<HTMLElement>('button,a[href]')
      if (!controls?.length) return
      const first=controls[0], last=controls[controls.length-1]
      if (e.shiftKey && document.activeElement===first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement===last) { e.preventDefault(); first.focus() }
    }
  }}>
    <div className={styles.contents} inert={paused}>
    <header className={styles.header}>
      <Link href="/games">{ru ? '← Игры' : '← Games'}</Link>
      <div><strong>{ru ? 'Найди отличия' : 'Spot the Difference'}</strong><small>{ru ? 'История' : 'Story'} {state.scene+1} / {SCENES.length}</small></div>
      <button type="button" onClick={openPause}>{ru ? 'Пауза' : 'Pause'}</button>
    </header>
    {!ready ? <p>{ru ? 'Загрузка…' : 'Loading…'}</p> : <>
    <section className={styles.stage}>
      {state.phase === 'play' ? <>
        <div className={styles.objective}><h1>{title}</h1><span>{ru ? 'Найдено' : 'Found'} {state.found.length} / {scene.differences.length}</span></div>
        <div className={styles.switcher} aria-label={ru ? 'Сравнить картины' : 'Compare pictures'}>
          <button aria-pressed={picture === 'before'} onClick={() => setPicture('before')}>{ru ? 'Картина A' : 'Picture A'}</button>
          <button aria-pressed={picture === 'objects'} onClick={() => setPicture('objects')}>{ru ? 'Картина B' : 'Picture B'}</button>
        </div>
        <div className={styles.inspection}>
          <button type="button" aria-pressed={compare} onClick={() => { down.current=null; pendingTap.current=null; setCompare(c=>!c) }}>{compare ? (ru ? 'Вернуть отличия' : 'Return to differences') : (ru ? 'Сверить с оригиналом' : 'Compare with original')}</button>
          <button type="button" aria-pressed={detail} onClick={() => { setDetail(d=>!d); inspectArea(detail ? 4 : areaFor(cursor.x,cursor.y)) }}>{detail ? (ru ? 'Вся картина' : 'Whole picture') : (ru ? 'Рассмотреть ближе' : 'Look closer')}</button>
          {detail && <div className={styles.areaControls}>
            <button type="button" aria-label={ru ? 'Предыдущая область' : 'Previous area'} onClick={() => inspectArea(area-1)}>‹</button>
            <span className={styles.areaName} role="status"><svg viewBox="0 0 48 64" aria-hidden="true"><rect x="1" y="1" width="46" height="62" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><rect x={view.x/16} y={view.y/16} width="24" height="32" rx="2" fill="currentColor" opacity=".65"/></svg><span>{ru ? AREA_LABELS[area].ru : AREA_LABELS[area].en}<small>{area+1} / 9</small></span></span>
            <button type="button" aria-label={ru ? 'Следующая область' : 'Next area'} onClick={() => inspectArea(area+1)}>›</button>
          </div>}
        </div>
        <div className={styles.discoveryTray} aria-label={ru ? 'Твои находки' : 'Your discoveries'}>{scene.differences.map((d,i)=><span key={d.id} className={state.found.includes(d.id) ? styles.discovered : ''}>{state.found.includes(d.id) ? `✓ ${ru ? d.nameRu : d.nameEn}` : `${i+1} · ?`}</span>)}</div>
        {compare && <p className={styles.compareNotice} role="status">{ru ? 'Оригинал на обеих картинах. Верни отличия, чтобы продолжить поиск.' : 'Original on both pictures. Return to differences to keep searching.'}</p>}
        <div className={styles.pictures}>{picturePanel('before')}{picturePanel('objects')}</div>
        {failedImage && <div className={styles.imageError} role="alert">{ru ? 'Не удалось открыть картину. Проверь соединение и обнови страницу — найденное сохранится, если память доступна.' : 'The picture could not load. Check your connection and reload; discoveries are kept when storage is available.'}</div>}
      </> : <div className={styles.chapter}>
        <img className={styles.chapterArt} src={`/images/jr/games/spot/spot-${scene.id}-before.png`} alt={title}/>
        <div className={styles.card}>
          <p className={styles.eyebrow}>{state.phase === 'story' ? (ru ? 'Посмотри внимательно' : 'Look closely') : (ru ? 'Ты заметил!' : 'You noticed!')}</p>
          <h1>{state.phase === 'done' ? (ru ? 'Все восемь историй пройдены!' : 'All eight stories explored!') : title}</h1>
          {state.phase === 'story' ? <><p>{ru ? scene.storyRu : scene.storyEn}</p><p className={styles.instruction}>{ru ? 'Сравни две картины. Найди три отличия в цвете или узоре предметов. Нажимай на любой картине. Мелкие детали можно рассмотреть ближе.' : 'Compare two pictures. Find three changes in the objects’ colors or patterns. Tap either picture. Look closer to inspect small details.'}</p><button className={styles.primary} onClick={() => dispatch({ type: 'start' })}>{ru ? 'Найти отличия' : 'Find the differences'}</button></> : <>
            <blockquote>{ru ? scene.verseRu : scene.verseEn}<cite>{ru ? `${scene.refRu} · Синодальный` : `${scene.refEn} · ESV`}</cite></blockquote>
            {state.phase === 'reward' ? <><ul>{scene.differences.map(d => <li key={d.id}>✓ {ru ? d.nameRu : d.nameEn}</li>)}</ul><button className={styles.primary} onClick={next}>{state.scene === SCENES.length-1 ? (ru ? 'Завершить' : 'Finish') : (ru ? 'Следующая история' : 'Next story')}</button></> : <><p>{ru ? 'Ты замечал детали и узнавал, что сделал Бог.' : 'You explored the details and learned what God has done.'}</p><button className={styles.primary} onClick={() => { dispatch({ type: 'reset' }); setMessage(''); setHint(0) }}>{ru ? 'Играть снова' : 'Play again'}</button><Link className={styles.more} href="/games">{ru ? 'Все игры' : 'All games'}</Link></>}
          </>}
        </div>
      </div>}
    </section>
    {state.phase === 'play' && <footer className={styles.footer}>
      <p role="status" aria-live="polite">{hint && remaining ? `${ru ? 'Присмотрись: ' : 'Look at: '}${ru ? remaining.nameRu : remaining.nameEn}` : message === 'miss' ? (ru ? 'Здесь одинаково. Сравни цвет и узор предметов.' : 'That spot matches. Compare the objects’ colors and patterns.') : message === 'found' ? (ru ? 'Верно! Найди следующее отличие.' : 'Found it! Look for the next difference.') : (ru ? 'Найди три отличия: цвет или узор.' : 'Find three changes: colors or patterns.')}</p>
      <button onClick={() => { setHint(h => Math.min(h+1,2)); if (hint && remaining && detail) inspectArea(areaFor(remaining.anchor[0], remaining.anchor[1])) }}>{hint ? (ru ? 'Показать область' : 'Show an area') : (ru ? 'Подсказка' : 'Hint')}</button>
    </footer>}
    {saveFailed && <p className={styles.saveNotice} role="status">{ru ? 'Можно играть. Прогресс не сохранится после закрытия.' : 'You can keep playing. Progress will not survive closing this page.'}</p>}
    </>}
    </div>
    {paused && <div className={styles.veil}><section ref={pauseDialog} className={styles.pause} role="dialog" aria-modal="true" aria-label={ru ? 'Пауза' : 'Paused'}><h2>{ru ? 'Пауза' : 'Paused'}</h2><p>{ru ? 'Твои находки остаются на месте.' : 'Your discoveries stay right here.'}</p><button autoFocus className={styles.primary} onClick={closePause}>{ru ? 'Продолжить' : 'Continue'}</button><Link href="/games">{ru ? 'Выйти к играм' : 'Exit to games'}</Link></section></div>}
  </main>
}
