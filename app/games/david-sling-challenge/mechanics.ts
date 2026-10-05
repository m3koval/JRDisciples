export type ShotResult = 'perfect' | 'hit' | 'near' | 'miss' | 'saved'

export function releaseError(angle: number, target: number, wind: number) {
  return ((angle + wind - target) % 360 + 540) % 360 - 180
}

export function resolveShot(angle: number, target: number, wind: number, window: number, shield: boolean) {
  const error = releaseError(angle, target, wind)
  const distance = Math.abs(error)
  const result: ShotResult = distance <= 3 ? 'perfect' : distance <= window ? 'hit' : distance <= window + 9 ? 'near' : shield ? 'saved' : 'miss'
  return { error, result, points: result === 'perfect' ? 120 : result === 'hit' ? 75 : result === 'near' ? 25 : 0,
    stoneCost: result === 'saved' ? 0 : 1, consumeShield: result === 'saved', advance: result === 'perfect' || result === 'hit' }
}

// Presentation for a timing game, not a physical ballistics solver. The same
// curve drives the live cue and the released stone, over the complete 4:3 art.
export function slingScene(width: number, height: number) {
  const compact = height < 340
  const available = Math.max(1, compact ? height : height - 188)
  const artWidth = Math.min(width, available * 4 / 3)
  const artHeight = artWidth * 3 / 4
  const left = (width - artWidth) / 2
  const top = (compact ? 0 : 88) + (available - artHeight) / 2
  return { left, top, width: artWidth, height: artHeight,
    origin: { x: left + artWidth * .082, y: top + artHeight * .53 },
    target: { x: left + artWidth * .94, y: top + artHeight * .49 } }
}

export function shotCurve(scene: ReturnType<typeof slingScene>, error: number, window: number) {
  const offset = Math.abs(error) <= window ? error / window * .055 : Math.sign(error) * Math.min(.43, .20 + (Math.abs(error) - window) * .004)
  return { start: scene.origin,
    control: { x: scene.left + scene.width * .49, y: scene.top + scene.height * .12 },
    end: { x: scene.target.x, y: scene.target.y + scene.height * offset } }
}

export function curvePoint(curve: ReturnType<typeof shotCurve>, progress: number) {
  const t = Math.max(0, Math.min(1, progress)), u = 1 - t
  return { x: u*u*curve.start.x + 2*u*t*curve.control.x + t*t*curve.end.x,
    y: u*u*curve.start.y + 2*u*t*curve.control.y + t*t*curve.end.y }
}
