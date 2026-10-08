export type Controls = { x: number; y: number; shield: boolean; rescue: boolean }
export const SITES = [{ x: -6, at: 100 }, { x: 6, at: 240 }, { x: -5, at: 380 }]
export const SHIELD = { drain: 34, recharge: 26, unlock: 32, perfect: .22, rearm: .55 }
export function newFlight() {
  return { time: 0, distance: 0, x: 0, y: 2, hull: 5, invulnerable: 0, shield: false,
    bossHealth: 6, bossActive: false, upgrades: 0, energy: 100, exhausted: false, shieldWasDown: false, releasedFor: 1, perfectWindow: 0, perfectSpent: false, perfects: 0, inputReset: false,
    celebration: 0, returnTime: 0, returnX: 0, returnZ: 0, bossImpact: 0,
    impact: 0, impactX: 0, impactZ: 0, impactKind: '', wave: 0, pattern: 'pair',
    rescued: [false, false, false], rescueProgress: 0, activeSite: -1, checkpoint: 0,
    blocks: 0, recoveries: 0, spawn: 2.5, won: false, cue: 'start', cueTimer: 5,
    darts: [] as { id: number; x: number; z: number; vx: number; vz: number; warning?: number }[], nextId: 1 }
}
export type Flight = ReturnType<typeof newFlight>
export function convoyX(distance: number) { return Math.sin(distance / 65) * 3 }
function say(s: Flight, cue: string) { s.cue = cue; s.cueTimer = 3 }
// Pause/recovery cannot carry a perfect window or a held rescue into play.
export function releaseFlightInputs(s: Flight) {
  s.shield = false; s.shieldWasDown = false; s.perfectWindow = 0; s.perfectSpent = true; s.releasedFor = 0; s.rescueProgress = 0; s.inputReset = true
}
export function dismissCelebration(s: Flight) { s.celebration = 0; releaseFlightInputs(s) }
export function advance(s: Flight, c: Controls, elapsed: number) {
  if (s.won || s.celebration || !Number.isFinite(elapsed)) return
  const dt = Math.max(0, Math.min(.04, elapsed)); if (!dt) return
  s.bossActive = s.distance >= 440 && s.rescued.every(Boolean) && s.bossHealth > 0
  const capacity = s.upgrades >= 1 ? 125 : 100, recharge = s.upgrades >= 2 ? 36 : SHIELD.recharge
  s.time += dt; s.cueTimer = Math.max(0, s.cueTimer - dt); s.invulnerable = Math.max(0, s.invulnerable - dt); s.impact = Math.max(0, s.impact - dt)
  s.bossImpact = Math.max(0, s.bossImpact - dt)
  if (s.returnTime > 0) { s.returnTime = Math.max(0, s.returnTime - dt); if (!s.returnTime) s.bossImpact = .65 }
  if (s.inputReset) { if (!c.shield && !c.rescue) s.inputReset = false; c = { ...c, shield: false, rescue: false } }
  s.perfectWindow = Math.max(0, s.perfectWindow - dt)
  if (!c.shield) {
    s.releasedFor += dt; s.energy = Math.min(capacity, s.energy + recharge * dt)
    if (s.energy >= SHIELD.unlock) s.exhausted = false
    s.perfectWindow = 0
  } else {
    if (!s.shieldWasDown && !s.exhausted && s.releasedFor >= SHIELD.rearm) { s.perfectWindow = s.upgrades >= 3 ? .32 : SHIELD.perfect; s.perfectSpent = false }
    s.releasedFor = 0
  }
  s.shieldWasDown = c.shield; s.shield = c.shield && !s.exhausted && s.energy > 0
  if (s.shield) { s.energy = Math.max(0, s.energy - SHIELD.drain * dt); if (!s.energy) { s.shield = false; s.exhausted = true; s.perfectWindow = 0; say(s, 'empty') } }
  s.x = Math.max(-9, Math.min(9, s.x + Math.max(-1, Math.min(1, c.x)) * dt * 12))
  s.y = Math.max(-11, Math.min(10, s.y + Math.max(-1, Math.min(1, c.y)) * dt * 12))
  s.activeSite = SITES.findIndex((site, i) => !s.rescued[i] && Math.abs(s.distance - site.at) < 19)
  const site = SITES[s.activeSite]
  const close = site && Math.abs(s.x - site.x) < 2.8 && Math.abs(s.distance - s.y - site.at) < 10
  if (c.rescue && close) {
    s.rescueProgress += dt / 1.4
    if (s.rescueProgress >= 1) { s.rescued[s.activeSite] = true; s.upgrades = s.rescued.filter(Boolean).length; s.checkpoint = site.at + 20; s.hull = 5; s.rescueProgress = 0; s.celebration = s.upgrades; releaseFlightInputs(s); say(s, `upgrade${s.upgrades}`); return }
  } else s.rescueProgress = Math.max(0, s.rescueProgress - dt)
  // Every family is reachable: the rescue zone waits, not a missed one-shot pickup.
  if (!s.bossActive && (!site || s.distance < site.at)) s.distance += dt * (c.rescue && close ? 0 : 9)
  s.spawn -= dt
  if (s.spawn <= 0 && !site && s.distance > 25) {
    const stage = s.distance < 120 ? 0 : s.distance < 280 ? 1 : 2
    s.pattern = s.bossActive ? (s.bossHealth > 3 ? 'boss1' : 'boss2') : ['pair', 'sweep', 'pincer'][stage]; s.wave++
    const target = convoyX(s.bossActive ? s.distance : s.distance + 18)
    const origins = s.bossActive ? (s.bossHealth > 3 ? [target - 2, target + 2] : [target - 4, target, target + 4]) : stage === 0 ? [target - 1.8, target + 1.8] : stage === 1 ? [-6, 0, 6] : [-8, -5, 5, 8]
    origins.forEach((x, i) => s.darts.push({ id: s.nextId++, x, z: -s.distance - 14, vx: s.bossActive || stage === 0 ? 0 : (target - x) * .65, vz: 18 + stage * 2, warning: 1 + (s.bossActive ? 0 : stage === 1 ? i * .32 : stage === 2 ? (i % 2) * .4 : 0) }))
    say(s, s.pattern); s.spawn = s.bossActive ? 3.2 : 4.8
  }
  for (const d of s.darts) {
    // Telegraphs are not projectiles: no motion, collision, or damage until launch.
    if (d.warning && d.warning > 0) { d.warning = Math.max(0, d.warning - dt); if (!d.warning) d.z = -s.distance - 14; continue }
    d.x += d.vx * dt; d.z += d.vz * dt
    const relativeZ = d.z + s.distance
    if (s.shield && Math.abs(d.x - s.x) < 5.2 && Math.abs(relativeZ - (s.y - 3.5)) < 1.5) {
      s.impact = .45; s.impactX = d.x; s.impactZ = d.z; d.z = 9999; s.blocks++
      const perfect = s.perfectWindow > 0 && !s.perfectSpent
      if (perfect) { s.perfects++; if (s.bossActive) { s.bossHealth = Math.max(0, s.bossHealth - 1); s.returnTime = .38; s.returnX = s.impactX; s.returnZ = s.impactZ } s.energy = Math.min(capacity, s.energy + 12); s.perfectSpent = true }
      if (perfect || s.cue !== 'perfect' || s.cueTimer < 2.6) { s.impactKind = perfect ? 'perfect' : 'block'; say(s, s.impactKind) }
    } else if (relativeZ > 15 && relativeZ < 18 && Math.abs(d.x - convoyX(s.distance)) < 4) {
      d.z = 9999
      if (!s.invulnerable) { s.hull--; s.invulnerable = 1.2; s.impact = .6; s.impactKind = 'hit'; s.impactX = convoyX(s.distance); s.impactZ = -s.distance + 16; say(s, 'hit') }
    }
  }
  s.darts = s.darts.filter(d => (d.warning || 0) > 0 || d.z + s.distance < 22)
  if (s.hull <= 0) { s.distance = s.checkpoint; s.hull = 5; s.darts = []; s.spawn = 3; s.recoveries++; s.invulnerable = 4; s.energy = 100; s.exhausted = false; s.impact = 0; s.activeSite = -1; releaseFlightInputs(s); say(s, 'recover') }
  if (s.distance >= 465 && s.rescued.every(Boolean) && s.bossHealth === 0) { s.won = true; say(s, 'win') }
}
