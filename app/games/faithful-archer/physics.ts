export type Point = { x: number; y: number }
export type Flight = Point & { vx: number; vy: number }

/** Exact constant-acceleration step, shared by preview and live arrows. */
export function stepFlight<T extends Flight>(arrow: T, dt: number, gravity: number): T {
  return { ...arrow, x: arrow.x + arrow.vx * dt, y: arrow.y + arrow.vy * dt + gravity * dt * dt / 2, vy: arrow.vy + gravity * dt }
}

/** Drag anywhere: the finger's displacement, not screen location, draws the bow. */
export function releasePoint(bow: Point, start: Point, current: Point): Point {
  return { x: bow.x + current.x - start.x, y: bow.y + current.y - start.y }
}

export function roundOutcome(level: number, cleared: boolean, arrows: number, flying: boolean) {
  if (cleared) return level >= 3 ? 'complete' : 'advance'
  return arrows <= 0 && !flying ? 'refill' : 'play'
}

export function targetMotion(kind: string, level: number) {
  if (kind === 'shield' || kind === 'scroll') return { x: 0, y: 0 }
  if (kind === 'bell') return { x: 16 + level * 5, y: 0 }
  if (kind === 'lantern') return { x: 0, y: 12 + level * 4 }
  return { x: 20 + level * 6, y: 0 }
}
