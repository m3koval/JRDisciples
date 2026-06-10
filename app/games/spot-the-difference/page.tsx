'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Hotspot {
  id: number
  // Positions as % of image width/height so they scale with the container
  x: number  // 0–100
  y: number  // 0–100
  r: number  // radius in % of width
  // Which side has the difference: 'right' means the right image has the change
  side: 'left' | 'right'
}

interface Scene {
  id: string
  titleEn: string; titleRu: string
  storyEn: string; storyRu: string
  verseEn: string; verseRu: string
  verseRefEn: string; verseRefRu: string
  // Images — placeholder gradient until FAL.ai images are added
  leftBg: string
  rightBg: string
  leftLabel: string; leftLabelRu: string
  rightLabel: string; rightLabelRu: string
  hotspots: Hotspot[]
  // Canvas-drawn "differences" described for accessibility
  diffs: string[]
  diffsRu: string[]
}

// ─── Scene data ───────────────────────────────────────────────────────────────
// Each scene has 5 differences. Hotspot coords are % of the container.
// Images: /images/spot/[id]-before.png and /images/spot/[id]-after.png
// Until those exist the scenes render with illustrated canvas panels.

const SCENES: Scene[] = [
  {
    id: 'water-to-wine',
    titleEn: 'Water into Wine',
    titleRu: 'Вода в вино',
    storyEn: 'Jesus was at a wedding in Cana. When the wine ran out, His mother told the servants to do whatever Jesus said. He told them to fill 6 stone jars with water — and it became wine! The best wine anyone had ever tasted.',
    storyRu: 'Иисус был на свадьбе в Кане. Когда вино закончилось, Его мама сказала слугам сделать всё, что Он скажет. Он велел наполнить 6 каменных сосудов водой — и она превратилась в вино! Самое лучшее вино из всех.',
    verseEn: 'Jesus did this, the first of his signs, in Cana of Galilee, and revealed his glory.',
    verseRu: 'Так положил Иисус начало чудесам в Кане Галилейской и явил славу Свою.',
    verseRefEn: 'John 2:11', verseRefRu: 'Ин 2:11',
    leftBg: 'linear-gradient(135deg,#1e3a5f,#0f766e)',
    rightBg: 'linear-gradient(135deg,#1e3a5f,#7c2d12)',
    leftLabel: 'Before the miracle', leftLabelRu: 'До чуда',
    rightLabel: 'After the miracle',  rightLabelRu: 'После чуда',
    hotspots: [
      { id: 1, x: 22, y: 55, r: 8, side: 'right' },
      { id: 2, x: 50, y: 42, r: 8, side: 'right' },
      { id: 3, x: 74, y: 60, r: 8, side: 'right' },
      { id: 4, x: 35, y: 25, r: 8, side: 'right' },
      { id: 5, x: 62, y: 78, r: 8, side: 'right' },
    ],
    diffs: ['Jar colour changed from grey to red', 'Servant\'s expression changed to smile', 'Third jar is now full', 'Star appeared in sky', 'Flowers bloomed on table'],
    diffsRu: ['Цвет кувшина изменился с серого на красный', 'Слуга улыбается', 'Третий кувшин полный', 'Звезда появилась на небе', 'Цветы расцвели на столе'],
  },
  {
    id: 'feeding-5000',
    titleEn: 'Feeding 5,000',
    titleRu: 'Насыщение 5000',
    storyEn: 'A huge crowd followed Jesus all day. It was late and everyone was hungry. A boy had 5 loaves of bread and 2 fish. Jesus thanked God, broke the bread — and it fed over 5,000 people, with 12 baskets left over!',
    storyRu: 'Огромная толпа весь день шла за Иисусом. Стало поздно, все проголодались. У одного мальчика было 5 хлебов и 2 рыбы. Иисус поблагодарил Бога, преломил хлеб — и накормил более 5000 человек! Осталось 12 корзин.',
    verseEn: 'They all ate and were satisfied, and the disciples picked up twelve basketfuls of broken pieces.',
    verseRu: 'И ели все, и насытились; и собрали оставшихся кусков двенадцать коробов полных.',
    verseRefEn: 'Matthew 14:20', verseRefRu: 'Мф 14:20',
    leftBg: 'linear-gradient(135deg,#365314,#0c4a6e)',
    rightBg: 'linear-gradient(135deg,#15803d,#0c4a6e)',
    leftLabel: '5 loaves, 2 fish',  leftLabelRu: '5 хлебов, 2 рыбы',
    rightLabel: '12 baskets remain', rightLabelRu: '12 корзин осталось',
    hotspots: [
      { id: 1, x: 18, y: 65, r: 8, side: 'right' },
      { id: 2, x: 45, y: 50, r: 8, side: 'right' },
      { id: 3, x: 70, y: 55, r: 8, side: 'right' },
      { id: 4, x: 30, y: 30, r: 8, side: 'right' },
      { id: 5, x: 58, y: 80, r: 8, side: 'right' },
    ],
    diffs: ['Baskets are now full', 'Boy\'s expression changed to wonder', 'Crowd grew larger', 'Extra fish appeared', 'Sun is setting (golden sky)'],
    diffsRu: ['Корзины теперь полные', 'Мальчик удивлён', 'Толпа стала больше', 'Появилась ещё рыба', 'Солнце садится (золотое небо)'],
  },
  {
    id: 'calm-storm',
    titleEn: 'Jesus Calms the Storm',
    titleRu: 'Иисус усмиряет бурю',
    storyEn: 'Jesus and his disciples were crossing a lake when a huge storm hit. Waves crashed over the boat! The disciples were terrified. Jesus stood up and said "Quiet! Be still!" — and the wind and waves obeyed. Everything became completely calm.',
    storyRu: 'Иисус и ученики переплывали озеро, когда налетела буря. Волны захлёстывали лодку! Ученики ужасно испугались. Иисус встал и сказал: «Замолчи, утихни!» — и ветер и волны послушались. Стало совершенно тихо.',
    verseEn: '"Who is this? Even the wind and the waves obey him!" — Mark 4:41',
    verseRu: '«Кто же Это, что и ветер и море повинуются Ему?» — Мк 4:41',
    verseRefEn: 'Mark 4:41', verseRefRu: 'Мк 4:41',
    leftBg: 'linear-gradient(135deg,#172554,#1e3a5f)',
    rightBg: 'linear-gradient(135deg,#0c4a6e,#164e63)',
    leftLabel: 'Wild storm',  leftLabelRu: 'Бурное море',
    rightLabel: 'Perfectly still', rightLabelRu: 'Полный штиль',
    hotspots: [
      { id: 1, x: 20, y: 35, r: 8, side: 'right' },
      { id: 2, x: 50, y: 55, r: 8, side: 'right' },
      { id: 3, x: 75, y: 40, r: 8, side: 'right' },
      { id: 4, x: 38, y: 72, r: 8, side: 'right' },
      { id: 5, x: 65, y: 22, r: 8, side: 'right' },
    ],
    diffs: ['Dark clouds replaced by stars', 'Waves flattened to calm water', 'Sail is no longer torn', 'Disciples\' faces changed from fear to awe', 'Moon appeared'],
    diffsRu: ['Тучи сменились звёздами', 'Волны стихли', 'Парус больше не порван', 'Лица учеников — вместо страха изумление', 'Появилась луна'],
  },
  {
    id: 'zacchaeus',
    titleEn: 'Zacchaeus in the Tree',
    titleRu: 'Закхей на дереве',
    storyEn: 'Zacchaeus was a short tax collector who cheated people. When Jesus came to town, Zacchaeus climbed a tree just to see him. Jesus stopped, looked up, and said "Come down — I\'m staying at your house today!" Zacchaeus was so changed he gave back everything he\'d taken.',
    storyRu: 'Закхей был маленьким сборщиком налогов, который обманывал людей. Когда Иисус пришёл в город, Закхей залез на дерево, чтобы Его увидеть. Иисус остановился и сказал: «Слезь — сегодня буду у тебя!» Закхей так изменился, что вернул всё, что взял.',
    verseEn: '"The Son of Man came to seek and to save the lost." — Luke 19:10',
    verseRu: '«Сын Человеческий пришёл взыскать и спасти погибшее.» — Лк 19:10',
    verseRefEn: 'Luke 19:10', verseRefRu: 'Лк 19:10',
    leftBg: 'linear-gradient(135deg,#365314,#713f12)',
    rightBg: 'linear-gradient(135deg,#166534,#713f12)',
    leftLabel: 'Zacchaeus hiding',   leftLabelRu: 'Закхей прячется',
    rightLabel: 'Zacchaeus changed', rightLabelRu: 'Закхей изменился',
    hotspots: [
      { id: 1, x: 25, y: 40, r: 8, side: 'right' },
      { id: 2, x: 55, y: 58, r: 8, side: 'right' },
      { id: 3, x: 72, y: 30, r: 8, side: 'right' },
      { id: 4, x: 40, y: 75, r: 8, side: 'right' },
      { id: 5, x: 15, y: 65, r: 8, side: 'right' },
    ],
    diffs: ['Zacchaeus is climbing down (not hiding)', 'Crowd expression changed to welcome', 'Coins on ground (giving back)', 'Tree now has fruit', 'Jesus is looking up with a smile'],
    diffsRu: ['Закхей слезает (не прячется)', 'Толпа встречает его', 'Монеты на земле (возврат)', 'На дереве появились плоды', 'Иисус смотрит вверх с улыбкой'],
  },
]

const TOTAL_DIFFS = 5

// ─── Illustrated panel ────────────────────────────────────────────────────────
// Tries to load /images/jr/games/spot/spot-[id]-[before|after].png.
// Falls back to the SVG illustration if the image hasn't been generated yet.

function ScenePanel({
  scene, side, found, onTap, disabled
}: {
  scene: Scene
  side: 'left' | 'right'
  found: Set<number>
  onTap: (id: number) => void
  disabled: boolean
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; ts: number }>>([])
  const [wrongRipple, setWrongRipple] = useState<{ x: number; y: number; ts: number } | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgSrc = `/images/jr/games/spot/spot-${scene.id}-${side === 'left' ? 'before' : 'after'}.png`

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX
      clientY = e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY
    } else {
      clientX = e.clientX; clientY = e.clientY
    }
    const px = ((clientX - rect.left) / rect.width)  * 100
    const py = ((clientY - rect.top)  / rect.height) * 100

    // Check against hotspots on the correct side
    let hit = false
    for (const hs of scene.hotspots) {
      if (hs.side !== side) continue
      if (found.has(hs.id)) continue
      const dx = px - hs.x, dy = py - hs.y
      // radius in % is relative to width; height is roughly 0.7× width for our panels
      if (Math.sqrt(dx*dx + dy*dy) < hs.r * 1.4) {
        setRipples(r => [...r, { id: Date.now(), x: px, y: py, ts: Date.now() }])
        onTap(hs.id)
        hit = true
        break
      }
    }
    if (!hit) {
      setWrongRipple({ x: px, y: py, ts: Date.now() })
      setTimeout(() => setWrongRipple(null), 700)
    }
  }, [disabled, found, onTap, scene.hotspots, side])

  const bg = side === 'left' ? scene.leftBg : scene.rightBg

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onTouchEnd={e => { e.preventDefault(); handleClick(e) }}
      style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        background: bg, aspectRatio: '3/4',
        cursor: disabled ? 'default' : 'crosshair',
        touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none',
        border: '2px solid rgba(255,255,255,.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,.4)'
      }}
    >
      {/* Real image (shown when available) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(false)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
      />
      {/* SVG fallback (shown until real image loads) */}
      {!imgLoaded && <SceneIllustration scene={scene} side={side} />}

      {/* Label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.55)', padding: '6px 10px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'sans-serif', fontSize: '.75rem', color: '#fff', fontWeight: 700 }}>
          {side === 'left' ? scene.leftLabel : scene.rightLabel}
        </span>
      </div>

      {/* Found hotspot markers */}
      {scene.hotspots.filter(hs => hs.side === side && found.has(hs.id)).map(hs => (
        <div key={hs.id} style={{
          position: 'absolute',
          left: `${hs.x}%`, top: `${hs.y}%`,
          transform: 'translate(-50%,-50%)',
          width: 38, height: 38, borderRadius: '50%',
          border: '3px solid #22c55e',
          background: 'rgba(34,197,94,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'popIn .3s ease'
        }}>
          <span style={{ fontSize: '1rem' }}>✓</span>
        </div>
      ))}

      {/* Ripple on correct tap */}
      {ripples.map(rp => (
        <div key={rp.id} style={{
          position: 'absolute', left: `${rp.x}%`, top: `${rp.y}%`,
          transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          width: 60, height: 60, borderRadius: '50%',
          border: '3px solid #22c55e', animation: 'rippleOut .6s ease forwards'
        }} />
      ))}

      {/* Wrong tap flash */}
      {wrongRipple && (
        <div style={{
          position: 'absolute', left: `${wrongRipple.x}%`, top: `${wrongRipple.y}%`,
          transform: 'translate(-50%,-50%)', pointerEvents: 'none',
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #ef4444', animation: 'rippleOut .5s ease forwards'
        }} />
      )}
    </div>
  )
}

// ─── SVG illustration ─────────────────────────────────────────────────────────
// Simple placeholder illustrations drawn with SVG shapes.
// Replace the src in <img> when FAL.ai images are ready.

function SceneIllustration({ scene, side }: { scene: Scene; side: 'left' | 'right' }) {
  const isAfter = side === 'right'

  const illustrations: Record<string, (after: boolean) => React.ReactNode> = {
    'water-to-wine': (after) => (
      <svg viewBox="0 0 200 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Sky */}
        <rect width="200" height="140" fill={after ? '#1e1b4b' : '#1e3a5f'} />
        {after && <circle cx="160" cy="30" r="8" fill="#fde68a" opacity=".9" />}
        {/* Ground */}
        <rect y="140" width="200" height="120" fill={after ? '#7c2d12' : '#1e3a5f'} opacity=".6" />
        {/* 3 jars */}
        {[40, 100, 160].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy="185" rx="18" ry="8" fill={after && i < 3 ? '#b91c1c' : '#9ca3af'} />
            <rect x={x-16} y="155" width="32" height="32" rx="8" fill={after ? '#dc2626' : '#6b7280'} />
            <ellipse cx={x} cy="155" rx="16" ry="7" fill={after ? '#ef4444' : '#9ca3af'} />
          </g>
        ))}
        {/* Table */}
        <rect x="20" y="210" width="160" height="12" rx="4" fill="#92400e" />
        {after && (
          <>
            <circle cx="70" cy="130" r="4" fill="#fde68a" />
            <circle cx="90" cy="120" r="3" fill="#fde68a" opacity=".7" />
          </>
        )}
        {/* Person */}
        <circle cx="170" cy="100" r="12" fill="#fbbf24" />
        <rect x="160" y="112" width="20" height="28" rx="6" fill={after ? '#15803d' : '#1d4ed8'} />
        <path d={after ? 'M170 110 Q180 120 175 130' : 'M170 110 Q162 122 158 128'} stroke="#fbbf24" strokeWidth="3" fill="none" />
      </svg>
    ),
    'feeding-5000': (after) => (
      <svg viewBox="0 0 200 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect width="200" height="140" fill={after ? '#78350f' : '#1a3a0f'} />
        {after && <rect x="0" y="100" width="200" height="40" fill="#fbbf24" opacity=".25" />}
        <rect y="140" width="200" height="120" fill="#166534" opacity=".5" />
        {/* Crowd dots */}
        {Array.from({ length: after ? 12 : 7 }, (_, i) => (
          <circle key={i} cx={20 + i * 15} cy={90 + (i % 3) * 10} r="6" fill="#fbbf24" opacity=".8" />
        ))}
        {/* Baskets */}
        {Array.from({ length: after ? 5 : 1 }, (_, i) => (
          <g key={i}>
            <ellipse cx={30 + i * 36} cy="205" rx="16" ry="9" fill="#92400e" />
            <rect x={15 + i * 36} y="185" width="30" height="22" rx="5" fill="#b45309" />
            <ellipse cx={30 + i * 36} cy="185" rx="15" ry="7" fill={after ? '#fde68a' : '#92400e'} />
          </g>
        ))}
        {/* Jesus figure */}
        <circle cx="100" cy="60" r="13" fill="#fbbf24" />
        <rect x="90" y="73" width="20" height="32" rx="6" fill="#1d4ed8" />
        <path d="M100 72 L90 90 M100 72 L110 90" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
      </svg>
    ),
    'calm-storm': (after) => (
      <svg viewBox="0 0 200 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Sky */}
        <rect width="200" height="130" fill={after ? '#0c4a6e' : '#172554'} />
        {after
          ? <><circle cx="150" cy="35" r="14" fill="#fde68a" opacity=".85" />
              {[20,50,80,110,140,170].map(x => <circle key={x} cx={x} cy={20 + (x%30)} r="1.5" fill="#fff" />)}</>
          : <><rect x="10" y="15" width="80" height="30" rx="12" fill="#374151" opacity=".8" />
              <rect x="110" y="10" width="75" height="35" rx="12" fill="#1f2937" opacity=".9" /></>
        }
        {/* Waves */}
        {after
          ? <path d="M0 150 Q50 145 100 150 Q150 155 200 150 L200 180 L0 180 Z" fill="#0369a1" />
          : <><path d="M0 130 Q25 115 50 130 Q75 145 100 130 Q125 115 150 130 Q175 145 200 130 L200 165 L0 165 Z" fill="#1e40af" />
              <path d="M0 155 Q30 138 60 155 Q90 172 120 155 Q150 138 180 155 L200 160 L200 185 L0 185Z" fill="#1d4ed8" opacity=".7" /></>
        }
        {/* Boat */}
        <path d="M50 165 Q100 155 150 165 L140 200 L60 200 Z" fill="#92400e" />
        {after
          ? <rect x="92" y="130" width="16" height="45" rx="3" fill="#b45309" />
          : <rect x="92" y="135" width="14" height="40" rx="3" fill="#78350f" />
        }
        {/* Disciples */}
        {[70, 100, 130].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={after ? 175 : 170 + (i%2)*6} r="7" fill="#fbbf24" opacity=".9" />
          </g>
        ))}
      </svg>
    ),
    'zacchaeus': (after) => (
      <svg viewBox="0 0 200 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect width="200" height="260" fill={after ? '#166534' : '#365314'} opacity=".7" />
        {/* Tree trunk */}
        <rect x="85" y="80" width="30" height="120" rx="8" fill="#92400e" />
        {/* Foliage */}
        <circle cx="100" cy="60" r="50" fill="#16a34a" opacity=".9" />
        <circle cx="70"  cy="75" r="35" fill="#15803d" opacity=".85" />
        <circle cx="130" cy="75" r="35" fill="#15803d" opacity=".85" />
        {after && (
          <>
            <circle cx="50"  cy="70" r="8" fill="#fbbf24" opacity=".8" />
            <circle cx="150" cy="65" r="8" fill="#fbbf24" opacity=".8" />
            <circle cx="100" cy="30" r="8" fill="#fbbf24" opacity=".8" />
          </>
        )}
        {/* Zacchaeus - in tree or climbing down */}
        <circle cx={after ? 105 : 100} cy={after ? 110 : 90} r="10" fill="#fbbf24" />
        <rect x={after ? 97 : 92} y={after ? 120 : 100} width="16" height="22" rx="5" fill="#7c3aed" />
        {/* Crowd */}
        {[20, 45, 155, 175].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="215" r="8" fill="#fbbf24" opacity=".85" />
            <rect x={x-8} y="223" width="16" height="22" rx="5" fill={['#1d4ed8','#15803d','#b45309','#dc2626'][i]} />
          </g>
        ))}
        {/* Jesus */}
        <circle cx="105" cy="195" r="11" fill="#fde68a" />
        <rect x="96" y="206" width="18" height="26" rx="5" fill="#1d4ed8" />
        {after && (
          <>
            <circle cx="40" cy="238" r="4" fill="#fde68a" opacity=".7" />
            <circle cx="55" cy="240" r="4" fill="#fde68a" opacity=".7" />
            <circle cx="70" cy="237" r="4" fill="#fde68a" opacity=".7" />
          </>
        )}
      </svg>
    ),
  }

  const render = illustrations[scene.id]
  return render ? <>{render(isAfter)}</> : <div style={{ position: 'absolute', inset: 0, background: isAfter ? scene.rightBg : scene.leftBg }} />
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpotTheDifferencePage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  const [sceneIdx, setSceneIdx]   = useState(0)
  const [found, setFound]         = useState<Set<number>>(new Set())
  const [phase, setPhase]         = useState<'story'|'game'|'verse'|'results'>('story')
  const [wrongFlash, setWrongFlash] = useState(false)
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scene = SCENES[sceneIdx]
  const allFound = found.size >= TOTAL_DIFFS

  const handleTap = useCallback((id: number) => {
    setFound(prev => {
      const next = new Set(prev)
      next.add(id)
      if (next.size >= TOTAL_DIFFS) {
        setTimeout(() => setPhase('verse'), 600)
      }
      return next
    })
  }, [])

  const nextScene = () => {
    const next = sceneIdx + 1
    if (next >= SCENES.length) { setPhase('results'); return }
    setSceneIdx(next)
    setFound(new Set())
    setPhase('story')
  }

  const restart = () => { setSceneIdx(0); setFound(new Set()); setPhase('story') }

  const t = {
    back:    isRu ? '← К играм' : '← Back to Games',
    title:   isRu ? 'Найди отличия' : 'Spot the Difference',
    eyebrow: isRu ? 'Библейские сцены' : 'Bible Scenes',
    start:   isRu ? 'Играть →' : 'Play →',
    found:   isRu ? 'Найдено' : 'Found',
    of:      isRu ? 'из' : 'of',
    next:    isRu ? 'Следующая сцена →' : 'Next Scene →',
    allDone: isRu ? 'Все отличия найдены!' : 'All differences found!',
    story:   isRu ? scene.storyRu : scene.storyEn,
    cont:    isRu ? 'Играть →' : 'Play →',
    hint:    isRu ? 'Нажми на правой картинке там, где что-то изменилось' : 'Tap the right image where something changed',
    verse:   isRu ? scene.verseRu   : scene.verseEn,
    vref:    isRu ? scene.verseRefRu: scene.verseRefEn,
    well:    isRu ? 'Молодец! Ты нашёл все ' : 'Amazing! You found all ',
    diffs:   isRu ? ' отличий!' : ' differences!',
    again:   isRu ? 'Ещё раз' : 'Play again',
    games:   isRu ? 'К играм' : 'Games',
    results_title: isRu ? 'Все сцены пройдены! 🎉' : 'All scenes complete! 🎉',
    results_sub:   isRu ? 'Ты внимательный наблюдатель — как хороший ученик!' : 'You\'re a careful observer — just like a good disciple!',
    scene_of:      isRu ? `Сцена ${sceneIdx + 1} из ${SCENES.length}` : `Scene ${sceneIdx + 1} of ${SCENES.length}`,
  }

  return (
    <main style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#0a0f1e,#0f1f3c 60%,#f0f4ff)', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 64px', color: '#fff' }}>
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'sans-serif', fontWeight: 900, textDecoration: 'none' }}>
          {t.back}
        </Link>

        {/* ── TITLE HEADER ── */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <p style={{ fontFamily: 'sans-serif', color: '#7ec8e3', fontSize: '.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,6vw,3rem)', margin: 0, color: '#fff' }}>
            🔍 {t.title}
          </h1>
          <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.65)', fontSize: '.88rem', margin: '6px 0 0' }}>{t.scene_of}</p>
        </div>

        {/* ── STORY PHASE ── */}
        {phase === 'story' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 20, padding: '24px 22px', marginBottom: 22 }}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: '1.1rem', margin: '0 0 12px' }}>
                {isRu ? scene.titleRu : scene.titleEn}
              </p>
              <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.88)', lineHeight: 1.7, margin: 0, fontSize: '.95rem' }}>
                {t.story}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setPhase('game')}
                style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.1rem', border: 'none', borderRadius: 14, padding: '14px 40px', cursor: 'pointer' }}
              >
                {t.cont}
              </button>
            </div>
          </div>
        )}

        {/* ── GAME PHASE ── */}
        {phase === 'game' && (
          <>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#22c55e,#86efac)', width: `${(found.size / TOTAL_DIFFS) * 100}%`, transition: 'width .4s ease' }} />
              </div>
              <span style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', whiteSpace: 'nowrap', fontSize: '.9rem' }}>
                {t.found} {found.size} {t.of} {TOTAL_DIFFS}
              </span>
            </div>

            <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.55)', fontSize: '.8rem', margin: '0 0 12px', textAlign: 'center' }}>
              {t.hint}
            </p>

            {/* Side-by-side panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ScenePanel scene={scene} side="left"  found={found} onTap={handleTap} disabled={allFound} />
              <ScenePanel scene={scene} side="right" found={found} onTap={handleTap} disabled={allFound} />
            </div>

            {/* Scene title */}
            <p style={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 900, color: '#bae6fd', marginTop: 12, fontSize: '.9rem' }}>
              {isRu ? scene.titleRu : scene.titleEn}
            </p>
          </>
        )}

        {/* ── VERSE PHASE ── */}
        {phase === 'verse' && (
          <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✨</div>
            <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#22c55e', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
              {t.allDone}
            </p>
            <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.8)', marginBottom: 6, fontSize: '.9rem' }}>
              {t.well}{TOTAL_DIFFS}{t.diffs}
            </p>
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 18, padding: '20px 18px', margin: '20px 0' }}>
              <p style={{ fontFamily: 'sans-serif', fontStyle: 'italic', color: '#fff', lineHeight: 1.65, margin: '0 0 10px', fontSize: '.95rem' }}>
                "{t.verse}"
              </p>
              <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', margin: 0 }}>{t.vref}</p>
            </div>
            <button
              onClick={nextScene}
              style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.1rem', border: 'none', borderRadius: 14, padding: '14px 36px', cursor: 'pointer' }}
            >
              {sceneIdx + 1 < SCENES.length ? t.next : (isRu ? 'Итоги →' : 'See results →')}
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === 'results' && (
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 24 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🏆</div>
            <h2 style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: 'clamp(1.4rem,5vw,2rem)', margin: '0 0 12px' }}>
              {t.results_title}
            </h2>
            <p style={{ fontFamily: 'sans-serif', color: '#bae6fd', lineHeight: 1.6, marginBottom: 28, fontSize: '.95rem' }}>
              {t.results_sub}
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button onClick={restart} style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', border: 'none', borderRadius: 14, padding: '13px 28px', cursor: 'pointer' }}>
                {t.again}
              </button>
              <Link href="/games" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '1rem', borderRadius: 14, padding: '13px 28px', textDecoration: 'none', display: 'inline-block' }}>
                {t.games}
              </Link>
            </div>
          </div>
        )}
      </section>

      <style>{`
        @keyframes popIn {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
          70%  { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
        }
        @keyframes rippleOut {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </main>
  )
}
