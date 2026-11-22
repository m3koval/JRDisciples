import {useSyncExternalStore} from 'react';
export type Progress={step:number;scene:number;panel:number;scenario:number;storyRead:boolean;discoveries:number[];priorities:number[];matches:number[];words:number[];objects:number[];sequence:number[];checked:boolean;motives:number[];decoded:boolean;reflected:boolean};
export const fresh=():Progress=>({step:0,scene:0,panel:0,scenario:0,storyRead:false,discoveries:[],priorities:[],matches:[],words:[],objects:[],sequence:[],checked:false,motives:[],decoded:false,reflected:false});
const ids=(v:unknown,n:number):number[]=>Array.isArray(v)?[...new Set(v.filter((x):x is number=>Number.isInteger(x)&&x>=0&&x<n))]:[];
const bounded=(v:unknown,n:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<n?v:0;
export function normalize(v:unknown):Progress{const p=(v&&typeof v==='object'?v:{}) as Partial<Progress>;return {step:bounded(p.step,5),scene:bounded(p.scene,8),panel:bounded(p.panel,7),scenario:bounded(p.scenario,4),storyRead:p.storyRead===true,discoveries:ids(p.discoveries,7),priorities:ids(p.priorities,6),matches:ids(p.matches,4),words:ids(p.words,12),objects:ids(p.objects,4),sequence:ids(p.sequence,4),checked:p.checked===true,motives:ids(p.motives,4),decoded:p.decoded===true,reflected:p.reflected===true};}
export const key='jd-timmy-web-v1';
type Save={en:Progress;ru:Progress;temporary:boolean};const server:Save={en:fresh(),ru:fresh(),temporary:false};let current=server,loaded=false;const listeners=new Set<()=>void>();
function load(){if(!loaded){loaded=true;try{const v=JSON.parse(localStorage.getItem(key)||'{}');current={en:normalize(v?.en),ru:normalize(v?.ru),temporary:false};}catch{current={en:fresh(),ru:fresh(),temporary:true};}}return current;}
function subscribe(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn);};}
function save(){try{localStorage.setItem(key,JSON.stringify({en:current.en,ru:current.ru}));current={...current,temporary:false};}catch{current={...current,temporary:true};}listeners.forEach(fn=>fn());}
export function update(l:'en'|'ru',patch:Partial<Progress>){const state=load();current={...state,[l]:normalize({...state[l],...patch})};save();}
export function reset(l:'en'|'ru'){current={...load(),[l]:fresh()};save();}
export function useProgress(){return useSyncExternalStore(subscribe,load,()=>server);}
