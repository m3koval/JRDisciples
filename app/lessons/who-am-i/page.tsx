'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ExternalSourceLink } from '@/components/ExternalSourceLink'
import { copy, type Scene } from './content'
import { scripture } from './scripture'
import styles from './page.module.css'

function Challenge({ scene, names, ru, onSuccess }: { scene: Scene; names: string[]; ru: boolean; onSuccess: () => void }) {
  const [picked, setPicked] = useState<number[]>([])
  const [matches, setMatches] = useState<number[]>([-1, -1, -1])
  const [wrong, setWrong] = useState(false)
  function grade(correct: boolean) { setWrong(!correct); if (correct) onSuccess() }
  return <div data-testid="challenge">
    <h2>{scene.task}</h2>
    {scene.kind !== 'match' && <div className={styles.choices}>{scene.options.map((option, i) => <button key={i} data-testid={`option-${i}`} aria-pressed={scene.kind === 'select' || scene.kind === 'sequence' ? picked.includes(i) : undefined} onClick={() => {
      if (scene.kind === 'choice') grade(scene.answer.includes(i))
      else { setWrong(false); setPicked(picked.includes(i) ? picked.filter(n => n !== i) : [...picked, i]) }
    }}>{(scene.kind === 'select' || scene.kind === 'sequence') && <span aria-hidden="true">{picked.includes(i) ? '✓ ' : '○ '}</span>}{option}</button>)}</div>}
    {scene.kind === 'match' && scene.options.map((prompt, row) => <fieldset key={row}><legend>{prompt}</legend><div className={styles.choices}>{[3, 1, 4, 0, 2].map(id => <button key={id} data-testid={`match-${row}-${id}`} aria-pressed={matches[row] === id} onClick={() => { setWrong(false); setMatches(matches.map((v, i) => i === row ? id : v)) }}>{names[id]}</button>)}</div></fieldset>)}
    {scene.kind === 'sequence' && <><ol data-testid="recall-answer">{picked.map(id => <li key={id}>{scene.options[id]}</li>)}</ol><button data-testid="clear" onClick={() => { setPicked([]); setWrong(false) }}>{ru ? 'Очистить' : 'Clear'}</button></>}
    {scene.kind !== 'choice' && <button className={styles.primary} data-testid="check" disabled={scene.kind === 'select' || scene.kind === 'sequence' ? !picked.length : matches.includes(-1)} onClick={() => grade(scene.kind === 'sequence' ? picked.length === scene.answer.length && picked.every((id, i) => id === scene.answer[i]) : scene.kind === 'select' ? picked.length === scene.answer.length && picked.every(id => scene.answer.includes(id)) : matches.every((id, i) => id === scene.answer[i]))}>{ru ? 'Проверить' : 'Check'}</button>}
    <p role="status" className={styles.feedback}>{wrong ? `${ru ? 'Попробуй ещё раз.' : 'Try again.'} ${scene.hint}` : ''}</p>
    <details><summary>{ru ? 'Нужна подсказка?' : 'Need a hint?'}</summary><p>{scene.hint}</p></details>
  </div>
}

export default function WhoAmIPage() {
  const { language } = useLanguage()
  const ru = language === 'ru'
  const t = copy[language]
  const verse = scripture[language]
  const [step, setStep] = useState(-1)
  const [phase, setPhase] = useState<'learn' | 'practice' | 'result'>('learn')
  const [mirror, setMirror] = useState<'people' | 'word'>('people')
  const [plan, setPlan] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const scene = t.scenes[Math.max(0, Math.min(step, t.scenes.length - 1))]
  const complete = step === t.scenes.length
  const completed = complete ? t.scenes.length : Math.max(0, step) + (phase === 'result' ? 1 : 0)
  function move(n: number, p: typeof phase = 'learn') {
    setStep(n); setPhase(p)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }) })
  }
  const quote = <blockquote className={styles.verse}><p>{verse.text}</p><cite>{verse.reference} · {verse.translation}</cite></blockquote>
  return <article className={styles.lesson} lang={language} data-testid="who-am-i">
    <nav className={styles.nav}><Link href="/lessons">← {ru ? 'Все уроки' : 'All lessons'}</Link><span>{ru ? 'Задания' : 'Challenges'}: {completed} / {t.scenes.length}</span></nav>
    <progress aria-label={ru ? 'Пройденные задания' : 'Completed challenges'} value={completed} max={t.scenes.length} />
    <header className={styles.header}><p>{verse.reference} · {ru ? 'История и задания · 15–20 минут' : 'Story & activities · 15–20 minutes'}</p>{step !== -1 && <strong>{t.title}</strong>}</header>
    <div className={styles.stage}>
      <aside className={styles.visual}>
        <Image src="/images/lessons/who-am-i/hero.png" alt={ru ? 'Дети приветствуют нового друга за столом с открытой Библией и зеркалом.' : 'Children welcome a new friend at a table with an open Bible and a mirror.'} width={1024} height={768} priority sizes="(min-width: 900px) 420px, 100vw" />
        {phase !== 'practice' && <div className={styles.mirrors}>
          <h2>{ru ? 'Два зеркала' : 'Two mirrors'}</h2>
          <div className={styles.tabs}><button data-testid="people-mirror" aria-pressed={mirror === 'people'} onClick={() => setMirror('people')}>{ru ? 'Мнение людей' : 'People’s opinions'}</button><button data-testid="word-mirror" aria-pressed={mirror === 'word'} onClick={() => setMirror('word')}>{ru ? 'Божье Слово' : 'God’s Word'}</button></div>
          <div className={styles.mirror} data-testid="mirror"><p>{mirror === 'people' ? (ru ? 'Когда нас оценивают только по…' : 'When people measure us only by…') : (ru ? 'Церковь во Христе — это…' : 'The Church in Christ is…')}</p><ul>{(mirror === 'people' ? t.labels : t.names).map(name => <li key={name}>{name}</li>)}</ul></div>
          <p className={styles.caption}>{ru ? 'Пояснения к уроку, не цитаты. Принадлежность Иисусу — дар милости.' : 'Lesson summaries, not quotations. Belonging to Jesus is a gift of mercy.'}</p>
        </div>}
      </aside>
      <section className={styles.panel}>
        <h1 ref={heading} tabIndex={-1}>{step === -1 ? t.title : complete ? (ru ? 'Не только кто, но и чей' : 'Not only who, but whose') : scene.title}</h1>
        {step === -1 ? <><p>{t.intro}</p><p>{ru ? 'Прочитайте вслух: как Пётр описывает Божий народ? Обратите внимание на последнее слово — милость.' : 'Read aloud: how does Peter describe God’s people? Listen especially for the gift of mercy at the end.'}</p>{quote}<button className={styles.primary} data-testid="start" onClick={() => move(0)}>{ru ? 'Начать историю' : 'Begin the story'} →</button></> : complete ? <>
          {t.end.map(p => <p key={p}>{p}</p>)}{quote}
          <fieldset><legend>{ru ? 'Если хочешь, выбери маленький шаг на сегодня' : 'If you like, choose a small step for today'}</legend>{(ru ? ['Замечу того, кто один.', 'Помолюсь и поблагодарю Бога.', 'Поговорю с надёжным взрослым о своём вопросе.'] : ['Notice someone who is alone.', 'Pray and thank God.', 'Talk with a trusted adult about my question.']).map((p, i) => <label className={styles.plan} key={i}><input type="radio" name="plan" checked={plan === i} onChange={() => setPlan(i)} />{p}</label>)}</fieldset>
          {plan !== null && <p role="status" className={styles.truth}>{ru ? 'Этот шаг — отклик, а не плата за Божью любовь. Можно попросить взрослого помочь.' : 'This step is a response, not payment for God’s love. You can ask an adult to help.'}</p>}
          <p className={styles.caption}>{ru ? 'Личные ответы не отправляются и не сохраняются. После обновления страницы урок начнётся заново.' : 'Personal answers are not sent or saved. Refreshing starts the lesson over.'}</p>
          <div className={styles.actions}><Link href="/lessons/alone-with-god">{ru ? 'Дальше: Наедине с Богом' : 'Next: Alone with God'} →</Link><button data-testid="restart" onClick={() => { setPlan(null); setMirror('people'); move(-1) }}>{ru ? 'Пройти ещё раз' : 'Start again'}</button></div>
        </> : phase === 'learn' ? <>
          {scene.paragraphs.map(p => <p key={p}>{p}</p>)}{(step === 0 || scene.kind === 'sequence') && quote}<div className={styles.talk}><h2>{ru ? 'Остановись и подумай' : 'Pause and think'}</h2><p>{scene.talk}</p></div>
          <button className={styles.primary} data-testid="play" onClick={() => move(step, 'practice')}>{ru ? 'Попробовать задание' : 'Try the challenge'} →</button>
        </> : phase === 'practice' ? <><Challenge key={`${language}-${step}`} scene={scene} names={t.names} ru={ru} onSuccess={() => move(step, 'result')} /><button className={styles.back} data-testid="read-again" onClick={() => move(step)}>{ru ? 'Вернуться к истории' : 'Return to the story'}</button></> : <>
          <div className={styles.truth} role="status"><h2>{ru ? 'Да, вот что важно' : 'Yes—here is what matters'}</h2><p>{scene.truth}</p></div><button className={styles.primary} data-testid="next" onClick={() => move(step + 1)}>{ru ? 'Продолжить' : 'Continue'} →</button>
        </>}
        {step > 0 && !complete && <button className={styles.back} data-testid="previous" onClick={() => move(step - 1)}>{ru ? '← Предыдущая часть' : '← Previous part'}</button>}
      </section>
    </div>
    <section className={styles.guide} aria-labelledby="printables-title"><h2 id="printables-title">{ru ? 'Книжка к уроку' : 'Your lesson booklet'}</h2><p>{ru ? 'Читай на экране или распечатай, сложи и обсуждай вместе с друзьями.' : 'Read on screen, or print, fold, and explore with friends.'}</p><div className={styles.actions}><a href={`/printables/who-am-i/Who-Am-I-${language.toUpperCase()}-READING-ORDER.pdf`}>{ru ? 'Читать книжку (PDF)' : 'Read the booklet (PDF)'}</a><a href={`/printables/who-am-i/Who-Am-I-${language.toUpperCase()}-LETTER-LONG-EDGE.pdf`} download>{ru ? 'Для печати (PDF)' : 'Print booklet (PDF)'}</a></div><p className={styles.caption}>{ru ? 'Бумага Letter, масштаб 100%, двусторонняя печать с переворотом по длинному краю. Сложи листы пополам. QR-код ведёт к этому уроку на Junior Disciples.' : 'US Letter, 100% scale, double-sided printing: flip on the long edge. Fold the sheets in half. The QR code opens this lesson on Junior Disciples.'}</p></section>
    <details className={styles.guide}><summary>{ru ? 'Для родителей и учителей · текст Библии и пояснения' : 'For parents & teachers · Bible text and notes'}</summary><p><a href="/printables/who-am-i/Who-Am-I-BILINGUAL-ANSWER-KEY.pdf" download>{ru ? 'Ответы для взрослых (PDF)' : 'Answer key for adults (PDF)'}</a></p>{t.adult.map(p => <p key={p}>{p}</p>)}<ExternalSourceLink href={verse.url}>{ru ? 'Прочитать отрывок на Bible.com' : 'Read the passage on Bible.com'} ↗</ExternalSourceLink></details>
  </article>
}
