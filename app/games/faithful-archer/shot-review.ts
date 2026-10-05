export type ReviewPoint = { x: number; y: number }
export type ShotOutcome = 'flying' | 'target' | 'ground' | 'blocked' | 'outside'
export type ShotReview = { id: number; points: ReviewPoint[]; outcome: ShotOutcome }
export function beginReview(id: number, point: ReviewPoint): ShotReview {
  return { id, points: [{ x: point.x, y: point.y }], outcome: 'flying' }
}
// Only the newest shot may update its review. Older arrows can still score normally.
export function traceReview(review: ShotReview | null, id: number, point: ReviewPoint): ShotReview | null {
  if (!review || review.id !== id || review.outcome !== 'flying' || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return review
  const last = review.points[review.points.length - 1]
  if (Math.hypot(point.x - last.x, point.y - last.y) < 3) return review
  const points = [...review.points, { x: point.x, y: point.y }]
  return { ...review, points: points.length > 160 ? points.filter((_, i) => i % 2 === 0 || i === points.length - 1) : points }
}
export function finishReview(review: ShotReview | null, id: number, outcome: Exclude<ShotOutcome, 'flying'>): ShotReview | null {
  return review?.id === id && review.outcome === 'flying' ? { ...review, outcome } : review
}
export function reviewCopy(outcome: ShotOutcome, ru: boolean): string {
  const en = { flying: 'Watch the arrow’s path.', target: 'Target reached! Choose the next one.', ground: 'It reached the ground. Compare the trail; adjust your aim.', blocked: 'The post stopped it. Aim above the post.', outside: 'It left the range. Compare the trail; adjust your aim.' }
  const russian = { flying: 'Следи за полётом стрелы.', target: 'Попал! Выбери следующую цель.', ground: 'Стрела упала. Сравни след и измени прицел.', blocked: 'Столб остановил стрелу. Целься выше столба.', outside: 'Стрела улетела за поле. Сравни след и измени прицел.' }
  return (ru ? russian : en)[outcome]
}
