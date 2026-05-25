'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { lessons } from '@/data/lessons'
import { lessonsRu } from '@/data/lessons-ru'

// ─── Types ──────────────────────────────────────────────────────────────────
type Tile = { uid: string; word: string }

// ─── Challenge unlock requirements per section ───────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['r1', 'r2'],
  2: ['ws'],
  3: ['match1', 'match2'],
  4: ['sc1', 'sc2'],
  5: ['fruits'],
  6: ['fitb'],
  7: ['decoder'],
}

// ─── Word search grid (8×6) ──────────────────────────────────────────────────
const WS_LAYOUT = [
  ['D','O','V','E','F','I','R','E'],
  ['X','A','L','W','I','N','D','P'],
  ['Q','O','I','L','B','M','Z','J'],
  ['W','A','T','E','R','G','V','N'],
  ['F','T','H','U','S','E','A','L'],
  ['K','M','J','X','Q','W','Z','Y'],
]
const WS_WORDS: Record<string, [number, number][]> = {
  DOVE:  [[0,0],[0,1],[0,2],[0,3]],
  FIRE:  [[0,4],[0,5],[0,6],[0,7]],
  WIND:  [[1,3],[1,4],[1,5],[1,6]],
  OIL:   [[2,1],[2,2],[2,3]],
  WATER: [[3,0],[3,1],[3,2],[3,3],[3,4]],
  SEAL:  [[4,4],[4,5],[4,6],[4,7]],
}

// ─── Scramble data ───────────────────────────────────────────────────────────
const SC1_TILES: Tile[] = [
  {uid:'s1_5',word:'hovering'},{uid:'s1_3',word:'God'},{uid:'s1_7',word:'the'},
  {uid:'s1_1',word:'Spirit'},{uid:'s1_4',word:'was'},{uid:'s1_0',word:'the'},
  {uid:'s1_2',word:'of'},{uid:'s1_8',word:'waters'},{uid:'s1_6',word:'over'},
]
const SC1_ANS = ['the','spirit','of','god','was','hovering','over','the','waters']

const SC2_TILES: Tile[] = [
  {uid:'s2_4',word:'rested'},{uid:'s2_1',word:'as'},{uid:'s2_8',word:'them'},
  {uid:'s2_0',word:'Tongues'},{uid:'s2_6',word:'each'},{uid:'s2_2',word:'of'},
  {uid:'s2_5',word:'on'},{uid:'s2_7',word:'of'},{uid:'s2_3',word:'fire'},
]
const SC2_ANS = ['tongues','as','of','fire','rested','on','each','of','them']

// ─── Fruit data ──────────────────────────────────────────────────────────────
const FRUITS = [
  { icon:'❤️', name:'Love',        greek:'agápe',       bg:'#fff0e8', color:'#a03000', kid:'Caring for others even when it\'s hard — because God first loved us!',         ex:'"Love your enemies." — Matt 5:44',                   ref:'1 John 4:19' },
  { icon:'😄', name:'Joy',         greek:'chará',        bg:'#fffbe8', color:'#806000', kid:'Deep happiness that doesn\'t depend on what\'s happening around you!',         ex:'"The joy of the Lord is your strength." — Neh 8:10',  ref:'Romans 15:13' },
  { icon:'🕊️', name:'Peace',       greek:'eirḗnē',      bg:'#e8f4ff', color:'#0a5090', kid:'Calm inside when things are scary — like Jesus sleeping in a storm!',          ex:'"The peace of God will guard your hearts." — Phil 4:7', ref:'John 14:27' },
  { icon:'⌛', name:'Patience',    greek:'makrothymía',  bg:'#f0fdf4', color:'#0a6830', kid:'Waiting without grumbling! Abraham waited 25 YEARS for God\'s promise!',        ex:'"Be still and wait patiently." — Ps 37:7',             ref:'Romans 5:3–4' },
  { icon:'🤲', name:'Kindness',    greek:'chrēstótēs',   bg:'#f3eeff', color:'#600090', kid:'Like the Good Samaritan — helping strangers nobody else would help!',          ex:'"Be kind to one another." — Eph 4:32',                 ref:'Luke 10:33–34' },
  { icon:'✨', name:'Goodness',    greek:'agathōsýnē',   bg:'#edfaf2', color:'#0a6040', kid:'Doing right because we love God — not just to show off!',                     ex:'"Overcome evil with good." — Rom 12:21',               ref:'Matthew 5:16' },
  { icon:'🙏', name:'Faithfulness',greek:'pístis',       bg:'#fff5f5', color:'#900020', kid:'Daniel prayed 3× a day even when it was ILLEGAL — that\'s faithfulness!',     ex:'"Well done, good and faithful servant!" — Matt 25:21', ref:'Daniel 6:10' },
  { icon:'🌸', name:'Gentleness',  greek:'praýtēs',      bg:'#e8f4ff', color:'#0a4080', kid:'Soft words and a humble heart — Jesus said "I am gentle and lowly."',         ex:'"A gentle answer turns away wrath." — Prov 15:1',      ref:'Matthew 11:29' },
  { icon:'🛡️', name:'Self-Control',greek:'enkráteia',   bg:'#fff8e1', color:'#7a4f00', kid:'Joseph RAN AWAY from temptation! That\'s the Spirit giving self-control!',     ex:'"He who rules his spirit is mighty." — Prov 16:32',    ref:'Genesis 39:12' },
]

// ─── Fill-in-blank answers ───────────────────────────────────────────────────
const FITB_ANSWERS: Record<string, string> = {
  b1:'TONGUES', b2:'HEALING', b3:'PROPHECY', b4:'WISDOM', b5:'FAITH', b6:'TEACHING',
}
const FITB_WORDS = ['HEALING','WISDOM','PROPHECY','FAITH','TEACHING','TONGUES']

// ─── Decoder ─────────────────────────────────────────────────────────────────
const DECODER_KEYS = [
  { emoji:'💪', word:'GREATER', id:'d1' },
  { emoji:'👆', word:'IS',      id:'d2' },
  { emoji:'🧑', word:'HE',      id:'d3' },
  { emoji:'👤', word:'WHO',     id:'d4' },
  { emoji:'👆', word:'IS',      id:'d5' },
  { emoji:'🏠', word:'IN',      id:'d6' },
  { emoji:'🙋', word:'YOU',     id:'d7' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#fff', borderRadius: 22, padding: '22px 20px',
  boxShadow: '0 3px 18px rgba(0,0,0,.08)', marginBottom: 16,
}
const roleCard = (color: string): React.CSSProperties => ({
  ...card, borderLeft: `6px solid ${color}`,
})
const symCard = (bg: string): React.CSSProperties => ({
  borderRadius: 22, padding: '22px 18px', textAlign: 'center',
  boxShadow: '0 3px 18px rgba(0,0,0,.08)', background: bg,
})

// ─── Helper: section lock overlay ────────────────────────────────────────────
function LockCard({ prevSec }: { prevSec: number }) {
  return (
    <div style={{
      textAlign: 'center', padding: '48px 24px',
      background: 'rgba(255,255,255,0.6)', borderRadius: 24,
      border: '3px dashed #ccc',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔒</div>
      <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#888', fontSize: '1.05rem' }}>
        Complete Section {prevSec} to unlock this part!
      </p>
    </div>
  )
}

// ─── Helper: truth banner ─────────────────────────────────────────────────────
function TruthBanner({ show, color, children }: { show: boolean; color: string; children: React.ReactNode }) {
  if (!show) return null
  return (
    <div style={{
      background: color, color: '#fff', borderRadius: 14,
      padding: '16px 18px', marginTop: 14, textAlign: 'center',
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', lineHeight: 1.6,
      animation: 'pop-in 0.45s cubic-bezier(.34,1.56,.64,1) both',
    }}>
      {children}
    </div>
  )
}

// ─── Helper: section-complete unlock banner ────────────────────────────────────
function UnlockBanner({ sec }: { sec: number }) {
  return (
    <div style={{
      marginTop: 24, background: 'linear-gradient(135deg,#1a6a30,#2d8a50)',
      color: '#fff', borderRadius: 16, padding: '18px 22px', textAlign: 'center',
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1.05rem',
      animation: 'pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both',
    }}>
      🎉 Section {sec} complete! Section {sec + 1} is now unlocked — scroll down!
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
export default function HolySpiritLesson() {
  const { language } = useLanguage()
  const currentLesson = language === 'ru' ? lessonsRu[0] : lessons[0]

  // ─── Progress state ──────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('hs_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch {}
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('hs_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch {}
    return new Set()
  })
  const [won, setWon]           = useState(false)

  useEffect(() => {
    localStorage.setItem('hs_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('hs_done',     JSON.stringify([...done]))
  }, [unlocked, done])

  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    setDone(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 7) {
        setUnlocked(prev => new Set([...prev, sec + 1]))
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 700)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([,reqs]) => reqs.every(r => done.has(r))).length
  const stars = '⭐'.repeat(secDoneCount) + '☆'.repeat(7 - secDoneCount)

  // ─── Section 1: Rebus ────────────────────────────────────────────────────────
  const [r1, setR1] = useState('')
  const [r2, setR2] = useState('')
  const [r1Err, setR1Err] = useState('')
  const [r2Err, setR2Err] = useState('')

  function checkR1() {
    const v = r1.trim().toLowerCase()
    if (['lives','lives in','lives inside'].some(a => v === a || v.startsWith(a))) {
      solve('r1', 1)
    } else {
      setR1Err('❌ Not quite — try again! Think about where the Spirit makes His home.')
      setTimeout(() => setR1Err(''), 2500)
    }
  }
  function checkR2() {
    const v = r2.trim().toLowerCase()
    if (['trinity','3 in 1','three in one','one god','three persons one god','3 persons one god'].some(a => v === a || v.startsWith(a))) {
      solve('r2', 1)
    } else {
      setR2Err('❌ Hint: Father + Son + Holy Spirit = three Persons, ___ God!')
      setTimeout(() => setR2Err(''), 2500)
    }
  }

  // ─── Section 2: Word search ──────────────────────────────────────────────────
  const [wsSel,   setWsSel]   = useState<Set<string>>(new Set())
  const [wsFound, setWsFound] = useState<Set<string>>(new Set())

  function wsClick(r: number, c: number) {
    for (const [word, coords] of Object.entries(WS_WORDS)) {
      if (wsFound.has(word) && coords.some(([rr,cc]) => rr === r && cc === c)) return
    }
    const key = `${r},${c}`
    const newSel = new Set(wsSel)
    if (newSel.has(key)) newSel.delete(key)
    else newSel.add(key)

    for (const [word, coords] of Object.entries(WS_WORDS)) {
      if (wsFound.has(word)) continue
      const keys = coords.map(([rr,cc]) => `${rr},${cc}`)
      if (newSel.size === keys.length && keys.every(k => newSel.has(k))) {
        const newFound = new Set([...wsFound, word])
        setWsFound(newFound)
        setWsSel(new Set())
        if (newFound.size === 6) solve('ws', 2)
        return
      }
    }
    setWsSel(newSel)
  }

  function wsCellState(r: number, c: number): 'found' | 'selected' | 'normal' {
    for (const [word, coords] of Object.entries(WS_WORDS)) {
      if (wsFound.has(word) && coords.some(([rr,cc]) => rr === r && cc === c)) return 'found'
    }
    return wsSel.has(`${r},${c}`) ? 'selected' : 'normal'
  }

  // ─── Section 3: Match games ───────────────────────────────────────────────────
  const [m1L, setM1L] = useState<string|null>(null)
  const [m1R, setM1R] = useState<string|null>(null)
  const [m1Matched, setM1Matched] = useState<Set<string>>(new Set())
  const [m1Shake,   setM1Shake]   = useState<Set<string>>(new Set())
  const [m2L, setM2L] = useState<string|null>(null)
  const [m2R, setM2R] = useState<string|null>(null)
  const [m2Matched, setM2Matched] = useState<Set<string>>(new Set())
  const [m2Shake,   setM2Shake]   = useState<Set<string>>(new Set())

  function doMatch(
    newLeft: string|null, newRight: string|null,
    matched: Set<string>,
    setMatched: (s: Set<string>) => void,
    setL: (v: string|null) => void,
    setR: (v: string|null) => void,
    setShake: (s: Set<string>) => void,
    challengeId: string,
  ) {
    if (!newLeft || !newRight) return
    if (newLeft === newRight) {
      const nm = new Set([...matched, newLeft])
      setMatched(nm)
      setL(null); setR(null)
      if (nm.size === 4) solve(challengeId, 3)
    } else {
      setShake(new Set([newLeft, newRight]))
      setTimeout(() => { setShake(new Set()); setL(null); setR(null) }, 700)
    }
  }

  function pickLeft1(id: string)  { if (m1Matched.has(id)) return; setM1L(id); doMatch(id, m1R, m1Matched, setM1Matched, setM1L, setM1R, setM1Shake, 'match1') }
  function pickRight1(id: string) { if (m1Matched.has(id)) return; setM1R(id); doMatch(m1L, id, m1Matched, setM1Matched, setM1L, setM1R, setM1Shake, 'match1') }
  function pickLeft2(id: string)  { if (m2Matched.has(id)) return; setM2L(id); doMatch(id, m2R, m2Matched, setM2Matched, setM2L, setM2R, setM2Shake, 'match2') }
  function pickRight2(id: string) { if (m2Matched.has(id)) return; setM2R(id); doMatch(m2L, id, m2Matched, setM2Matched, setM2L, setM2R, setM2Shake, 'match2') }

  function matchItemStyle(id: string, side: 'L'|'R', isLeft: boolean,
    lSel: string|null, rSel: string|null,
    matched: Set<string>, shake: Set<string>,
    color: string
  ): React.CSSProperties {
    const sel = isLeft ? lSel === id : rSel === id
    const isMatched = matched.has(id)
    const isShake = shake.has(id)
    return {
      padding: '12px 10px', borderRadius: 14, cursor: isMatched ? 'default' : 'pointer',
      fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.88rem',
      border: `3px solid ${isMatched ? '#40b870' : sel ? color : '#ddd'}`,
      background: isMatched ? '#edfaf2' : sel ? color : '#fafafa',
      color: isMatched ? '#0a6830' : sel ? '#fff' : '#334',
      textAlign: 'center', lineHeight: 1.4, transition: 'background .15s, border-color .15s',
      animation: isShake ? 'shake 0.35s ease' : undefined,
      userSelect: 'none',
    }
  }

  // ─── Section 4: Scramble ──────────────────────────────────────────────────────
  const [az1,     setAz1]     = useState<Tile[]>([])
  const [az2,     setAz2]     = useState<Tile[]>([])
  const [az1Used, setAz1Used] = useState<Set<string>>(new Set())
  const [az2Used, setAz2Used] = useState<Set<string>>(new Set())

  function addToAz1(tile: Tile) {
    if (az1Used.has(tile.uid)) return
    const newUsed = new Set([...az1Used, tile.uid])
    const newAz   = [...az1, tile]
    setAz1Used(newUsed); setAz1(newAz)
    if (newAz.length === SC1_ANS.length && newAz.every((t,i) => t.word.toLowerCase() === SC1_ANS[i])) solve('sc1', 4)
  }
  function removeFromAz1(tile: Tile) {
    setAz1Used(p => { const n = new Set(p); n.delete(tile.uid); return n })
    setAz1(p => p.filter(t => t.uid !== tile.uid))
  }
  function addToAz2(tile: Tile) {
    if (az2Used.has(tile.uid)) return
    const newUsed = new Set([...az2Used, tile.uid])
    const newAz   = [...az2, tile]
    setAz2Used(newUsed); setAz2(newAz)
    if (newAz.length === SC2_ANS.length && newAz.every((t,i) => t.word.toLowerCase() === SC2_ANS[i])) solve('sc2', 4)
  }
  function removeFromAz2(tile: Tile) {
    setAz2Used(p => { const n = new Set(p); n.delete(tile.uid); return n })
    setAz2(p => p.filter(t => t.uid !== tile.uid))
  }
  function scTileColor(tile: Tile, i: number, ans: string[]) {
    return ans[i] && tile.word.toLowerCase() === ans[i] ? '#2d8a50' : '#1a3a6e'
  }
  function scHint(az: Tile[], ans: string[]) {
    if (!az.length) return 'Tap words below to build the verse!'
    const ok = az.filter((t,i) => ans[i] && t.word.toLowerCase() === ans[i]).length
    return `✅ ${ok} of ${az.length} word${az.length > 1 ? 's' : ''} in the right spot!`
  }
  function resetSc1() { setAz1([]); setAz1Used(new Set()) }
  function resetSc2() { setAz2([]); setAz2Used(new Set()) }

  // ─── Section 5: Fruit reveal ───────────────────────────────────────────────────
  const [fruitsOpen, setFruitsOpen] = useState<Set<number>>(new Set())
  function revealFruit(i: number) {
    const next = new Set([...fruitsOpen, i])
    setFruitsOpen(next)
    if (next.size === 9) solve('fruits', 5)
  }

  // ─── Section 6: Fill-in-blank ─────────────────────────────────────────────────
  const [wbSel,     setWbSel]     = useState<string|null>(null)
  const [bk,        setBk]        = useState<Record<string,string>>({b1:'',b2:'',b3:'',b4:'',b5:'',b6:''})
  const [fitbErr,   setFitbErr]   = useState('')
  const [fitbCheck, setFitbCheck] = useState(false)

  const usedWords = Object.values(bk).filter(Boolean)
  function wb6Pick(word: string) {
    if (usedWords.includes(word)) return
    setWbSel(prev => prev === word ? null : word)
  }
  function wb6Drop(id: string) {
    if (bk[id] && !wbSel) { setBk(p => ({...p, [id]: ''})); return }
    if (!wbSel) return
    setBk(p => ({...p, [id]: wbSel}))
    setWbSel(null)
  }
  function blankBorder(id: string) {
    if (!fitbCheck || !bk[id]) return bk[id] ? '#40b870' : '#ccc'
    return bk[id] === FITB_ANSWERS[id] ? '#40b870' : '#e04040'
  }
  function checkFitb() {
    setFitbCheck(true)
    if (Object.entries(FITB_ANSWERS).every(([id, ans]) => bk[id] === ans)) {
      setFitbErr('')
      solve('fitb', 6)
    } else {
      setFitbErr('❌ Some answers are wrong or missing — check the highlighted ones!')
      setTimeout(() => { setFitbErr(''); setFitbCheck(false) }, 3000)
    }
  }

  // ─── Section 7: Decoder ───────────────────────────────────────────────────────
  const [decoded, setDecoded] = useState<Record<string,string>>({})
  const [decErr,  setDecErr]  = useState('')

  function decodeKey(id: string, word: string) {
    if (decoded[id]) return
    const next = {...decoded, [id]: word}
    setDecoded(next)
    if (Object.keys(next).length >= 7) solve('decoder', 7)
  }
  function checkDecoder() {
    if (Object.keys(decoded).length >= 7) { solve('decoder', 7) }
    else { setDecErr(`🔐 Keep tapping! ${Object.keys(decoded).length} of 7 decoded.`); setTimeout(() => setDecErr(''), 2000) }
  }

  // ─── Reset all progress ────────────────────────────────────────────────────────
  function resetAll() {
    if (!confirm('Reset all progress for this lesson?')) return
    localStorage.removeItem('hs_unlocked'); localStorage.removeItem('hs_done')
    setUnlocked(new Set([1])); setDone(new Set()); setWon(false)
    setR1(''); setR2(''); setR1Err(''); setR2Err('')
    setWsSel(new Set()); setWsFound(new Set())
    setM1L(null); setM1R(null); setM1Matched(new Set()); setM1Shake(new Set())
    setM2L(null); setM2R(null); setM2Matched(new Set()); setM2Shake(new Set())
    setAz1([]); setAz2([]); setAz1Used(new Set()); setAz2Used(new Set())
    setFruitsOpen(new Set())
    setWbSel(null); setBk({b1:'',b2:'',b3:'',b4:'',b5:'',b6:''}); setFitbErr(''); setFitbCheck(false)
    setDecoded({}); setDecErr('')
  }

  // ════════════════════ JSX ════════════════════════════════════════════════════

  const secPad: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '44px 18px 52px' }
  const tileBase: React.CSSProperties = {
    padding: '9px 13px', borderRadius: 12, color: '#fff',
    fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
    cursor: 'pointer', userSelect: 'none', display: 'inline-block',
  }
  const ansTile = (tile: Tile, i: number, ans: string[]): React.CSSProperties => ({
    ...tileBase, background: scTileColor(tile, i, ans),
    boxShadow: ans[i] && tile.word.toLowerCase() === ans[i] ? '0 0 0 3px #86efac' : 'none',
  })

  return (
    <>
      {/* ── Win Screen ──────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,18,40,.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30,
          animation: 'pop-in .4s ease',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉🕊️🔥</div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '2rem', color: '#fff', marginBottom: 14, textShadow: '0 0 40px rgba(255,179,71,.8)' }}>
            You Did It All!
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 20, fontSize: '1.05rem' }}>
            You completed every section of The Holy Spirit!<br />God is SO proud of you! 🌟
          </p>
          <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', borderLeft: '3px solid var(--flame2)', paddingLeft: 14, textAlign: 'left', maxWidth: 380, lineHeight: 1.8, marginBottom: 28 }}>
            &ldquo;Greater is He who is in you than he who is in the world.&rdquo;
            <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 1, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 6 }}>1 John 4:4 · ESV</span>
          </blockquote>
          <button
            onClick={() => setWon(false)}
            style={{ padding: '14px 32px', background: 'linear-gradient(135deg,var(--fire),var(--flame2))', color: '#fff', border: 'none', borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
          >
            ⭐ Keep Exploring!
          </button>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '70vh',
        background: 'radial-gradient(ellipse at 50% 50%,#2a1050 0%,#1a0f40 35%,#0d1f3c 60%,#060e20 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 100px', overflow: 'hidden',
      }}>
        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 800, marginBottom: 40, zIndex: 10 }}>
          <img
            src="/images/jr/holy-spirit-hero.png"
            alt="The Holy Spirit"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 24,
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,.3))',
            }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,6vw,3.2rem)', color: '#fff', textShadow: '0 0 30px rgba(126,200,227,.8)', marginBottom: 10, lineHeight: 1.2 }}>
          The Holy Spirit
        </h1>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--flame2)', marginBottom: 20 }}>
          Person · Presence · Power
        </p>
        <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', color: 'rgba(255,255,255,.9)', fontSize: '1rem', borderLeft: '3px solid rgba(126,200,227,.7)', paddingLeft: 16, textAlign: 'left', maxWidth: 480, lineHeight: 1.85 }}>
          &ldquo;But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things.&rdquo;
          <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 8 }}>John 14:26 · ESV</span>
        </blockquote>
      </section>

      {/* ── Progress Bar ───────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 52, zIndex: 99,
        background: 'linear-gradient(90deg,#0a1228,#1a3060)',
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid rgba(126,200,227,.2)',
      }}>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.76rem', fontWeight: 900, color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap', letterSpacing: 1 }}>
          📖 PROGRESS
        </span>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,.12)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(secDoneCount / 7) * 100}%`, background: 'linear-gradient(90deg,#ffb347,#ff6b1a)', borderRadius: 10, transition: 'width .5s cubic-bezier(.34,1.56,.64,1)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1rem', letterSpacing: 2, minWidth: 110, textAlign: 'right' }}>{stars}</span>
      </div>

      {/* ════════ SECTION 1 — WHO IS HE ═══════════════════════════ */}
      <div id="sec-1" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🔥 SECTION 1 · WHO IS THE HOLY SPIRIT? 🔥
        </div>
        <div className="alt-bg3">
          <div style={secPad}>
            <p className="eyebrow">The Third Person of the Trinity</p>
            <h2 className="sec-title">Who Is the Holy Spirit?</h2>
            <p className="sec-intro">The Holy Spirit is NOT a force, a feeling, or an energy — He is a real <strong>Person</strong>, equal with God the Father and Jesus the Son. He has always existed, and He lives inside every believer today.</p>
            <div className="kid-note">👨‍👧 Ask a grown-up: &ldquo;What does it mean that my body is a temple?&rdquo;</div>

            {/* Trinity Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { bg:'#fffbe8', border:'#f0c040', icon:'☀️', name:'God the Father', nameColor:'#7a5800', desc:'Our Creator and Heavenly Dad — who made everything and loves us with a perfect, forever love.', ref:'Genesis 1:1 · Matthew 6:9' },
                { bg:'#e8f0ff', border:'#6090e8', icon:'✝️', name:'God the Son',    nameColor:'#1a3a9a', desc:'Jesus came to earth, died for our sins, rose again, and went back to heaven to prepare a place for us.', ref:'John 3:16 · John 14:2' },
                { bg:'#fff0e8', border:'#e87030', icon:'🕊️', name:'God the Holy Spirit', nameColor:'#a03000', desc:'He lives INSIDE every believer — our Helper, Teacher, Comforter, and Guide, sent by Jesus Himself.', ref:'John 14:26 · 1 Cor 6:19' },
              ].map(p => (
                <div key={p.name} style={{ borderRadius: 20, padding: '24px 18px', textAlign: 'center', border: `3px solid ${p.border}`, background: p.bg }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: 8 }}>{p.icon}</span>
                  <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.9rem', color: p.nameColor, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65 }}>{p.desc}</div>
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: p.nameColor, marginTop: 6 }}>{p.ref}</div>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <div className="pull-quote" style={{ marginBottom: 28 }}>
              <p className="pq-text">&ldquo;Go therefore and make disciples of all nations, baptising them in the name of the Father and of the Son and of the Holy Spirit.&rdquo;</p>
              <span className="pq-ref">Matthew 28:19 · ESV — All three Persons together at once</span>
            </div>

            {/* Trait cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { icon:'🧠', title:'He Has a Mind',    body:'He thinks and knows everything — even the deep things of God. He searches all things and prays according to God\'s perfect will.', ref:'Romans 8:27 · 1 Cor 2:10' },
                { icon:'💔', title:'He Has Feelings',  body:'He can be grieved (made sad) by sin, and He loves with the love of God. He is not a machine — He is a Person who cares deeply.', ref:'Ephesians 4:30 · Romans 15:30' },
                { icon:'✅', title:'He Has a Will',    body:'He decides who gets which gifts — "apportioning to each one individually as he wills." He makes real choices with real purpose.', ref:'1 Corinthians 12:11' },
                { icon:'🏠', title:'He Lives In You!', body:'"Your body is a temple of the Holy Spirit within you." If you believe in Jesus, the Spirit of God literally lives inside you right now.', ref:'1 Corinthians 6:19' },
              ].map(t => (
                <div key={t.title} style={card}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>{t.icon}</span>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', color: 'var(--deep)', marginBottom: 4 }}>{t.title}</h4>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65 }}>{t.body}</p>
                      <small style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: 'var(--fire)', letterSpacing: 1, textTransform: 'uppercase' }}>{t.ref}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Challenges ── */}
            {/* Rebus 1 */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: '#e87030' }}>
              <p className="puzzle-label">🧩 Rebus Puzzle 1 of 2</p>
              <p className="puzzle-q">Solve the picture equation — what does the Holy Spirit do for you?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>🏠</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>HOME</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>❤️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>HEART</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>=</span>
                <input
                  value={r1} onChange={e => setR1(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkR1()}
                  disabled={done.has('r1')}
                  placeholder="He _ _ _ _ _ in you!"
                  style={{ minWidth: 140, height: 42, border: `3px dashed ${done.has('r1') ? '#40b870' : '#ccc'}`, borderRadius: 12, background: done.has('r1') ? '#edfaf2' : '#fafafa', fontFamily: 'var(--font-nunito)', fontWeight: 900, textAlign: 'center', fontSize: '0.95rem', padding: '0 8px' }}
                />
              </div>
              {!done.has('r1') && <button className="pz-btn" style={{ background: '#e87030' }} onClick={checkR1}>CHECK MY ANSWER ✓</button>}
              <p className="pz-hint">💡 Hint: The Spirit makes your heart His home! (1 Cor 6:19)</p>
              {r1Err && <p className="pz-error">{r1Err}</p>}
              <TruthBanner show={done.has('r1')} color="#e87030">
                🏠 YES! The Holy Spirit LIVES in you — when you believe in Jesus!
                <span className="truth-verse">&ldquo;Do you not know that your body is a temple of the Holy Spirit within you?&rdquo; — 1 Corinthians 6:19</span>
              </TruthBanner>
            </div>

            {/* Rebus 2 */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: '#1a3a8e' }}>
              <p className="puzzle-label">🧩 Rebus Puzzle 2 of 2</p>
              <p className="puzzle-q">How many Persons is God? The Father, Son, and Holy Spirit are all God — but only ONE God. What do we call that?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>☀️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>FATHER</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>✝️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>SON</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>🕊️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>SPIRIT</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>=</span>
                <input
                  value={r2} onChange={e => setR2(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkR2()}
                  disabled={done.has('r2')}
                  placeholder="3 Persons, ___ God"
                  style={{ minWidth: 140, height: 42, border: `3px dashed ${done.has('r2') ? '#40b870' : '#ccc'}`, borderRadius: 12, background: done.has('r2') ? '#edfaf2' : '#fafafa', fontFamily: 'var(--font-nunito)', fontWeight: 900, textAlign: 'center', fontSize: '0.95rem', padding: '0 8px' }}
                />
              </div>
              {!done.has('r2') && <button className="pz-btn" style={{ background: '#1a3a8e' }} onClick={checkR2}>CHECK MY ANSWER ✓</button>}
              <p className="pz-hint">💡 Hint: Three different Persons, but only ___ God! Try: &ldquo;Trinity&rdquo; or &ldquo;one God&rdquo;</p>
              {r2Err && <p className="pz-error">{r2Err}</p>}
              <TruthBanner show={done.has('r2')} color="#1a3a8e">
                ✝️ THREE Persons — ONE God! That&apos;s called the Trinity!<br />
                The Father, Son, and Holy Spirit are each fully God, but there is only one God!
                <span className="truth-verse">&ldquo;Baptising them in the name of the Father and of the Son and of the Holy Spirit.&rdquo; — Matthew 28:19</span>
              </TruthBanner>
            </div>

            {done.has('r1') && done.has('r2') && <UnlockBanner sec={1} />}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🕊️</span><div className="div-line"/></div>

      {/* ════════ SECTION 2 — SYMBOLS ══════════════════════════════ */}
      <div id="sec-2" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🌊 SECTION 2 · SYMBOLS OF THE HOLY SPIRIT 💧
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            {!unlocked.has(2) ? <LockCard prevSec={1} /> : (
              <>
                <p className="eyebrow">Picture-Language from God</p>
                <h2 className="sec-title">Symbols of the Holy Spirit</h2>
                <p className="sec-intro">God uses vivid picture-language throughout Scripture to help us understand the Holy Spirit. Each symbol reveals a different truth about who He is and what He does.</p>

                {/* Symbols illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-symbols.png" alt="Holy Spirit Symbols" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                {/* Symbol cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))', gap: 18, marginBottom: 28 }}>
                  {[
                    { bg:'#e4f4ff', color:'#0a6090', icon:'🕊️', name:'The Dove',      kid:'Gentle, peaceful, and pure — just like the Holy Spirit! He descends softly, not by force.',         verse:'"The Spirit of God descending like a dove."', ref:'Matthew 3:16' },
                    { bg:'#fff3e0', color:'#a03000', icon:'🔥', name:'Fire',           kid:'Fire gives light, warmth, and power — and purifies. The Spirit lights up our hearts and burns away what\'s wrong.', verse:'"Divided tongues as of fire rested on each one."', ref:'Acts 2:3' },
                    { bg:'#edfaf2', color:'#0a6830', icon:'💨', name:'Wind',           kid:'You can\'t see wind but you feel it! The Spirit is invisible but very real — you see His effects in people\'s lives.', verse:'"A sound like a mighty rushing wind."', ref:'Acts 2:2' },
                    { bg:'#e8f0ff', color:'#1a3aaa', icon:'💧', name:'Living Water',   kid:'We NEED water to live — and we need the Spirit just as much. He flows from our innermost being!', verse:'"Out of his heart will flow rivers of living water."', ref:'John 7:38–39' },
                    { bg:'#f8eeff', color:'#600090', icon:'🫙', name:'Anointing Oil',  kid:'Kings and priests were anointed with oil — chosen and set apart. The Spirit anoints US, marking us as God\'s own!', verse:'"You have been anointed by the Holy One."', ref:'1 John 2:20' },
                    { bg:'#fff0ee', color:'#900020', icon:'🔏', name:'A Seal',         kid:'A royal seal meant "this belongs to the king." The Spirit is God\'s seal on us — we are His, and He guarantees it!', verse:'"Sealed with the promised Holy Spirit."', ref:'Ephesians 1:13–14' },
                  ].map(s => (
                    <div key={s.name} style={symCard(s.bg)}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: 10 }}>{s.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.85rem', fontWeight: 700, color: s.color, marginBottom: 8 }}>{s.name}</div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65, marginBottom: 8 }}>{s.kid}</div>
                      <div style={{ fontSize: '.8rem', fontStyle: 'italic', color: '#556', lineHeight: 1.6, marginBottom: 4 }}>{s.verse}</div>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: s.color }}>{s.ref}</div>
                    </div>
                  ))}
                </div>

                <div className="pull-quote" style={{ marginBottom: 28 }}>
                  <p className="pq-text">&ldquo;The wind blows where it wishes, and you hear its sound, but you do not know where it comes from or where it goes. So it is with everyone who is born of the Spirit.&rdquo;</p>
                  <span className="pq-ref">John 3:8 · ESV — Jesus explaining the Spirit to Nicodemus</span>
                </div>

                {/* Word search challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#0a6090' }}>
                  <p className="puzzle-label">🔍 Word Search Challenge</p>
                  <p className="puzzle-q">Find all 6 symbols hidden in the grid! Tap letters to select, then they lock in blue when you find a word.</p>

                  {/* Word list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    {Object.keys(WS_WORDS).map(w => (
                      <span key={w} style={{
                        fontFamily: 'var(--font-nunito)', fontSize: '.88rem', fontWeight: 900,
                        padding: '5px 12px', borderRadius: 20,
                        background: wsFound.has(w) ? '#0a6090' : '#eee',
                        color: wsFound.has(w) ? '#fff' : '#555',
                        textDecoration: wsFound.has(w) ? 'line-through' : 'none',
                      }}>
                        {w === 'DOVE' ? '🕊️' : w === 'FIRE' ? '🔥' : w === 'WIND' ? '💨' : w === 'WATER' ? '💧' : w === 'OIL' ? '🫙' : '🔏'} {w}
                      </span>
                    ))}
                  </div>

                  {/* Grid */}
                  <div style={{ overflowX: 'auto', textAlign: 'center', paddingBottom: 6 }}>
                    <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(8,42px)', gap: 3, background: '#e8e8e8', borderRadius: 14, padding: 8 }}>
                      {WS_LAYOUT.map((row, r) => row.map((letter, c) => {
                        const state = wsCellState(r, c)
                        return (
                          <div
                            key={`${r}-${c}`}
                            onClick={() => !done.has('ws') && wsClick(r, c)}
                            className="word-cell"
                            style={{
                              background: state === 'found' ? '#0a6090' : state === 'selected' ? '#fff0aa' : '#fff',
                              color: state === 'found' ? '#fff' : 'var(--text)',
                              cursor: done.has('ws') ? 'default' : 'pointer',
                              transform: state === 'selected' ? 'scale(1.08)' : 'none',
                            }}
                          >
                            {letter}
                          </div>
                        )
                      }))}
                    </div>
                  </div>

                  <p className="pz-hint">💡 Words go left-to-right and top-to-bottom. Tap all letters of a word to lock it!</p>
                  {!done.has('ws') && <button className="pz-btn" style={{ background: '#888', marginTop: 8 }} onClick={() => setWsSel(new Set())}>↩ Clear Selection</button>}
                  <TruthBanner show={done.has('ws')} color="#0a6090">
                    🎉 Amazing — you found all 6 symbols!
                    <span className="truth-verse">Gentle like a Dove · Powerful like Fire · Invisible like Wind · Filling like Living Water · Anointing like Oil · Protecting like a Seal!</span>
                  </TruthBanner>
                </div>

                {done.has('ws') && <UnlockBanner sec={2} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">⚡</span><div className="div-line"/></div>

      {/* ════════ SECTION 3 — ROLES ════════════════════════════════ */}
      <div id="sec-3" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          ⚡ SECTION 3 · THE ROLES OF THE HOLY SPIRIT ⚡
        </div>
        <div className="alt-bg5">
          <div style={secPad}>
            {!unlocked.has(3) ? <LockCard prevSec={2} /> : (
              <>
                <p className="eyebrow">What He Actually Does</p>
                <h2 className="sec-title">The Roles of the Holy Spirit</h2>
                <p className="sec-intro">Jesus called the Holy Spirit our &ldquo;Helper&rdquo; — in Greek: <em>Paraclete</em>, meaning &ldquo;one who comes alongside.&rdquo; He has 8 amazing roles for every believer:</p>

                {/* Role cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
                  {[
                    { color:'#5aaedc', icon:'🤝', name:'The Helper',       desc:'He comes alongside us — like the best friend who never leaves. When life feels hard, He is right there helping you carry it.', ref:'John 14:16' },
                    { color:'#e87030', icon:'📚', name:'The Teacher',      desc:'When you read the Bible and suddenly understand it — that\'s the Holy Spirit! He opens our minds to God\'s truth.', ref:'John 14:26' },
                    { color:'#9050d0', icon:'🪞', name:'The Convicter',    desc:'When we sin, the Spirit makes us feel it inside — not to condemn us but to lead us back to God\'s forgiveness.', ref:'John 16:8' },
                    { color:'#40b870', icon:'🙏', name:'Prayer Helper',    desc:'When we don\'t know what to pray, the Spirit prays FOR us with prayers too deep for words. We are never alone!', ref:'Romans 8:26' },
                    { color:'#f0c040', icon:'⚡', name:'Power-Giver',     desc:'Jesus told His disciples to wait for the Holy Spirit before doing anything — He is the source of God\'s power in us.', ref:'Acts 1:8' },
                    { color:'#e84070', icon:'🧭', name:'The Guide',       desc:'Not sure which way to go? The Spirit is our guide into all truth — like a GPS for our hearts, pointing to God.', ref:'John 16:13' },
                    { color:'#5070d8', icon:'🌱', name:'The Transformer', desc:'He changes us from the inside out — slowly growing love, joy, and peace. Only He can produce that kind of fruit.', ref:'Galatians 5:22' },
                    { color:'#d04060', icon:'❤️', name:'The Comforter',   desc:'When we are sad, scared, or lonely — the Spirit is right there with God\'s comfort, pouring His love into our hearts.', ref:'Romans 5:5' },
                  ].map(r => (
                    <div key={r.name} style={roleCard(r.color)}>
                      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 8 }}>{r.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.88rem', color: r.color, marginBottom: 8 }}>{r.name}</div>
                      <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#334', lineHeight: 1.75, marginBottom: 8 }}>{r.desc}</div>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: r.color }}>{r.ref}</div>
                    </div>
                  ))}
                </div>

                {/* Match Round 1 */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#9050d0' }}>
                  <p className="puzzle-label">🔗 Match It — Round 1 of 2</p>
                  <p className="puzzle-q">Tap a ROLE (left), then tap its MEANING (right). Get all 4 right!</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 10 }}>
                    Matched: {m1Matched.size} / 4
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[{id:'helper',label:'🤝 The Helper'},{id:'teacher',label:'📚 The Teacher'},{id:'power',label:'⚡ Power-Giver'},{id:'comforter',label:'❤️ Comforter'}].map(item => (
                        <div key={item.id} onClick={() => !done.has('match1') && pickLeft1(item.id)}
                          style={matchItemStyle(item.id,'L',true,m1L,m1R,m1Matched,m1Shake,'#9050d0')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[{id:'teacher',label:'Explains the Bible so you understand it'},{id:'comforter',label:'Loves you when you feel sad or alone'},{id:'helper',label:'Comes alongside you like a best friend'},{id:'power',label:'Gives you strength to do what God asks'}].map(item => (
                        <div key={item.id} onClick={() => !done.has('match1') && pickRight1(item.id)}
                          style={matchItemStyle(item.id,'R',false,m1L,m1R,m1Matched,m1Shake,'#9050d0')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <TruthBanner show={done.has('match1')} color="#9050d0">
                    🎉 Round 1 done! Great matching!
                    <span className="truth-verse">&ldquo;I will ask the Father, and he will give you another Helper, to be with you forever.&rdquo; — John 14:16</span>
                  </TruthBanner>
                </div>

                {/* Match Round 2 */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#e84070' }}>
                  <p className="puzzle-label">🔗 Match It — Round 2 of 2</p>
                  <p className="puzzle-q">Four more roles! Tap a role, then its meaning.</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 10 }}>
                    Matched: {m2Matched.size} / 4
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[{id:'guide',label:'🧭 The Guide'},{id:'prayer',label:'🙏 Prayer Helper'},{id:'convict',label:'🪞 Convicter'},{id:'transform',label:'🌱 Transformer'}].map(item => (
                        <div key={item.id} onClick={() => !done.has('match2') && pickLeft2(item.id)}
                          style={matchItemStyle(item.id,'L',true,m2L,m2R,m2Matched,m2Shake,'#e84070')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[{id:'transform',label:'Grows love & kindness inside you'},{id:'guide',label:'Shows you which way is right'},{id:'prayer',label:'Prays when you have no words'},{id:'convict',label:'Shows us when we sin and leads us back'}].map(item => (
                        <div key={item.id} onClick={() => !done.has('match2') && pickRight2(item.id)}
                          style={matchItemStyle(item.id,'R',false,m2L,m2R,m2Matched,m2Shake,'#e84070')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <TruthBanner show={done.has('match2')} color="#e84070">
                    🌟 All 8 roles mastered — incredible!
                    <span className="truth-verse">&ldquo;The Spirit himself intercedes for us with groanings too deep for words.&rdquo; — Romans 8:26</span>
                  </TruthBanner>
                </div>

                {done.has('match1') && done.has('match2') && <UnlockBanner sec={3} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">📖</span><div className="div-line"/></div>

      {/* ════════ SECTION 4 — STORIES ══════════════════════════════ */}
      <div id="sec-4" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          📖 SECTION 4 · BIBLE STORIES OF THE HOLY SPIRIT 📖
        </div>
        <div className="alt-bg">
          <div style={secPad}>
            {!unlocked.has(4) ? <LockCard prevSec={3} /> : (
              <>
                <p className="eyebrow">Old &amp; New Testament</p>
                <h2 className="sec-title">Bible Stories of the Holy Spirit</h2>
                <p className="sec-intro">The Holy Spirit has been active from the very first verse of the Bible! From Creation to Pentecost, He has always been at work.</p>

                {/* Story cards */}
                {[
                  { bg:'linear-gradient(180deg,#0d1f3c,#1a3a6e,#2255a4)', icon:'🌌', label:'In the Beginning', title:'The Spirit Hovers Over Creation', ref:'Genesis 1:1–2', refColor:'#0a6090', text:'Before anything existed — before light, land, or creatures — the Spirit of God was already present, hovering over the dark, empty waters like a bird brooding over a nest, full of creative power. The same Spirit who was there at the very beginning lives inside you today! 🌍✨', quote:'"The earth was without form and void… and the Spirit of God was hovering over the face of the waters."', qref:'Genesis 1:2 · ESV' },
                  { bg:'linear-gradient(180deg,#87ceeb,#c8e8f5,#5cb85c 80%)', icon:'🕊️', label:'Jordan River', title:'The Spirit Descends on Jesus', ref:'Matthew 3:13–17', refColor:'#0a5070', text:'When Jesus came out of the Jordan River after being baptised, the heavens opened. The Holy Spirit descended visibly — like a dove — and rested on Jesus. At the same moment, the Father spoke from heaven. All three Persons of the Trinity were present at once! 🎉', quote:'"He saw the Spirit of God descending like a dove… a voice from heaven said, \'This is my beloved Son.\'"', qref:'Matthew 3:16–17 · ESV' },
                  { bg:'linear-gradient(180deg,#1a4a1a,#2d6a2d,#4a9a4a)', icon:'🦴', label:'Valley of Dry Bones', title:'The Spirit Brings Dead Bones to Life', ref:'Ezekiel 37:1–14', refColor:'#166534', text:'God took Ezekiel to a valley of dry bones. God told him to speak to them. As he did, they rattled together, grew flesh, and stood up as a living army! God said: this is what His Spirit does — He brings the spiritually dead to life. Only God can do that! 💪', quote:'"I will put my Spirit within you, and you shall live."', qref:'Ezekiel 37:14 · ESV' },
                  { bg:'linear-gradient(180deg,#1a0a00,#7c2d12,#ea580c)', icon:'🔥', label:'Acts 2 · Pentecost', title:'The Spirit Is Poured Out on All People', ref:'Acts 2:1–21', refColor:'#9a3412', text:'Fifty days after the resurrection, 120 believers gathered in Jerusalem. Suddenly a sound like a violent rushing wind filled the house! Tongues of fire rested on each person, and they were all filled with the Holy Spirit. 3,000 believed that day. The Church was born! 🌍🎉', quote:'"I will pour out my Spirit on all flesh… everyone who calls on the name of the Lord shall be saved."', qref:'Acts 2:17, 21 · ESV' },
                  { bg:'linear-gradient(180deg,#2d0052,#6b21a8,#a855f7)', icon:'🎶', label:'Philippi Prison', title:'Worship in Prison — and God Shows Up', ref:'Acts 16:25–34', refColor:'#581c87', text:'Paul and Silas were in prison, feet in chains. At midnight they were praying and singing hymns! Suddenly an earthquake shook the foundations, all doors flew open, chains fell off. The jailer\'s whole family believed in Jesus that night. The Spirit moves powerfully in worship — even in the darkest places! 🎵⚡', quote:'"About midnight Paul and Silas were praying and singing hymns… a great earthquake shook the foundations."', qref:'Acts 16:25–26 · ESV' },
                ].map(s => (
                  <div key={s.title} style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 22, boxShadow: '0 4px 28px rgba(0,0,0,.09)', display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <div style={{ background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, padding: '20px 8px' }}>
                      <span style={{ fontSize: '3.5rem' }}>{s.icon}</span>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, color: 'rgba(255,255,255,.75)', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' }}>{s.label}</span>
                    </div>
                    <div style={{ padding: '20px 22px', background: '#fff' }}>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1rem', color: s.refColor, marginBottom: 6 }}>{s.title}</div>
                      <span style={{ fontFamily: 'var(--font-nunito)', display: 'inline-block', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, marginBottom: 10, background: '#f0f8ff', color: s.refColor }}>{s.ref}</span>
                      <p style={{ fontSize: '.9rem', fontWeight: 700, lineHeight: 1.8, color: '#334', marginBottom: 10 }}>{s.text}</p>
                      <blockquote style={{ fontSize: '.88rem', fontStyle: 'italic', borderLeft: `3px solid ${s.refColor}`, paddingLeft: 12, lineHeight: 1.75, color: '#556' }}>
                        {s.quote}
                        <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: s.refColor, marginTop: 4 }}>{s.qref}</span>
                      </blockquote>
                    </div>
                  </div>
                ))}

                {/* Scramble challenges */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#1a3a6e' }}>
                  <p className="puzzle-label">🌀 Story Scramble 1 of 2 — Genesis 1:2</p>
                  <p className="puzzle-q">Tap the words in the right order to complete the verse about Creation! Green = correct position.</p>
                  {/* Answer zone */}
                  <div style={{ minHeight: 58, border: `3px dashed ${done.has('sc1') ? '#40b870' : '#ccc'}`, borderRadius: 14, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, justifyContent: 'center', marginBottom: 8, background: done.has('sc1') ? '#edfaf2' : '#fafafa' }}>
                    {az1.map((tile, i) => (
                      <div key={tile.uid} onClick={() => !done.has('sc1') && removeFromAz1(tile)} style={ansTile(tile, i, SC1_ANS)}>{tile.word}</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.85rem', fontWeight: 900, textAlign: 'center', color: az1.some((t,i) => SC1_ANS[i] && t.word.toLowerCase() === SC1_ANS[i]) ? '#2d8a50' : '#aaa', marginBottom: 8 }}>
                    {scHint(az1, SC1_ANS)}
                  </p>
                  {/* Source tiles */}
                  {!done.has('sc1') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                      {SC1_TILES.map(tile => (
                        <div key={tile.uid} onClick={() => addToAz1(tile)} style={{ ...tileBase, background: az1Used.has(tile.uid) ? 'rgba(26,58,110,.28)' : '#1a3a6e', opacity: az1Used.has(tile.uid) ? 0.4 : 1, cursor: az1Used.has(tile.uid) ? 'default' : 'pointer' }}>{tile.word}</div>
                      ))}
                    </div>
                  )}
                  {!done.has('sc1') && <button className="pz-btn pz-btn-reset" onClick={resetSc1} style={{ background: '#888', marginTop: 0 }}>↩ Reset</button>}
                  <TruthBanner show={done.has('sc1')} color="#1a3a6e">
                    🌌 Yes! The Spirit was there before ANYTHING existed!
                    <span className="truth-verse">The same Spirit who hovered at Creation lives inside YOU right now!</span>
                  </TruthBanner>
                </div>

                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#ea580c' }}>
                  <p className="puzzle-label">🌀 Story Scramble 2 of 2 — Pentecost (Acts 2:3)</p>
                  <p className="puzzle-q">What happened when the Holy Spirit came at Pentecost? Put the words in order!</p>
                  <div style={{ minHeight: 58, border: `3px dashed ${done.has('sc2') ? '#40b870' : '#ccc'}`, borderRadius: 14, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, justifyContent: 'center', marginBottom: 8, background: done.has('sc2') ? '#edfaf2' : '#fafafa' }}>
                    {az2.map((tile, i) => (
                      <div key={tile.uid} onClick={() => !done.has('sc2') && removeFromAz2(tile)} style={{ ...tileBase, background: SC2_ANS[i] && tile.word.toLowerCase() === SC2_ANS[i] ? '#2d8a50' : '#ea580c', boxShadow: SC2_ANS[i] && tile.word.toLowerCase() === SC2_ANS[i] ? '0 0 0 3px #86efac' : 'none' }}>{tile.word}</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.85rem', fontWeight: 900, textAlign: 'center', color: az2.some((t,i) => SC2_ANS[i] && t.word.toLowerCase() === SC2_ANS[i]) ? '#2d8a50' : '#aaa', marginBottom: 8 }}>
                    {scHint(az2, SC2_ANS)}
                  </p>
                  {!done.has('sc2') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                      {SC2_TILES.map(tile => (
                        <div key={tile.uid} onClick={() => addToAz2(tile)} style={{ ...tileBase, background: az2Used.has(tile.uid) ? 'rgba(234,88,12,.28)' : '#ea580c', opacity: az2Used.has(tile.uid) ? 0.4 : 1, cursor: az2Used.has(tile.uid) ? 'default' : 'pointer' }}>{tile.word}</div>
                      ))}
                    </div>
                  )}
                  {!done.has('sc2') && <button className="pz-btn pz-btn-reset" onClick={resetSc2} style={{ background: '#888', marginTop: 0 }}>↩ Reset</button>}
                  <TruthBanner show={done.has('sc2')} color="#ea580c">
                    🔥 Tongues of fire rested on each person — and 3,000 believed that day!
                    <span className="truth-verse">&ldquo;I will pour out my Spirit on all flesh… everyone who calls on the name of the Lord shall be saved.&rdquo; — Acts 2:17, 21</span>
                  </TruthBanner>
                </div>

                {done.has('sc1') && done.has('sc2') && <UnlockBanner sec={4} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🌿</span><div className="div-line"/></div>

      {/* ════════ SECTION 5 — FRUIT ════════════════════════════════ */}
      <div id="sec-5" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🌿 SECTION 5 · THE FRUIT OF THE SPIRIT 🌿
        </div>
        <div className="alt-bg4">
          <div style={secPad}>
            {!unlocked.has(5) ? <LockCard prevSec={4} /> : (
              <>
                <p className="eyebrow">Galatians 5:22–23</p>
                <h2 className="sec-title">The Fruit of the Spirit</h2>
                <p className="sec-intro">When the Holy Spirit lives in us, He transforms our character from the inside out. These 9 qualities grow naturally as we stay connected to God — like a branch drawing life from the vine (John 15:4–5). We don&apos;t produce them by trying harder; He produces them in us.</p>

                {/* Fruit garden illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-fruit-garden.png" alt="Fruit of the Spirit" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#40b870' }}>
                  <p className="puzzle-label">👆 Tap-to-Reveal Challenge</p>
                  <p className="puzzle-q">Tap each fruit to discover what it means! Reveal all 9 to complete this section.</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.82rem', fontWeight: 800, color: '#888', textAlign: 'center', marginBottom: 14, letterSpacing: 1 }}>
                    {fruitsOpen.size < 9 ? `👆 TAP ANY FRUIT TO REVEAL! (${fruitsOpen.size}/9 revealed)` : '🌿 All 9 fruits revealed!'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11 }}>
                    {FRUITS.map((f, i) => (
                      <div
                        key={f.name}
                        onClick={() => !done.has('fruits') && revealFruit(i)}
                        style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 2px 14px rgba(0,0,0,.09)', cursor: fruitsOpen.has(i) ? 'default' : 'pointer', userSelect: 'none', overflow: 'hidden' }}
                      >
                        <div style={{ background: fruitsOpen.has(i) ? f.bg : '#fff', borderRadius: fruitsOpen.has(i) ? '16px 16px 0 0' : 16, padding: '13px 9px 9px', transition: 'background .25s' }}>
                          <span style={{ fontSize: '1.9rem', display: 'block', marginBottom: 4 }}>{f.icon}</span>
                          <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.85rem', color: 'var(--deep)', marginBottom: 1 }}>{f.name}</div>
                          <span style={{ fontFamily: 'var(--font-lora)', fontSize: '.58rem', color: '#bbb', fontStyle: 'italic', display: 'block' }}>{f.greek}</span>
                          {!fruitsOpen.has(i) && <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.58rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: f.color, opacity: .65, marginTop: 3 }}>Tap ▾</div>}
                        </div>
                        {fruitsOpen.has(i) && (
                          <div style={{ background: f.bg, borderRadius: '0 0 16px 16px', padding: '10px 11px 14px' }}>
                            <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.78rem', fontWeight: 700, color: '#334', lineHeight: 1.6, display: 'block', marginBottom: 5 }}>{f.kid}</span>
                            <div style={{ fontSize: '.72rem', fontStyle: 'italic', color: f.color, fontWeight: 700, lineHeight: 1.5, borderLeft: `3px solid ${f.color}`, paddingLeft: 7 }}>{f.ex}</div>
                            <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.6rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#bbb', marginTop: 4, display: 'block' }}>{f.ref}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <TruthBanner show={done.has('fruits')} color="#1a6a30">
                    🌿 WOW! You discovered all 9 fruits of the Spirit!
                    <span className="truth-verse">&ldquo;The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.&rdquo; — Galatians 5:22–23</span>
                  </TruthBanner>
                </div>

                <div className="pull-quote" style={{ marginTop: 8 }}>
                  <p className="pq-text">&ldquo;The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.&rdquo;</p>
                  <span className="pq-ref">Galatians 5:22–23 · ESV</span>
                </div>

                {done.has('fruits') && <UnlockBanner sec={5} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🎁</span><div className="div-line"/></div>

      {/* ════════ SECTION 6 — GIFTS ════════════════════════════════ */}
      <div id="sec-6" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🎁 SECTION 6 · GIFTS OF THE HOLY SPIRIT 🎁
        </div>
        <div className="alt-bg3">
          <div style={secPad}>
            {!unlocked.has(6) ? <LockCard prevSec={5} /> : (
              <>
                <p className="eyebrow">1 Corinthians 12 · Romans 12 · Ephesians 4</p>
                <h2 className="sec-title">Gifts of the Holy Spirit</h2>
                <p className="sec-intro">Beyond transforming our character, the Spirit equips each believer with supernatural gifts — not for personal glory, but to build up the church and advance God&apos;s Kingdom. &ldquo;To each is given the manifestation of the Spirit for the common good.&rdquo; (1 Cor 12:7)</p>

                {/* Gifts constellation illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-gifts.png" alt="Gifts of the Holy Spirit" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                {/* Gift reference cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 28 }}>
                  {[
                    { color:'#0369a1', icon:'🗣️', name:'Tongues & Interpretation', desc:'Praying or speaking in a language unknown to the speaker, with the gift of interpretation making it understood.' },
                    { color:'#9a3412', icon:'📣', name:'Prophecy',                 desc:'Speaking a message from God that strengthens, encourages, and comforts the church.' },
                    { color:'#166534', icon:'🩺', name:'Healing',                  desc:'Supernatural restoration of physical, emotional, or spiritual wholeness through prayer in Jesus\' name.' },
                    { color:'#7e22ce', icon:'⚡', name:'Miracles',                 desc:'Acts of supernatural power beyond natural law — signs that reveal God\'s glory and confirm the gospel.' },
                    { color:'#b45309', icon:'🧭', name:'Wisdom & Knowledge',       desc:'Spirit-given insight for a specific situation, or supernatural knowledge of facts not known naturally.' },
                    { color:'#0e7490', icon:'🔍', name:'Discernment of Spirits',   desc:'Ability to distinguish what is from God, from human nature, or from evil spiritual forces.' },
                    { color:'#4f46e5', icon:'🎓', name:'Teaching',                 desc:'The Spirit enables certain believers to explain Scripture with unusual clarity so others are changed by it.' },
                    { color:'#065f46', icon:'🤲', name:'Faith & Generosity',       desc:'Extraordinary mountain-moving faith for specific situations; and supernatural liberality in giving.' },
                  ].map(g => (
                    <div key={g.name} style={{ ...card, borderTop: `5px solid ${g.color}` }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>{g.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.85rem', color: g.color, marginBottom: 7 }}>{g.name}</div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.7 }}>{g.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Fill-in-blank challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#4f46e5' }}>
                  <p className="puzzle-label">✏️ Fill in the Blank Challenge</p>
                  <p className="puzzle-q">Tap a word from the bank, then tap the blank where it belongs. Tap a filled blank without a selection to return the word!</p>
                  <div className="kid-note">💡 Tap a word → then tap the blank where it goes. Tap a filled blank to send the word back!</div>

                  {/* Word bank */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
                    {FITB_WORDS.map(word => {
                      const isUsed = usedWords.includes(word)
                      const isSel = wbSel === word
                      return (
                        <span key={word} onClick={() => !done.has('fitb') && wb6Pick(word)} style={{
                          padding: '7px 14px', borderRadius: 20,
                          background: isSel ? '#4f46e5' : isUsed ? '#ddd' : '#e8f0ff',
                          color: isSel ? '#fff' : isUsed ? '#aaa' : '#1a3a8a',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.88rem',
                          cursor: isUsed ? 'default' : 'pointer',
                          border: `2px solid ${isSel ? '#4f46e5' : 'transparent'}`,
                          transform: isSel ? 'scale(1.06)' : 'none',
                          transition: 'all .15s',
                        }}>{word}</span>
                      )
                    })}
                  </div>

                  {/* Sentences */}
                  {[
                    { id:'b1', pre:'1. Speaking in a special language given by the Spirit is the gift of', post:'.' },
                    { id:'b2', pre:'2. When God heals someone\'s body through prayer, that\'s', post:'.' },
                    { id:'b3', pre:'3. Sharing an encouraging message from God is', post:'.' },
                    { id:'b4', pre:'4. Knowing exactly the right thing to say is the gift of', post:'.' },
                    { id:'b5', pre:'5. Mountain-moving trust in God is the gift of', post:'.' },
                    { id:'b6', pre:'6. Explaining the Bible so clearly that people understand it is', post:'.' },
                  ].map(s => (
                    <div key={s.id} style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1rem', lineHeight: 2.4, color: '#334', margin: '6px 0' }}>
                      {s.pre}{' '}
                      <span
                        onClick={() => !done.has('fitb') && wb6Drop(s.id)}
                        style={{
                          display: 'inline-block', minWidth: 100, borderBottom: `3px solid ${done.has('fitb') ? '#40b870' : blankBorder(s.id)}`,
                          background: 'transparent', fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          color: bk[s.id] ? (done.has('fitb') ? '#0a6830' : 'var(--deep)') : '#ccc',
                          padding: '0 6px 2px', textAlign: 'center', cursor: 'pointer', borderRadius: 4,
                          fontSize: '.95rem', verticalAlign: 'bottom',
                        }}
                      >{bk[s.id] || '        '}</span>
                      {s.post}
                    </div>
                  ))}

                  {!done.has('fitb') && <button className="pz-btn" style={{ background: '#4f46e5', marginTop: 16 }} onClick={checkFitb}>CHECK ANSWERS ✓</button>}
                  {fitbErr && <p className="pz-error">{fitbErr}</p>}
                  <TruthBanner show={done.has('fitb')} color="#4f46e5">
                    🎁 You know all the gifts! Remember — they&apos;re for helping OTHERS!
                    <span className="truth-verse">&ldquo;To each is given the manifestation of the Spirit for the common good.&rdquo; — 1 Corinthians 12:7</span>
                  </TruthBanner>
                </div>

                {done.has('fitb') && <UnlockBanner sec={6} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">❤️</span><div className="div-line"/></div>

      {/* ════════ SECTION 7 — LIVING ════════════════════════════════ */}
      <div id="sec-7" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-7" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          ❤️ SECTION 7 · LIVING WITH THE HOLY SPIRIT ❤️
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            {!unlocked.has(7) ? <LockCard prevSec={6} /> : (
              <>
                <p className="eyebrow">Ephesians 5 · Romans 8 · Galatians 5</p>
                <h2 className="sec-title">Living With the Holy Spirit</h2>
                <p className="sec-intro">The Holy Spirit is not just a doctrine to believe — He is a Person to walk with every day. Scripture gives us clear guidance on how to relate to Him, cooperate with Him, and avoid hindering His work in our lives.</p>

                {/* Warning bar */}
                <div style={{ background: 'linear-gradient(135deg,#7c0a02,#b91c1c)', color: '#fff', borderRadius: 20, padding: '22px 20px', marginBottom: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>⚠️</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1rem', marginBottom: 6 }}>Do Not Grieve the Holy Spirit</h3>
                    <p style={{ fontSize: '.9rem', fontWeight: 700, lineHeight: 1.75, opacity: .92 }}>
                      &ldquo;Do not grieve the Holy Spirit of God, by whom you were sealed for the day of redemption. Let all bitterness and wrath and anger and clamour and slander be put away from you.&rdquo; Because He is a Person with feelings, sin grieves Him — especially bitterness and unforgiveness.
                    </p>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 6, display: 'block' }}>Ephesians 4:30–31 · ESV</span>
                  </div>
                </div>

                <div className="pull-quote" style={{ marginBottom: 22 }}>
                  <p className="pq-text">&ldquo;Do not quench the Spirit. Do not despise prophecies, but test everything; hold fast what is good.&rdquo;</p>
                  <span className="pq-ref">1 Thessalonians 5:19–21 · ESV — We must not suppress His working</span>
                </div>

                {/* Practice list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 28 }}>
                  {[
                    { n:1, title:'Be Filled Continually',          body:'Paul\'s command is present continuous — "keep on being filled." It\'s not a one-time event but an ongoing daily surrender to Him.', ref:'Ephesians 5:18' },
                    { n:2, title:'Walk By the Spirit',             body:'"Walk by the Spirit, and you will not gratify the desires of the flesh." Follow His leading step by step, all day long.', ref:'Galatians 5:16' },
                    { n:3, title:'Pray in the Spirit',             body:'"Praying at all times in the Spirit, with all prayer and supplication." Let the Spirit direct and empower your prayer life.', ref:'Ephesians 6:18 · Jude 1:20' },
                    { n:4, title:'Be Led by the Spirit',           body:'"For all who are led by the Spirit of God are sons of God." He will guide your decisions, relationships, and your calling.', ref:'Romans 8:14' },
                    { n:5, title:'Set Your Mind on the Spirit',    body:'"To set the mind on the Spirit is life and peace." What we meditate on shapes how the Spirit flows through us.', ref:'Romans 8:6' },
                    { n:6, title:'The Spirit Helps in Weakness',   body:'"The Spirit helps us in our weakness… the Spirit himself intercedes for us with groanings too deep for words." You never pray alone.', ref:'Romans 8:26' },
                  ].map(p => (
                    <div key={p.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...card }}>
                      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--fire),var(--flame2))', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.n}</div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', color: 'var(--deep)', marginBottom: 4 }}>{p.title}</h4>
                        <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.7 }}>{p.body}</p>
                        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: 'var(--fire)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{p.ref}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decoder challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#0369a1' }}>
                  <p className="puzzle-label">🔐 Emoji Decoder — Final Challenge!</p>
                  <p className="puzzle-q">Each emoji = one word. Tap each key below to decode the hidden verse!</p>

                  {/* Decode display */}
                  <div style={{ textAlign: 'center', margin: '14px 0' }}>
                    <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: '#aaa', letterSpacing: 2, marginBottom: 10 }}>DECODE THE VERSE:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                      {DECODER_KEYS.map(k => (
                        <div key={k.id} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.8rem' }}>{k.emoji}</div>
                          <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.9rem', background: decoded[k.id] ? '#c8e8ff' : '#e8f4ff', borderRadius: 8, padding: '4px 8px', minWidth: 28, border: `2px solid ${decoded[k.id] ? '#0369a1' : '#ccc'}`, color: 'var(--deep)', transition: 'all .25s' }}>
                            {decoded[k.id] || (k.id === 'd3' ? 'HE?' : k.id === 'd4' ? 'WHO?' : '?????')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keys */}
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: '#aaa', letterSpacing: 2, textAlign: 'center', marginBottom: 10 }}>THE KEY — TAP EACH ONE:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                    {DECODER_KEYS.map(k => (
                      <button key={k.id} onClick={() => !done.has('decoder') && decodeKey(k.id, k.word)}
                        style={{ padding: '6px 10px', borderRadius: 10, fontFamily: 'var(--font-nunito)', fontSize: '.8rem', fontWeight: 900, background: decoded[k.id] ? '#c8e8ff' : '#fff', border: `2px solid ${decoded[k.id] ? '#0369a1' : '#ddd'}`, color: decoded[k.id] ? '#0369a1' : '#445', cursor: done.has('decoder') ? 'default' : 'pointer' }}>
                        {k.emoji} = {k.word}
                      </button>
                    ))}
                  </div>

                  {!done.has('decoder') && <button className="pz-btn" style={{ background: '#0369a1' }} onClick={checkDecoder}>REVEAL THE VERSE ✓</button>}
                  {decErr && <p className="pz-error">{decErr}</p>}
                  <TruthBanner show={done.has('decoder')} color="#0369a1">
                    💙 GREATER IS HE WHO IS IN YOU! The Holy Spirit inside you is more powerful than ANYTHING in the world!
                    <span className="truth-verse">&ldquo;Greater is he who is in you than he who is in the world.&rdquo; — 1 John 4:4 · ESV</span>
                  </TruthBanner>
                </div>

                <div className="pull-quote" style={{ marginTop: 8 }}>
                  <p className="pq-text">&ldquo;For you did not receive the spirit of slavery to fall back into fear, but you have received the Spirit of adoption as sons, by whom we cry, &lsquo;Abba! Father!&rsquo;&rdquo;</p>
                  <span className="pq-ref">Romans 8:15 · ESV — The Spirit makes us children of God</span>
                </div>

                {done.has('decoder') && (
                  <div style={{ margin: '28px 18px 0', background: 'linear-gradient(135deg,#0a1a4e,#1a3a8e,#2255b4)', borderRadius: 28, padding: '32px 24px', textAlign: 'center', color: '#fff', boxShadow: '0 8px 32px rgba(10,26,78,.4)' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: 12, letterSpacing: 4 }}>🕊️ 🔥 ❤️ ⚡ 🌱</div>
                    <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.6rem', lineHeight: 1.2, marginBottom: 10 }}>The Big Message</h2>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.98rem', fontWeight: 700, opacity: .9, lineHeight: 1.85 }}>
                      The Holy Spirit is God — living INSIDE every believer right now.<br />
                      He is your Helper, Teacher, Comforter, Guide, and Power-Giver.<br />
                      He transforms your character, equips you with gifts,<br />
                      and makes absolutely certain you are never alone. 💛<br /><br />
                      <em>&ldquo;Greater is He who is in you than he who is in the world.&rdquo; — 1 John 4:4</em>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Reset button ────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '24px 18px', background: 'var(--cream)' }}>
        <button onClick={resetAll} style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.8rem', color: '#aaa', background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', cursor: 'pointer' }}>
          ↺ Reset My Progress
        </button>
      </div>
    </>
  )
}
