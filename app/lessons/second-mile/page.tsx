'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useSyncExternalStore } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ExternalSourceLink } from '@/components/ExternalSourceLink'
import { markLessonComplete, recordGradedAnswer, resetLessonMastery } from '@/lib/lesson-mastery'
import { copy, images, scriptureEn, scriptureRu } from './content'
import styles from './page.module.css'

const ID = 'second-mile'
const KEY = 'second-mile-progress'
const EVENT = 'second-mile-progress-change'
type Progress = { scene: number; phase: 'learn' | 'do' | 'result'; order: number[]; sorted: number[]; matched: number[]; graded: string[]; plan: number | null }
const initial: Progress = { scene: 0, phase: 'learn', order: [], sorted: [], matched: [], graded: [], plan: null }
const EMPTY = JSON.stringify(initial)
let memory = EMPTY
let initialized = false
function snapshot() {
  if (!initialized) {
    try { memory = localStorage.getItem(KEY) ?? EMPTY } catch { /* play without storage */ }
    initialized = true
  }
  return memory
}
function subscribe(callback: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) { memory = EMPTY; initialized = false; callback() } }
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener('storage', storage) }
}
function parse(raw: string): Progress {
  try {
    const p = JSON.parse(raw)
    const ids = (value: unknown, max: number): number[] => Array.isArray(value) ? [...new Set(value.filter((x): x is number => Number.isInteger(x) && x >= 0 && x < max))] : []
    if (!p || !Number.isInteger(p.scene) || p.scene < 0 || p.scene > 5) return initial
    const normalized: Progress = { scene: p.scene, phase: ['learn', 'do', 'result'].includes(p.phase) ? p.phase : 'learn', order: ids(p.order, p.scene === 4 ? 3 : 5), sorted: ids(p.sorted, 4), matched: ids(p.matched, 3), graded: Array.isArray(p.graded) ? p.graded.filter((x: unknown) => typeof x === 'string') : [], plan: Number.isInteger(p.plan) && p.plan >= 0 && p.plan < 3 ? p.plan : null }
    if (normalized.scene >= 1 && normalized.scene <= 4) {
      const solved = normalized.scene === 2 ? normalized.sorted.length === 4
        : normalized.scene === 3 ? normalized.matched.length === 3
        : normalized.order.length === (normalized.scene === 1 ? 5 : 3) && normalized.order.every((id, i) => id === i)
      if (solved && (normalized.scene === 2 || normalized.scene === 3)) normalized.phase = 'result'
      else if (!solved && normalized.phase === 'result') normalized.phase = 'do'
    }
    return normalized
  } catch { return initial }
}
function save(p: Progress) {
  memory = JSON.stringify(p)
  try { localStorage.setItem(KEY, memory) } catch { /* session memory remains usable */ }
  window.dispatchEvent(new Event(EVENT))
}

export default function SecondMilePage() {
  const { language } = useLanguage()
  const raw = useSyncExternalStore(subscribe, snapshot, () => EMPTY)
  return <Lesson key={language} language={language} progress={parse(raw)} />
}

function Lesson({ language, progress: p }: { language: 'en' | 'ru'; progress: Progress }) {
  const t = copy[language]
  const scriptures = language === 'ru' ? scriptureRu : scriptureEn
  const index = Math.max(0, Math.min(3, p.scene - 1))
  const verse = scriptures[p.scene === 5 ? 0 : index]
  const [selection, setSelection] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'wrong' | 'right' | null>(null)
  const [hint, setHint] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const update = (patch: Partial<Progress>) => save({ ...p, ...patch })
  function transition(patch: Partial<Progress>) {
    update(patch); setSelection(null); setFeedback(null); setHint(false)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'nearest' }) })
  }
  function grade(key: string, correct: boolean, patch: Partial<Progress> = {}) {
    const graded = p.graded.includes(key) ? p.graded : [...p.graded, key]
    if (!p.graded.includes(key)) recordGradedAnswer(ID, correct)
    update({ ...patch, graded })
    setFeedback(correct ? 'right' : 'wrong')
  }
  function checkOrder() {
    const length = p.scene === 1 ? 5 : 3
    const correct = p.order.length === length && p.order.every((value, i) => value === i)
    grade(`order-${p.scene}`, correct, correct ? { phase: 'result' } : {})
  }
  function sort(bucket: number) {
    if (selection === null) return
    const correct = selection % 2 === bucket
    const sorted = correct ? [...p.sorted, selection] : p.sorted
    grade(`heart-${selection}`, correct, { sorted, phase: sorted.length === 4 ? 'result' : 'do' })
    if (correct) setSelection(null)
  }
  function match(action: number) {
    if (selection === null) return
    const correct = [1, 2, 0][selection] === action
    const matched = correct ? [...p.matched, selection] : p.matched
    grade(`help-${selection}`, correct, { matched, phase: matched.length === 3 ? 'result' : 'do' })
    if (correct) setSelection(null)
  }
  const title = p.scene === 0 ? t.title : p.scene === 5 ? t.done : t.titles[index]
  const tiles = p.scene === 1 ? t.verseTiles : t.graceTiles
  const tileOrder = p.scene === 1 ? [3, 0, 4, 1, 2] : [2, 0, 1]
  return <article className={styles.lesson} data-testid="second-mile" lang={language}>
    <nav className={styles.nav}><Link href="/lessons">← {t.all}</Link><span>{t.progress}: {Math.max(0, p.scene - 1)} / 4</span></nav>
    <progress className={styles.progress} aria-label={t.progress} max={4} value={Math.max(0, p.scene - 1)} />
    <section className={styles.stage}>
      <div className={styles.visual}><Image src={images[p.scene]} alt={t.alts[p.scene]} fill style={p.scene === 1 ? { objectPosition: 'center top' } : undefined} sizes="(max-width: 900px) 100vw, 48vw" priority /><span className={styles.imageLabel}>{p.scene > 0 && p.scene < 5 ? `${p.scene} / 4` : t.title}</span></div>
      <div className={styles.panel}>
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        {p.scene === 0 ? <>
          <p>{t.intro}</p><Verse verse={scriptures[0]} language={language} />
          <button data-testid="start" className={styles.primary} onClick={() => transition({ scene: 1 })}>{t.start} →</button><small>{t.saved}</small>
        </> : p.scene === 5 ? <>
          <p>{t.doneText}</p><Verse verse={verse} language={language} />
          <fieldset className={styles.plans}><legend>{t.planTitle}</legend>{t.plans.map((plan, i) => <label key={plan}><input type="radio" name="plan" checked={p.plan === i} onChange={() => update({ plan: i })} />{plan}</label>)}</fieldset>
          {p.plan !== null && <p role="status">{t.planSaved} {t.plans[p.plan]}</p>}
          <p className={styles.truth}>{t.prayer}</p>
          <Link className={styles.primary} href="/lessons/grace-in-the-kingdom">{t.nextLesson} →</Link>
          <button onClick={() => { resetLessonMastery(ID); save(initial); setFeedback(null); setHint(false); setSelection(null) }}>{t.again}</button>
        </> : p.phase === 'learn' ? <>
          <p>{t.teaching[index]}</p><Verse verse={verse} language={language} />
          <button data-testid="play" className={styles.primary} onClick={() => transition({ phase: 'do' })}>{t.play} →</button>
        </> : p.phase === 'result' ? <>
          <div className={styles.truth} role="status"><strong>✓ {t.success}</strong><p>{t.learns[index]}</p></div>
          <Verse verse={verse} language={language} />
          <button data-testid="next" className={styles.primary} onClick={() => { if (p.scene === 4) markLessonComplete(ID); transition({ scene: p.scene + 1, phase: 'learn', order: [] }) }}>{t.next} →</button>
        </> : <>
          <p className={styles.task}>{t.tasks[index]}</p>
          {(p.scene === 1 || p.scene === 4) && <>
            <ol className={styles.path} aria-label={t.tasks[index]}>{p.order.map(id => <li key={id}>{tiles[id]}</li>)}</ol>
            <div className={styles.tiles}>{tileOrder.map(id => <button data-testid={`tile-${id}`} key={id} disabled={p.order.includes(id)} onClick={() => { update({ order: [...p.order, id] }); setFeedback(null) }}>{tiles[id]}</button>)}</div>
            <div className={styles.tools}><button disabled={!p.order.length} onClick={() => update({ order: p.order.slice(0, -1) })}>{t.undo}</button><button data-testid="clear" disabled={!p.order.length} onClick={() => { update({ order: [] }); setFeedback(null) }}>{t.clear}</button></div>
            <button data-testid="check" className={styles.primary} disabled={p.order.length !== tiles.length} onClick={checkOrder}>{t.check}</button>
          </>}
          {p.scene === 2 && <>
            <div className={styles.tiles}>{t.thoughts.map((text, id) => <button data-testid={`thought-${id}`} key={id} aria-pressed={selection === id} disabled={p.sorted.includes(id)} onClick={() => { setSelection(id); setFeedback(null) }}>{p.sorted.includes(id) ? '✓ ' : ''}{text}</button>)}</div>
            <div className={styles.baskets}>{t.baskets.map((text, id) => <button data-testid={`basket-${id}`} key={id} disabled={selection === null} onClick={() => sort(id)}>{id === 0 ? '↔ ' : '♡ '}{text}</button>)}</div>
          </>}
          {p.scene === 3 && <div className={styles.matches}>
            <div>{t.needs.map((text, id) => <button data-testid={`need-${id}`} key={id} disabled={p.matched.includes(id)} aria-pressed={selection === id} onClick={() => { setSelection(id); setFeedback(null) }}>{p.matched.includes(id) ? '✓ ' : ''}{text}</button>)}</div>
            <div>{t.actions.map((text, id) => <button data-testid={`action-${id}`} key={id} disabled={selection === null || p.matched.some(need => [1, 2, 0][need] === id)} onClick={() => match(id)}>{text}</button>)}</div>
          </div>}
          <div className={styles.feedback} role="status" aria-live="polite">{feedback === 'wrong' ? `${t.retry} ${t.hints[index]}` : feedback === 'right' ? `✓ ${t.success}` : ''}</div>
          <details open={hint} onToggle={event => setHint(event.currentTarget.open)}><summary>{t.hint}</summary><p>{t.hints[index]}</p><Verse verse={verse} language={language} /></details>
        </>}
      </div>
    </section>
    <details className={styles.parent}><summary>{t.parent}</summary><p>{t.note}</p>{scriptures.map(v => <ExternalSourceLink key={v.url} href={v.url}>{v.reference} · {language === 'ru' ? 'Синодальный перевод (RST)' : 'ESV'} ↗ </ExternalSourceLink>)}</details>
  </article>
}
function Verse({ verse, language }: { verse: typeof scriptureEn[number]; language: 'en' | 'ru' }) {
  return <blockquote className={styles.verse}><p>“{verse.text}”</p><cite>{verse.reference} · {language === 'ru' ? 'Синодальный перевод (RST)' : 'ESV'}</cite></blockquote>
}
