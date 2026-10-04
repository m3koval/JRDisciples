'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { recordGradedAnswer, markLessonComplete, resetLessonMastery } from '@/lib/lesson-mastery'
import { content, scriptureEn, scriptureRu, sources, type Language } from './content'
import styles from './lesson.module.css'

const ID = 'paid-in-full'
const KEY = 'jr-paid-in-full-v1:'
const volatile = new Map<string, number>()
function snapshot(lang: Language) {
  if (volatile.has(lang)) return volatile.get(lang)!
  let value = 0
  try { const raw = JSON.parse(localStorage.getItem(KEY + lang) || '0'); if (Number.isInteger(raw) && raw >= 0 && raw <= 5) value = raw } catch { /* available in memory when storage is blocked */ }
  volatile.set(lang, value)
  return value
}
function save(lang: Language, value: number) {
  volatile.set(lang, value)
  try { localStorage.setItem(KEY + lang, JSON.stringify(value)) } catch { /* retain the authoritative in-memory snapshot */ }
  window.dispatchEvent(new Event(KEY))
}
function subscribe(callback: () => void) { window.addEventListener(KEY, callback); return () => window.removeEventListener(KEY, callback) }
const serverSnapshot = () => 0
const imagePath = (name: string) => `/images/jr/lessons/paid-in-full/${name}.webp`

export default function PaidInFull() {
  const { language } = useLanguage()
  return <Lesson key={language} lang={language === 'ru' ? 'ru' : 'en'} />
}
function Lesson({ lang }: { lang: Language }) {
  const t = content[lang]
  const scripture = lang === 'ru' ? scriptureRu : scriptureEn
  const done = useSyncExternalStore(subscribe, () => snapshot(lang), serverSnapshot)
  const [review, setReview] = useState<number | null>(null)
  const [mission, setMission] = useState<number | null>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const index = review ?? Math.min(done, 4)
  const completed = done === 5 && review === null
  const ru = lang === 'ru'
  function reset() {
    if (!window.confirm(t.resetConfirm)) return
    resetLessonMastery(ID)
    save(lang, 0); setReview(null); setMission(null)
  }
  function finish(grades: boolean[]) {
    if (index < done) { setReview(null); return }
    grades.forEach(correct => recordGradedAnswer(ID, correct))
    save(lang, index + 1)
    if (index === 4) markLessonComplete(ID)
    setReview(null)
    title.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  return <div className={styles.lesson}>
    <header className={styles.hero}>
      <Image src={imagePath('cover')} alt={ru ? 'Мишутка и Рози читают Библию рядом с образом долговой записи' : 'Michael and Rosie read the Bible beside a debt-scroll illustration'} fill priority sizes="100vw" className={styles.cover} />
      <div className={styles.shade} />
      <div className={styles.heroCopy}>
        <Link href="/lessons" className={styles.back}>← {t.all}</Link>
        <p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1>
        <p>{t.intro}</p><p className={styles.meta}>{t.peterRef} · {t.colRef}</p>
        <a className={styles.primary} href="#discovery">{t.start} <span aria-hidden="true">→</span></a>
        <p className={styles.meta}>{t.age}</p>
      </div>
    </header>
    <div className={styles.body}>
      <section className={styles.progress} aria-label={t.progress}>
        <div className={styles.progressTop}><strong>{t.progress}: {done} / 5</strong><button className={styles.textButton} onClick={reset}>{t.reset}</button></div>
        <progress value={done} max={5} aria-label={t.progress} />
        <div className={styles.steps}>{t.stages.map((s, i) => <button key={s.short} disabled={i > done} aria-current={index === i && !completed ? 'step' : undefined} onClick={() => setReview(i)}>{i < done ? '✓' : i + 1} · {s.short}{i > done ? <span className={styles.srOnly}> — {t.locked}</span> : null}</button>)}</div>
      </section>
      <h2 className={styles.anchor} id="discovery" tabIndex={-1} ref={title}>{completed ? t.completion : `${index + 1}. ${t.stages[index].title}`}</h2>
      {completed ? <section className={styles.finish} data-testid="completion">
        <div className={styles.seal} aria-hidden="true">✓</div><h3>{t.takeaway}</h3>
        <blockquote>{scripture.memory}<cite>{t.memoryRef} · {t.version}</cite></blockquote>
        <h3>{t.missionTitle}</h3><p>{t.mission}</p>
        <div className={styles.answers}>{t.missions.map((m, i) => <button key={m} aria-pressed={mission === i} onClick={() => setMission(i)}>{mission === i ? '✓ ' : ''}{m}</button>)}</div>
        {mission !== null && <p role="status">{ru ? 'Твой шаг выбран. Обсуди его со взрослым и попробуй на этой неделе.' : 'Your next step is chosen. Talk it over with a grown-up and try it this week.'}</p>}
        <details className={styles.guide}><summary>{t.prayerTitle}</summary><p>{t.prayer}</p><p className={styles.note}>{t.prayerNote}</p></details>
        <p className={styles.note}>{t.grace}</p>
        <div className={styles.actions}><button className={styles.primary} onClick={() => setReview(0)}>{t.back}</button><button onClick={reset}>{t.replay}</button><Link href="/lessons">{t.all} →</Link></div>
      </section> : <Discovery key={`${lang}:${index}:${done}`} lang={lang} index={index} solved={index < done} onFinish={finish} />}
      <p className={styles.note}>{t.save}</p>
      {done > 0 && <details className={styles.notebook}><summary>{t.review}</summary>{t.stages.slice(0, done).map((s, i) => <article key={s.title}><h3>{s.title}</h3><p>{s.truth}</p><p>{s.learn}</p>{i === 0 && t.matchCards.map(c => <p key={c.text}>✓ {c.text} — {t.matchLabels[c.category]}: {c.why}</p>)}{i === 1 && t.sortCards.map(c => <p key={c.text}>✓ {c.text} — {t.sortLabels[c.category]}: {c.why}</p>)}{i === 2 && <ol>{t.timeline.map(x => <li key={x}>{x}</li>)}</ol>}{i === 3 && <blockquote>{scripture.memory}<cite>{t.memoryRef} · {t.version}</cite></blockquote>}{i === 4 && t.quiz.map(q => <p key={q.question}><strong>{q.question}</strong><br />{q.options[q.correct]} — {q.explanation}</p>)}</article>)}</details>}
      <details className={styles.guide}><summary>{t.fullReading}</summary><h3>{t.peterRef} · {t.version}</h3><blockquote>{scripture.peter}</blockquote><h3>{t.colRef} · {t.version}</h3><blockquote>{scripture.colossians}</blockquote></details>
      <details className={styles.guide}><summary>{t.guide}</summary><p>{t.guideIntro}</p><ol>{t.plan.map(p => <li key={p}>{p}</li>)}</ol><h3>{t.discussionTitle}</h3>{t.discussions.map(([q, a]) => <p key={q}><strong>{q}</strong><br />{a}</p>)}<h3>{t.notesTitle}</h3>{t.notes.map(n => <p key={n}>{n}</p>)}<ul>{sources.map(([label, url], i) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{ru ? ['1 Петра 1:17–21 · ESV', '1 Петра 1:17–21 · Синодальный', 'Колоссянам 2:13–14 · ESV', 'Колоссянам 2:13–14 · Синодальный', 'Служба национальных парков · Линкольн', 'Историческое общество геодезистов · Линкольн', 'Королевская семья · Ричард I'][i] : label}</a></li>)}</ul></details>
    </div>
  </div>
}

function Discovery({ lang, index, solved, onFinish }: { lang: Language; index: number; solved: boolean; onFinish: (grades: boolean[]) => void }) {
  const t = content[lang]; const s = t.stages[index]; const ru = lang === 'ru'
  const scripture = lang === 'ru' ? scriptureRu : scriptureEn
  const [phase, setPhase] = useState<'see' | 'do' | 'feedback' | 'learn'>(solved ? 'learn' : 'see')
  const [hint, setHint] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [message, setMessage] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [grades, setGrades] = useState<boolean[]>([])
  const [order, setOrder] = useState([2, 4, 0, 3, 1])
  const [tiles, setTiles] = useState<number[]>([])
  const heading = useRef<HTMLHeadingElement>(null)
  const lastPhase = useRef(phase)
  useEffect(() => { if (lastPhase.current !== phase) { heading.current?.focus({ preventScroll: true }); lastPhase.current = phase } }, [phase])
  const words = scripture.memory.split(' ')
  const bank = words.map((_, i) => i).sort((a, b) => (a % 2) - (b % 2) || b - a)
  const phaseIndex = { see: 0, do: 1, feedback: 2, learn: 3 }[phase]
  function grade(ok: boolean, why = '') {
    if (accepted) return
    if (!ok) { setWrong(true); setMessage(`${t.retry} ${why || s.hint}`); return }
    setGrades(g => [...g, !wrong]); setAccepted(true); setMessage(`${t.success} ${why}`)
  }
  function nextCard(total: number) {
    if (!accepted) return
    if (cursor + 1 === total) { setPhase('feedback'); return }
    setCursor(c => c + 1); setAccepted(false); setWrong(false); setMessage('')
  }
  function move(i: number, delta: number) { setOrder(old => { const next = [...old]; [next[i], next[i + delta]] = [next[i + delta], next[i]]; return next }); setMessage('') }
  const cards = index === 0 ? t.matchCards : t.sortCards
  const labels = index === 0 ? t.matchLabels : t.sortLabels
  return <section className={styles.discovery} data-testid={`stage-${index}`}>
    <div className={styles.visual}><Image src={imagePath(s.image)} alt={s.alt} width={1024} height={768} sizes="(min-width: 900px) 45vw, 100vw" /><p>{s.truth}</p></div>
    <div className={styles.panel}>
      <div className={styles.phases} aria-label={ru ? 'Шаги открытия' : 'Discovery steps'}>{t.phases.map((label, i) => <span key={label} aria-current={phaseIndex === i ? 'step' : undefined}>{label}</span>)}</div>
      <h3 ref={heading} tabIndex={-1}>{phase === 'see' ? (ru ? 'Заглянем в письмо' : 'Look inside the letter') : phase === 'do' ? s.activity : phase === 'feedback' ? t.success : (ru ? 'Возьми с собой' : 'Take this with you')}</h3>
      {phase === 'see' && <>{s.paragraphs.map(p => <p key={p}>{p}</p>)}<blockquote>{scripture[s.verse]}<cite>{s.ref} · {t.version}</cite></blockquote><button className={styles.primary} onClick={() => setPhase('do')}>{ru ? 'Попробовать задание' : 'Try the activity'} →</button></>}
      {phase === 'do' && <>
        <p>{s.instruction}</p><button className={styles.textButton} aria-expanded={hint} onClick={() => setHint(!hint)}>{hint ? t.hideHint : t.hint}</button>
        {hint && <p className={styles.hint}>{index === 3 ? scripture.memory : s.hint}</p>}
        {index < 2 && <><p className={styles.counter}>{cursor + 1} {t.outOf} {cards.length}</p><div className={styles.card}>{cards[cursor].text}</div><div className={styles.windows}>{labels.map((label, i) => <button key={label} disabled={accepted} onClick={() => grade(i === cards[cursor].category, i === cards[cursor].category ? cards[cursor].why : s.hint)}>{index === 0 ? ['⌂', '⚖', '⌂ + ⚖'][i] : ['↓', '↗'][i]}<span>{label}</span></button>)}</div></>}
        {index === 2 && <><ol className={styles.timeline}>{order.map((item, i) => <li key={item}><span>{i + 1}. {t.timeline[item]}</span><div><button aria-label={`${t.moveUp}: ${t.timeline[item]}`} disabled={i === 0 || accepted} onClick={() => move(i, -1)}>↑</button><button aria-label={`${t.moveDown}: ${t.timeline[item]}`} disabled={i === 4 || accepted} onClick={() => move(i, 1)}>↓</button></div></li>)}</ol><button disabled={accepted} onClick={() => grade(order.every((item, i) => item === i))}>{t.check}</button></>}
        {index === 3 && <><div className={styles.tileTray} aria-label={t.selected}>{tiles.length ? tiles.map((id, i) => <button key={id} disabled={accepted} aria-label={`${t.remove} ${words[id]}`} onClick={() => { setTiles(old => old.filter((_, j) => j !== i)); setMessage('') }}>{words[id]}</button>) : <p>{t.empty}</p>}</div><div className={styles.wordBank} aria-label={t.wordBank}>{bank.map(id => <button key={id} disabled={tiles.includes(id) || accepted} onClick={() => { setTiles(old => [...old, id]); setMessage('') }}>{words[id]}</button>)}</div><div className={styles.actions}><button disabled={tiles.length !== words.length || accepted} onClick={() => grade(tiles.map(id => words[id]).join(' ') === scripture.memory)}>{t.check}</button><button disabled={accepted} onClick={() => { setTiles([]); setMessage('') }}>{t.clear}</button></div></>}
        {index === 4 && <><p className={styles.counter}>{t.question} {cursor + 1} {t.outOf} {t.quiz.length}</p><div className={styles.card}>{t.quiz[cursor].question}</div><div className={styles.answers}>{t.quiz[cursor].options.map((option, i) => <button disabled={accepted} key={option} onClick={() => grade(i === t.quiz[cursor].correct, i === t.quiz[cursor].correct ? t.quiz[cursor].explanation : s.hint)}>{option}</button>)}</div></>}
        <div aria-live="polite" className={`${styles.feedback} ${accepted ? styles.good : ''}`}>{message}</div>
        {accepted && <button className={styles.primary} onClick={() => index < 2 ? nextCard(cards.length) : index === 4 ? nextCard(t.quiz.length) : setPhase('feedback')}>{t.continue} →</button>}
      </>}
      {phase === 'feedback' && <><div className={styles.seal} aria-hidden="true">✓</div><p>{s.truth}</p>{index === 2 && <ol>{t.timeline.map(x => <li key={x}>{x}</li>)}</ol>}{index === 3 && <blockquote>{scripture.memory}<cite>{t.memoryRef} · {t.version}</cite></blockquote>}<button className={styles.primary} onClick={() => setPhase('learn')}>{t.continue} →</button></>}
      {phase === 'learn' && <><p>{s.learn}</p><div className={styles.hint}><strong>{ru ? 'Поговорим' : 'Talk it over'}</strong><p>{s.question}</p></div>{solved && <blockquote>{scripture[s.verse]}<cite>{s.ref} · {t.version}</cite></blockquote>}<button className={styles.primary} onClick={() => onFinish(grades)}>{solved ? (ru ? 'К моему шагу' : 'Back to my next step') : index === 4 ? t.finish : t.next} →</button></>}
    </div>
  </section>
}
