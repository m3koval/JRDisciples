import { SCENES, type Difference } from './scenes'
export type Phase = 'story' | 'play' | 'reward' | 'done'
export interface State { version: 2; scene: number; found: number[]; phase: Phase }
export const initialState = (): State => ({ version: 2, scene: 0, found: [], phase: 'story' })
export const SAVE_KEY = 'jd-spot-objects-v2'
export type Action = { type: 'start' | 'next' | 'reset' } | { type: 'find'; id: number } | { type: 'restore'; value: unknown }
export function restore(value: unknown): State {
  if (!value || typeof value !== 'object') return initialState()
  const raw = value as Partial<State>
  if (raw.version !== 2 || !Number.isInteger(raw.scene) || raw.scene! < 0 || raw.scene! >= SCENES.length) return initialState()
  const scene = raw.scene!
  const ids = SCENES[scene].differences.map(d => d.id)
  const found = Array.isArray(raw.found) ? [...new Set(raw.found.filter(id => ids.includes(id)))] : []
  let phase: Phase = raw.phase === 'story' ? 'story' : 'play'
  if (found.length === ids.length) phase = raw.phase === 'done' && scene === SCENES.length - 1 ? 'done' : 'reward'
  return { version: 2, scene, found, phase }
}
export function reducer(state: State, action: Action): State {
  if (action.type === 'restore') return restore(action.value)
  if (action.type === 'reset') return initialState()
  if (action.type === 'start') return state.phase === 'story' ? { ...state, phase: 'play' } : state
  if (action.type === 'find') {
    if (state.phase !== 'play' || state.found.includes(action.id) || !SCENES[state.scene].differences.some(d => d.id === action.id)) return state
    const found = [...state.found, action.id]
    return { ...state, found, phase: found.length === SCENES[state.scene].differences.length ? 'reward' : 'play' }
  }
  if (action.type === 'next' && state.phase === 'reward') {
    return state.scene === SCENES.length - 1 ? { ...state, phase: 'done' } : { version: 2, scene: state.scene + 1, found: [], phase: 'story' }
  }
  return state
}
const masks = new Map<string, Uint8Array>()
// The bitmap comes from the exact pixels edited in the authored picture, not guessed circles.
export function hitsObject(difference: Difference, x: number, y: number, tolerance = 12): boolean {
  if (![x, y, tolerance].every(Number.isFinite) || x < 0 || y < 0 || x >= 768 || y >= 1024) return false
  let mask = masks.get(difference.hitMask)
  if (!mask) { mask = Uint8Array.from(atob(difference.hitMask), c => c.charCodeAt(0)); masks.set(difference.hitMask, mask) }
  const radius = Math.max(0, Math.min(4, Math.ceil(tolerance / 8)))
  const cx = Math.floor(x / 8), cy = Math.floor(y / 8)
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
    if (dx * dx + dy * dy > radius * radius) continue
    const xx = cx + dx, yy = cy + dy
    if (xx < 0 || xx >= 96 || yy < 0 || yy >= 128) continue
    const index = yy * 96 + xx
    if (mask[index >> 3] & (1 << (7 - (index & 7)))) return true
  }
  return false
}
export function findAt(state: State, x: number, y: number): number | null {
  return SCENES[state.scene].differences.find(d => !state.found.includes(d.id) && hitsObject(d, x, y))?.id ?? null
}
