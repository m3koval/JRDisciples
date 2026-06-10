'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT      = '#075985'
const ACCENT_DARK = '#04344d'
const ACCENT_GLOW = 'rgba(7,89,133,.12)'

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['seq'],
  2: ['flip'],
  3: ['scramble'],
  4: ['tf'],
}

// ─── Story sequence data ──────────────────────────────────────────────────────
const SEQ_CORRECT = ['a','b','c','d','e']
const SEQ_EN = [
  { id:'a', emoji:'📣', text:'God tells Jonah: "Go to Nineveh and warn the people!"' },
  { id:'b', emoji:'🏃', text:'Jonah runs the OPPOSITE way and boards a ship to Tarshish' },
  { id:'c', emoji:'🌊', text:'God sends a huge storm — the sailors are terrified' },
  { id:'d', emoji:'🙋', text:'Jonah admits: "This storm is my fault — throw me into the sea!"' },
  { id:'e', emoji:'🐋', text:'God sends a big fish to swallow Jonah — and save his life!' },
]
const SEQ_RU = [
  { id:'a', emoji:'📣', text:'Бог говорит Ионе: «Иди в Ниневию и предупреди людей!»' },
  { id:'b', emoji:'🏃', text:'Иона бежит в ОБРАТНУЮ сторону и садится на корабль в Фарсис' },
  { id:'c', emoji:'🌊', text:'Бог посылает сильную бурю — моряки в ужасе' },
  { id:'d', emoji:'🙋', text:'Иона признаётся: «Буря из-за меня — бросьте меня в море!»' },
  { id:'e', emoji:'🐋', text:'Бог посылает большую рыбу проглотить Иону — и спасти его!' },
]

function shuffleIds(): string[] {
  const ids = [...SEQ_CORRECT]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

// ─── Storm voices flip card data ──────────────────────────────────────────────
const CHARS_EN = [
  { id:'jonah',   emoji:'😴', name:'Jonah',        role:'The Runaway',        back:"I thought I could sail away from God. I even fell asleep in the storm! But deep down I knew — there is nowhere God's love can't find you." },
  { id:'captain', emoji:'🧭', name:'The Captain',  role:"The Ship's Leader",  back:'"Wake up! How can you sleep?!" Everyone was praying to their gods, but our passenger was snoring below deck. "Get up and call on your God!"' },
  { id:'sailors', emoji:'⚓', name:'The Sailors',  role:'The Crew',           back:"We rowed with all our strength, but the sea only grew wilder. When the storm stopped the moment Jonah went in — we knew: Jonah's God is the real God!" },
  { id:'fish',    emoji:'🐋', name:'The Big Fish', role:"God's Rescue Boat",  back:"Everyone thinks I was the punishment. Wrong! God sent me to RESCUE Jonah from drowning. I was a submarine with a three-day prayer room inside!" },
]
const CHARS_RU = [
  { id:'jonah',   emoji:'😴', name:'Иона',          role:'Беглец',             back:'Я думал, что смогу уплыть от Бога. Я даже уснул во время бури! Но в глубине души я знал — нет места, где Божья любовь тебя не найдёт.' },
  { id:'captain', emoji:'🧭', name:'Капитан',       role:'Начальник корабля',  back:'«Проснись! Как ты можешь спать?!» Все молились своим богам, а наш пассажир храпел в трюме. «Встань и призови Бога твоего!»' },
  { id:'sailors', emoji:'⚓', name:'Моряки',        role:'Команда',            back:'Мы гребли изо всех сил, но море бушевало всё сильнее. Когда буря утихла в тот же миг, как Иона оказался в воде, мы поняли: Бог Ионы — истинный Бог!' },
  { id:'fish',    emoji:'🐋', name:'Большая рыба',  role:'Спасательная лодка Бога', back:'Все думают, что я была наказанием. Неправда! Бог послал меня СПАСТИ Иону, чтобы он не утонул. Я была подводной лодкой с молитвенной комнатой на три дня!' },
]

// ─── Scramble tiles (Jonah 2:2) ───────────────────────────────────────────────
type Tile = { uid: string; word: string }
// display order is deliberately shuffled from answer order
const SC_TILES_EN: Tile[] = [
  {uid:'sc4',word:'LORD'},{uid:'sc0',word:'I'},{uid:'sc7',word:'answered'},
  {uid:'sc2',word:'to'},{uid:'sc5',word:'and'},{uid:'sc1',word:'called'},
  {uid:'sc8',word:'me.'},{uid:'sc3',word:'the'},{uid:'sc6',word:'He'},
]
const SC_ANS_EN = ['i','called','to','the','lord','and','he','answered','me.']

const SC_TILES_RU: Tile[] = [
  {uid:'sc3',word:'Господу'},{uid:'sc0',word:'Я'},{uid:'sc6',word:'услышал'},
  {uid:'sc1',word:'воззвал'},{uid:'sc7',word:'меня.'},{uid:'sc4',word:'и'},
  {uid:'sc2',word:'к'},{uid:'sc5',word:'Он'},
]
const SC_ANS_RU = ['я','воззвал','к','господу','и','он','услышал','меня.']

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  { id:'q1', text:'God asked Jonah to go to the great city of Nineveh.',                    correct:true,  explain:'Jonah 1:2 — "Go to the great city of Nineveh and preach against it."' },
  { id:'q2', text:'Jonah obeyed God right away.',                                           correct:false, explain:'Jonah 1:3 — He ran the OPPOSITE way and boarded a ship to Tarshish!' },
  { id:'q3', text:'Jonah was inside the fish for three days and three nights.',             correct:true,  explain:'Jonah 1:17 — three days and three nights inside the fish, praying.' },
  { id:'q4', text:'When Jonah finally preached, the people of Nineveh ignored him.',        correct:false, explain:'Jonah 3:5-10 — the whole city, even the king, turned to God. God showed them mercy!' },
  { id:'q5', text:'Jesus compared His three days in the tomb to Jonah\'s days in the fish.', correct:true,  explain:'Matthew 12:40 — Jonah\'s story was a picture of Jesus\' death and resurrection!' },
]
const TF_RU = [
  { id:'q1', text:'Бог велел Ионе идти в великий город Ниневию.',                            correct:true,  explain:'Иона 1:2 — «Встань, иди в Ниневию, город великий, и проповедуй в нём».' },
  { id:'q2', text:'Иона сразу послушался Бога.',                                             correct:false, explain:'Иона 1:3 — он побежал в ОБРАТНУЮ сторону и сел на корабль в Фарсис!' },
  { id:'q3', text:'Иона был внутри рыбы три дня и три ночи.',                                correct:true,  explain:'Иона 2:1 — три дня и три ночи внутри рыбы, в молитве.' },
  { id:'q4', text:'Когда Иона наконец проповедовал, жители Ниневии не послушали его.',       correct:false, explain:'Иона 3:5-10 — весь город, даже царь, обратился к Богу. И Бог помиловал их!' },
  { id:'q5', text:'Иисус сравнил Свои три дня во гробе с днями Ионы внутри рыбы.',           correct:true,  explain:'Матф. 12:40 — история Ионы была картиной смерти и воскресения Иисуса!' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function JonahBigFishPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('jonah_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('jonah_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('jonah_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('jonah_done',     JSON.stringify([...done]))
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
  const fishes = '🐟'.repeat(secDoneCount) + '🫧'.repeat(4 - secDoneCount)

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

  // ── Activity 2: Storm voices flip cards ───────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipChar(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    const CHARS = isRu ? CHARS_RU : CHARS_EN
    if (CHARS.every(c => next.has(c.id))) solve('flip', 2)
  }

  // ── Activity 3: Prayer scramble ───────────────────────────────────────────
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
      solve('scramble', 3)
    } else {
      const msg = isRu ? '❌ Не совсем — попробуй ещё раз!' : '❌ Not quite — try again!'
      setScrambleErr(msg)
      setTimeout(() => setScrambleErr(''), 2500)
    }
  }

  // ── Activity 4: True / False ──────────────────────────────────────────────
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({})

  function answerTf(id: string, answer: boolean) {
    if (tfAnswers[id] !== undefined && tfAnswers[id] !== null) return
    const TF = isRu ? TF_RU : TF_EN
    const next = { ...tfAnswers, [id]: answer }
    setTfAnswers(next)
    if (TF.every(q => next[q.id] !== undefined && next[q.id] !== null)) solve('tf', 4)
  }

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    localStorage.removeItem('jonah_unlocked')
    localStorage.removeItem('jonah_done')
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
      background: inSlot ? ACCENT : '#eef4f7',
      color: inSlot ? '#fff' : 'var(--text)',
      border: `2px solid ${inSlot ? ACCENT : '#cfdde5'}`,
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
      cursor: 'pointer', userSelect: 'none', display: 'inline-block',
    }
  }

  const emojiBanner = (emojis: string) => (
    <div aria-hidden="true" style={{ textAlign: 'center', fontSize: 'clamp(2rem,6vw,3rem)', letterSpacing: 8, margin: '4px 0 24px' }}>
      {emojis}
    </div>
  )

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <>
      {/* ── Win Screen ────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(2,12,22,.96)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30, animation: 'pop-in .4s ease',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌊🐋💙</div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.9rem', color: '#7dd3fc', marginBottom: 14, textShadow: '0 0 40px rgba(56,189,248,.6)' }}>
            {isRu ? 'От Божьей любви не убежать!' : "You Can't Outrun God's Love!"}
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 28, fontSize: '1.05rem', maxWidth: 440 }}>
            {isRu
              ? 'Иона бежал не туда — а Бог всё равно дал ему второй шанс. Целый город получил милость. И Бог даёт второй шанс тебе — каждый день!'
              : 'Jonah ran the wrong way — and God still gave him a second chance. A whole city received mercy. And God offers second chances to you — every single day!'}
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
        background: 'radial-gradient(ellipse at 50% 30%, #0c4a6e 0%, #082f49 45%, #020c16 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '56px 20px 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, width: '100%', marginBottom: 28 }}>
          <img
            src="/images/jr/story-jonah.png"
            alt={isRu ? 'Иона и большая рыба' : 'Jonah and the Big Fish'}
            style={{ width: '100%', height: 'auto', borderRadius: 20, boxShadow: '0 12px 48px rgba(7,89,133,.55)' }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#7dd3fc', marginBottom: 10, textShadow: '0 2px 18px rgba(56,189,248,.45)' }}>
          {isRu ? 'Иона и большая рыба' : 'Jonah & the Big Fish'}
        </h1>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '1rem', color: 'rgba(125,211,252,.85)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18 }}>
          {isRu ? 'Пророк, который побежал не туда' : 'The Prophet Who Ran the Wrong Way'}
        </p>
        <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,.75)', maxWidth: 520, lineHeight: 1.7 }}>
          {isRu
            ? '«Я воззвал в скорби моей к Господу, и Он услышал меня» — Иона 2:3'
            : '"In my distress I called to the LORD, and he answered me." — Jonah 2:2'}
        </div>
      </section>

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div style={{ background: ACCENT_GLOW, borderBottom: `2px solid ${ACCENT}`, padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1 }}>
          {isRu ? '🌊 ПУТЬ ИОНЫ' : "🌊 JONAH'S JOURNEY"} {fishes} {secDoneCount}/4
        </span>
        <button onClick={resetAll} style={{ marginLeft: 16, fontFamily: 'var(--font-nunito)', fontSize: '0.7rem', fontWeight: 900, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
      </div>

      {/* ════════════════ SECTION 1 ══════════════════════════════════ */}
      <section id="sec-1" style={{ background: '#fff', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '⛵ РАЗДЕЛ 1 · БЕГЛЕЦ ⛵' : '⛵ SECTION 1 · RUN AWAY! ⛵'}
          </p>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
          <p className="eyebrow">{isRu ? 'История Ионы · Глава 1' : "Jonah's Story · Chapter 1"}</p>
          <h2 className="sec-title">{isRu ? 'Пророк бежит не туда' : 'The Wrong-Way Prophet'}</h2>

          {emojiBanner('📣 🏃 ⛵')}

          <p className="sec-intro">
            {isRu
              ? 'Однажды Бог дал пророку Ионе задание: «Встань и иди в Ниневию, город великий, и скажи людям, чтобы они перестали делать зло». Но жители Ниневии были врагами народа Ионы — и Иона совсем не хотел, чтобы Бог их простил!'
              : 'One day God gave the prophet Jonah a mission: "Get up and go to the great city of Nineveh, and tell the people to stop doing evil." But the people of Nineveh were enemies of Jonah\'s people — and Jonah did NOT want God to forgive them!'}
          </p>
          <p className="sec-intro" style={{ marginTop: 14 }}>
            {isRu
              ? 'И что сделал Иона? Он встал... и побежал в ПРОТИВОПОЛОЖНУЮ сторону! Он спустился в порт Иоппию, купил билет на корабль и поплыл в Фарсис — так далеко от Ниневии, как только мог увезти его корабль. Он думал, что может убежать от Бога.'
              : 'So what did Jonah do? He got up... and ran the OPPOSITE way! He went down to the port of Joppa, bought a ticket, and sailed for Tarshish — as far from Nineveh as a ship could carry him. He thought he could run away from God.'}
          </p>
          <p className="sec-intro" style={{ marginTop: 14 }}>
            {isRu
              ? 'Спойлер: от Бога убежать нельзя. Бог видел Иону на корабле. Бог видел его в трюме. Бог любил Иону слишком сильно, чтобы просто отпустить его не туда.'
              : "Spoiler alert: you cannot run away from God. God saw Jonah on the ship. God saw him hiding below deck. And God loved Jonah too much to let him keep running the wrong way."}
          </p>

          <div className="kid-note" style={{ marginTop: 20 }}>
            {isRu
              ? '💡 Ниневия была примерно в 800 км на восток. Фарсис — около 4 000 км на ЗАПАД! Иона купил билет настолько «не туда», насколько это вообще было возможно.'
              : '💡 Nineveh was about 500 miles to the EAST. Tarshish was about 2,500 miles to the WEST! Jonah bought a ticket as completely "wrong-way" as a ticket could be.'}
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
                  {isRu ? 'Отлично! Ты знаешь, как всё началось!' : 'Great job! You know how it all began!'}
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
                        background: seqErr ? '#fff0f0' : selected ? ACCENT_GLOW : '#f5f9fb',
                        border: `2px solid ${seqErr ? '#e04040' : selected ? ACCENT : '#d5e2e9'}`,
                        transition: 'all .2s', userSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: selected ? ACCENT : '#dde8ee',
                        color: selected ? '#fff' : '#9ab',
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
      <section id="sec-2" style={{ background: '#f2f8fb', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '🌊 РАЗДЕЛ 2 · БУРЯ 🌊' : '🌊 SECTION 2 · THE STORM 🌊'}
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
            <p className="eyebrow">{isRu ? 'Четыре голоса с корабля' : 'Four Voices from the Ship'}</p>
            <h2 className="sec-title">{isRu ? 'Буря, которая всех изменила' : 'The Storm That Changed Everyone'}</h2>

            {emojiBanner('⚡ ⛵ 🌊')}

            <p className="sec-intro">
              {isRu
                ? 'Корабль вышел в море — и Бог послал такой сильный ветер, что корабль чуть не разломился! Опытные моряки были в ужасе. Они выбрасывали груз за борт и кричали каждый своему богу. А Иона? Иона крепко спал в трюме.'
                : 'The ship set sail — and God sent a wind so strong the ship was about to break apart! Even the experienced sailors were terrified. They threw cargo overboard and cried out, each to his own god. And Jonah? Jonah was fast asleep below deck.'}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'Капитан разбудил его: «Как ты можешь спать?! Встань, призови Бога твоего!» Когда жребий указал на Иону, он признался: «Буря из-за меня. Я бегу от Господа, Бога небес, сотворившего море и сушу. Бросьте меня в море — и оно утихнет». Моряки не хотели этого делать и гребли изо всех сил. Но в конце концов они бросили Иону в волны — и море мгновенно успокоилось.'
                : 'The captain shook him awake: "How can you sleep?! Get up and call on your God!" When the lot pointed to Jonah, he confessed: "This storm is because of me. I am running from the LORD, the God of heaven, who made the sea and the dry land. Throw me into the sea, and it will become calm." The sailors did not want to do it — they rowed with all their strength. But finally they threw Jonah into the waves — and instantly, the sea went still.'}
            </p>

            <div className="kid-note" style={{ marginTop: 20 }}>
              {isRu
                ? '💡 Моряки начали путь, молясь множеству выдуманных богов, — а закончили его, поклоняясь единому истинному Богу! Даже побег Ионы Бог использовал, чтобы целая команда узнала о Нём.'
                : "💡 The sailors started the trip praying to many made-up gods — and ended it worshiping the one true God! Even Jonah's running away became a way for a whole crew to meet the real God."}
            </div>

            {/* ── Activity 2: Flip Cards ─────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '🃏 АКТИВНОСТЬ 2 · ГОЛОСА С КОРАБЛЯ' : '🃏 ACTIVITY 2 · VOICES FROM THE SHIP'}
              </p>
              <p className="puzzle-q">
                {isRu
                  ? 'Нажми на каждую карточку и услышь историю с четырёх сторон!'
                  : 'Tap each card to hear the story from four different sides!'}
              </p>

              {done.has('flip') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a' }}>
                    {isRu ? 'Ты услышал все четыре голоса!' : 'You heard all four voices!'}
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
                          style={{ flex: '1 1 180px', maxWidth: 240, minHeight: 200, perspective: '700px', cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none' }}
                        >
                          <div style={{
                            position: 'relative', width: '100%', height: '100%', minHeight: 200,
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.55s ease',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          }}>
                            {/* Front */}
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                              borderRadius: 18, padding: '18px 14px',
                              background: '#fff', border: '3px solid #d5e2e9',
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
                              <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.8rem', color: '#444', lineHeight: 1.55, margin: 0 }}>
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
            {isRu ? '🐋 РАЗДЕЛ 3 · ВНУТРИ РЫБЫ 🐋' : '🐋 SECTION 3 · INSIDE THE FISH 🐋'}
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
            <p className="eyebrow">{isRu ? 'Самая необычная молитвенная комната' : 'The Strangest Prayer Room Ever'}</p>
            <h2 className="sec-title">{isRu ? 'Три дня в темноте' : 'Three Days in the Dark'}</h2>

            {emojiBanner('🌊 🐋 🙏')}

            <p className="sec-intro">
              {isRu
                ? 'Иона пошёл ко дну. Водоросли обвили его голову. Он тонул — и вдруг... ГЛОТЬ! Бог послал большую рыбу, и она проглотила Иону целиком. Рыба была не наказанием. Рыба была спасением! Бог поймал Иону, как спасатель ловит тонущего.'
                : 'Jonah sank down, down, down. Seaweed wrapped around his head. He was drowning — and then... GULP! God sent a big fish, and it swallowed Jonah whole. The fish was not the punishment. The fish was the rescue! God caught Jonah the way a lifeguard catches a drowning swimmer.'}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'Три дня и три ночи Иона сидел в самой странной комнате на свете — тёмной, мокрой и пахнущей рыбой. И что он там делал? Он молился! Он благодарил Бога за спасение и пообещал исполнить то, что обещал. И Бог повелел рыбе — и она выплюнула Иону на сушу. Второй шанс!'
                : 'For three days and three nights, Jonah sat in the strangest room in the world — dark, wet, and very fishy-smelling. And what did he do in there? He prayed! He thanked God for saving him and promised to do what he had promised. Then God commanded the fish — and it spit Jonah out onto dry land. Second chance!'}
            </p>

            <div className="kid-note" style={{ marginTop: 20 }}>
              {isRu
                ? '💡 Молиться можно ГДЕ УГОДНО — в своей комнате, в школьном автобусе и даже в животе рыбы! Бог слышит всегда и везде.'
                : '💡 You can pray ANYWHERE — your room, the school bus, even the belly of a fish! There is no place too dark, too deep, or too weird for God to hear you.'}
            </div>

            {/* ── Activity 3: Scramble ───────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '🔤 АКТИВНОСТЬ 3 · СОБЕРИ МОЛИТВУ ИОНЫ' : "🔤 ACTIVITY 3 · BUILD JONAH'S PRAYER"}
              </p>
              <p className="puzzle-q">
                {isRu
                  ? 'Расставь слова в правильном порядке и собери стих Иона 2:3!'
                  : 'Arrange the words in the correct order to build Jonah 2:2!'}
              </p>

              {done.has('scramble') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🙏🐋⭐</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a', fontSize: '1.05rem' }}>
                    {isRu ? 'Ты собрал молитву! Запомни её — она работает где угодно!' : 'You built the prayer! Remember it — it works anywhere!'}
                  </p>
                  <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1rem', color: ACCENT_DARK, marginTop: 12, padding: '10px 16px', background: ACCENT_GLOW, borderRadius: 10 }}>
                    {isRu ? '«Я воззвал к Господу, и Он услышал меня». — Иона 2:3' : '"I called to the LORD, and He answered me." — Jonah 2:2'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Answer slots */}
                  <div style={{ minHeight: 52, padding: '10px 12px', background: '#eef4f7', borderRadius: 12, border: '2px dashed #b8cdd9', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                    {scrambleOrder.length === 0
                      ? <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '0.85rem', color: '#9ab', fontWeight: 700 }}>
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
                      background: '#eef4f7', color: '#789', border: '2px solid #cfdde5',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer',
                    }}>
                      {isRu ? 'Очистить' : 'Clear'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 ══════════════════════════════════ */}
      <section id="sec-4" style={{ background: '#f2f8fb', padding: '0 0 8px' }}>
        <div style={{ background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`, padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
            {isRu ? '💚 РАЗДЕЛ 4 · БОГ ВТОРЫХ ШАНСОВ 💚' : '💚 SECTION 4 · THE GOD OF SECOND CHANCES 💚'}
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
            <p className="eyebrow">{isRu ? 'Финал истории · Главы 3–4' : 'The Story Finale · Chapters 3–4'}</p>
            <h2 className="sec-title">{isRu ? 'Целый город получает милость' : 'A Whole City Gets Mercy'}</h2>

            {emojiBanner('🏙️ 🙏 💚')}

            <p className="sec-intro">
              {isRu
                ? 'На этот раз Иона послушался! Он пришёл в Ниневию — город такой огромный, что его нужно было обходить три дня, — и объявил Божье предупреждение. И случилось чудо: ВЕСЬ город поверил Богу! Люди, и даже сам царь, отвернулись от зла и просили прощения. И Бог их помиловал.'
                : 'This time, Jonah obeyed! He walked into Nineveh — a city so huge it took three days to cross — and announced God\'s warning. And then a miracle happened: the WHOLE city believed God! The people, and even the king himself, turned from evil and asked for forgiveness. And God showed them mercy.'}
            </p>
            <p className="sec-intro" style={{ marginTop: 14 }}>
              {isRu
                ? 'А Иона... обиделся! Он сидел за городом и дулся, потому что Бог простил его врагов. Бог вырастил растение, чтобы дать Ионе тень, а потом убрал его — и Иона расстроился из-за растения! Тогда Бог задал ему вопрос, на который должен ответить каждый из нас: «Тебе жалко растение... а Мне ли не пожалеть город, в котором больше 120 000 человек?» Божья любовь больше, чем мы думаем.'
                : 'But Jonah... pouted! He sat outside the city and sulked because God had forgiven his enemies. God grew a plant to give Jonah shade, then took it away — and Jonah was upset about the plant! Then God asked him the question every one of us must answer: "You care about a plant... should I not care about a great city with more than 120,000 people?" God\'s love is bigger than we think.'}
            </p>

            {/* ── Jonah → Jesus connection ── */}
            <div style={{
              margin: '24px 0 0', borderRadius: 18,
              overflow: 'hidden', boxShadow: '0 4px 20px rgba(7,89,133,.18)',
            }}>
              <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '12px 20px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.8rem', color: 'rgba(255,255,255,.85)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {isRu ? '🔑 Секретная связь: Иона и Иисус' : '🔑 Secret connection: Jonah & Jesus'}
                </span>
              </div>
              <div style={{ background: ACCENT_GLOW, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', borderLeft: '4px solid #38bdf8' }}>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.72rem', color: '#888', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                    {isRu ? '🐋 Иона' : '🐋 Jonah'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                    {isRu
                      ? 'Три дня и три ночи в животе рыбы — а потом вышел живым, и целый город был спасён.'
                      : 'Three days and three nights inside the fish — then he came out alive, and a whole city was saved.'}
                  </p>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', borderLeft: `4px solid ${ACCENT}` }}>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.72rem', color: ACCENT, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                    {isRu ? '✝️ Иисус — Матф. 12:40' : '✝️ Jesus — Matthew 12:40'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                    {isRu
                      ? 'Три дня и три ночи в сердце земли — а потом воскрес, и весь мир может быть спасён!'
                      : 'Three days and three nights in the heart of the earth — then He rose again, and the whole world can be saved!'}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.88rem', color: ACCENT_DARK, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                  {isRu
                    ? 'Иисус Сам сказал: история Ионы была подсказкой о Нём — за сотни лет заранее!'
                    : "Jesus Himself said it: Jonah's story was a sneak preview of Him — hundreds of years early!"}
                </p>
              </div>
            </div>

            {/* ── Activity 4: True/False ─────────────────────────────── */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 28 }}>
              <p className="puzzle-label">
                {isRu ? '✅ АКТИВНОСТЬ 4 · ПРАВДА ИЛИ ЛОЖЬ?' : '✅ ACTIVITY 4 · TRUE OR FALSE?'}
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
                      background: answered ? (correct ? '#f0faf4' : '#fff0f0') : '#f5f9fb',
                      border: `2px solid ${answered ? (correct ? '#40b870' : '#e04040') : '#d5e2e9'}`,
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

            {/* ── Final gospel invitation ────────────────────────────── */}
            {done.has('tf') && (
              <div style={{
                marginTop: 36, padding: '28px 24px',
                background: `linear-gradient(135deg,${ACCENT_GLOW},rgba(125,211,252,.12))`,
                border: `3px solid ${ACCENT}`, borderRadius: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>🐋💙</div>
                <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.3rem', color: ACCENT_DARK, marginBottom: 14 }}>
                  {isRu ? 'А от чего убегаешь ты?' : 'What are YOU running from?'}
                </h3>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 18 }}>
                  {isRu
                    ? 'Иногда мы, как Иона, убегаем: от извинения, от честности, от того, что Бог просит нас сделать. Но Бог не гонится за тобой, чтобы наказать. Он догоняет тебя, чтобы обнять. Его любовь даёт второй шанс — и третий, и сотый.'
                    : "Sometimes we run like Jonah — from saying sorry, from telling the truth, from what God asks us to do. But God isn't chasing you to punish you. He's chasing you to hug you. His love gives second chances — and third ones, and hundredth ones."}
                </p>
                <div style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: ACCENT_DARK, lineHeight: 1.8, padding: '14px 18px', background: 'rgba(255,255,255,.7)', borderRadius: 14, marginBottom: 20 }}>
                  {isRu
                    ? '«Боже, спасибо, что Твоя любовь всегда находит меня. Помоги мне не убегать от Тебя, а бежать к Тебе. Спасибо за второй шанс через Иисуса. Аминь.»'
                    : '"God, thank You that Your love always finds me. Help me stop running away from You and start running TO You. Thank You for second chances through Jesus. Amen."'}
                </div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem', color: ACCENT, letterSpacing: 1 }}>
                  {isRu
                    ? '🌊 От Божьей любви не убежать — и это самая лучшая новость!'
                    : "🌊 You can't outrun God's love — and that's the best news ever!"}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Back link ──────────────────────────────────────────────── */}
      <section style={{ background: '#f5f9fb', padding: '24px 20px', textAlign: 'center' }}>
        <Link href="/lessons" style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: ACCENT, textDecoration: 'none' }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>
      </section>
    </>
  )
}
