import { dist, guideRadius, type Journey, type Point, type Trail, type Hazard } from './mechanics'

export type GuideState = 'collect' | 'return' | 'wait' | 'escort' | 'home' | 'done'
export type Guidance = { state: GuideState; target: Point | null; remaining: number; canCall: boolean }

// A projection only: advice never moves actors, spends energy, or changes a checkpoint.
export function getGuidance(s: Journey, level: Trail, wide: boolean): Guidance {
  const remaining = Math.max(0, level.requiredLight - s.orbs.filter(o => o.found).length)
  const gap = dist(s.player, s.lamb)
  const radius = guideRadius(s, wide)
  const canCall = remaining === 0 && gap >= radius && gap < 34 && s.callCooldown <= 0
  if (s.result !== 'play') return { state: 'done', target: null, remaining, canCall: false }
  if (remaining) {
    const nearest = s.orbs.filter(o => !o.found).sort((a, b) => dist(s.player, a) - dist(s.player, b) || a.id - b.id)[0]
    return { state: 'collect', target: nearest ?? null, remaining, canCall: false }
  }
  // The engine uses strictly less than the reach, not <=.
  if (gap >= radius) return { state: 'return', target: s.lamb, remaining, canCall }
  if (dist(s.player, level.gate) < 3) return { state: 'home', target: null, remaining, canCall }
  // Give a walking child room to react before the lamb loses the light.
  if (gap >= radius - 4 || (!s.moving && gap > 8)) return { state: 'wait', target: null, remaining, canCall }
  return { state: 'escort', target: level.gate, remaining, canCall }
}

export function segmentClear(a: Point, b: Point, hazards: Hazard[], margin = .75): boolean {
  const dx = b.x - a.x, dy = b.y - a.y, length2 = dx * dx + dy * dy
  return hazards.every(h => {
    const t = length2 ? Math.max(0, Math.min(1, ((h.x - a.x) * dx + (h.y - a.y) * dy) / length2)) : 0
    return dist(h, { x: a.x + t * dx, y: a.y + t * dy }) >= h.r + margin
  })
}

// Small visibility graph around the real circular hazards. Never draw a straight
// "safe" line through danger, even while shield/helper/Calm Mode protects Michael.
// If an endpoint is inside a danger margin, show only the target, not a safe path.
export function guidePath(start: Point, target: Point, hazards: Hazard[]): Point[] {
  if (!segmentClear(start, start, hazards) || !segmentClear(target, target, hazards)) return []
  if (segmentClear(start, target, hazards)) return [start, target]
  const nodes: Point[] = [start, target]
  for (const h of hazards) for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6
    const p = { x: h.x + Math.cos(angle) * (h.r + 2), y: h.y + Math.sin(angle) * (h.r + 2) }
    if (p.x >= 7 && p.x <= 93 && p.y >= 9 && p.y <= 91 && segmentClear(p, p, hazards)) nodes.push(p)
  }
  const costs = nodes.map(() => Infinity), previous = nodes.map(() => -1), visited = new Set<number>()
  costs[0] = 0
  while (visited.size < nodes.length) {
    let current = -1
    for (let i = 0; i < nodes.length; i++) if (!visited.has(i) && (current < 0 || costs[i] < costs[current])) current = i
    if (current < 0 || !Number.isFinite(costs[current])) return []
    if (current === 1) {
      const path: Point[] = []
      for (let i = 1; i !== -1; i = previous[i]) path.unshift(nodes[i])
      return path
    }
    visited.add(current)
    for (let i = 0; i < nodes.length; i++) {
      if (visited.has(i) || !segmentClear(nodes[current], nodes[i], hazards)) continue
      const cost = costs[current] + dist(nodes[current], nodes[i])
      if (cost < costs[i]) { costs[i] = cost; previous[i] = current }
    }
  }
  return []
}
