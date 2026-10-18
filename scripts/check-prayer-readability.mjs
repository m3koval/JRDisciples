import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const prayer = readFileSync('app/lessons/how-to-pray/page.tsx', 'utf8')
const alone = readFileSync('app/lessons/alone-with-god/page.tsx', 'utf8')
const challenge = alone.slice(alone.indexOf('function Challenge'), alone.indexOf('export default'))
assert(!challenge.includes('<Verse verse={verses.continual} />'), 'Memory challenge must not display its answer')
assert(prayer.includes('data-testid={`prayer-card-${card.id}`}'), 'Cards need testable keyboard controls')
assert(prayer.includes("background: '#f5f0ff'"), 'Revealed cards need an opaque light surface')
assert(!prayer.includes("transform: isFlipped ? 'rotateY"), 'Card copy must grow naturally, not use fixed 3D faces')
console.log('Prayer answer-leak and readable-card regression checks passed')
