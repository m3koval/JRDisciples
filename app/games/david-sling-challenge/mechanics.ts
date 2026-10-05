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
