'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ExternalSourceLink } from '@/components/ExternalSourceLink'
import { copy, type Scene } from './content'
import { scriptureEn, scriptureRu, type Scripture } from './scripture'
import styles from './page.module.css'

type Language = 'en' | 'ru'
function Verse({ verse }: { verse: Scripture }) {
  return <blockquote className={styles.verse}><p>“{verse.text}”</p><cite>{verse.reference} · {verse.translation}</cite></blockquote>
}

function Challenge({ scene, language, onSuccess }: { scene: Scene; language: Language; onSuccess: () => void }) {
  const t = copy[language]
  const verses = language === 'ru' ? scriptureRu : scriptureEn
  const [picked, setPicked] = useState<number[]>([])
  const [matches, setMatches] = useState<number[]>([-1, -1, -1])
  const [wrong, setWrong] = useState(false)
  const tiles = scene.kind === 'memory' ? verses.continual.text.split(' ') : scene.options
  const ordered = scene.kind === 'order' || scene.kind === 'memory'
  const indices = tiles.map((_, i) => i)
  const shuffled = indices.length > 1 ? [...indices.slice(1), indices[0]] : indices
  function grade(correct: boolean) { setWrong(!correct); if (correct) onSuccess() }
  function toggle(id: number) {
    setWrong(false)
    setPicked(picked.includes(id) ? picked.filter(value => value !== id) : [...picked, id])
  }
  return <div data-testid="challenge">
    <h2>{scene.task}</h2>
    {scene.kind === 'memory' && <><p className={styles.label}>{t.memory}</p><Verse verse={verses.continual} /></>}
    {scene.kind === 'choice' && <div className={styles.choices}>{scene.options.map((option, i) => <button key={i} data-testid={`option-${i}`} onClick={() => grade(scene.answer.includes(i))}>{option}</button>)}</div>}
    {scene.kind === 'select' && <><div className={styles.choices}>{scene.options.map((option, i) => <button key={i} data-testid={`option-${i}`} aria-pressed={picked.includes(i)} onClick={() => toggle(i)}><span aria-hidden="true">{picked.includes(i) ? '☑' : '□'} </span>{option}</button>)}</div><button className={styles.primary} data-testid="check" disabled={!picked.length} onClick={() => grade(picked.length === scene.answer.length && picked.every(id => scene.answer.includes(id)))}>{t.check}</button></>}
    {ordered && <>
      <ol className={styles.order} aria-label={scene.task}>{picked.map(id => <li key={id}>{tiles[id]}</li>)}</ol>
      <div className={styles.choices}>{shuffled.map(id => <button key={id} data-testid={`tile-${id}`} disabled={picked.includes(id)} onClick={() => { setPicked([...picked, id]); setWrong(false) }}>{tiles[id]}</button>)}</div>
      <div className={styles.actions}><button data-testid="clear" disabled={!picked.length} onClick={() => { setPicked([]); setWrong(false) }}>{t.clear}</button><button className={styles.primary} data-testid="check" disabled={picked.length !== tiles.length} onClick={() => grade(picked.every((id, i) => id === i))}>{t.check}</button></div>
    </>}
    {scene.kind === 'match' && <>
      {t.matchPrompts.map((prompt, i) => <fieldset className={styles.match} key={i}><legend>{prompt}</legend><div className={styles.choices}>{[2, 0, 1].map(id => <button key={id} data-testid={`match-${i}-${id}`} aria-pressed={matches[i] === id} onClick={() => { setMatches(matches.map((value, row) => row === i ? id : value)); setWrong(false) }}>{t.matchAnswers[id]}</button>)}</div></fieldset>)}
      <button className={styles.primary} data-testid="check" disabled={matches.includes(-1)} onClick={() => grade(matches.every((id, i) => id === i))}>{t.check}</button>
    </>}
    <p role="status" aria-live="polite" className={styles.feedback}>{wrong ? `${t.retry} ${scene.hint}` : ''}</p>
    <details><summary>{t.hint}</summary><p>{scene.hint}</p></details>
  </div>
}

export default function AloneWithGodPage() {
  const { language } = useLanguage()
  const t = copy[language]
  const scripture = language === 'ru' ? scriptureRu : scriptureEn
  const [step, setStep] = useState(-1)
  const [phase, setPhase] = useState<'learn' | 'practice' | 'result'>('learn')
  const [plan, setPlan] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const total = t.scenes.length
  const scene = t.scenes[Math.min(Math.max(step, 0), total - 1)]
  const completed = step === total ? total : Math.max(0, step) + (phase === 'result' ? 1 : 0)
  function move(nextStep: number, nextPhase: typeof phase = 'learn') {
    setStep(nextStep); setPhase(nextPhase)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }) })
  }
  return <article className={styles.lesson} lang={language} data-testid="alone-with-god">
    <nav className={styles.nav}><Link href="/lessons">← {t.all}</Link><span>{t.progress}: {completed} / {total}</span></nav>
    <progress className={styles.progress} aria-label={t.progress} value={completed} max={total} />
    <header className={styles.header}><p>{t.eyebrow}</p>{step !== -1 && <strong>{t.title}</strong>}</header>
    <section className={styles.stage}>
      <div className={styles.visual}><Image src="/images/lessons/alone-with-god/hero.png" alt={t.alt} width={1024} height={768} priority sizes="(min-width: 900px) 440px, 100vw" /><div className={styles.imageCaption}>{t.title}<span>{language === 'ru' ? 'Матфея 6:6' : 'Matthew 6:6'}</span></div></div>
      <div className={styles.panel}>
        <h1 ref={heading} tabIndex={-1}>{step === -1 ? t.title : step === total ? t.done : scene.title}</h1>
        {step === -1 ? <>
          <p className={styles.lead}>{t.intro}</p><Verse verse={scripture.private} />
          <button className={styles.primary} data-testid="start" onClick={() => move(0)}>{t.start} →</button>
        </> : step === total ? <>
          <p>{t.doneText}</p><p className={styles.label}>{t.memory}</p><Verse verse={scripture.continual} />
          <h2>{t.responseTitle}</h2><p>{t.response}</p>
          <fieldset className={styles.plans}><legend>{t.planTitle}</legend>{t.plans.map((text, i) => <label key={i}><input type="radio" name="personal-step" checked={plan === i} onChange={() => setPlan(i)} />{text}</label>)}</fieldset>
          {plan !== null && <p className={styles.truth} role="status">{t.planReply}</p>}
          <p className={styles.privacy}>{t.privacy}</p>
          <div className={styles.actions}><Link className={styles.primary} href="/lessons/how-to-pray">{t.nextLesson} →</Link><button data-testid="restart" onClick={() => { setPlan(null); move(-1) }}>{t.again}</button></div>
        </> : phase === 'learn' ? <>
          <div className={styles.reading}>{scene.paragraphs.map((text, i) => <p key={i}>{text}</p>)}</div>
          {scene.verses.map(key => <Verse key={key} verse={scripture[key]} />)}
          <button className={styles.primary} data-testid="play" onClick={() => move(step, 'practice')}>{t.play} →</button>
        </> : phase === 'practice' ? <>
          <Challenge key={`${step}-${language}`} scene={scene} language={language} onSuccess={() => move(step, 'result')} />
          <button className={styles.back} data-testid="read-again" onClick={() => move(step)}>{t.back}</button>
        </> : <>
          <div className={styles.truth} role="status"><h2>✓ {t.success}</h2><p>{scene.truth}</p></div>
          <button className={styles.primary} data-testid="next" onClick={() => move(step + 1)}>{t.next} →</button>
        </>}
      </div>
    </section>
    <section className={styles.downloads}><h2>{t.printable}</h2><p><a href="/printables/alone-with-god/Alone-with-God-EN-LETTER-LONG-EDGE.pdf" download>{t.englishPdf}</a><a href="/printables/alone-with-god/Alone-with-God-RU-LETTER-LONG-EDGE.pdf" download>{t.russianPdf}</a></p><p>{t.printHelp}</p></section>
    <details className={styles.guide}><summary>{t.guide}</summary>{t.adult.map((text, i) => <p key={i}>{text}</p>)}
      <h2>{t.source}</h2>{Object.entries(scripture).map(([key, verse]) => <div key={key}><ExternalSourceLink href={verse.url}>{verse.reference} · {verse.translation} ↗</ExternalSourceLink>{key === 'crowds' && <Verse verse={verse} />}</div>)}
    </details>
  </article>
}
