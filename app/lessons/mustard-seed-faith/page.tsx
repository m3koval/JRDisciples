'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT      = '#15803d'
const ACCENT_DARK = '#14532d'
const ACCENT_GLOW = 'rgba(21,128,61,.15)'

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['seq'],
  2: ['flip'],
  3: ['tf'],
  4: ['scramble'],
}

// ─── Story sequence data ──────────────────────────────────────────────────────
const SEQ_CORRECT = ['a', 'b', 'c', 'd']

const SEQ_EN = [
  { id: 'a', emoji: '🏔️', text: 'Jesus, Peter, James and John come down from the mountain of the Transfiguration' },
  { id: 'b', emoji: '👨', text: "A man kneels before Jesus — his son has a terrible illness" },
  { id: 'c', emoji: '😔', text: 'The disciples had already tried to heal the boy — but could not' },
  { id: 'd', emoji: '✨', text: 'Jesus heals the boy immediately with a single word' },
]
const SEQ_RU = [
  { id: 'a', emoji: '🏔️', text: 'Иисус, Пётр, Иаков и Иоанн спускаются с горы Преображения' },
  { id: 'b', emoji: '👨', text: 'Мужчина падает на колени перед Иисусом — его сын тяжело болен' },
  { id: 'c', emoji: '😔', text: 'Ученики уже пытались исцелить мальчика — но не смогли' },
  { id: 'd', emoji: '✨', text: 'Иисус исцеляет мальчика немедленно одним словом' },
]

function shuffleIds(): string[] {
  const ids = [...SEQ_CORRECT]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

// ─── Character flip card data ─────────────────────────────────────────────────
const CHARS_EN = [
  {
    id: 'father',
    emoji: '👨',
    name: 'The Father',
    role: 'The Desperate Parent',
    back: "He'd been everywhere. No one could help his son. Then he heard Jesus was near. He ran. He knelt. He begged. His faith wasn't perfect — but it was real and it brought him to the right place.",
  },
  {
    id: 'son',
    emoji: '😢',
    name: 'The Son',
    role: 'The One Who Needed Help',
    back: "He couldn't fix himself. He needed help he couldn't earn. That's the picture of all of us before God — we can't heal ourselves. We need Jesus.",
  },
  {
    id: 'disciples',
    emoji: '😕',
    name: 'The Disciples',
    role: 'The Ones Who Tried',
    back: "They tried. They prayed. But something wasn't working. Jesus said it was 'little faith.' Even the people closest to Jesus had moments when their faith was weak. And that's okay — Jesus didn't give up on them.",
  },
  {
    id: 'jesus',
    emoji: '✨',
    name: 'Jesus',
    role: 'The Healer',
    back: "He didn't say 'I'll try.' He didn't ask for a second opinion. He rebuked the illness and the boy was healed immediately. Complete authority. Complete power. Complete love.",
  },
]

const CHARS_RU = [
  {
    id: 'father',
    emoji: '👨',
    name: 'Отец',
    role: 'Отчаявшийся родитель',
    back: 'Он обходил всех. Никто не мог помочь его сыну. Потом он услышал, что Иисус рядом. Побежал. Упал на колени. Умолял. Его вера была не идеальной — но она была настоящей и привела его куда надо.',
  },
  {
    id: 'son',
    emoji: '😢',
    name: 'Сын',
    role: 'Тот, кому нужна была помощь',
    back: 'Сам он не мог себе помочь. Ему было нужно то, чего он не мог заработать. Это образ каждого из нас перед Богом — мы не можем исцелить себя. Нам нужен Иисус.',
  },
  {
    id: 'disciples',
    emoji: '😕',
    name: 'Ученики',
    role: 'Те, кто старался',
    back: 'Они старались. Они молились. Но что-то не работало. Иисус сказал — «маловерие». Даже самые близкие к Иисусу люди бывали со слабой верой. И это нормально — Иисус не бросил их.',
  },
  {
    id: 'jesus',
    emoji: '✨',
    name: 'Иисус',
    role: 'Целитель',
    back: 'Он не сказал «попробую». Он не сомневался. Он запретил болезни — и мальчик немедленно исцелился. Полная власть. Полная сила. Полная любовь.',
  },
]

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  {
    id: 'q1',
    text: 'The disciples never tried to heal the boy — they gave up right away.',
    correct: false,
    explain: 'The disciples DID try — they just couldn\'t do it. Jesus had to explain why afterward.',
  },
  {
    id: 'q2',
    text: 'Jesus healed the boy immediately when He spoke.',
    correct: true,
    explain: 'Matthew 17:18 — "the boy was healed at that moment." No waiting, no process — instant.',
  },
  {
    id: 'q3',
    text: "Jesus said the disciples couldn't heal because they hadn't memorized enough Bible verses.",
    correct: false,
    explain: 'Jesus said it was because of their "little faith" — not lack of knowledge or technique.',
  },
  {
    id: 'q4',
    text: 'Jesus said "because of your little faith" you could not do it.',
    correct: true,
    explain: 'Matthew 17:20 — "Because you have so little faith." He was honest AND still teaching them.',
  },
  {
    id: 'q5',
    text: 'Jesus said that faith as tiny as a mustard seed can move a mountain.',
    correct: true,
    explain: 'Matthew 17:20 — that\'s the famous mustard seed promise. Small real faith in a big real God!',
  },
]

const TF_RU = [
  {
    id: 'q1',
    text: 'Ученики даже не пытались исцелить мальчика — сразу сдались.',
    correct: false,
    explain: 'Ученики пытались — просто не смогли. Иисус объяснил почему уже потом.',
  },
  {
    id: 'q2',
    text: 'Иисус исцелил мальчика немедленно, когда сказал слово.',
    correct: true,
    explain: 'Матф. 17:18 — «и с этого часа мальчик стал здоров». Никакого ожидания — мгновенно.',
  },
  {
    id: 'q3',
    text: 'Иисус сказал, что ученики не могли исцелить, потому что не выучили достаточно стихов из Библии.',
    correct: false,
    explain: 'Иисус сказал — «по неверию вашему». Дело не в знаниях, а в вере.',
  },
  {
    id: 'q4',
    text: 'Иисус сказал: «по неверию вашему» вы не смогли этого сделать.',
    correct: true,
    explain: 'Матф. 17:20 — «по неверию вашему». Он был честным — и всё равно продолжал учить их.',
  },
  {
    id: 'q5',
    text: 'Иисус сказал: вера размером с горчичное зерно может сдвинуть гору.',
    correct: true,
    explain: 'Матф. 17:20 — это знаменитое обещание о горчичном зерне. Маленькая вера в большого Бога!',
  },
]

// ─── Scramble tiles ───────────────────────────────────────────────────────────
type Tile = { uid: string; word: string }

const SC_TILES_EN: Tile[] = [
  { uid: 'sc3', word: 'IMPOSSIBLE' },
  { uid: 'sc0', word: 'NOTHING' },
  { uid: 'sc5', word: 'YOU' },
  { uid: 'sc2', word: 'BE' },
  { uid: 'sc4', word: 'FOR' },
  { uid: 'sc1', word: 'WILL' },
]
const SC_ANS_EN = ['nothing', 'will', 'be', 'impossible', 'for', 'you']

const SC_TILES_RU: Tile[] = [
  { uid: 'sc2', word: 'БУДЕТ' },
  { uid: 'sc0', word: 'НИЧТО' },
  { uid: 'sc4', word: 'ДЛЯ' },
  { uid: 'sc1', word: 'НЕ' },
  { uid: 'sc5', word: 'ВАС' },
  { uid: 'sc3', word: 'НЕВОЗМОЖНЫМ' },
]
const SC_ANS_RU = ['ничто', 'не', 'будет', 'невозможным', 'для', 'вас']

// ─── Component ────────────────────────────────────────────────────────────────
export default function MustardSeedFaithPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('mustard-faith_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('mustard-faith_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('mustard-faith_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('mustard-faith_done',     JSON.stringify([...done]))
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

  function progressIcon(secNum: number): string {
    const reqs = SECTION_REQS[secNum]
    if (reqs.every(r => done.has(r))) return '⭐'
    if (unlocked.has(secNum)) return '📖'
    return '🔒'
  }

  // ── Activity 1: Sequence ──────────────────────────────────────────────────
  const [seqShuffled] = useState<string[]>(shuffleIds)
  const [seqOrder, setSeqOrder] = useState<string[]>([])
  const [seqErr, setSeqErr] = useState(false)

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

  // ── Activity 2: Flip cards ─────────────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipChar(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    const CHARS = isRu ? CHARS_RU : CHARS_EN
    if (CHARS.every(c => next.has(c.id))) solve('flip', 2)
  }

  // ── Activity 3: True / False (one at a time) ──────────────────────────────
  const [tfIdx, setTfIdx] = useState(0)
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({})
  const [tfFlash, setTfFlash] = useState<'correct' | 'wrong' | null>(null)

  const TF_ACTIVE = isRu ? TF_RU : TF_EN

  function answerTf(id: string, answer: boolean) {
    if (tfAnswers[id] !== undefined) return
    const q = TF_ACTIVE.find(q => q.id === id)
    if (!q) return
    const isCorrect = answer === q.correct
    setTfFlash(isCorrect ? 'correct' : 'wrong')
    const next = { ...tfAnswers, [id]: answer }
    setTfAnswers(next)
    setTimeout(() => {
      setTfFlash(null)
      if (tfIdx < TF_ACTIVE.length - 1) {
        setTfIdx(i => i + 1)
      } else {
        solve('tf', 3)
      }
    }, 1000)
  }

  // ── Activity 4: Scramble ──────────────────────────────────────────────────
  const [scrambleOrder, setScrambleOrder] = useState<string[]>([])
  const [scrambleErr, setScrambleErr] = useState('')

  const SC_TILES = isRu ? SC_TILES_RU : SC_TILES_EN
  const SC_ANS   = isRu ? SC_ANS_RU   : SC_ANS_EN

  const scrambleCorrect =
    scrambleOrder.length === SC_ANS.length &&
    scrambleOrder.every((uid, i) => {
      const tile = SC_TILES.find(t => t.uid === uid)
      return tile?.word.toLowerCase() === SC_ANS[i]
    })

  function addScrambleTile(uid: string) {
    if (scrambleOrder.includes(uid)) return
    setScrambleOrder(prev => [...prev, uid])
  }
  function removeScrambleTile(uid: string) {
    setScrambleOrder(prev => prev.filter(u => u !== uid))
  }
  function checkScramble() {
    if (scrambleCorrect) {
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
    localStorage.removeItem('mustard-faith_unlocked')
    localStorage.removeItem('mustard-faith_done')
    window.location.reload()
  }

  // ── Language-dependent refs ────────────────────────────────────────────────
  const CHARS_ACTIVE = isRu ? CHARS_RU : CHARS_EN
  const SEQ_ACTIVE   = isRu ? SEQ_RU   : SEQ_EN
  const seqById      = Object.fromEntries(SEQ_ACTIVE.map(e => [e.id, e]))

  // ── Tile style helper ──────────────────────────────────────────────────────
  function tileStyle(inSlot: boolean): React.CSSProperties {
    return {
      padding: '11px 16px', borderRadius: 10, minHeight: 44,
      background: inSlot ? ACCENT : 'rgba(255,255,255,.12)',
      color: inSlot ? '#fff' : 'rgba(255,255,255,.9)',
      border: `2px solid ${inSlot ? ACCENT : 'rgba(255,255,255,.25)'}`,
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
      cursor: 'pointer', userSelect: 'none' as const, display: 'inline-block',
    }
  }

  // ── Locked section placeholder ─────────────────────────────────────────────
  function LockedPlaceholder({ secNum, light }: { secNum: number; light?: boolean }) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: light ? 'rgba(20,83,45,.6)' : 'rgba(255,255,255,.5)', fontSize: '1rem' }}>
          {isRu
            ? `Заверши Раздел ${secNum - 1}, чтобы открыть этот раздел!`
            : `Complete Section ${secNum - 1} to unlock this section!`}
        </p>
      </div>
    )
  }

  // ── TF score after done ───────────────────────────────────────────────────
  const tfScore = Object.entries(tfAnswers).filter(([id, ans]) => {
    const q = TF_ACTIVE.find(q => q.id === id)
    return q && ans === q.correct
  }).length

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <>
      {/* ── Win Screen ──────────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(4,20,10,.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30,
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>⛰️</div>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#86efac',
            marginBottom: 14, lineHeight: 1.3, maxWidth: 480,
          }}>
            {isRu ? 'Твоя вера не должна быть большой. Просто настоящей.' : "Your faith doesn't have to be big. Just real."}
          </h2>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 700,
            color: 'rgba(255,255,255,.8)', lineHeight: 1.7, marginBottom: 28,
            fontSize: '0.98rem', maxWidth: 460,
          }}>
            {isRu
              ? 'Даже самые близкие ученики Иисуса бывали со слабой верой — и Он продолжал их учить. С тобой будет так же.'
              : "Even Jesus' closest disciples had weak faith moments — and He kept teaching them. He'll do the same with you."}
          </p>
          <div style={{
            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
            fontSize: '0.95rem', color: 'rgba(134,239,172,.85)',
            lineHeight: 1.8, maxWidth: 500, marginBottom: 32,
            padding: '16px 20px', background: 'rgba(21,128,61,.2)',
            borderRadius: 14, border: '1.5px solid rgba(21,128,61,.4)',
          }}>
            {isRu
              ? '"Истинно говорю вам: если вы будете иметь веру с горчичное зерно и скажете горе сей: «перейди отсюда туда», и она перейдёт; и ничего не будет невозможного для вас." — Матф. 17:20'
              : '"Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, \'Move from here to there,\' and it will move. Nothing will be impossible for you." — Matthew 17:20'}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setWon(false)} style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
              color: '#fff', border: 'none', borderRadius: 18,
              fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900, cursor: 'pointer',
            }}>
              {isRu ? '← Вернуться к уроку' : '← Back to Lesson'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('mustard-faith_unlocked')
                localStorage.removeItem('mustard-faith_done')
                window.location.reload()
              }}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)',
                color: '#3b2307', border: 'none', borderRadius: 18,
                fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900, cursor: 'pointer',
              }}
            >
              {isRu ? '🔄 Пройти заново' : '🔄 Do It Again'}
            </button>
            <Link href="/lessons" style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,.08)',
              color: 'rgba(255,255,255,.8)', border: '1.5px solid rgba(255,255,255,.2)',
              borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1rem',
              fontWeight: 900, cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block',
            }}>
              {isRu ? 'Все уроки' : 'All Lessons'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '52vh',
        background: 'linear-gradient(180deg,#061a0e,#0a2015 40%,#e8f5e9)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '64px 20px 52px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌱</div>
        <h1 style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#86efac',
          marginBottom: 10, lineHeight: 1.2,
        }}>
          {isRu ? 'Вера с горчичное зерно' : 'Mustard Seed Faith'}
        </h1>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          fontSize: '0.95rem', color: 'rgba(134,239,172,.75)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 22,
        }}>
          {isRu ? 'Матфея 17:14–21' : 'Matthew 17:14–21'}
        </p>
        <div style={{
          fontFamily: 'var(--font-lora)', fontStyle: 'italic',
          fontSize: '1.05rem', color: 'rgba(255,255,255,.7)',
          maxWidth: 540, lineHeight: 1.75, marginBottom: 28,
        }}>
          {isRu
            ? '"…если будете иметь веру с горчичное зерно, ничего не будет невозможного для вас." — Матф. 17:20'
            : '"…if you have faith as small as a mustard seed, nothing will be impossible for you." — Matthew 17:20'}
        </div>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 700,
          fontSize: '0.9rem', color: 'rgba(255,255,255,.55)',
          maxWidth: 480, lineHeight: 1.65,
        }}>
          {isRu
            ? 'Прямо после Преображения — Иисус, Пётр, Иаков и Иоанн спускаются с горы сияющими… и сразу сталкиваются с отчаянным отцом, больным сыном и учениками, которые не смогли помочь.'
            : 'Right after the Transfiguration — Jesus, Peter, James and John come down the mountain glowing… and immediately walk into a desperate situation: a frantic father, a very sick boy, and disciples who already tried and failed.'}
        </p>
      </section>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div style={{
        background: ACCENT_GLOW,
        borderTop: `2px solid ${ACCENT}`,
        borderBottom: `2px solid ${ACCENT}`,
        padding: '10px 20px', textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1,
        }}>
          {isRu ? '📖 ПРОГРЕСС' : '📖 PROGRESS'}{' '}
          {[1, 2, 3, 4].map(n => progressIcon(n)).join(' ')}{' '}
          {secDoneCount}/4
        </span>
        <button onClick={resetAll} style={{
          marginLeft: 16, fontFamily: 'var(--font-nunito)', fontSize: '0.7rem',
          fontWeight: 900, color: '#aaa', background: 'none', border: 'none',
          cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
      </div>

      {/* ════════════════ SECTION 1 · BACK TO THE VALLEY ════════════════ */}
      <section id="sec-1" style={{
        background: 'linear-gradient(180deg,#0a2015,#0f2d1a)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🏔️ РАЗДЕЛ 1 · НАЗАД В ДОЛИНУ 🏔️' : '🏔️ SECTION 1 · BACK TO THE VALLEY 🏔️'}
          </p>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
            color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
          }}>
            {isRu ? 'История Матфея 17:14–21' : 'The Story of Matthew 17:14–21'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
            marginBottom: 20, lineHeight: 1.2,
          }}>
            {isRu ? 'Назад в долину' : 'Back to the Valley'}
          </h2>

          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'Иисус только что показал Петру, Иакову и Иоанну нечто невероятное: Своё Преображение на горе. Его лицо сияло как солнце. Явились Моисей и Илия. Прозвучал голос Бога. Это был самый великий момент в жизни этих учеников.'
              : 'Jesus had just shown Peter, James, and John something incredible: His Transfiguration on the mountain. His face shone like the sun. Moses and Elijah appeared. God\'s voice rang out. It was the most extraordinary moment of these disciples\' lives.'}
          </p>
          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'И они спустились с горы. Прямо навстречу отчаянию. Отец с больным сыном ждал их. Другие ученики уже пытались помочь — и не смогли. Иисус вошёл в эту ситуацию, не уклоняясь и не задерживаясь. Одним словом — мальчик исцелился.'
              : 'And they came down the mountain. Straight into despair. A father with a very sick son was waiting. The other disciples had already tried to help — and couldn\'t. Jesus walked into that situation without hesitation. With a single word — the boy was healed.'}
          </p>

          {/* Callout */}
          <div style={{
            margin: '24px 0 28px', padding: '18px 22px',
            background: 'rgba(255,255,255,.06)', borderRadius: 16,
            border: `1.5px solid ${ACCENT}`,
            borderLeft: `5px solid ${ACCENT}`,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 800,
              fontSize: '0.97rem', color: '#86efac', lineHeight: 1.7, margin: 0,
            }}>
              {isRu
                ? '💡 Со сверкающей горы славы — прямо в долину боли. Это и есть настоящая жизнь. Иисус её не избегал. Он шёл прямо навстречу.'
                : "💡 Coming off the mountain of glory straight into a valley of pain — that's real life. Jesus didn't avoid it. He walked right into it."}
            </p>
          </div>

          {/* Verse */}
          <div style={{
            padding: '18px 22px', marginBottom: 28,
            background: 'rgba(255,255,255,.04)', borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,.14)',
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
              color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Матфея 17:14–15' : 'Matthew 17:14–15'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
              fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
            }}>
              {isRu
                ? '"Один человек, подойдя к Нему, пал на колени и сказал: «Господи! помилуй сына моего; он в новолуния беснуется и тяжко страдает»"'
                : '"A man came to him and knelt before him. \'Lord, have mercy on my son,\' he said. \'He has seizures and is suffering greatly.\'"'}
            </p>
          </div>

          {/* ── Activity 1: Sequence ──────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,.06)', borderRadius: 22,
            border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px', marginTop: 8,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
              color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? '📋 АКТИВНОСТЬ 1 · РАССТАВЬ ПО ПОРЯДКУ' : '📋 ACTIVITY 1 · PUT IT IN ORDER'}
            </p>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 700,
              fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 16,
            }}>
              {isRu
                ? 'Нажимай события в правильном порядке — от первого до последнего!'
                : 'Tap the events in the correct order — first to last!'}
            </p>

            {done.has('seq') ? (
              <div>
                <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#86efac', margin: 0 }}>
                    {isRu ? 'Отлично! Вот вся история по порядку:' : 'Great job! Here is the whole story in order:'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {SEQ_CORRECT.map((id, i) => {
                    const ev = seqById[id]
                    return (
                      <div key={id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 12,
                        background: ACCENT_GLOW,
                        border: `2px solid ${ACCENT}`,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: '#4ade80', color: '#052e16',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>{ev.emoji}</span>
                        <span style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 700,
                          fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.4,
                        }}>
                          {ev.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                        padding: '12px 16px', borderRadius: 12,
                        cursor: selected ? 'default' : 'pointer',
                        background: seqErr ? 'rgba(224,64,64,.15)' : selected ? ACCENT_GLOW : 'rgba(255,255,255,.05)',
                        border: `2px solid ${seqErr ? '#e04040' : selected ? ACCENT : 'rgba(255,255,255,.14)'}`,
                        transition: 'all .2s', userSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: selected ? ACCENT : 'rgba(255,255,255,.12)',
                        color: selected ? '#fff' : 'rgba(255,255,255,.4)',
                        fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selected ? pos + 1 : '?'}
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>{ev.emoji}</span>
                      <span style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 700,
                        fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.4,
                      }}>
                        {ev.text}
                      </span>
                    </div>
                  )
                })}
                {seqErr && (
                  <p style={{
                    textAlign: 'center', color: '#f87171',
                    fontFamily: 'var(--font-nunito)', fontWeight: 900, marginTop: 4,
                  }}>
                    {isRu ? '❌ Попробуй ещё раз!' : '❌ Not quite! Try again.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 2 · FOUR PEOPLE, ONE CRISIS ═══════════ */}
      <section id="sec-2" style={{
        background: 'linear-gradient(180deg,#0f2d1a,#0a2015)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '👥 РАЗДЕЛ 2 · ЧЕТЫРЕ ЧЕЛОВЕКА, ОДИН КРИЗИС 👥' : '👥 SECTION 2 · FOUR PEOPLE, ONE CRISIS 👥'}
          </p>
        </div>

        {!unlocked.has(2) ? (
          <LockedPlaceholder secNum={2} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Четыре ключевых участника' : 'Four Key Participants'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Четыре человека, один кризис' : 'Four People, One Crisis'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'В этой сцене — четыре разных участника, и у каждого своя история. Отец в отчаянии. Сын, который не может помочь сам себе. Ученики, которые старались — и не смогли. И Иисус, у которого есть всё, что нужно.'
                : 'In this scene — four different participants, each with their own story. A desperate father. A son who can\'t help himself. Disciples who tried and failed. And Jesus, who has everything needed.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'У каждого из них есть что сказать нам о вере, о нужде и о том, кто такой Иисус.'
                : 'Each of them has something to say to us about faith, need, and who Jesus is.'}
            </p>

            {/* ── Activity 2: Flip Cards ────────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🃏 АКТИВНОСТЬ 2 · ПОЗНАКОМЬСЯ С УЧАСТНИКАМИ' : '🃏 ACTIVITY 2 · MEET THE PARTICIPANTS'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажми на каждую карточку, чтобы узнать, что говорит каждый участник!'
                  : 'Tap each card to learn what each participant tells us!'}
              </p>

              {done.has('flip') && (
                <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#86efac', margin: 0 }}>
                    {isRu ? 'Ты познакомился со всеми четырьмя участниками! Перечитай их истории ниже.' : "You've met all four participants! Read their stories again below."}
                  </p>
                </div>
              )}
              {(
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                    {CHARS_ACTIVE.map(c => {
                      const isFlipped = done.has('flip') || flipped.has(c.id)
                      return (
                        <div
                          key={c.id}
                          onClick={() => !isFlipped && flipChar(c.id)}
                          style={{
                            flex: '1 1 180px', maxWidth: 240,
                            minHeight: 200, perspective: '700px',
                            cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none',
                          }}
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
                              background: 'rgba(255,255,255,.07)',
                              border: '2px solid rgba(255,255,255,.18)',
                              textAlign: 'center',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{c.emoji}</div>
                              <div style={{
                                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                                fontSize: '0.95rem', color: '#86efac', marginBottom: 6,
                              }}>
                                {c.name}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                                fontSize: '0.78rem', color: 'rgba(255,255,255,.5)', marginBottom: 10,
                              }}>
                                {c.role}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-nunito)', fontSize: '0.65rem',
                                fontWeight: 900, letterSpacing: 1, color: 'rgba(255,255,255,.3)',
                                textTransform: 'uppercase',
                              }}>
                                {isRu ? 'Нажми ▾' : 'Tap ▾'}
                              </div>
                            </div>
                            {/* Back */}
                            <div style={{
                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              borderRadius: 18, padding: '18px 14px',
                              background: ACCENT_GLOW,
                              border: `2px solid ${ACCENT}`,
                              textAlign: 'center',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.emoji}</div>
                              <div style={{
                                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                                fontSize: '0.85rem', color: '#86efac', marginBottom: 10,
                              }}>
                                {c.name}
                              </div>
                              <p style={{
                                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                                fontSize: '0.83rem', color: 'rgba(255,255,255,.85)',
                                lineHeight: 1.65, margin: 0,
                              }}>
                                {c.back}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {!done.has('flip') && (
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 700,
                      fontSize: '0.82rem', color: 'rgba(255,255,255,.45)',
                      textAlign: 'center', marginTop: 14,
                    }}>
                      {isRu
                        ? `Открыто: ${flipped.size} из ${CHARS_ACTIVE.length}`
                        : `Revealed: ${flipped.size} of ${CHARS_ACTIVE.length}`}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Verse */}
            <div style={{
              padding: '18px 22px', marginTop: 24,
              background: 'rgba(255,255,255,.04)', borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,.14)',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Матфея 17:18' : 'Matthew 17:18'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"И запретил ему Иисус, и бес вышел из него; и с этого часа мальчик стал здоров."'
                  : '"Jesus rebuked the demon, and it came out of the boy, and he was healed at that moment."'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 3 · WHY COULDN'T WE? ══════════════════ */}
      <section id="sec-3" style={{
        background: 'linear-gradient(180deg,#0a2015,#0f2d1a)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '❓ РАЗДЕЛ 3 · ПОЧЕМУ МЫ НЕ СМОГЛИ? ❓' : "❓ SECTION 3 · WHY COULDN'T WE? ❓"}
          </p>
        </div>

        {!unlocked.has(3) ? (
          <LockedPlaceholder secNum={3} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Честный разговор' : 'An Honest Conversation'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Почему мы не смогли?' : "Why Couldn't We?"}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'После того как Иисус исцелил мальчика, ученики наедине спросили Его: «Почему мы не смогли?» Это хороший вопрос. Они старались. Они молились. Но что-то не работало.'
                : 'After Jesus healed the boy, the disciples asked Him privately: "Why couldn\'t we drive it out?" That\'s a good question. They tried. They prayed. But something wasn\'t working.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'Иисус не сказал: «Вы плохие ученики» или «Я в вас разочарован». Он был честен: это было маловерие. И тут же дал им самое удивительное обещание о том, на что способна даже маленькая настоящая вера.'
                : 'Jesus didn\'t say "You\'re bad disciples" or "I\'m disappointed in you." He was honest: it was little faith. And then He immediately gave them the most amazing promise about what even small real faith can do.'}
            </p>

            {/* ── Activity 3: True/False one-at-a-time ─────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '✅ АКТИВНОСТЬ 3 · ПРАВДА ИЛИ ЛОЖЬ?' : '✅ ACTIVITY 3 · TRUE OR FALSE?'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажми «Правда» или «Ложь» для каждого утверждения!'
                  : 'Tap TRUE or FALSE for each statement!'}
              </p>

              {done.has('tf') ? (
                <div>
                  <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#86efac', marginBottom: 6 }}>
                      {Object.keys(tfAnswers).length > 0
                        ? (isRu
                          ? `Ты ответил на все вопросы! Счёт: ${tfScore}/5`
                          : `You answered all questions! Score: ${tfScore}/5`)
                        : (isRu ? 'Раздел пройден! Вот все ответы:' : 'Section complete! Here are all the answers:')}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 700,
                      fontSize: '0.9rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.65,
                      maxWidth: 420, margin: '0 auto',
                    }}>
                      {isRu
                        ? 'Иисус был честен с учениками. Но Он не отвергал их — Он учил их. Вера в правильного Человека важнее, чем большая вера.'
                        : "Jesus was honest with his disciples. But He wasn't giving up on them — He was teaching them. Faith in the right Person matters more than having a lot of faith."}
                    </p>
                  </div>

                  {/* Answer review — every statement, its verdict, and why */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {TF_ACTIVE.map(q => (
                      <div key={q.id} style={{
                        padding: '14px 16px', borderRadius: 14,
                        background: q.correct ? 'rgba(74,222,128,.08)' : 'rgba(248,113,113,.08)',
                        border: `1.5px solid ${q.correct ? 'rgba(74,222,128,.45)' : 'rgba(248,113,113,.45)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                          <span style={{
                            flexShrink: 0, padding: '3px 10px', borderRadius: 999,
                            background: q.correct ? 'rgba(74,222,128,.18)' : 'rgba(248,113,113,.18)',
                            color: q.correct ? '#4ade80' : '#f87171',
                            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                          }}>
                            {q.correct ? (isRu ? '✅ ПРАВДА' : '✅ TRUE') : (isRu ? '❌ ЛОЖЬ' : '❌ FALSE')}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 700,
                            fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.45,
                          }}>
                            {q.text}
                          </span>
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                          fontSize: '0.85rem', color: 'rgba(255,255,255,.6)',
                          lineHeight: 1.6, margin: 0, paddingLeft: 4,
                        }}>
                          💡 {q.explain}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress indicator */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                    {TF_ACTIVE.map((q, i) => (
                      <div key={q.id} style={{
                        flex: 1, height: 4, borderRadius: 4,
                        background: tfAnswers[q.id] !== undefined
                          ? (tfAnswers[q.id] === q.correct ? '#4ade80' : '#f87171')
                          : i === tfIdx ? ACCENT : 'rgba(255,255,255,.15)',
                        transition: 'background .3s',
                      }} />
                    ))}
                  </div>

                  {/* Current question */}
                  {tfIdx < TF_ACTIVE.length && (
                    <div style={{
                      borderRadius: 16, padding: '20px 18px', marginBottom: 14,
                      background: tfFlash === 'correct' ? 'rgba(74,222,128,.2)'
                        : tfFlash === 'wrong' ? 'rgba(248,113,113,.2)'
                        : 'rgba(255,255,255,.05)',
                      border: `2px solid ${tfFlash === 'correct' ? '#4ade80'
                        : tfFlash === 'wrong' ? '#f87171'
                        : 'rgba(255,255,255,.14)'}`,
                      transition: 'all .25s',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 700,
                        fontSize: '0.85rem', color: ACCENT, marginBottom: 10,
                        letterSpacing: 1, textTransform: 'uppercase',
                      }}>
                        {isRu ? `Вопрос ${tfIdx + 1} из 5` : `Question ${tfIdx + 1} of 5`}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 700,
                        fontSize: '1rem', color: '#fff', marginBottom: 18, lineHeight: 1.5,
                      }}>
                        {TF_ACTIVE[tfIdx].text}
                      </p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {([true, false] as boolean[]).map(val => (
                          <button
                            key={String(val)}
                            onClick={() => answerTf(TF_ACTIVE[tfIdx].id, val)}
                            disabled={tfFlash !== null}
                            style={{
                              flex: 1, padding: '12px 0', borderRadius: 12,
                              background: val ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.15)',
                              border: `2px solid ${val ? '#4ade80' : '#f87171'}`,
                              color: val ? '#4ade80' : '#f87171',
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '0.95rem', cursor: tfFlash !== null ? 'default' : 'pointer',
                              opacity: tfFlash !== null ? 0.6 : 1,
                            }}
                          >
                            {val ? (isRu ? '✅ Правда' : '✅ True') : (isRu ? '❌ Ложь' : '❌ False')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Verse */}
            <div style={{
              padding: '18px 22px', marginTop: 24,
              background: 'rgba(255,255,255,.04)', borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,.14)',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Матфея 17:20а' : 'Matthew 17:20a'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"Он же сказал им: по неверию вашему."'
                  : '"He replied, \'Because you have so little faith.\'"'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 · FAITH THE SIZE OF A SEED ══════════ */}
      {/* Light background from the start — the section's text colors are dark,
          so a tall dark→light gradient would swallow the heading at the top */}
      <section id="sec-4" style={{
        background: 'linear-gradient(180deg,#d4ecd9,#e8f5e9)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🌱 РАЗДЕЛ 4 · ВЕРА РАЗМЕРОМ С ЗЕРНО 🌱' : '🌱 SECTION 4 · FAITH THE SIZE OF A SEED 🌱'}
          </p>
        </div>

        {!unlocked.has(4) ? (
          <LockedPlaceholder secNum={4} light />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Обещание Иисуса' : "Jesus' Promise"}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: ACCENT_DARK,
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Вера размером с зерно' : 'Faith the Size of a Seed'}
            </h2>

            {/* Mustard seed illustration */}
            <div style={{
              margin: '0 0 28px', padding: '22px',
              background: '#fff', borderRadius: 20,
              border: `2px solid ${ACCENT}`,
              boxShadow: `0 4px 20px ${ACCENT_GLOW}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>🌱 → 🌳</div>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 800,
                fontSize: '0.95rem', color: ACCENT_DARK, lineHeight: 1.65,
              }}>
                {isRu
                  ? 'Горчичное зерно — одно из самых МАЛЕНЬКИХ семян. Но вырастает в дерево, которое даёт тень. Маленькая настоящая вера в большого настоящего Бога меняет всё.'
                  : 'A mustard seed is one of the SMALLEST seeds. But it grows into a tree big enough to give shade. Small real faith in a big real God changes things.'}
              </p>
            </div>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#2d5a3a',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'После того как Иисус объяснил причину («маловерие»), Он не остановился на этом. Он дал им обещание. Он сказал: вам не нужна огромная вера. Вам нужна настоящая вера — даже маленькая, как горчичное зерно. И это изменит всё.'
                : "After Jesus explained the problem — 'little faith' — He didn't stop there. He gave them a promise. He said: you don't need huge faith. You need real faith — even tiny, like a mustard seed. And that changes everything."}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#2d5a3a',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'Дело не в размере твоей веры. Дело в том, в Кого ты веришь. Маленькая вера в большого Бога способна сдвинуть горы.'
                : "The point isn't the size of your faith. It's who your faith is in. Small faith in a big God can move mountains."}
            </p>

            {/* ── Activity 4: Scramble ─────────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: `1.5px solid ${ACCENT}`, padding: '22px 20px', marginBottom: 28,
              boxShadow: `0 4px 20px ${ACCENT_GLOW}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🔤 АКТИВНОСТЬ 4 · СОБЕРИ СТИХ' : '🔤 ACTIVITY 4 · BUILD THE VERSE'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: ACCENT_DARK, marginBottom: 18,
              }}>
                {isRu
                  ? 'Расставь слова в правильном порядке — Матфея 17:20б!'
                  : 'Arrange the words in the correct order — Matthew 17:20b!'}
              </p>

              {done.has('scramble') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🌱⭐🌳</div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    color: ACCENT_DARK, fontSize: '1.05rem', marginBottom: 12,
                  }}>
                    {isRu
                      ? 'Ты собрал стих! Запомни его — он может изменить твою жизнь!'
                      : "You built the verse! Keep it in your heart — it can change your life!"}
                  </p>
                  <div style={{
                    fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                    fontSize: '1rem', color: ACCENT_DARK, padding: '12px 18px',
                    background: ACCENT_GLOW, borderRadius: 12,
                    border: `1.5px solid ${ACCENT}`,
                  }}>
                    {isRu
                      ? '"Ничто не будет невозможным для вас." — Матф. 17:20'
                      : '"Nothing will be impossible for you." — Matthew 17:20'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Answer row */}
                  <div style={{
                    minHeight: 56, padding: '10px 12px',
                    background: scrambleCorrect ? ACCENT_GLOW : 'rgba(255,255,255,.08)',
                    borderRadius: 12,
                    border: `2px dashed ${scrambleCorrect ? ACCENT : 'rgba(255,255,255,.25)'}`,
                    display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14,
                    transition: 'border-color .3s, background .3s',
                  }}>
                    {scrambleOrder.length === 0 ? (
                      <span style={{
                        fontFamily: 'var(--font-nunito)', fontSize: '0.85rem',
                        color: 'rgba(255,255,255,.3)', fontWeight: 700,
                      }}>
                        {isRu ? 'Нажми слова снизу...' : 'Tap words below...'}
                      </span>
                    ) : scrambleOrder.map(uid => {
                      const tile = SC_TILES.find(t => t.uid === uid)
                      return tile ? (
                        <span key={uid} onClick={() => removeScrambleTile(uid)} style={tileStyle(true)}>
                          {tile.word}
                        </span>
                      ) : null
                    })}
                  </div>

                  {/* Available tiles */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {SC_TILES.map(tile => {
                      const used = scrambleOrder.includes(tile.uid)
                      return (
                        <span
                          key={tile.uid}
                          onClick={() => !used && addScrambleTile(tile.uid)}
                          style={{
                            ...tileStyle(false),
                            opacity: used ? 0.3 : 1,
                            cursor: used ? 'default' : 'pointer',
                          }}
                        >
                          {tile.word}
                        </span>
                      )
                    })}
                  </div>

                  {scrambleErr && (
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      color: '#f87171', marginBottom: 10, fontSize: '0.9rem',
                    }}>
                      {scrambleErr}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={checkScramble} style={{
                      flex: 2, padding: '12px 0', borderRadius: 12,
                      background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
                      color: '#fff', border: 'none',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      fontSize: '1rem', cursor: 'pointer',
                    }}>
                      {isRu ? '✅ Проверить!' : '✅ Check it!'}
                    </button>
                    <button onClick={() => setScrambleOrder([])} style={{
                      flex: 1, padding: '12px 0', borderRadius: 12,
                      background: 'rgba(255,255,255,.08)',
                      color: 'rgba(255,255,255,.6)',
                      border: '2px solid rgba(255,255,255,.2)',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      fontSize: '0.9rem', cursor: 'pointer',
                    }}>
                      {isRu ? 'Очистить' : 'Clear'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Post-scramble reflection */}
            {done.has('scramble') && (
              <div style={{
                padding: '24px 22px', marginBottom: 28,
                background: '#fff', borderRadius: 18,
                border: `2px solid ${ACCENT}`,
                boxShadow: `0 6px 24px ${ACCENT_GLOW}`,
              }}>
                <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 14 }}>🙏</div>
                <p style={{
                  fontFamily: 'var(--font-nunito)', fontWeight: 900,
                  fontSize: '1.05rem', color: ACCENT_DARK,
                  lineHeight: 1.65, textAlign: 'center', marginBottom: 0,
                }}>
                  {isRu
                    ? 'Что кажется тебе невозможным прямо сейчас? Это может быть очень большим. Твоя вера не должна быть большой. Просто настоящей.'
                    : "What feels impossible in your life right now? It might be huge. Your faith doesn't have to be. Just real."}
                </p>
              </div>
            )}

            {/* Final verse */}
            <div style={{
              padding: '22px', marginBottom: 28,
              background: ACCENT_GLOW, borderRadius: 16,
              border: `2px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10,
              }}>
                {isRu ? 'Матфея 17:20' : 'Matthew 17:20'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: ACCENT_DARK, lineHeight: 1.8, margin: 0,
              }}>
                {isRu
                  ? '"Истинно говорю вам: если вы будете иметь веру с горчичное зерно и скажете горе сей: «перейди отсюда туда», и она перейдёт; и ничего не будет невозможного для вас."'
                  : '"Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, \'Move from here to there,\' and it will move. Nothing will be impossible for you."'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Back link ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#e8f5e9', padding: '28px 20px', textAlign: 'center',
        borderTop: `2px solid ${ACCENT}`,
      }}>
        <Link href="/lessons" style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          color: ACCENT_DARK, textDecoration: 'none', fontSize: '1rem',
        }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>
      </section>
    </>
  )
}
