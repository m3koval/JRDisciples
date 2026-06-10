'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'intro' | 'room1' | 'room2' | 'room3' | 'room4' | 'victory'

interface Puzzle {
  id: string
  solved: boolean
}

// ─── Room 1: The Decree ───────────────────────────────────────────────────────
// Unscramble the king's decree to understand what Daniel was ordered NOT to do.
function Room1({ onClear, isRu }: { onClear: () => void; isRu: boolean }) {
  const words_en = ['pray', 'to', 'God', 'for', '30', 'days']
  const words_ru = ['молиться', 'Богу', '30', 'дней']
  const words = isRu ? words_ru : words_en
  const [slots, setSlots]   = useState<(string|null)[]>(Array(words.length).fill(null))
  const [pool, setPool]     = useState(() => [...words].sort(() => Math.random() - 0.5))
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong]   = useState(false)

  const addToSlot = (word: string) => {
    const firstEmpty = slots.findIndex(s => s === null)
    if (firstEmpty === -1) return
    const newSlots = [...slots]; newSlots[firstEmpty] = word
    const newPool  = pool.filter(w => w !== word)
    setSlots(newSlots); setPool(newPool)
    // Check correctness
    if (newSlots.every((s, i) => s === words[i])) {
      setSolved(true); setTimeout(onClear, 1000)
    } else if (newSlots.every(s => s !== null)) {
      setWrong(true)
      setTimeout(() => {
        setSlots(Array(words.length).fill(null))
        setPool([...words].sort(() => Math.random() - 0.5))
        setWrong(false)
      }, 900)
    }
  }

  const removeSlot = (i: number) => {
    if (slots[i] === null) return
    setPool(p => [...p, slots[i]!])
    const s = [...slots]; s[i] = null; setSlots(s)
  }

  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.85)', lineHeight: 1.65, marginBottom: 18, fontSize: '.95rem' }}>
        {isRu
          ? 'Царь Дарий подписал указ. Придворные хотели поймать Даниила. Что им запрещалось делать?'
          : "King Darius signed a new law. His jealous officials wanted to trap Daniel. What did the law say you could NOT do?"}
      </p>
      <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: '.88rem', marginBottom: 14 }}>
        {isRu ? 'Составь запрет:' : 'Build the banned act:'}
      </p>
      {/* Slots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 48, marginBottom: 18, padding: '10px 12px', background: wrong ? 'rgba(239,68,68,.18)' : 'rgba(255,255,255,.06)', borderRadius: 14, border: `2px solid ${solved ? '#22c55e' : wrong ? '#ef4444' : 'rgba(255,255,255,.15)'}`, transition: 'all .3s' }}>
        {slots.map((s, i) => (
          <button key={i} onClick={() => removeSlot(i)} style={{ padding: '7px 14px', borderRadius: 10, border: '2px solid rgba(255,255,255,.3)', background: s ? 'rgba(251,191,36,.2)' : 'transparent', color: s ? '#fde68a' : 'rgba(255,255,255,.25)', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '.9rem', cursor: s ? 'pointer' : 'default', minWidth: 40 }}>
            {s ?? '…'}
          </button>
        ))}
      </div>
      {/* Word pool */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {pool.map(w => (
          <button key={w} onClick={() => addToSlot(w)} style={{ padding: '8px 16px', borderRadius: 10, border: '2px solid rgba(251,191,36,.5)', background: 'rgba(251,191,36,.12)', color: '#fde68a', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '.9rem', cursor: 'pointer' }}>
            {w}
          </button>
        ))}
      </div>
      {solved && <p style={{ fontFamily: 'sans-serif', color: '#22c55e', fontWeight: 900 }}>✓ {isRu ? 'Верно! Дверь открыта.' : 'Correct! The door opens.'}</p>}
    </div>
  )
}

// ─── Room 2: Daniel's Window ──────────────────────────────────────────────────
// Tap the correct direction Daniel faced to pray.
function Room2({ onClear, isRu }: { onClear: () => void; isRu: boolean }) {
  const [chosen, setChosen] = useState<string|null>(null)
  const options_en = ['North → Babylon', 'East → Sunrise', 'South → Egypt', 'West → Jerusalem ✦']
  const options_ru = ['Север → Вавилон', 'Восток → Восход', 'Юг → Египет', 'Запад → Иерусалим ✦']
  const options = isRu ? options_ru : options_en
  const correct = options[3]

  const pick = (opt: string) => {
    setChosen(opt)
    if (opt === correct) setTimeout(onClear, 900)
  }

  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.85)', lineHeight: 1.65, marginBottom: 18, fontSize: '.95rem' }}>
        {isRu
          ? 'Даниил не остановился. Он пошёл домой, открыл окно и помолился — как всегда. В какую сторону он смотрел, молясь?'
          : "Daniel didn't stop. He went home, opened his upstairs window, and prayed — just like always. Which direction did he face when he prayed?"}
      </p>
      <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: '.88rem', marginBottom: 14 }}>
        {isRu ? 'Выбери направление:' : 'Choose the direction:'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map(opt => {
          const isCorrect = opt === correct
          const isChosen  = opt === chosen
          return (
            <button key={opt} onClick={() => pick(opt)} disabled={!!chosen} style={{ padding: '14px 10px', borderRadius: 14, border: `2px solid ${isChosen ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,.2)'}`, background: isChosen ? (isCorrect ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.15)') : 'rgba(255,255,255,.06)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '.9rem', cursor: chosen ? 'default' : 'pointer', transition: 'all .25s' }}>
              {opt}
            </button>
          )
        })}
      </div>
      {chosen === correct && <p style={{ fontFamily: 'sans-serif', color: '#22c55e', fontWeight: 900, marginTop: 14 }}>✓ {isRu ? 'Иерусалим! Правильно.' : 'Jerusalem! Correct.'}</p>}
    </div>
  )
}

// ─── Room 3: The Den Seal ─────────────────────────────────────────────────────
// True/False about what happened in the den — teaches the story.
interface TFQ { q_en: string; q_ru: string; answer: boolean }
const TF_QUESTIONS: TFQ[] = [
  { q_en: 'King Darius wanted to throw Daniel to the lions.',        q_ru: 'Царь Дарий хотел бросить Даниила львам.',            answer: false },
  { q_en: 'God sent an angel to shut the lions\' mouths.',           q_ru: 'Бог послал ангела и закрыл пасти львов.',             answer: true  },
  { q_en: 'Daniel was hurt by the lions.',                           q_ru: 'Даниил был ранен львами.',                           answer: false },
  { q_en: 'The king did not sleep all night worrying about Daniel.', q_ru: 'Царь не спал всю ночь, беспокоясь о Данииле.',        answer: true  },
  { q_en: 'After this, the king told everyone to fear Daniel\'s God.',q_ru: 'После этого царь повелел всем бояться Бога Даниила.',answer: true  },
]

function Room3({ onClear, isRu }: { onClear: () => void; isRu: boolean }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [flash, setFlash]     = useState<'right'|'wrong'|null>(null)

  const answer = (choice: boolean) => {
    const correct = choice === TF_QUESTIONS[current].answer
    setFlash(correct ? 'right' : 'wrong')
    setTimeout(() => {
      setFlash(null)
      setAnswers(a => [...a, correct])
      if (current + 1 >= TF_QUESTIONS.length) {
        setTimeout(onClear, 400)
      } else {
        setCurrent(c => c + 1)
      }
    }, 700)
  }

  const q = TF_QUESTIONS[current]
  const correct = answers.filter(Boolean).length

  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.85)', lineHeight: 1.65, marginBottom: 18, fontSize: '.95rem' }}>
        {isRu
          ? 'Чтобы открыть печать ямы со львами, ответь на вопросы о том, что случилось.'
          : "To break the seal on the lions' den, answer questions about what happened inside."}
      </p>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {TF_QUESTIONS.map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < answers.length ? (answers[i] ? '#22c55e' : '#ef4444') : i === current ? '#fde68a' : 'rgba(255,255,255,.2)' }} />
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 16, padding: '20px 16px', marginBottom: 18, border: `2px solid ${flash === 'right' ? '#22c55e' : flash === 'wrong' ? '#ef4444' : 'rgba(255,255,255,.12)'}`, transition: 'border .2s' }}>
        <p style={{ fontFamily: 'sans-serif', fontWeight: 700, color: '#fff', lineHeight: 1.6, margin: 0, fontSize: '.95rem' }}>
          {isRu ? q.q_ru : q.q_en}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => answer(true)} disabled={!!flash} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '2px solid #22c55e', background: 'rgba(34,197,94,.12)', color: '#22c55e', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}>
          ✓ {isRu ? 'Верно' : 'True'}
        </button>
        <button onClick={() => answer(false)} disabled={!!flash} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '2px solid #ef4444', background: 'rgba(239,68,68,.12)', color: '#ef4444', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}>
          ✗ {isRu ? 'Неверно' : 'False'}
        </button>
      </div>
    </div>
  )
}

// ─── Room 4: The Verse Key ────────────────────────────────────────────────────
// Complete the scripture verse by choosing the missing words.
interface FillBlank { before: string; missing_en: string; missing_ru: string; options_en: string[]; options_ru: string[]; after: string; after_ru: string }
const FILL_BLANKS: FillBlank[] = [
  {
    before: '"My God sent His',
    missing_en: 'angel',
    missing_ru: 'ангела',
    options_en: ['angel', 'servant', 'prophet'],
    options_ru: ['ангела', 'слугу', 'пророка'],
    after: ', and He shut the mouths of the lions."',
    after_ru: ', и Он заградил уста львам."',
  },
  {
    before: '"Daniel was taken up out of the den and',
    missing_en: 'no wound',
    missing_ru: 'ни одной раны',
    options_en: ['no wound', 'great scars', 'little scratches'],
    options_ru: ['ни одной раны', 'большие шрамы', 'маленькие царапины'],
    after: ' was found on him, because he had trusted in his God."',
    after_ru: ' не было найдено на нём, потому что он уповал на Бога своего."',
  },
]

function Room4({ onClear, isRu }: { onClear: () => void; isRu: boolean }) {
  const [step, setStep]     = useState(0)
  const [chosen, setChosen] = useState<string|null>(null)
  const [done, setDone]     = useState(false)

  const blank = FILL_BLANKS[step]
  const correct = isRu ? blank.missing_ru : blank.missing_en
  const options  = isRu ? blank.options_ru : blank.options_en

  const pick = (opt: string) => {
    if (chosen) return
    setChosen(opt)
    if (opt === correct) {
      setTimeout(() => {
        if (step + 1 >= FILL_BLANKS.length) {
          setDone(true); setTimeout(onClear, 900)
        } else {
          setStep(s => s+1); setChosen(null)
        }
      }, 800)
    }
  }

  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.85)', lineHeight: 1.65, marginBottom: 18, fontSize: '.95rem' }}>
        {isRu
          ? 'Последний ключ — это Слово Бога. Восполни пропуски в стихе из Даниила 6.'
          : "The final key is God's Word itself. Fill in the missing words from Daniel 6."}
      </p>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 16, padding: '18px 16px', marginBottom: 20, border: '1px solid rgba(255,255,255,.15)' }}>
        <p style={{ fontFamily: 'sans-serif', fontStyle: 'italic', color: '#fff', lineHeight: 1.7, margin: 0, fontSize: '.9rem' }}>
          {isRu
            ? `${blank.before} `
            : `${blank.before} `}
          <span style={{ display: 'inline-block', padding: '2px 12px', borderRadius: 8, border: `2px solid ${chosen ? (chosen === correct ? '#22c55e' : '#ef4444') : '#fde68a'}`, background: chosen ? (chosen === correct ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.15)') : 'rgba(251,191,36,.15)', color: chosen === correct ? '#22c55e' : chosen ? '#ef4444' : '#fde68a', fontStyle: 'normal', fontWeight: 900, margin: '0 4px' }}>
            {chosen ?? (isRu ? '___' : '___')}
          </span>
          {isRu ? blank.after_ru : blank.after}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => pick(opt)} disabled={!!chosen} style={{ padding: '12px 18px', borderRadius: 12, border: `2px solid ${chosen === opt ? (opt === correct ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,.2)'}`, background: chosen === opt ? (opt === correct ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.1)') : 'rgba(255,255,255,.05)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '.9rem', cursor: chosen ? 'default' : 'pointer', textAlign: 'left', transition: 'all .2s' }}>
            {opt}
          </button>
        ))}
      </div>
      {done && <p style={{ fontFamily: 'sans-serif', color: '#22c55e', fontWeight: 900, marginTop: 14 }}>✓ {isRu ? 'Все ключи найдены!' : 'All keys found!'}</p>}
    </div>
  )
}

// ─── Room wrapper ─────────────────────────────────────────────────────────────
const ROOMS: { phase: Phase; titleEn: string; titleRu: string; icon: string; descEn: string; descRu: string }[] = [
  { phase: 'room1', icon: '📜', titleEn: "The King's Decree",   titleRu: 'Указ царя',          descEn: 'Find out what new law was made.', descRu: 'Узнай, какой закон был принят.' },
  { phase: 'room2', icon: '🪟', titleEn: "Daniel's Window",     titleRu: 'Окно Даниила',        descEn: 'Follow Daniel\'s prayer habit.', descRu: 'Следуй привычке Даниила молиться.' },
  { phase: 'room3', icon: '🦁', titleEn: "Inside the Den",      titleRu: 'Внутри ямы',          descEn: 'Discover what God did inside.',  descRu: 'Узнай, что Бог сделал внутри.' },
  { phase: 'room4', icon: '🗝️', titleEn: 'The Verse Key',       titleRu: 'Ключ — стих',         descEn: 'Complete God\'s Word to escape.',descRu: 'Восполни Слово Бога — и выйдешь!' },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EscapeRoomDanielPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  const [phase, setPhase]         = useState<Phase>('intro')
  const [clearedRooms, setCleared]= useState<Set<number>>(new Set())
  const [roomIdx, setRoomIdx]     = useState(0)

  const currentRoom = ROOMS[roomIdx]

  const handleClear = useCallback(() => {
    setCleared(prev => {
      const next = new Set(prev)
      next.add(roomIdx)
      if (next.size >= ROOMS.length) {
        setTimeout(() => setPhase('victory'), 600)
      }
      return next
    })
  }, [roomIdx])

  const goToRoom = (idx: number) => { setRoomIdx(idx); setPhase(ROOMS[idx].phase) }

  const isCleared = (idx: number) => clearedRooms.has(idx)
  const allCleared = clearedRooms.size >= ROOMS.length

  return (
    <main style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#0c0a1e,#1a1040 50%,#2c1810)', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <section style={{ maxWidth: 620, margin: '0 auto', padding: '28px 18px 72px', color: '#fff' }}>
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'sans-serif', fontWeight: 900, textDecoration: 'none' }}>
          ← {isRu ? 'К играм' : 'Back to Games'}
        </Link>

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontFamily: 'sans-serif', color: '#c4b5fd', fontSize: '.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>
              {isRu ? 'Комната-загадка' : 'Escape Room'}
            </p>
            <h1 style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,6vw,3rem)', margin: '0 0 6px', color: '#fff' }}>
              🦁 {isRu ? 'Яма со львами' : "Lion's Den"}
            </h1>
            <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.6)', fontSize: '.85rem', margin: '0 0 24px' }}>
              {isRu ? 'Даниил 6' : 'Daniel 6'}
            </p>
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: '22px 20px', marginBottom: 24 }}>
              <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.9)', lineHeight: 1.7, margin: '0 0 16px', fontSize: '.95rem' }}>
                {isRu
                  ? 'Даниил жил в Вавилоне и каждый день молился Богу. Завистливые чиновники убедили царя Дария подписать закон, запрещающий молитву. Тот, кто нарушит его, — будет брошен к львам. Но Даниил не остановился...'
                  : "Daniel lived in Babylon and prayed to God every single day. Jealous officials tricked King Darius into signing a law making prayer illegal. Anyone who disobeyed would be thrown to the lions. But Daniel didn't stop..."}
              </p>
              <p style={{ fontFamily: 'sans-serif', color: '#c4b5fd', fontWeight: 900, margin: 0, fontSize: '.9rem' }}>
                {isRu ? '🔒 4 комнаты • Реши загадку • Сбеги!' : '🔒 4 rooms • Solve each puzzle • Escape!'}
              </p>
            </div>
            {/* Room map preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {ROOMS.map((r, i) => (
                <div key={r.phase} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: '14px 14px', border: '1px solid rgba(255,255,255,.1)' }}>
                  <span style={{ fontSize: '1.6rem' }}>{r.icon}</span>
                  <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#c4b5fd', fontSize: '.8rem', margin: '6px 0 2px' }}>
                    {isRu ? `Комната ${i+1}` : `Room ${i+1}`}
                  </p>
                  <p style={{ fontFamily: 'sans-serif', color: '#fff', fontWeight: 900, fontSize: '.85rem', margin: 0 }}>
                    {isRu ? r.titleRu : r.titleEn}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => goToRoom(0)}
              style={{ background: 'linear-gradient(180deg,#a78bfa,#7c3aed)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.1rem', border: 'none', borderRadius: 14, padding: '15px 42px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,.4)' }}
            >
              {isRu ? 'Начать → Комната 1' : 'Start → Room 1'}
            </button>
          </div>
        )}

        {/* ── ROOM ── */}
        {(['room1','room2','room3','room4'] as Phase[]).includes(phase) && (
          <div style={{ marginTop: 24 }}>
            {/* Room header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(167,139,250,.2)', border: '2px solid rgba(167,139,250,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                {currentRoom.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'sans-serif', color: '#c4b5fd', fontSize: '.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 2px' }}>
                  {isRu ? `Комната ${roomIdx + 1} из ${ROOMS.length}` : `Room ${roomIdx + 1} of ${ROOMS.length}`}
                </p>
                <h2 style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fff', fontSize: '1.3rem', margin: 0 }}>
                  {isRu ? currentRoom.titleRu : currentRoom.titleEn}
                </h2>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
              {ROOMS.map((r, i) => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: isCleared(i) ? '#a78bfa' : i === roomIdx ? 'rgba(167,139,250,.4)' : 'rgba(255,255,255,.12)' }} />
              ))}
            </div>

            {/* Puzzle content */}
            <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 20, padding: '22px 18px', border: '1px solid rgba(167,139,250,.2)' }}>
              {phase === 'room1' && <Room1 onClear={handleClear} isRu={isRu} />}
              {phase === 'room2' && <Room2 onClear={handleClear} isRu={isRu} />}
              {phase === 'room3' && <Room3 onClear={handleClear} isRu={isRu} />}
              {phase === 'room4' && <Room4 onClear={handleClear} isRu={isRu} />}
            </div>

            {/* Navigation — show "next" only after clearing */}
            {isCleared(roomIdx) && !allCleared && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  onClick={() => goToRoom(Math.min(roomIdx + 1, ROOMS.length - 1))}
                  style={{ background: 'linear-gradient(180deg,#a78bfa,#7c3aed)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', border: 'none', borderRadius: 14, padding: '13px 32px', cursor: 'pointer' }}
                >
                  {isRu ? `Комната ${roomIdx + 2} →` : `Room ${roomIdx + 2} →`}
                </button>
              </div>
            )}

            {/* Room map */}
            <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {ROOMS.map((r, i) => (
                <button
                  key={i}
                  onClick={() => isCleared(i) || i === 0 || isCleared(i-1) ? goToRoom(i) : undefined}
                  style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${i === roomIdx ? '#a78bfa' : isCleared(i) ? '#22c55e' : 'rgba(255,255,255,.15)'}`, background: i === roomIdx ? 'rgba(167,139,250,.25)' : isCleared(i) ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.04)', fontSize: '1.2rem', cursor: isCleared(i) || i <= roomIdx ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isCleared(i) ? '✓' : r.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── VICTORY ── */}
        {phase === 'victory' && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🙌</div>
            <h2 style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: 'clamp(1.6rem,6vw,2.4rem)', margin: '0 0 14px' }}>
              {isRu ? 'Ты сбежал!' : 'You Escaped!'}
            </h2>
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 20, padding: '22px 18px', margin: '0 auto 28px', maxWidth: 440 }}>
              <p style={{ fontFamily: 'sans-serif', fontStyle: 'italic', color: '#fff', lineHeight: 1.7, margin: '0 0 12px', fontSize: '.95rem' }}>
                {isRu
                  ? '"Бог мой послал Ангела Своего и заградил пасти львов, и они не повредили мне." — Дан 6:22'
                  : '"My God sent His angel and shut the mouths of the lions. They have not hurt me." — Daniel 6:22'}
              </p>
              <p style={{ fontFamily: 'sans-serif', color: '#c4b5fd', lineHeight: 1.6, margin: 0, fontSize: '.9rem' }}>
                {isRu
                  ? 'Даниил остался верным Богу даже когда это было опасно. Бог был с ним.'
                  : "Daniel stayed faithful to God even when it was dangerous. God was with him."}
              </p>
            </div>
            <div style={{ background: 'rgba(167,139,250,.15)', borderRadius: 16, padding: '16px 18px', marginBottom: 28, border: '1px solid rgba(167,139,250,.3)' }}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#c4b5fd', margin: '0 0 6px', fontSize: '.85rem' }}>
                {isRu ? 'Вопрос для размышления:' : 'Think about it:'}
              </p>
              <p style={{ fontFamily: 'sans-serif', color: '#fff', margin: 0, lineHeight: 1.6, fontSize: '.9rem' }}>
                {isRu
                  ? 'Есть ли что-то, из-за чего тебе трудно делать правильное? Как история Даниила помогает тебе?'
                  : 'Is there something that makes it hard to do the right thing? How does Daniel\'s story help you?'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button
                onClick={() => { setPhase('intro'); setCleared(new Set()); setRoomIdx(0) }}
                style={{ background: 'linear-gradient(180deg,#a78bfa,#7c3aed)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', border: 'none', borderRadius: 14, padding: '13px 28px', cursor: 'pointer' }}
              >
                {isRu ? 'Ещё раз' : 'Play again'}
              </button>
              <Link href="/games" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '1rem', borderRadius: 14, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
                {isRu ? 'К играм' : 'Games'}
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
