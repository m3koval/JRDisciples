'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT      = '#8a6500'
const ACCENT_DARK = '#5a4000'
const ACCENT_GLOW = 'rgba(138,101,0,.15)'

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['seq'],
  2: ['flip'],
  3: ['tf'],
  4: ['scramble'],
}

// ─── Story sequence data ──────────────────────────────────────────────────────
const SEQ_CORRECT = ['a','b','c','d','e']
const SEQ_EN = [
  { id:'a', emoji:'🏔️', text:'Jesus takes Peter, James & John up a high mountain to pray' },
  { id:'b', emoji:'☀️', text:"Jesus' face shines like the sun and his clothes become white as light" },
  { id:'c', emoji:'📜', text:'Moses and Elijah appear and speak with Jesus' },
  { id:'d', emoji:'☁️', text:'A bright cloud covers them and God\'s voice speaks: "Listen to Him!"' },
  { id:'e', emoji:'🤲', text:'Jesus touches the disciples and says: "Get up — don\'t be afraid"' },
]
const SEQ_RU = [
  { id:'a', emoji:'🏔️', text:'Иисус берёт Петра, Иакова и Иоанна на высокую гору молиться' },
  { id:'b', emoji:'☀️', text:'Лицо Иисуса засияло как солнце, и одежды стали белыми как свет' },
  { id:'c', emoji:'📜', text:'Моисей и Илия явились и говорили с Иисусом' },
  { id:'d', emoji:'☁️', text:'Светлое облако покрыло их, и голос Бога сказал: «Его слушайте!»' },
  { id:'e', emoji:'🤲', text:'Иисус прикоснулся к ученикам: «Встаньте, не бойтесь»' },
]

function shuffleIds(): string[] {
  const ids = [...SEQ_CORRECT]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

// ─── Witness card data ────────────────────────────────────────────────────────
const CHARS_EN = [
  { id:'moses',  emoji:'📜', name:'Moses',          role:'The Lawgiver',    back:"I received God's Law on Mount Sinai. Jesus came to perfectly fulfill every commandment — something no one else ever could!" },
  { id:'elijah', emoji:'🔥', name:'Elijah',          role:'The Prophet',     back:"I declared God's Word to Israel for years. But Jesus is the Word of God Himself — the greatest Prophet who ever lived!" },
  { id:'peter',  emoji:'🪨', name:'Peter',           role:'The Disciple',    back:'"Lord, it is good for us to be here!" Seeing Jesus in His glory changed me forever. I never forgot that mountain.' },
  { id:'voice',  emoji:'☁️', name:'God the Father',  role:'The Voice',       back:'"This is my beloved Son, with whom I am well pleased — listen to him!" God Himself declared who Jesus is. That changes everything.' },
]
const CHARS_RU = [
  { id:'moses',  emoji:'📜', name:'Моисей',          role:'Законодатель',   back:'Я получил Закон Божий на горе Синай. Иисус пришёл, чтобы совершенно исполнить каждую заповедь — чего никто другой не смог!' },
  { id:'elijah', emoji:'🔥', name:'Илия',             role:'Пророк',         back:'Я возвещал Слово Бога народу Израиля. Но Иисус — это Само Слово Бога, величайший Пророк из всех, кто жил!' },
  { id:'peter',  emoji:'🪨', name:'Пётр',             role:'Ученик',         back:'«Господи, хорошо нам здесь быть!» Видеть Иисуса в Его славе изменило меня навсегда. Я никогда не забуду ту гору.' },
  { id:'voice',  emoji:'☁️', name:'Бог Отец',         role:'Голос',          back:'«Сей есть Сын Мой Возлюбленный — Его слушайте!» Сам Бог провозгласил, кто такой Иисус. Это меняет всё.' },
]

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  { id:'q1', text:'Jesus was transfigured on a high mountain.',                           correct:true,  explain:'Matthew 17:1 — Jesus took them "up a high mountain by themselves."' },
  { id:'q2', text:'Peter, James, and John were the three witnesses.',                     correct:true,  explain:'These three were Jesus\' inner circle and witnessed His glory.' },
  { id:'q3', text:'Abraham and Isaac appeared alongside Jesus.',                          correct:false, explain:'It was Moses (representing the Law) and Elijah (representing the Prophets) — not Abraham and Isaac.' },
  { id:'q4', text:'God\'s voice from the cloud said "Listen to Him!"',                   correct:true,  explain:'Matthew 17:5 — the Father\'s command for all of us, not just the disciples!' },
  { id:'q5', text:'The disciples felt brave and excited when they heard the voice.',      correct:false, explain:'Matthew 17:6 — they "fell facedown to the ground, terrified." Jesus had to come and touch them.' },
]
const TF_RU = [
  { id:'q1', text:'Иисус преобразился на высокой горе.',                                  correct:true,  explain:'Матф. 17:1 — Иисус взял их «на высокую гору отдельно».' },
  { id:'q2', text:'Свидетелями Преображения были Пётр, Иаков и Иоанн.',                  correct:true,  explain:'Эти трое составляли ближайший круг Иисуса и увидели Его славу.' },
  { id:'q3', text:'Рядом с Иисусом явились Авраам и Исаак.',                              correct:false, explain:'Явились Моисей (Закон) и Илия (Пророки) — не Авраам и Исаак.' },
  { id:'q4', text:'Голос из облака сказал: «Его слушайте!»',                              correct:true,  explain:'Матф. 17:5 — повеление Отца не только ученикам, но и всем нам!' },
  { id:'q5', text:'Ученики почувствовали смелость и радость, услышав голос из облака.',   correct:false, explain:'Матф. 17:6 — они «пали на лица свои и очень испугались». Иисус подошёл и прикоснулся к ним.' },
]

// ─── Scramble tiles (Romans 12:2) ─────────────────────────────────────────────
type Tile = { uid: string; word: string }
// display order is deliberately shuffled from answer order
const SC_TILES_EN: Tile[] = [
  {uid:'sc2',word:'by'},{uid:'sc0',word:'Be'},{uid:'sc5',word:'renewing'},
  {uid:'sc7',word:'mind.'},{uid:'sc1',word:'transformed'},{uid:'sc3',word:'the'},
  {uid:'sc6',word:'of'},{uid:'sc4',word:'your'},
]
const SC_ANS_EN = ['be','transformed','by','the','renewing','of','your','mind.']

const SC_TILES_RU: Tile[] = [
  {uid:'sc2',word:'ума'},{uid:'sc0',word:'Преобразуйтесь'},{uid:'sc3',word:'вашего.'},{uid:'sc1',word:'обновлением'},
]
const SC_ANS_RU = ['преобразуйтесь','обновлением','ума','вашего.']

// ─── Component ────────────────────────────────────────────────────────────────
export default function TransfigurationPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('transf_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('transf_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('transf_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('transf_done',     JSON.stringify([...done]))
  }, [unlocked, done])

  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    setDone(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 4) {
        setUnlocked(prev => new Set([...prev, sec + 1]))
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 2000)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([, reqs]) => reqs.every(r => done.has(r))).length
  const stars = '⭐'.repeat(secDoneCount) + '☆'.repeat(4 - secDoneCount)

  // ── Activity 1: Sequence ──────────────────────────────────────────────────
  const [seqShuffled] = useState<string[]>(shuffleIds)
  const [seqOrder,    setSeqOrder]    = useState<string[]>([])
  const [seqErr,      setSeqErr]      = useState(false)

  function seqTap(id: string) {
    if (done.has('seq') || seqOrder.includes(id)) return
    const next = [...seqOrder, id]
    if (next.length === SEQ_CORRECT.length) {
      if (next.every((v, i) => v === SEQ_CORRECT[i])) {
        setSeqOrder(next)
        solve('seq', 1)
      } else {
        setSeqErr(true)
        setTimeout(() => { setSeqOrder([]); setSeqErr(false) }, 800)
      }
      return
    }
    setSeqOrder(next)
  }

  // ── Activity 2: Witness flip cards ────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipChar(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    const CHARS = isRu ? CHARS_RU : CHARS_EN
    if (CHARS.every(c => next.has(c.id))) solve('flip', 2)
  }

  // ── Activity 3: True / False ──────────────────────────────────────────────
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({})

  function answerTf(id: string, answer: boolean) {
    if (tfAnswers[id] !== undefined && tfAnswers[id] !== null) return
    const TF = isRu ? TF_RU : TF_EN
    const next = { ...tfAnswers, [id]: answer }
    setTfAnswers(next)
    if (TF.every(q => next[q.id] !== undefined && next[q.id] !== null)) solve('tf', 3)
  }

  // ── Activity 4: Scramble ──────────────────────────────────────────────────
  const [scrambleOrder, setScrambleOrder] = useState<string[]>([])
  const [scrambleErr,   setScrambleErr]   = useState('')

  const SC_TILES  = isRu ? SC_TILES_RU  : SC_TILES_EN
  const SC_ANS    = isRu ? SC_ANS_RU    : SC_ANS_EN

  function addScrambleTile(uid: string) {
    if (scrambleOrder.includes(uid)) return
    setScrambleOrder(prev => [...prev, uid])
  }
  function removeScrambleTile(uid: string) {
    setScrambleOrder(prev => prev.filter(u => u !== uid))
  }
  function checkScramble() {
    const placed = scrambleOrder.map(uid => SC_TILES.find(t => t.uid === uid)?.word.toLowerCase() ?? '')
    if (placed.length === SC_ANS.length && placed.every((w, i) => w === SC_ANS[i])) {
      setScrambleErr('')
      solve('scramble', 4)
    } else {
      const msg = isRu ? '❌ Не совсем — попробуй ещё раз!' : '❌ Not quite — try again!'
      setScrambleErr(msg)
      setTimeout(() => setScrambleErr(''), 2500)
    }
  }

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    localStorage.removeItem('transf_unlocked')
    localStorage.removeItem('transf_done')
    window.location.reload()
  }

  // ── Language-dependent refs ────────────────────────────────────────────────
  const CHARS_ACTIVE  = isRu ? CHARS_RU  : CHARS_EN
  const TF_ACTIVE     = isRu ? TF_RU     : TF_EN
  const SEQ_ACTIVE    = isRu ? SEQ_RU    : SEQ_EN
  const seqById       = Object.fromEntries(SEQ_ACTIVE.map(e => [e.id, e]))

  // ── Tile style helper ──────────────────────────────────────────────────────
  function tileStyle(inSlot: boolean): React.CSSProperties {
    return {
      padding: '11px 16px', borderRadius: 10, minHeight: 44,
      background: inSlot ? ACCENT : '#f0ede8',
      color: inSlot ? '#fff' : 'var(--text)',
      border: `2px solid ${inSlot ? ACCENT : '#ddd'}`,
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
      cursor: 'pointer', userSelect: 'none', display: 'inline-block',
    }
  }

  const sectionImg = (src: string, alt: string) => (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <img src={src} alt={alt} style={{ maxWidth: 600, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 28px rgba(0,0,0,.14)' }} />
    </div>
  )

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <>
      {/* ── Win Screen ────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,8,0,.96)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30, animation: 'pop-in .4s ease',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>⛰️✨🦋</div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.9rem', color: '#ffe380', marginBottom: 14, textShadow: `0 0 40px rgba(255,200,0,.6)` }}>
            {isRu ? 'Ты преображён!' : "You're Transformed!"}
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 28, fontSize: '1.05rem', maxWidth: 440 }}>
            {isRu
              ? 'Иисус явил Свою славу на горе — и Он хочет явить её и в твоей жизни! Пусть Его Дух обновляет тебя каждый день.'
              : 'Jesus revealed His glory on the mountain — and He wants to reveal it in your life too! Let His Spirit transform you day by day.'}
          </p>
          <button onClick={() => setWon(false)} style={{
            padding: '14px 32px',
            background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
            color: '#fff', border: 'none', borderRadius: 18,
            fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer',
          }}>
            {isRu ? '← Вернуться к уроку' : '← Back to Lesson'}
          </button>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '60vh',
        background: `radial-gradient(ellipse at 50% 40%, #5a3800 0%, #2a1c00 45%, #0d0800 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '56px 20px 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, width: '100%', marginBottom: 28 }}>
          <img
            src="/images/jr/transfiguration-hero.png"
            alt={isRu ? 'Преображение' : 'The Transfiguration'}
            style={{ width: '100%', height: 'auto', borderRadius: 20, boxShadow: `0 12px 48px rgba(138,101,0,.5)` }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#ffe380', marginBottom: 10, textShadow: '0 2px 18px rgba(255,210,0,.4)' }}>
          {isRu ? 'Преображение' : 'The Transfiguration'}
        </h1>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '1rem', color: 'rgba(255,227,128,.85)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>
          {isRu ? 'Когда Иисус явил Свою славу' : 'When Jesus Revealed His Glory'}
        </p>
        <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,.75)', maxWidth: 520, lineHeight: 1.7 }}>
          {isRu
            ? '"И преобразился перед ними: и просияло лицо Его, как солнце..." — Матф. 17:2'
            : '"He was transfigured before them. His face shone like the sun..." — Matthew 17:2'}
        </div>
      </section>

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div style={{ background: ACCENT_GLOW, borderBottom: `2px solid ${ACCENT}`, padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1 }}>
          {isRu ? '📖 ПРОГРЕСС' : '📖 PROGRESS'} {stars} {secDoneCount}/4
        </span>
        <button onClick={resetAll} style={{ marginLeft: 16, fontFamily: 'var(--font-nunito)', fontSize: '0.7rem', fontWeight: 900, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
      </div>

      {/* ════════════════ SECTION 1 ══════════════════════════════════ */}
      <section id="sec-1" style={{ background: '#fff', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '⛰️ РАЗДЕЛ 1 · МОМЕНТ НА ГОРЕ ⛰️' : '⛰️ SECTION 1 · THE MOUNTAIN MOMENT ⛰️'}
          </p>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
          <p className="eyebrow">{isRu ? 'История Преображения' : 'The Story of the Transfiguration'}</p>
          <h2 className="sec-title">{isRu ? 'Момент на горе' : 'The Mountain Moment'}</h2>

          {sectionImg('/images/jr/transfiguration-glory.png', isRu ? 'Преображение Иисуса' : 'The Transfiguration of Jesus')}

          <p className="sec-intro">
            {isRu
              ? 'Иисус взял трёх своих ближайших учеников — Петра, Иакова и Иоанна — на высокую гору помолиться. И вдруг произошло нечто невероятное: Иисус преобразился перед ними. Его лицо засияло, как солнце, а одежды стали белыми как свет!'
              : 'Jesus took His three closest disciples — Peter, James, and John — up a high mountain to pray. And then something incredible happened: Jesus was transfigured before them. His face shone like the sun, and His clothes became white as light!'}
          </p>
          <p className="sec-intro" style={{ marginTop: 14 }}>
            {isRu
              ? 'Затем появились два великих мужа из Ветхого Завета: Моисей и Илия. Они разговаривали с Иисусом! Пётр, переполненный восторгом, воскликнул: «Господи, хорошо нам здесь быть! Сделаем три кущи!»'
              : 'Then two great figures from the Old Testament appeared: Moses and Elijah. They were actually talking with Jesus! Peter, overwhelmed with wonder, blurted out: "Lord, it\'s great that we\'re here! Let us build three shelters!"'}
          </p>
          <p className="sec-intro" style={{ marginTop: 14 }}>
            {isRu
              ? 'Когда Пётр ещё говорил, светлое облако накрыло их. Голос из облака произнёс: «Сей есть Сын Мой Возлюбленный — Его слушайте!» Ученики в страхе пали на лица свои. Иисус подошёл, прикоснулся к ним и сказал: «Встаньте, не бойтесь». Когда они подняли глаза — увидели только Иисуса.'
              : 'While Peter was still speaking, a bright cloud covered them. A voice from the cloud said: "This is my beloved Son, with whom I am well pleased — listen to him!" The disciples fell facedown in fear. Jesus came and touched them: "Get up. Don\'t be afraid." When they looked up, they saw no one except Jesus alone.'}
          </p>

          <div className="kid-note" style={{ marginTop: 20 }}>
            {isRu
              ? '💡 «Преображение» (по-гречески: metamorphosis) означает полное изменение. Это то самое слово, которое используется для превращения гусеницы в бабочку!'
              : '💡 "Transfigured" comes from the Greek word metamorphosis — the same word used for a caterpillar becoming a butterfly!'}
          </div>

          {/* ── Activity 1: Sequence ───────────────────────────────── */}
          <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
            <p className="puzzle-label">
              {isRu ? '📋 АКТИВНОСТЬ 1 · РАССТАВЬ ПО ПОРЯДКУ' : '📋 ACTIVITY 1 · PUT IT IN ORDER'}
            </p>
            <p className="puzzle-q">
              {isRu
                ? 'Нажимай события в правильном порядке — от первого до последнего!'
                : 'Tap the events in the correct order — first to last!'}
            </p>
            {done.has('seq') ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a' }}>
                  {isRu ? 'Отлично! Ты знаешь эту историю!' : 'Great job! You know the story!'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {seqShuffled.map(id => {
                  const ev = seqById[id]
                  const pos = seqOrder.indexOf(id)
                  const selected = pos >= 0
                  return (
                    <div
                      key={id}
                      onClick={() => seqTap(id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 12, cursor: selected ? 'default' : 'pointer',
                        background: seqErr ? '#fff0f0' : selected ? ACCENT_GLOW : '#f8f6f2',
                        border: `2px solid ${seqErr ? '#e04040' : selected ? ACCENT : '#ddd'}`,
                        transition: 'all .2s', userSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: selected ? ACCENT : '#e8e4de',
                        color: selected ? '#fff' : '#aaa',
                        fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selected ? pos + 1 : '?'}
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>{ev.emoji}</span>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.4 }}>
                        {ev.text}
                      </span>
                    </div>
                  )
                })}
                {seqErr && (
                  <p style={{ textAlign: 'center', color: '#c03030', fontFamily: 'var(--font-nunito)', fontWeight: 900, marginTop: 4 }}>
                    {isRu ? '❌ Попробуй ещё раз!' : '❌ Not quite! Try again.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 2 ══════════════════════════════════ */}
      <section id="sec-2" style={{ background: '#faf8f2', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '👁️ РАЗДЕЛ 2 · СВИДЕТЕЛИ СЛАВЫ 👁️' : '👁️ SECTION 2 · WITNESSES TO GLORY 👁️'}
          </p>
        </div>

        {!unlocked.has(2) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#888', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 1, чтобы открыть этот раздел!' : 'Complete Section 1 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p className="eyebrow">{isRu ? 'Четыре ключевых участника' : 'Four Key Participants'}</p>
            <h2 className="sec-title">{isRu ? 'Свидетели Преображения' : 'Witnesses to the Transfiguration'}</h2>

            {sectionImg('/images/jr/transfiguration-witnesses.png', isRu ? 'Свидетели Преображения' : 'Witnesses of the Transfiguration')}

            <p className="sec-intro">
              {isRu
                ? 'Каждый, кто присутствовал на той горе, говорит нам что-то важное об Иисусе. Моисей представлял Закон Бога. Илия представлял Пророков Бога. А Пётр, Иаков и Иоанн стали живыми свидетелями того, что увидели. Но самым главным был голос самого Бога!'
                : 'Everyone present on that mountain tells us something important about Jesus. Moses represented the Law of God. Elijah represented the Prophets of God. Peter, James, and John became eyewitnesses to what they saw. But the greatest voice was God the Father Himself!'}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'Почему именно Моисей и Илия? Потому что вся Библия — от первой книги до последней — указывала на Иисуса. И вот они встретились на вершине горы: прошлое и исполнение, Закон и Спаситель, пророчество и его исполнение — в одной точке.'
                : 'Why Moses and Elijah? Because the entire Bible — from the first page to the last — was pointing to Jesus. And here they met: the past and its fulfillment, the Law and the Savior, prophecy and its answer — all in one place.'}
            </p>

            {/* ── Activity 2: Flip Cards ─────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '🃏 АКТИВНОСТЬ 2 · УЗНАЙ СВИДЕТЕЛЕЙ' : '🃏 ACTIVITY 2 · MEET THE WITNESSES'}
              </p>
              <p className="puzzle-q">
                {isRu
                  ? 'Нажми на каждую карточку, чтобы услышать, что говорит каждый участник!'
                  : 'Tap each card to hear what each participant says!'}
              </p>

              {done.has('flip') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a' }}>
                    {isRu ? 'Ты познакомился со всеми свидетелями!' : "You've met all the witnesses!"}
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 14 }}>
                    {CHARS_ACTIVE.map(c => {
                      const isFlipped = flipped.has(c.id)
                      return (
                        <div
                          key={c.id}
                          onClick={() => !isFlipped && flipChar(c.id)}
                          style={{ flex: '1 1 180px', maxWidth: 240, minHeight: 190, perspective: '700px', cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none' }}
                        >
                          <div style={{
                            position: 'relative', width: '100%', height: '100%', minHeight: 190,
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.55s ease',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          }}>
                            {/* Front */}
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                              borderRadius: 18, padding: '18px 14px',
                              background: '#fff', border: '3px solid #ddd',
                              boxShadow: '0 3px 14px rgba(0,0,0,.09)',
                              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{c.emoji}</div>
                              <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.9rem', color: ACCENT_DARK, marginBottom: 6 }}>{c.name}</div>
                              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.78rem', color: '#888' }}>{c.role}</div>
                              <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: 1, color: '#bbb', marginTop: 10, textTransform: 'uppercase' }}>
                                {isRu ? 'Нажми ▾' : 'Tap ▾'}
                              </div>
                            </div>
                            {/* Back */}
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              borderRadius: 18, padding: '18px 14px',
                              background: ACCENT_GLOW, border: `3px solid ${ACCENT}`,
                              boxShadow: '0 3px 14px rgba(0,0,0,.09)',
                              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.emoji}</div>
                              <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.8rem', color: ACCENT_DARK, marginBottom: 8 }}>{c.name}</div>
                              <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.82rem', color: '#444', lineHeight: 1.6, margin: 0 }}>
                                {c.back}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="pz-hint" style={{ marginTop: 12 }}>
                    {isRu
                      ? `Открыто: ${flipped.size} из ${CHARS_ACTIVE.length}`
                      : `Revealed: ${flipped.size} of ${CHARS_ACTIVE.length}`}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 3 ══════════════════════════════════ */}
      <section id="sec-3" style={{ background: '#fff', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '📜 РАЗДЕЛ 3 · ПОЧЕМУ МОИСЕЙ И ИЛИЯ? 📜' : '📜 SECTION 3 · WHY MOSES & ELIJAH? 📜'}
          </p>
        </div>

        {!unlocked.has(3) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#888', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 2, чтобы открыть этот раздел!' : 'Complete Section 2 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p className="eyebrow">{isRu ? 'Иисус исполняет всё' : 'Jesus Fulfills Everything'}</p>
            <h2 className="sec-title">{isRu ? 'Почему Моисей и Илия?' : 'Why Moses & Elijah?'}</h2>

            {sectionImg('/images/jr/transfiguration-fulfillment.png', isRu ? 'Моисей, Илия и Иисус' : 'Moses, Elijah, and Jesus')}

            <p className="sec-intro">
              {isRu
                ? 'Случайно ли появились именно Моисей и Илия? Совсем нет! Моисей представлял весь Закон Бога — заповеди, которые Бог дал народу Своему. Илия представлял всех Пророков — тех, кто веками возвещал Слово Бога Израилю.'
                : "Was it random that Moses and Elijah appeared? Not at all! Moses represented God's entire Law — the commandments God gave His people. Elijah represented all the Prophets — those who spoke God's Word to Israel for centuries."}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'Вместе они олицетворяют всю Библию — от Бытия до Малахии. И оба указывали вперёд — на Кого-то большего. Встреча на горе говорила громко: Иисус — это исполнение всего! Он пришёл исполнить Закон, которого никто другой не мог соблюсти, и осуществить каждое пророчество о грядущем Мессии.'
                : 'Together they represent the entire Old Testament — from Genesis to Malachi. And both were pointing forward to Someone greater. Their meeting on the mountain declared loudly: Jesus is the fulfillment of everything! He came to perfectly keep the Law no one else could keep, and to fulfill every prophecy about the coming Messiah.'}
            </p>

            {/* ── "Listen to Him" callout ── */}
            <div style={{
              margin: '24px 0 0', borderRadius: 18,
              overflow: 'hidden', boxShadow: '0 4px 20px rgba(138,101,0,.18)',
            }}>
              {/* header */}
              <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '12px 20px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.8rem', color: 'rgba(255,255,255,.85)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {isRu ? '🔑 Бог сказал это дважды' : '🔑 God said it twice'}
                </span>
              </div>
              {/* body */}
              <div style={{ background: ACCENT_GLOW, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Baptism */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', borderLeft: `4px solid #aaa` }}>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.72rem', color: '#888', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                    {isRu ? 'Крещение — Матф. 3:17' : 'Baptism — Matthew 3:17'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                    {isRu
                      ? '"Сей есть Сын Мой Возлюбленный, в Котором Моё благоволение."'
                      : '"This is my beloved Son, with whom I am well pleased."'}
                  </p>
                </div>
                {/* Transfiguration */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', borderLeft: `4px solid ${ACCENT}` }}>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.72rem', color: ACCENT, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                    {isRu ? 'Преображение — Матф. 17:5' : 'Transfiguration — Matthew 17:5'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                    {isRu
                      ? <>“Сей есть Сын Мой Возлюбленный —{' '}<span style={{ fontFamily: 'var(--font-nunito)', fontStyle: 'normal', fontWeight: 900, color: ACCENT_DARK, fontSize: '1.05rem' }}>Его слушайте!</span>”</>
                      : <>“This is my beloved Son, with whom I am well pleased —{' '}<span style={{ fontFamily: 'var(--font-nunito)', fontStyle: 'normal', fontWeight: 900, color: ACCENT_DARK, fontSize: '1.05rem' }}>listen to him!</span>”</>
                    }
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.88rem', color: ACCENT_DARK, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                  {isRu
                    ? 'Три новых слова. Бог не просто говорит, кто такой Иисус — Он говорит нам, что делать: слушать Его!'
                    : 'Three new words. God doesn\'t just tell us who Jesus is — He tells us what to do: listen to Him!'}
                </p>
              </div>
            </div>

            {/* ── Activity 3: True/False ─────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '✅ АКТИВНОСТЬ 3 · ПРАВДА ИЛИ ЛОЖЬ?' : '✅ ACTIVITY 3 · TRUE OR FALSE?'}
              </p>
              <p className="puzzle-q">
                {isRu
                  ? 'Нажми «Правда» или «Ложь» для каждого утверждения!'
                  : 'Tap TRUE or FALSE for each statement!'}
              </p>

              {done.has('tf') && (
                <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a' }}>
                    {isRu ? 'Ты разобрал все вопросы! Посмотри результаты ниже.' : 'You examined every question! Review your answers below.'}
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                {TF_ACTIVE.map(q => {
                  const ans = tfAnswers[q.id]
                  const answered = ans !== undefined && ans !== null
                  const correct = answered && ans === q.correct
                  return (
                    <div key={q.id} style={{
                      background: answered ? (correct ? '#f0faf4' : '#fff0f0') : '#f8f6f2',
                      border: `2px solid ${answered ? (correct ? '#40b870' : '#e04040') : '#ddd'}`,
                      borderRadius: 14, padding: '14px 16px',
                    }}>
                      <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.93rem', color: 'var(--text)', marginBottom: answered ? 8 : 10 }}>
                        {q.text}
                      </p>
                      {!answered ? (
                        <div style={{ display: 'flex', gap: 10 }}>
                          {[true, false].map(val => (
                            <button key={String(val)} onClick={() => answerTf(q.id, val)} style={{
                              flex: 1, padding: '8px 0', borderRadius: 10,
                              background: val ? '#e8f8ee' : '#fde8e8',
                              border: `2px solid ${val ? '#40b870' : '#e04040'}`,
                              color: val ? '#2a7a2a' : '#a02020',
                              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer',
                            }}>
                              {val ? (isRu ? '✅ Правда' : '✅ True') : (isRu ? '❌ Ложь' : '❌ False')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '0.82rem', fontWeight: 700, color: correct ? '#2a7a2a' : '#a02020', lineHeight: 1.5 }}>
                          {correct ? '✅ ' : '❌ '}{q.explain}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 ══════════════════════════════════ */}
      <section id="sec-4" style={{ background: '#faf8f2', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '🦋 РАЗДЕЛ 4 · БУДЬ ПРЕОБРАЖЁН! 🦋' : '🦋 SECTION 4 · BE TRANSFORMED! 🦋'}
          </p>
        </div>

        {!unlocked.has(4) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#888', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 3, чтобы открыть этот раздел!' : 'Complete Section 3 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p className="eyebrow">{isRu ? 'Что это значит для тебя' : 'What This Means for You'}</p>
            <h2 className="sec-title">{isRu ? 'Будь преображён!' : 'Be Transformed!'}</h2>

            {sectionImg('/images/jr/transfiguration-transform.png', isRu ? 'Преображение' : 'Transformation')}

            <p className="sec-intro">
              {isRu
                ? 'Слово «преображение» в переводе с греческого буквально означает — метаморфоза. То же самое слово, которое используется для превращения гусеницы в бабочку! Гусеница не остаётся гусеницей. Она позволяет произойти изменению — и становится чем-то совершенно новым и прекрасным.'
                : 'The Greek word for "transfigured" is metamorphosis — the very same word used for a caterpillar becoming a butterfly! A caterpillar doesn\'t stay a caterpillar. It surrenders to the process of change — and becomes something completely new and beautiful.'}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'На той горе Иисус показал Своим ученикам Свою истинную славу. Но вот что удивительно: Бог хочет преобразить и тебя тоже! Не снаружи, а изнутри. Когда мы проводим время с Иисусом — читаем Его Слово, молимся, поклоняемся Ему — что-то меняется в нас. Мы начинаем становиться всё больше похожими на Него: добрее, честнее, смелее любить других.'
                : 'On that mountain, Jesus showed His disciples His true glory. But here\'s the amazing thing: God wants to transform you too! Not on the outside — on the inside. When we spend time with Jesus — reading His Word, praying, worshiping — something changes in us. We start becoming more like Him: kinder, more honest, braver at loving others.'}
            </p>

            {/* Gospel call */}
            <div style={{
              margin: '24px 0', padding: '22px 20px',
              background: `linear-gradient(135deg,${ACCENT_GLOW},rgba(255,220,80,.1))`,
              border: `2px solid ${ACCENT}`, borderRadius: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>✨</div>
              <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1.05rem', color: ACCENT_DARK, lineHeight: 1.7, marginBottom: 12 }}>
                {isRu
                  ? '"Не сообразуйтесь с веком сим, но преобразуйтесь обновлением ума вашего."'
                  : '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind."'}
              </p>
              <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.85rem', color: ACCENT, letterSpacing: 1 }}>
                {isRu ? '— Римлянам 12:2' : '— Romans 12:2'}
              </p>
            </div>

            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'Петр, Иаков и Иоанн увидели Иисуса в Его славе на той горе. Это изменило их жизнь навсегда. Сегодня ты тоже можешь узнать Иисуса по-новому — и Он начнёт менять тебя изнутри. Всё начинается с простого выбора: «Господи, я хочу следовать за Тобой».'
                : 'Peter, James, and John saw Jesus in His glory on that mountain. It changed their lives forever. Today you can know Jesus personally too — and He will begin transforming you from the inside out. It all starts with a simple choice: "Lord, I want to follow You."'}
            </p>

            {/* ── Activity 4: Scramble ───────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '🔤 АКТИВНОСТЬ 4 · СОБЕРИ СТИХ' : '🔤 ACTIVITY 4 · BUILD THE VERSE'}
              </p>
              <p className="puzzle-q">
                {isRu
                  ? 'Расставь слова в правильном порядке, чтобы собрать стих из Послания к Римлянам 12:2!'
                  : 'Arrange the words in the correct order to complete Romans 12:2!'}
              </p>

              {done.has('scramble') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>⭐🦋⭐</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a', fontSize: '1.05rem' }}>
                    {isRu ? 'Ты собрал стих! Помни его — он может изменить твою жизнь!' : 'You built the verse! Keep it in your heart — it can change your life!'}
                  </p>
                  <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1rem', color: ACCENT_DARK, marginTop: 12, padding: '10px 16px', background: ACCENT_GLOW, borderRadius: 10 }}>
                    {isRu ? '"Преобразуйтесь обновлением ума вашего." — Рим. 12:2' : '"Be transformed by the renewing of your mind." — Romans 12:2'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Answer slots */}
                  <div style={{ minHeight: 52, padding: '10px 12px', background: '#f0ede8', borderRadius: 12, border: '2px dashed #ccc', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                    {scrambleOrder.length === 0
                      ? <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '0.85rem', color: '#bbb', fontWeight: 700 }}>
                          {isRu ? 'Нажми слова снизу...' : 'Tap words below...'}
                        </span>
                      : scrambleOrder.map(uid => {
                          const tile = SC_TILES.find(t => t.uid === uid)
                          return tile ? (
                            <span key={uid} onClick={() => removeScrambleTile(uid)} style={tileStyle(true)}>
                              {tile.word}
                            </span>
                          ) : null
                        })
                    }
                  </div>

                  {/* Available tiles */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {SC_TILES.map(tile => {
                      const used = scrambleOrder.includes(tile.uid)
                      return (
                        <span
                          key={tile.uid}
                          onClick={() => !used && addScrambleTile(tile.uid)}
                          style={{ ...tileStyle(false), opacity: used ? 0.35 : 1, cursor: used ? 'default' : 'pointer' }}
                        >
                          {tile.word}
                        </span>
                      )
                    })}
                  </div>

                  {scrambleErr && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#c03030', marginBottom: 10, fontSize: '0.9rem' }}>
                      {scrambleErr}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={checkScramble} style={{
                      flex: 2, padding: '12px 0', borderRadius: 12,
                      background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
                      color: '#fff', border: 'none',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                    }}>
                      {isRu ? '✅ Проверить!' : '✅ Check it!'}
                    </button>
                    <button onClick={() => setScrambleOrder([])} style={{
                      flex: 1, padding: '12px 0', borderRadius: 12,
                      background: '#f0ede8', color: '#888', border: '2px solid #ddd',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer',
                    }}>
                      {isRu ? 'Очистить' : 'Clear'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ── Final gospel invitation ────────────────────────────── */}
            {done.has('scramble') && (
              <div style={{
                marginTop: 36, padding: '28px 24px',
                background: `linear-gradient(135deg,${ACCENT_GLOW},rgba(255,220,80,.1))`,
                border: `3px solid ${ACCENT}`, borderRadius: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>⛰️✨</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.3rem', color: ACCENT_DARK, marginBottom: 14 }}>
                  {isRu ? 'А ты? Кем для тебя является Иисус?' : 'So — who is Jesus to you?'}
                </h3>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 18 }}>
                  {isRu
                    ? 'Пётр, Иаков и Иоанн видели Иисуса в Его славе — и это изменило их навсегда. Иисус хочет войти в твою жизнь и изменить тебя тоже. Если ты ещё не сказал Ему: «Да» — ты можешь сделать это прямо сейчас.'
                    : "Peter, James, and John saw Jesus in His glory — and it changed them forever. Jesus wants to enter your life and transform you too. If you've never said 'yes' to Him — you can do it right now."}
                </p>
                <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: ACCENT_DARK, lineHeight: 1.8, padding: '14px 18px', background: 'rgba(255,255,255,.7)', borderRadius: 14, marginBottom: 20 }}>
                  {isRu
                    ? '«Иисус, я верю, что Ты — Сын Бога. Войди в мою жизнь, прости мои грехи и преобрази меня. Я хочу следовать за Тобой всю жизнь. Аминь.»'
                    : '"Jesus, I believe You are the Son of God. Come into my life, forgive my sins, and transform me. I want to follow You all my life. Amen."'}
                </div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: ACCENT, letterSpacing: 1 }}>
                  {isRu
                    ? '🦋 Когда Иисус входит в твою жизнь — начинается преображение!'
                    : '🦋 When Jesus enters your life — the transformation begins!'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Back link ──────────────────────────────────────────────── */}
      <section style={{ background: '#f8f6f2', padding: '24px 20px', textAlign: 'center' }}>
        <Link href="/lessons" style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: ACCENT, textDecoration: 'none' }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>
      </section>
    </>
  )
}
