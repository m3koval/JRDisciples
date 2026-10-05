'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { advance, beginStage, course, COURSE_LENGTH, createRun, GOAL, pause, resume, safeBest, saveBest, STAGES, type Run } from './engine'
import styles from './runner.module.css'

// Existing Scripture wording and reference pairs are preserved.
const WISDOM = [
  { en: 'Your word is a lamp to my feet and a light to my path.', ru: 'Слово Твое — светильник ноге моей и свет стезе моей.', refEn: 'Psalm 119:105', refRu: 'Псалом 118:105' },
  { en: 'You will know the truth, and the truth will set you free.', ru: 'И познаете истину, и истина сделает вас свободными.', refEn: 'John 8:32', refRu: 'Иоанна 8:32' },
  { en: 'Be doers of the word, and not hearers only.', ru: 'Будьте же исполнители слова, а не слышатели только.', refEn: 'James 1:22', refRu: 'Иакова 1:22' },
  { en: 'When I am afraid, I put my trust in you.', ru: 'Когда я в страхе, на Тебя я уповаю.', refEn: 'Psalm 56:3', refRu: 'Псалом 55:4' },
]
const EN = {
  title:'Truth Runner', back:'All Games', start:'Light the trail', next:'Next trail', retry:'Try this trail again', replay:'Run again',
  pause:'Pause', paused:'Taking a rest', resume:'Keep going', exit:'Exit', best:'Best', score:'Score', lives:'Hearts',
  objective:'Collect 6 lights. Dodge the rocks.', controls:'Hold ◀ or ▶ to steer. Or slide your finger across the trail. Keyboard: ← → or A / D.',
  left:'Steer left', right:'Steer right', stage:'Trail', lights:'Lights', finish:'Rest stop', cleared:'Trail lit!', won:'You lit all four trails!',
  lost:'Let’s try that trail again', missed:'Find at least 6 lights before the rest stop.', bumped:'Watch the rocks. There is always a way around.',
  saved:'Best score stays on this device.', unsaved:'Saving is unavailable. You can still play.',
  good:'Light collected!', rock:'A bump! Keep following the lights.', intro:'Carry a lantern along four woodland trails. Stop along the way to hear God’s Word.',
  apply:['God’s Word guides us. Follow the lights to the rest stop.', 'Jesus tells the truth. We can trust His words.', 'God’s Word is for living. Choose one kind thing to do today.', 'When you feel afraid, you can turn to God.'],
  places:['Lantern Grove','River Bend','High Meadow','Homeward Trail'],
}
const RU: typeof EN = {
  title:'Путь истины', back:'Все игры', start:'Осветить тропу', next:'Следующая тропа', retry:'Попробовать ещё', replay:'Пройти снова',
  pause:'Пауза', paused:'Время отдохнуть', resume:'Продолжить', exit:'Выйти', best:'Рекорд', score:'Очки', lives:'Сердечки',
  objective:'Собери 6 огоньков. Обходи камни.', controls:'Удерживай ◀ или ▶. Или веди пальцем по тропе. Клавиатура: ← → или A / D.',
  left:'Двигаться влево', right:'Двигаться вправо', stage:'Тропа', lights:'Огоньки', finish:'Привал', cleared:'Тропа освещена!', won:'Все четыре тропы освещены!',
  lost:'Попробуем ещё раз', missed:'Собери хотя бы 6 огоньков до привала.', bumped:'Обходи камни. Рядом всегда есть проход.',
  saved:'Рекорд хранится на этом устройстве.', unsaved:'Не удалось сохранить рекорд. Играть можно дальше.',
  good:'Огонёк собран!', rock:'Камень! Следуй за огоньками.', intro:'Пронеси фонарь по четырём лесным тропам. На привалах тебя ждёт Божье Слово.',
  apply:['Божье Слово направляет нас. Следуй за огоньками до привала.', 'Иисус говорит истину. Его словам можно доверять.', 'Божье Слово учит жить. Сделай сегодня доброе дело.', 'Когда тебе страшно, ты можешь обратиться к Богу.'],
  places:['Роща фонарей','Излучина реки','Высокий луг','Дорога домой'],
}

export default function TruthRunnerPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const copy = isRu ? RU : EN
  const [run, setRun] = useState<Run>(createRun)
  const runRef = useRef(run)
  const [best, setBest] = useState(0)
  const bestRef = useRef(0)
  const [storageOkay, setStorageOkay] = useState(true)
  const keys = useRef(new Set<string>())
  const holds = useRef(new Map<number, number>())
  const pointer = useRef<{ id:number; x:number } | null>(null)
  const arena = useRef<HTMLDivElement>(null)
  const dialogButton = useRef<HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(0)
  const active = run.status === 'running'
  const started = run.status !== 'ready'
  const modal = !active
  const verse = WISDOM[run.stage]

  function publish(next: Run) { runRef.current = next; setRun(next) }
  function clearInput() {
    keys.current.clear(); holds.current.clear(); setPressed(0)
    const p = pointer.current
    pointer.current = null
    if(p && arena.current?.hasPointerCapture(p.id)) arena.current.releasePointerCapture(p.id)
  }
  function stop() { clearInput(); publish(pause(runRef.current)) }
  function start() { clearInput(); publish(beginStage(runRef.current)) }
  function continueRun() { clearInput(); publish(resume(runRef.current)) }
  function exit() { clearInput(); publish(createRun()) }

  useEffect(() => {
    try { const saved = safeBest(window.localStorage); bestRef.current=saved.value; setBest(saved.value); setStorageOkay(saved.available) }
    catch { setStorageOkay(false) }
  }, [])

  useEffect(() => {
    const reset = () => {
      keys.current.clear(); holds.current.clear(); pointer.current=null; setPressed(0)
      const next = pause(runRef.current); runRef.current=next; setRun(next)
    }
    const visibility = () => { if(document.hidden) reset() }
    const down = (event:KeyboardEvent) => {
      if((event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]')) return
      const k=event.key.toLowerCase()
      if(k==='escape' && runRef.current.status==='running') { event.preventDefault(); reset(); return }
      if(runRef.current.status!=='running' || !['arrowleft','arrowright','a','d'].includes(k)) return
      event.preventDefault(); keys.current.add(k)
    }
    const up = (event:KeyboardEvent) => keys.current.delete(event.key.toLowerCase())
    window.addEventListener('keydown',down); window.addEventListener('keyup',up)
    window.addEventListener('blur',reset); window.addEventListener('pagehide',reset); window.addEventListener('resize',reset)
    document.addEventListener('visibilitychange',visibility)
    return () => {
      window.removeEventListener('keydown',down); window.removeEventListener('keyup',up)
      window.removeEventListener('blur',reset); window.removeEventListener('pagehide',reset); window.removeEventListener('resize',reset)
      document.removeEventListener('visibilitychange',visibility)
    }
  }, [])

  useEffect(() => {
    if(!active) return
    let frame=0; let last:number | null=null
    const tick=(now:number) => {
      if(runRef.current.status!=='running') return
      const elapsed=last===null ? 0 : (now-last)/1000; last=now
      const keyboard=Number(keys.current.has('arrowright') || keys.current.has('d'))-Number(keys.current.has('arrowleft') || keys.current.has('a'))
      const held=[...holds.current.values()].reduce((a,b)=>a+b,0)
      const input={ axis:Math.max(-1,Math.min(1,keyboard+held)), target:pointer.current?.x }
      const next=advance(runRef.current,input,elapsed)
      runRef.current=next; setRun(next)
      if(next.status==='running') frame=requestAnimationFrame(tick)
    }
    frame=requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])

  useEffect(() => {
    if(!['checkpoint','won','lost'].includes(run.status)) return
    keys.current.clear(); holds.current.clear(); pointer.current=null; setPressed(0)
    try {
      const saved=saveBest(window.localStorage,bestRef.current,run.score)
      bestRef.current=saved.value; setBest(saved.value); setStorageOkay(saved.available)
    } catch { bestRef.current=Math.max(bestRef.current,run.score); setBest(bestRef.current); setStorageOkay(false) }
  }, [run.status,run.score])

  useEffect(() => { if(modal && started) dialogButton.current?.focus() }, [modal,started,run.status])

  function steer(event:React.PointerEvent<HTMLDivElement>) {
    if(runRef.current.status!=='running' || pointer.current?.id!==event.pointerId) return
    const rect=event.currentTarget.getBoundingClientRect()
    pointer.current={id:event.pointerId,x:Math.max(18,Math.min(82,(event.clientX-rect.left)/rect.width*100))}
  }
  function release(event:React.PointerEvent<HTMLDivElement>) { if(pointer.current?.id===event.pointerId) pointer.current=null }
  function hold(event:React.PointerEvent<HTMLButtonElement>, direction:number) {
    if(runRef.current.status!=='running') return
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId)
    // Explicit controls take ownership from direct dragging.
    pointer.current=null; holds.current.set(event.pointerId,direction)
    setPressed([...holds.current.values()].reduce((a,b)=>a+b,0))
  }
  function unhold(event:React.PointerEvent<HTMLButtonElement>) {
    holds.current.delete(event.pointerId); setPressed([...holds.current.values()].reduce((a,b)=>a+b,0))
  }
  const heading=run.status==='ready' ? copy.title : run.status==='paused' ? copy.paused : run.status==='checkpoint' ? copy.cleared : run.status==='won' ? copy.won : copy.lost
  const nextAction=run.status==='ready' ? copy.start : run.status==='paused' ? copy.resume : run.status==='checkpoint' ? copy.next : run.status==='won' ? copy.replay : copy.retry

  return <main className={`${styles.root} ${started ? styles.fullscreen : ''}`}>
    {!started && <Link className={styles.back} href="/games">← {copy.back}</Link>}
    <div className={styles.hud}>
      <div><strong>{copy.stage} {run.stage+1}/{STAGES}</strong><span>{copy.places[run.stage]}</span></div>
      <div><strong>✦ {run.collected}/{GOAL}</strong><span>{copy.lights}</span></div>
      <div aria-label={`${copy.lives}: ${run.lives}`}><strong className={styles.hearts}>{'♥'.repeat(run.lives)}{'♡'.repeat(3-run.lives)}</strong><span>{copy.lives}</span></div>
      {started && <button type="button" onClick={active ? stop : exit}>{active ? copy.pause : copy.exit}</button>}
    </div>
    <div className={styles.progress} role="progressbar" aria-label={copy.stage} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(run.distance/COURSE_LENGTH*100)}><i style={{width:`${run.distance/COURSE_LENGTH*100}%`}} /></div>
    <div className={`${styles.arena} ${styles[`theme${run.stage}`]}`} ref={arena} aria-label={copy.title}
      onPointerDown={e=>{ if(!active || pointer.current || holds.current.size) return; e.currentTarget.setPointerCapture(e.pointerId); pointer.current={id:e.pointerId,x:run.x}; steer(e) }}
      onPointerMove={steer} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
      <div className={styles.scenery} aria-hidden="true">{Array.from({length:14},(_,i)=><i key={i} style={{left:i%2 ? '91%' : '4%',top:`${((i*19+run.distance*0.1)%120)-10}%`}} />)}</div>
      <div className={styles.road} aria-hidden="true" style={{backgroundPosition:`0 ${run.distance*2}px`}} />
      <div className={styles.objective}>{run.collected>=GOAL ? `${copy.finish} →` : copy.objective}</div>
      {course(run.stage).filter(item=>!run.resolved.includes(item.id)).map(item=> {
        const y=78-(item.at-run.distance)/240*80
        return y > -10 && y < 94 ? <div key={item.id} aria-hidden="true" className={item.kind==='light' ? styles.light : styles.rock} style={{left:`${item.x}%`,top:`${y}%`}}>{item.kind==='light' ? '✦' : ''}</div> : null
      })}
      {COURSE_LENGTH-run.distance<240 && <div className={styles.finish} style={{top:`${78-(COURSE_LENGTH-run.distance)/240*80}%`}}>{copy.finish}</div>}
      <div data-testid="runner" className={`${styles.player} ${run.grace>0 ? styles.protected : ''}`} style={{left:`${run.x}%`}} aria-hidden="true"><span className={styles.lantern}>✦</span><i /></div>
      <div className={styles.feedback} role="status">{active && (run.feedback==='light' ? copy.good : run.feedback==='rock' ? copy.rock : '')}</div>
      {modal && <div className={styles.shade} onPointerDown={e=>e.stopPropagation()}>
        <section className={styles.card} role={started ? 'dialog' : undefined} aria-modal={started ? true : undefined} aria-labelledby="runner-heading">
          <span className={styles.badge}>✦ {run.status==='ready' ? copy.places[0] : `${copy.stage} ${run.stage+1}/${STAGES}`}</span>
          <h1 id="runner-heading">{heading}</h1>
          {run.status==='ready' && <p>{copy.intro}</p>}
          {run.status==='lost' ? <p>{run.lives<=0 ? copy.bumped : copy.missed}</p> : run.status!=='paused' && <>
            <blockquote><p>“{isRu ? verse.ru : verse.en}”</p><cite>{isRu ? verse.refRu : verse.refEn}</cite></blockquote>
            <p>{copy.apply[run.stage]}</p>
          </>}
          {(run.status==='ready' || run.status==='paused') && <p className={styles.instructions}>{copy.controls}</p>}
          {['checkpoint','won','lost'].includes(run.status) && <p>{copy.score}: <b>{run.score}</b> · {copy.best}: <b>{best}</b></p>}
          <button ref={dialogButton} className={styles.primary} type="button" onClick={()=>{if(run.status==='paused') continueRun(); else if(run.status==='won') {clearInput();publish(beginStage(createRun()))} else start()}}>{nextAction} →</button>
          <small>{storageOkay ? copy.saved : copy.unsaved}</small>
          {started && <button className={styles.secondary} type="button" onClick={exit}>{copy.exit}</button>}
        </section>
      </div>}
    </div>
    {started && <div className={styles.controls}>
      <button type="button" disabled={!active} aria-label={copy.left} aria-pressed={pressed<0} onPointerDown={e=>hold(e,-1)} onPointerUp={unhold} onPointerCancel={unhold} onLostPointerCapture={unhold} onClick={e=>{if(e.detail===0 && active) publish({...runRef.current,x:Math.max(18,runRef.current.x-26)})}}>◀</button>
      <span>{copy.score}: {run.score}<small>{copy.best}: {best}</small></span>
      <button type="button" disabled={!active} aria-label={copy.right} aria-pressed={pressed>0} onPointerDown={e=>hold(e,1)} onPointerUp={unhold} onPointerCancel={unhold} onLostPointerCapture={unhold} onClick={e=>{if(e.detail===0 && active) publish({...runRef.current,x:Math.min(82,runRef.current.x+26)})}}>▶</button>
    </div>}
  </main>
}
