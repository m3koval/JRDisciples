'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from './page.module.css'

// Percent coordinates refer to the uncropped original square illustration.
const objects = [
  { id: 'zipper', x: 5.2, y: 19.6, w: 9, h: 19, en: 'Zipper', ru: 'Молния' },
  { id: 'watch', x: 84.1, y: 18.4, w: 12, h: 15, en: 'Watch', ru: 'Часы' },
  { id: 'car', x: 13.4, y: 63.6, w: 20, h: 13, en: 'Toy car', ru: 'Машинка' },
  { id: 'headphones', x: 69.7, y: 62, w: 17, h: 18, en: 'Headphones', ru: 'Наушники' },
  { id: 'flashlight', x: 33.2, y: 90.4, w: 18, h: 12, en: 'Flashlight', ru: 'Фонарик' },
  { id: 'shoe', x: 76.5, y: 86, w: 22, h: 14, en: 'Sneaker', ru: 'Кроссовок' },
]

export function HarvestHunt({ language, alt }: { language: 'en' | 'ru'; alt: string }) {
  const [found, setFound] = useState<string[]>([])
  const [miss, setMiss] = useState(false)
  const ru = language === 'ru'
  const complete = found.length === objects.length
  return <div className={styles.hunt}>
    <p className={styles.huntInstruction}>{ru ? 'Нажми на шесть предметов, которых не было в библейские времена.' : 'Tap six things that did not belong in Bible times.'}</p>
    <div className={styles.huntPicture} data-testid="hunt-picture" onClick={() => setMiss(true)}>
      <Image src="/images/jr/lessons/remember-the-giver/cover.webp" alt={alt} width={1024} height={1024} sizes="(max-width: 800px) 100vw, 40vw" priority draggable={false} />
      {objects.map(object => {
        const selected = found.includes(object.id)
        return <button key={object.id} type="button" data-testid={`hunt-${object.id}`} className={`${styles.hotspot} ${selected ? styles.found : ''}`} style={{ left: `${object.x}%`, top: `${object.y}%`, width: `${object.w}%`, height: `${object.h}%` }} aria-label={object[language]} aria-pressed={selected} onClick={event => {
          event.stopPropagation()
          setMiss(false)
          setFound(previous => previous.includes(object.id) ? previous : [...previous, object.id])
        }}>{selected && <span aria-hidden="true">✓</span>}</button>
      })}
    </div>
    <p className={styles.huntStatus} role="status" aria-live="polite" data-testid="hunt-status">
      <strong>{complete ? (ru ? 'Все шесть найдены!' : 'You found all six!') : `${ru ? 'Найдено' : 'Found'}: ${found.length} / 6`}</strong>
      {found.length > 0 && <span>{objects.filter(object => found.includes(object.id)).map(object => object[language]).join(' · ')}</span>}
      {miss && !complete && <span>{ru ? 'Посмотри ещё: что здесь из нашего времени?' : 'Look again: which things are from our time?'}</span>}
    </p>
    {complete && <button type="button" className={styles.huntReset} onClick={() => { setFound([]); setMiss(false) }}>{ru ? 'Найти ещё раз' : 'Find them again'}</button>}
  </div>
}
