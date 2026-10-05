// Pure rules shared by the arena and deterministic regression tests.
export const WAVE_SIZES = [5, 7, 9, 11, 13, 15, 18, 21, 24, 28]
export const GUARD_MAX = 100
export function stepGuard(energy: number, held: boolean, dt: number, upgraded: boolean) {
  const elapsed = Math.max(0, Math.min(dt, 100)) / 1000
  const active = held && energy > 0
  return { active, energy: Math.max(0, Math.min(GUARD_MAX, energy + elapsed * (held ? (active ? -(upgraded ? 22 : 34) : 0) : 25))) }
}
export function waveOutcome(hp: number, unspawned: number, active: number, wave: number) {
  if (hp <= 0) return 'dead'
  if (unspawned === 0 && active === 0) return wave + 1 >= WAVE_SIZES.length ? 'victory' : 'verse'
  return 'playing'
}
export function hasExited(d: {x:number;y:number;r:number}, width:number,height:number) {
  return d.x < -d.r * 4 || d.x > width + d.r * 4 || d.y < -d.r * 4 || d.y > height + d.r * 4
}
export function safeBest(value: string | null) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
}
