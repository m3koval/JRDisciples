import type { Orb } from './mechanics'

// Simulation-time projection only; never awards light or advances a timer.
export function pickupEcho(orb: Orb, time: number) {
  if (!orb.found || orb.foundAt === undefined) return null
  const age = time - orb.foundAt
  if (!Number.isFinite(age) || age < 0 || age >= .85) return null
  return { radius: 2 + age * 7, opacity: 1 - age / .85 }
}
