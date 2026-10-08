export type Point = { x: number; y: number }
export type Orb = Point & { id: number; found: boolean; foundAt?: number }
export type Hazard = Point & { id: number; r: number; kind: 'fog' | 'splash' | 'gust' }
export type Trail = { orbs: Orb[]; hazards: Hazard[]; lambStart: Point; gate: Point; requiredLight: number }
export type Journey = {
  player: Point; lamb: Point; orbs: Orb[]; hp: number; energy: number;
  invulnerable: number; helperTime: number; helperCooldown: number; callTime: number; callCooldown: number;
  time: number; result: 'play' | 'won' | 'failed'; hits: number;
  facing: number; lambFacing: number; moving: boolean; lambMoving: boolean;
}
export type Input = { target?: Point; dx?: number; dy?: number; wide?: boolean; calm?: boolean }
export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))
export const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
export function moveToward(a: Point, b: Point, step: number): Point {
  const d = dist(a, b)
  return d <= step || !d ? { ...b } : { x: a.x + (b.x - a.x) * step / d, y: a.y + (b.y - a.y) * step / d }
}
export function createJourney(level: Trail): Journey {
  return { player: { x: 18, y: 82 }, lamb: { ...level.lambStart }, orbs: level.orbs.map(o => ({ ...o, found: false })), hp: 3, energy: 100, invulnerable: 0, helperTime: 0, helperCooldown: 0, callTime: 0, callCooldown: 0, time: 0, result: 'play', hits: 0, facing: 0, lambFacing: 0, moving: false, lambMoving: false }
}
export function retryJourney(s: Journey, level: Trail): Journey {
  return { ...createJourney(level), orbs: s.orbs.map(o => ({ ...o })), time: s.time, invulnerable: 3 }
}
export function activateHelper(s: Journey): Journey {
  return s.result !== 'play' || s.helperCooldown > 0 ? s : { ...s, helperTime: 5, helperCooldown: 12, energy: 100 }
}
export function callLamb(s: Journey): Journey {
  return s.result !== 'play' || s.callCooldown > 0 ? s : { ...s, callTime: 3, callCooldown: 4 }
}
// Shared with the light-ring presentation: never show a different escort reach.
export function guideRadius(s: Journey, wide: boolean): number {
  return s.callTime > 0 ? 34 : (wide && s.energy > 0) || s.helperTime > 0 ? 24 : 16
}
function facing(from: Point, to: Point, previous: number, lamb = false): number {
  if (dist(from, to) < .001) return previous
  const dx = to.x - from.x, dy = to.y - from.y
  // Owned models have different forward axes; cardinal rows come from their render fixture.
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? (lamb ? 0 : 1) : (lamb ? 2 : 3)) : (dy > 0 ? (lamb ? 3 : 0) : (lamb ? 1 : 2))
}
// Pure, bounded simulation. Rendering and timers never move the lamb independently.
export function stepJourney(s: Journey, level: Trail, input: Input, delta: number): Journey {
  if (s.result !== 'play') return s
  const dt = clamp(Number.isFinite(delta) ? delta : 0, 0, .05)
  if (!dt) return s
  const wide = !!input.wide && s.energy > 0
  const protectedNow = s.helperTime > 0 || !!input.calm || (wide && s.energy > 8)
  const speed = wide ? 14 : 21
  let player = { ...s.player }
  if (input.target) player = moveToward(player, input.target, speed * dt)
  else {
    const dx = input.dx || 0, dy = input.dy || 0, length = Math.hypot(dx, dy) || 1
    player = { x: player.x + dx / length * speed * dt, y: player.y + dy / length * speed * dt }
  }
  player = { x: clamp(player.x, 7, 93), y: clamp(player.y, 9, 91) }
  const next: Journey = { ...s, player, time: s.time + dt, energy: clamp(s.energy + (wide ? -16 : 14) * dt, 0, 100), invulnerable: Math.max(0, s.invulnerable - dt), helperTime: Math.max(0, s.helperTime - dt), helperCooldown: Math.max(0, s.helperCooldown - dt), callTime: Math.max(0, s.callTime - dt), callCooldown: Math.max(0, s.callCooldown - dt) }
  next.orbs = s.orbs.map(o => o.found || dist(player, o) > (wide ? 7 : 4.5) ? o : { ...o, found: true, foundAt: next.time })
  const danger = level.hazards.find(h => dist(player, h) < h.r)
  if (danger && !protectedNow && next.invulnerable === 0) {
    next.hp -= 1; next.hits += 1; next.invulnerable = 1.8
    // Push outward, never into an invisible distant boundary.
    const away = dist(player, danger) < .1 ? { x: danger.x - 1, y: danger.y } : player
    const d = dist(away, danger)
    next.player = { x: clamp(danger.x + (away.x - danger.x) / d * (danger.r + 2), 7, 93), y: clamp(danger.y + (away.y - danger.y) / d * (danger.r + 2), 9, 91) }
    if (next.hp <= 0) { next.result = 'failed'; return next }
  }
  const ready = next.orbs.filter(o => o.found).length >= level.requiredLight
  const radius = guideRadius(s, !!input.wide)
  if (ready && dist(next.player, s.lamb) < radius && dist(next.player, s.lamb) > 3) {
    next.lamb = moveToward(s.lamb, next.player, (s.callTime > 0 ? 23 : wide ? 18 : 15) * dt)
  }
  next.moving = dist(s.player, next.player) > .001
  next.lambMoving = dist(s.lamb, next.lamb) > .001
  next.facing = facing(s.player, next.player, s.facing)
  next.lambFacing = facing(s.lamb, next.lamb, s.lambFacing, true)
  if (ready && dist(next.lamb, level.gate) < 7 && dist(next.player, level.gate) < 10) next.result = 'won'
  return next
}
