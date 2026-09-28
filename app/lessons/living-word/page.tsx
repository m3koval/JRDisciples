'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useRef, useState, useSyncExternalStore} from 'react'
import {useLanguage} from '@/context/LanguageContext'
import {ExternalSourceLink} from '@/components/ExternalSourceLink'
import {markLessonComplete, recordGradedAnswer, resetLessonMastery} from '@/lib/lesson-mastery'
import {copy, images} from './content'
import {scriptureEn, scriptureRu, type VerseData} from './scripture'
import {initial, parseProgress, applyAnswer, type Progress} from './state'
import {createProgressStore} from './store'
import styles from './page.module.css'

const ID = 'living-word'
const EMPTY = JSON.stringify(initial)
const store = createProgressStore(EMPTY)
const fruitAnswers = [1,2,0]
const claimAnswers = [1,0,1]

export default function LivingWordPage() {
  const {language} = useLanguage()
  const raw = useSyncExternalStore(store.subscribe, store.snapshot, () => EMPTY)
  const persistent = useSyncExternalStore(store.subscribe, store.canPersist, () => true)
  return <Lesson key={language} language={language} p={parseProgress(raw)} persistent={persistent}/>
}
function Lesson({language,p,persistent}:{language:'en'|'ru';p:Progress;persistent:boolean}) {
  const t = copy[language]
  const scriptures = language === 'ru' ? scriptureRu : scriptureEn
  const getVerse = (id:string) => scriptures.find(v=>v.id===id)!
  const index = Math.max(0,Math.min(3,p.scene-1))
  const verse = getVerse(['MAT.22.29','JAS.1.22','GAL.5.22-23','1TH.5.21'][index])
  const [selected,setSelected] = useState<number|null>(null)
  const [feedback,setFeedback] = useState('')
  const [positive,setPositive] = useState(false)
  const [hint,setHint] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const completedTruths = p.scene===5 ? 4 : Math.max(0,p.scene-1)
  const claim = [0,1,2].find(id=>!p.claims.includes(id)) ?? 2
  function save(next:Progress) {store.save(JSON.stringify(next))}
  function update(patch:Partial<Progress>) {save({...p,...patch})}
  function focusHeading() {requestAnimationFrame(()=>{heading.current?.focus(); heading.current?.scrollIntoView({block:'nearest',behavior:'instant'})})}
  function transition(patch:Partial<Progress>) {
    update(patch); setSelected(null); setFeedback(''); setHint(false); focusHeading()
  }
  function grade(key:string,correct:boolean,message:string,patch:Partial<Progress>={}) {
    if (!(key in p.attempts)) recordGradedAnswer(ID,correct)
    const next = applyAnswer(p,key,correct,patch)
    save(next); setPositive(correct); setFeedback(message)
    if (correct) setSelected(null)
    if (next.phase==='feedback') focusHeading()
  }
  function answerClaim(bucket:number) {
    const correct = claimAnswers[claim]===bucket
    grade(`claim-${claim}`,correct,t.claimFeedback[claim],correct?{claims:[...p.claims,claim]}:{})
  }
  const title = p.scene===0 ? t.title : p.scene===5 ? t.done : t.titles[index]
  return <article className={styles.lesson} lang={language} data-testid="living-word">
    <nav className={styles.nav}><Link href="/lessons">← {t.all}</Link><span>{t.progress}: {completedTruths} / 4</span></nav>
    <progress className={styles.progress} aria-label={t.progress} max={4} value={completedTruths}/>
    <section className={styles.stage}>
      <div className={`${styles.visual} ${p.scene===1?styles.tomb:''}`}>
        <Image src={images[p.scene]} alt={t.alts[p.scene]} fill sizes="(orientation: portrait) 100vw, (max-width: 760px) 100vw, 44vw" priority/>
        <div className={styles.imageShade}/>
        <div className={styles.imageCaption}><span>{p.scene>0 && p.scene<5 ? `${p.scene} / 4` : '✦'}</span></div>
      </div>
      <div className={styles.panel}>
        {p.scene>0 && p.scene<5 && <ol className={styles.phases} aria-label={t.progress}>{(['see','do','feedback','learn'] as const).map((phase,i)=><li key={phase} aria-current={p.phase===phase?'step':undefined}>{t.phases[i]}</li>)}</ol>}
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        {p.scene===0 ? <>
          <p>{t.intro}</p><Verse verse={getVerse('JHN.14.19')}/>
          <button data-testid="start" className={styles.primary} onClick={()=>transition({scene:1,phase:'see'})}>{t.start} →</button>
        </> : p.scene===5 ? <>
          {!p.completed ? <>
            <p>{t.doneText}</p>
            <fieldset className={styles.plans}><legend>{t.planTitle}</legend>{t.plans.map((plan,id)=><label key={id}><input type="radio" name="plan" checked={p.plan===id} onChange={()=>update({plan:id})}/><span>{plan}</span></label>)}</fieldset>
            <button data-testid="commit" className={styles.primary} disabled={p.plan===null} onClick={()=>{markLessonComplete(ID);transition({completed:true})}}>{t.commit} →</button>
          </> : <>
            <div className={styles.truth} role="status"><strong>✓ {t.completed}</strong><p>{t.planSaved} {t.plans[p.plan!]}</p></div>
            <Verse verse={getVerse('JHN.14.19')}/><p>{t.prayer}</p>
            <Link className={styles.primary} href="/lessons/grace-in-the-kingdom">{t.nextLesson} →</Link>
            <button onClick={()=>{resetLessonMastery(ID);save(initial);setFeedback('');setSelected(null);setHint(false);focusHeading()}}>{t.again}</button>
          </>}
        </> : p.phase==='see' ? <>
          <p>{t.teaching[index]}</p><Verse verse={verse}/>
          <button data-testid="play" className={styles.primary} onClick={()=>transition({phase:'do'})}>{t.play} →</button>
        </> : p.phase==='feedback' ? <>
          <div className={styles.truth} role="status"><strong>✓ {t.success}</strong><p>{p.scene===1?t.choiceFeedback[1]:p.scene===2?t.hints[1]:p.scene===3?t.hints[2]:t.hints[3]}</p></div>
          <button data-testid="learn" className={styles.primary} onClick={()=>transition({phase:'learn'})}>{t.learn} →</button>
        </> : p.phase==='learn' ? <>
          <p className={styles.takeaway}>{t.learns[index]}</p>
          <Verse verse={p.scene===1?getVerse('JHN.14.19'):p.scene===3?getVerse('EPH.2.8-10'):verse}/>
          <button data-testid="next" className={styles.primary} onClick={()=>transition({scene:p.scene+1,phase:'see'})}>{p.scene===4?t.finish:t.next} →</button>
        </> : <>
          <p className={styles.task}>{t.tasks[index]}</p>
          {p.scene===1 && <div className={styles.choices}>{t.choices.map((choice,id)=><button key={id} data-testid={`choice-${id}`} onClick={()=>grade('context',id===1,t.choiceFeedback[id],id===1?{context:true}:{})}>{choice}</button>)}</div>}
          {p.scene===2 && <>
            <ol className={styles.order} aria-label={t.tasks[1]}>{p.order.map(id=><li key={id}>{t.steps[id]}</li>)}</ol>
            <div className={styles.choices}>{[2,0,1].map(id=><button data-testid={`tile-${id}`} key={id} disabled={p.order.includes(id)} onClick={()=>{update({order:[...p.order,id]});setFeedback('')}}>{t.steps[id]}</button>)}</div>
            <div className={styles.tools}><button disabled={!p.order.length} onClick={()=>{update({order:p.order.slice(0,-1)});setFeedback('')}}>{t.undo}</button><button data-testid="clear" disabled={!p.order.length} onClick={()=>{update({order:[]});setFeedback('')}}>{t.clear}</button></div>
            <button data-testid="check" className={styles.primary} disabled={p.order.length!==3} onClick={()=>grade('order',p.order.every((v,i)=>v===i),t.hints[1])}>{t.check}</button>
          </>}
          {p.scene===3 && <div className={styles.matches}>
            <div>{t.moments.map((moment,id)=><button data-testid={`moment-${id}`} key={id} disabled={p.matched.includes(id)} aria-pressed={selected===id} onClick={()=>{setSelected(id);setFeedback('')}}>{p.matched.includes(id)?'✓ ':''}{moment}</button>)}</div>
            <div>{t.actions.map((action,id)=><button data-testid={`action-${id}`} key={id} disabled={selected===null || p.matched.some(n=>fruitAnswers[n]===id)} onClick={()=>{if(selected===null)return; const correct=fruitAnswers[selected]===id;grade(`fruit-${selected}`,correct,correct?t.success:t.fruitFeedback[selected],correct?{matched:[...p.matched,selected]}:{})}}>{action}</button>)}</div>
          </div>}
          {p.scene===4 && <>
            <p className={styles.claim} data-testid={`claim-${claim}`}><span>{p.claims.length+1} / 3</span>{t.claims[claim]}</p>
            <div className={styles.buckets}>{t.buckets.map((bucket,id)=><button key={id} data-testid={`bucket-${id}`} onClick={()=>answerClaim(id)}>{bucket}</button>)}</div>
          </>}
          <div className={`${styles.feedback} ${positive?styles.positive:''}`} role="status" aria-live="polite">{feedback && <>{positive?'✓ ':`${t.retry} `}{feedback}</>}</div>
          <details className={styles.hint} open={hint} onToggle={e=>setHint(e.currentTarget.open)}><summary>{t.hint}</summary><p>{t.hints[index]}</p><Verse verse={verse}/></details>
        </>}
        <small className={styles.saveNote} role={persistent?undefined:'status'}>{persistent?t.saved:t.sessionOnly}</small>
      </div>
    </section>
    <details className={styles.parent}><summary>{t.parent}</summary><p>{t.note}</p><p>{t.art}</p><ExternalSourceLink href="https://boxcast.tv/view/omqntujmt4hjw6710z9a">{t.source} ↗</ExternalSourceLink><div className={styles.sources}>{scriptures.map(v=><Verse key={v.id} verse={v}/>)}</div></details>
  </article>
}
function Verse({verse}:{verse:VerseData}) {
  return <blockquote className={styles.verse}><p>{verse.text}</p><cite><ExternalSourceLink href={verse.url}>{verse.reference} · {verse.translation==='RST'?'Синодальный перевод (RST)':'ESV'} ↗</ExternalSourceLink></cite></blockquote>
}
