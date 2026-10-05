export type Cell = { x: number; y: number }
export const GRID = 21
export const MAX_TRAIL = 18
export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y
export const initialTrail = (): Cell[] => [7, 6, 5, 4].map(x => ({ x, y: 10 }))

// Broad, connected paths: first learn turning, then steer around visible rocks.
export function rocksForLevel(level: number): Cell[] {
  if (level <= 3) return []
  const rocks = [{ x: 6, y: 5 }, { x: 7, y: 5 }, { x: 13, y: 15 }, { x: 14, y: 15 }]
  if (level >= 7) rocks.push({ x: 15, y: 7 }, { x: 15, y: 8 }, { x: 5, y: 14 }, { x: 5, y: 15 })
  return rocks
}

// A bounded enumeration, not random retries. Null means no free cell.
export function freeCell(blocked: Cell[], random = Math.random, grid = GRID): Cell | null {
  const keys = new Set(blocked.map(c => `${c.x},${c.y}`))
  const free: Cell[] = []
  for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) {
    if (!keys.has(`${x},${y}`)) free.push({ x, y })
  }
  if (!free.length) return null
  const index = Math.min(free.length - 1, Math.max(0, Math.floor(random() * free.length)))
  return free[index]
}

// Authored destinations make each verse a little journey around the board.
// Pick the nearest reachable free square if the moving trail occupies an anchor.
export function wordCell(level: number, word: number, snake: Cell[], blocked: Cell[]): Cell | null {
  const anchors = [{ x: 12, y: 10 }, { x: 16, y: 5 }, { x: 10, y: 3 }, { x: 3, y: 5 }, { x: 3, y: 15 }, { x: 10, y: 17 }, { x: 17, y: 15 }, { x: 17, y: 10 }]
  const target = anchors[(word + Math.floor((level - 1) / 3)) % anchors.length]
  const walls = new Set([...blocked, ...snake.slice(1)].map(c => `${c.x},${c.y}`))
  const seen = new Set<string>()
  const queue = [snake[0] ?? { x: 7, y: 10 }]
  const candidates: Cell[] = []
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i], key = `${c.x},${c.y}`
    if (c.x < 0 || c.y < 0 || c.x >= GRID || c.y >= GRID || walls.has(key) || seen.has(key)) continue
    seen.add(key)
    if (!snake.some(s => sameCell(s, c))) candidates.push(c)
    queue.push({ x: c.x + 1, y: c.y }, { x: c.x - 1, y: c.y }, { x: c.x, y: c.y + 1 }, { x: c.x, y: c.y - 1 })
  }
  candidates.sort((a, b) => Math.abs(a.x - target.x) + Math.abs(a.y - target.y) - Math.abs(b.x - target.x) - Math.abs(b.y - target.y))
  return candidates[0] ?? null
}

export type CollisionReason = 'edge' | 'rock' | 'trail'
export function collisionReason(head: Cell, snake: Cell[], rocks: Cell[], grows: boolean): CollisionReason | null {
  if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) return 'edge'
  if (rocks.some(c => sameCell(c, head))) return 'rock'
  if ((grows ? snake : snake.slice(0, -1)).some(c => sameCell(c, head))) return 'trail'
  return null
}
export function collides(head: Cell, snake: Cell[], rocks: Cell[], grows: boolean): boolean {
  return collisionReason(head, snake, rocks, grows) !== null
}
export function tickDuration(level: number, gentle: boolean) {
  return Math.max(gentle ? 185 : 130, (gentle ? 250 : 205) - (level - 1) * 8)
}
export function frameDelta(now: number, last: number) {
  // A stalled frame never causes catch-up deaths; return to the same moment.
  return now - last > 250 ? 0 : Math.max(0, now - last)
}
export function readBest(storage: Pick<Storage, 'getItem'>): number {
  try {
    const value = Number(storage.getItem('manna-trail-best'))
    return Number.isSafeInteger(value) && value >= 0 ? value : 0
  } catch { return 0 }
}
export function saveBest(storage: Pick<Storage, 'setItem'>, best: number): boolean {
  try { storage.setItem('manna-trail-best', String(best)); return true } catch { return false }
}
export function ownsPointer(owner: number | null, incoming: number) { return owner === incoming }
