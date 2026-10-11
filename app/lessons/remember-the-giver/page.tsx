'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ExternalSourceLink } from '@/components/ExternalSourceLink'
import { markLessonComplete, recordGradedAnswer, resetLessonMastery } from '@/lib/lesson-mastery'
import { copy, scriptureEn, scriptureRu } from './content'
import { teacherGuide } from './teacher-guide'
import styles from './page.module.css'

const ID = 'remember-the-giver'
export default function RememberTheGiverPage() {
  const { language } = useLanguage()
  const t = language === 'ru' ? copy.ru : copy.en
  const verse = language === 'ru' ? scriptureRu : scriptureEn
  const [scene, setScene] = useState(-1)
  const [phase, setPhase] = useState<'learn' | 'do' | 'result'>('learn')
  const [order, setOrder] = useState<number[]>([])
  const [feedback, setFeedback] = useState(false)
  const [graded, setGraded] = useState<number[]>([])
  const [plan, setPlan] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const s = t.scenes[Math.max(0, Math.min(5, scene))]
  const tiles = scene === 1 ? t.verseTiles : t.kingTiles
  const sequence = scene === 1 || scene === 3
  const completed = scene === 6 ? 6 : Math.max(0, scene) + (phase === 'result' ? 1 : 0)
  function transition(nextScene: number, nextPhase: typeof phase = 'learn') {
    setScene(nextScene); setPhase(nextPhase); setOrder([]); setFeedback(false)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }) })
  }
  function grade(correct: boolean) {
    if (!graded.includes(scene)) {
      // A fresh run owns its own first-attempt score, including after reload.
      if (graded.length === 0) resetLessonMastery(ID)
      recordGradedAnswer(ID, correct); setGraded([...graded, scene])
    }
    setFeedback(!correct)
    if (correct) setPhase('result')
  }
  const verseCard = <blockquote className={styles.verse}><strong>{t.verseLabel}</strong><p>“{verse.text}”</p><cite>{verse.reference} · {verse.translation}</cite></blockquote>
  return <article className={styles.lesson} lang={language} data-testid={ID}>
    <nav className={styles.nav}><Link href="/lessons">← {t.all}</Link><span>{t.progress}: {completed} / 6</span></nav>
    <progress className={styles.progress} aria-label={t.progress} max={6} value={completed} />
    <header className={styles.header}><p>{t.eyebrow}</p>{scene !== -1 && <strong>{t.title}</strong>}</header>
    <section className={styles.stage}>
      <div className={styles.visual}>
        <a href="/images/jr/lessons/remember-the-giver/cover.webp" target="_blank" rel="noopener noreferrer" aria-label={language === 'ru' ? 'Открыть большую картинку в новой вкладке' : 'Open the full picture in a new tab'}>
        <Image src="/images/jr/lessons/remember-the-giver/cover.webp" alt={t.alt} width={1024} height={1024} sizes="(max-width: 800px) 100vw, 40vw" priority />
          <span>{language === 'ru' ? 'Увеличить картинку ↗' : 'Enlarge the picture ↗'}</span>
        </a>
        <p>{t.hunt}</p>
      </div>
      <div className={styles.panel}>
        <h1 ref={heading} tabIndex={-1}>{scene === -1 ? t.title : scene === 6 ? t.done : s.title}</h1>
        {scene === -1 ? <>
          <p className={styles.lead}>{t.intro}</p>{verseCard}
          <button className={styles.primary} data-testid="start" onClick={() => transition(0)}>{t.start} →</button><small>{t.session}</small>
        </> : scene === 6 ? <>
          <p>{t.doneText}</p>{verseCard}
          <fieldset><legend>{t.planTitle}</legend>{t.plans.map((text, i) => <label className={styles.plan} key={i}><input type="radio" name="response" checked={plan === i} onChange={() => setPlan(i)} />{text}</label>)}</fieldset>
          <p>{t.planReply}</p><p className={styles.truth}>{t.prayer}</p><p>{t.home}</p>
          <Link className={styles.primary} href="/lessons/grace-in-the-kingdom">{t.nextLesson} →</Link>
          <button onClick={() => { resetLessonMastery(ID); setGraded([]); setPlan(null); transition(-1) }}>{t.again}</button>
        </> : <>
          <p className={styles.reference}>{s.reference}{scene >= 1 && scene <= 3 ? ` · ${t.retelling}` : ''}</p>
          {phase === 'learn' ? <>
            {s.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
            {scene === 1 && verseCard}
            <button className={styles.primary} data-testid="play" onClick={() => transition(scene, 'do')}>{t.play} →</button>
          </> : phase === 'result' ? <>
            <div className={styles.truth} role="status"><strong>✓ {t.success}</strong><p>{s.truth}</p></div>
            <button className={styles.primary} data-testid="next" onClick={() => { if (scene === 5) markLessonComplete(ID); transition(scene + 1) }}>{t.next} →</button>
          </> : <>
            <h2>{s.task}</h2>{scene === 1 && verseCard}
            {sequence ? <>
              <ol className={styles.order} aria-label={s.task}>{order.map(id => <li key={id}>{tiles[id]}</li>)}</ol>
              <div className={styles.choices}>{(scene === 1 ? [2, 0, 3, 1] : [2, 0, 1]).map(id => <button key={id} data-testid={`tile-${id}`} disabled={order.includes(id)} onClick={() => { setOrder([...order, id]); setFeedback(false) }}>{tiles[id]}</button>)}</div>
              <button disabled={!order.length} data-testid="clear" onClick={() => { setOrder([]); setFeedback(false) }}>{t.clear}</button>
              <button className={styles.primary} data-testid="check" disabled={order.length !== tiles.length} onClick={() => grade(order.every((id, i) => id === i))}>{t.check}</button>
            </> : <div className={styles.choices}>{s.options.map((text, i) => <button data-testid={`option-${i}`} key={i} onClick={() => grade(i === s.answer)}>{text}</button>)}</div>}
            <div role="status" aria-live="polite" className={styles.feedback}>{feedback ? `${t.retry} ${s.hint}` : ''}</div>
            <details><summary>{t.hint}</summary><p>{s.hint}</p></details>
            <button onClick={() => transition(scene)}>{t.back}</button>
          </>}
        </>}
      </div>
    </section>
    <details className={styles.guide}><summary>{t.guide}</summary>
      <p>{language === 'ru' ? 'Скачать лист для печати: LETTER, альбомная ориентация, двусторонняя печать — переворот по ДЛИННОМУ краю (LONG-edge). Сложите пополам.' : 'Download the printable: LETTER, landscape, duplex — flip on the LONG edge. Fold in half.'}</p>
      <p><a href="/print/remember-the-giver/PRINT-EN-FRONT-QR-LONG-EDGE.pdf" download>{language === 'ru' ? 'Лист на английском (PDF)' : 'English printable (PDF)'}</a> · <a href="/print/remember-the-giver/PRINT-RU-FRONT-QR-LONG-EDGE.pdf" download>{language === 'ru' ? 'Лист на русском (PDF)' : 'Russian printable (PDF)'}</a></p>
      <p>{t.adultNote}</p><ExternalSourceLink href={verse.url}>{t.source}: {verse.reference} · {verse.translation} ↗</ExternalSourceLink>
      {teacherGuide[language].pages.map((page, i) => <section key={i}><h2>{page.title}</h2><p>{page.kicker}</p>{page.blocks.map((block, j) => <div key={j}><h3>{block.heading}</h3><p>{block.text}</p></div>)}</section>)}
    </details>
  </article>
}
