// Pure fixed-step simulation. All distances are course units, all times seconds.
export const STEP = 1 / 120
export const COURSE_LENGTH = 840
export const GOAL = 6
export const STAGES = 4
export type Status = 'ready' | 'running' | 'paused' | 'checkpoint' | 'lost' | 'won'
export type CourseItem = { id: number; x: number; at: number; kind: 'light' | 'rock' }
export type Input = { axis: number; target?: number }
export type Run = {
  status: Status; stage: number; x: number; distance: number; collected: number;
  lives: number; score: number; bank: number; resolved: number[]; remainder: number;
  grace: number; feedback: 'light' | 'rock' | ''; feedbackTime: number;
}
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
// Authored routes: gradual introductions, then alternating turns. Every row has an open lane.
const ROUTES = [[1,1,0,0,1,2,2,1,0,1], [1,2,1,0,1,2,1,0,0,1], [0,1,2,1,0,1,2,2,1,0], [1,0,1,2,1,0,1,2,1,1]]
const COURSES: CourseItem[][] = ROUTES.map((lanes, stage) => lanes.flatMap((lane, row) => {
  const at = 130 + row * 65
  const light: CourseItem = { id: row * 2, x: [24,50,76][lane], at, kind: 'light' }
  if (row < 2 && stage === 0) return [light]
  const rock: CourseItem = { id: row * 2 + 1, x: [24,50,76][(lane + 1 + row % 2) % 3], at, kind: 'rock' }
  return [light, rock]
}))
export function course(stage: number): readonly CourseItem[] { return COURSES[clamp(stage, 0, STAGES - 1)] }
export function createRun(): Run {
  return { status:'ready', stage:0, x:50, distance:0, collected:0, lives:3, score:0, bank:0, resolved:[], remainder:0, grace:0, feedback:'', feedbackTime:0 }
}
export function beginStage(run: Run): Run {
  const next = run.status === 'checkpoint'
  if (next && run.stage >= STAGES - 1) return run
  return { ...createRun(), status:'running', stage:next ? run.stage + 1 : run.stage, score:next ? run.score : run.bank, bank:next ? run.score : run.bank }
}
export function pause(run: Run): Run { return run.status === 'running' ? { ...run, status:'paused', remainder:0 } : run }
export function resume(run: Run): Run { return run.status === 'paused' ? { ...run, status:'running', remainder:0 } : run }
export function advance(run: Run, input: Input, elapsed: number): Run {
  if(run.status !== 'running' || !Number.isFinite(elapsed) || elapsed <= 0) return run
  const s = { ...run, resolved:[...run.resolved], remainder:run.remainder + Math.min(elapsed, 0.1) }
  while(s.remainder + 1e-9 >= STEP && s.status === 'running') {
    s.remainder = Math.max(0, s.remainder - STEP)
    const delta = input.target !== undefined && Number.isFinite(input.target) ? clamp(input.target,18,82) - s.x : clamp(input.axis || 0,-1,1) * 100
    s.x = clamp(s.x + clamp(delta, -86 * STEP, 86 * STEP),18,82)
    const before = s.distance
    s.distance = Math.min(COURSE_LENGTH, s.distance + (36 + s.stage * 3) * STEP)
    s.grace = Math.max(0, s.grace - STEP)
    s.feedbackTime = Math.max(0, s.feedbackTime - STEP)
    if(!s.feedbackTime) s.feedback = ''
    for(const item of course(s.stage)) {
      if(s.resolved.includes(item.id) || item.at < before || item.at > s.distance) continue
      s.resolved.push(item.id)
      if(Math.abs(item.x - s.x) > 10) continue
      if(item.kind === 'light') { s.collected++; s.score += 10; s.feedback = 'light'; s.feedbackTime = 0.8 }
      else if(s.grace === 0) { s.lives--; s.grace = 1; s.feedback = 'rock'; s.feedbackTime = 1.2 }
    }
    if(s.lives <= 0) s.status = 'lost'
    else if(s.distance >= COURSE_LENGTH) s.status = s.collected >= GOAL ? (s.stage === STAGES-1 ? 'won' : 'checkpoint') : 'lost'
  }
  if(s.status !== 'running') s.remainder = 0
  return s
}
type Store = Pick<Storage, 'getItem' | 'setItem'>
function parseBest(raw: string | null): number { const n = Number(raw); return Number.isSafeInteger(n) && n >= 0 ? n : 0 }
export function safeBest(store: Pick<Store,'getItem'>): {value:number; available:boolean} {
  try { return {value:parseBest(store.getItem('truth-runner-best')),available:true} } catch { return {value:0,available:false} }
}
export function saveBest(store: Store, inMemory: number, score: number): {value:number;available:boolean} {
  let value = Math.max(inMemory,score)
  try { value = Math.max(value,parseBest(store.getItem('truth-runner-best'))); store.setItem('truth-runner-best',String(value)); return {value,available:true} }
  catch { return {value,available:false} }
}
