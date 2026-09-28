export type Progress = {
  scene: number
  phase: 'see' | 'do' | 'feedback' | 'learn'
  order: number[]
  context: boolean
  matched: number[]
  claims: number[]
  attempts: Record<string, boolean>
  plan: number | null
  completed: boolean
}
export const initial: Progress = {scene:0, phase:'see', order:[], context:false, matched:[], claims:[], attempts:{}, plan:null, completed:false}
export function solved(p: Progress): boolean {
  return p.scene === 1 ? p.context : p.scene === 2 ? p.order.length === 3 && p.order.every((v,i)=>v===i) : p.scene === 3 ? p.matched.length===3 : p.scene===4 ? p.claims.length===3 : false
}
export function parseProgress(raw: string): Progress {
  try {
    const p = JSON.parse(raw)
    if (!p || !Number.isInteger(p.scene) || p.scene<0 || p.scene>5) return initial
    const ids = (v: unknown): number[] => Array.isArray(v) ? [...new Set(v.filter((x): x is number => Number.isInteger(x) && x>=0 && x<3))] : []
    const attempts: Record<string,boolean> = {}
    if (p.attempts && typeof p.attempts==='object') for (const [k,v] of Object.entries(p.attempts)) if (/^(context|order|fruit-[0-2]|claim-[0-2])$/.test(k) && typeof v==='boolean') attempts[k]=v
    const n: Progress = {scene:p.scene, phase:['see','do','feedback','learn'].includes(p.phase)?p.phase:'see', order:ids(p.order), context:p.context===true, matched:ids(p.matched), claims:ids(p.claims), attempts, plan:Number.isInteger(p.plan) && p.plan>=0 && p.plan<3?p.plan:null, completed:p.completed===true && p.scene===5 && Number.isInteger(p.plan) && p.plan>=0 && p.plan<3}
    if (n.scene>=1 && n.scene<=4) {
      if (!solved(n) && (n.phase==='feedback' || n.phase==='learn')) n.phase='do'
      if (solved(n) && n.phase==='do' && n.scene!==2) n.phase='feedback'
    }
    return n
  } catch { return initial }
}
export function applyAnswer(p: Progress, key:string, correct:boolean, patch:Partial<Progress>={}):Progress {
  const next = {...p,...patch,attempts:{...p.attempts,[key]:p.attempts[key] ?? correct}}
  return {...next,phase:correct && solved(next)?'feedback':'do'}
}
