export type CourseState = { obstacles: number[]; resolve: number; fear: number; health: number; coins: number; strength: number }
export type CourseAction = { type: 'advance'; index: number } | { type: 'rally' }
export function nextObstacle(obstacles: number[]) { return obstacles.findIndex(value => value > 0) }
export function courseTurn(state: CourseState, action: CourseAction, level: number, helpers: number): CourseState {
  if (state.health <= 0 || nextObstacle(state.obstacles) < 0) return state
  if (action.type === 'rally') {
    return { ...state, resolve: Math.min(3, state.resolve + 1), fear: Math.max(0, state.fear - 8 - helpers * 3) }
  }
  if (action.index !== nextObstacle(state.obstacles) || state.resolve < 1) return state
  const obstacles = [...state.obstacles]
  obstacles[action.index] = Math.max(0, obstacles[action.index] - (state.strength > 0 ? 2 : 1))
  const pressure = state.fear + 18 + Math.min(9, Math.max(0, level)) * 2
  return {
    obstacles, resolve: state.resolve - 1,
    fear: pressure >= 100 ? 38 : pressure,
    health: Math.max(0, state.health - (pressure >= 100 ? 1 : 0)),
    coins: state.coins + (obstacles[action.index] === 0 ? 1 : 0),
    strength: Math.max(0, state.strength - 1),
  }
}
export function answerOrder(level: number): number[] {
  return [0, 1, 2].map(index => (index + level + 1) % 3)
}
