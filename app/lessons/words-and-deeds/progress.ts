import {useSyncExternalStore} from 'react';
export type Progress={step:number;counts:string[];countChecked:boolean;clues:number[];motives:number[];objects:number[];sequence:number[];sequenceChecked:boolean;reflected:boolean};
export const fresh=():Progress=>({step:0,counts:Array(9).fill(''),countChecked:false,clues:[],motives:[],objects:[],sequence:[],sequenceChecked:false,reflected:false});
const ids=(v:unknown,n:number)=>Array.isArray(v)?[...new Set(v.filter(x=>Number.isInteger(x)&&x>=0&&x<n))]:[];
export function normalize(v:unknown):Progress{
 const p=(v&&typeof v==='object'?v:{}) as Partial<Progress>;
 return {step:Number.isInteger(p.step)&&p.step!>=0&&p.step!<5?p.step!:0,counts:Array.from({length:9},(_,i)=>typeof p.counts?.[i]==='string'&&/^\d{0,2}$/.test(p.counts[i])?p.counts[i]:''),countChecked:p.countChecked===true,clues:ids(p.clues,3),motives:ids(p.motives,4),objects:ids(p.objects,6),sequence:ids(p.sequence,4),sequenceChecked:p.sequenceChecked===true,reflected:p.reflected===true};
}
export const key='jd-words-and-deeds-v1';
type Save={en:Progress;ru:Progress};
const server:Save={en:fresh(),ru:fresh()};let current:Save=server;let loaded=false;
const listeners=new Set<()=>void>();
function load(){if(!loaded){loaded=true;try{const v=JSON.parse(localStorage.getItem(key)||'{}');current={en:normalize(v.en),ru:normalize(v.ru)};}catch{current={en:fresh(),ru:fresh()};}}return current;}
function subscribe(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn);};}
export function update(lang:'en'|'ru',patch:Partial<Progress>){current={...load(),[lang]:normalize({...current[lang],...patch})};save();}
function save(){try{localStorage.setItem(key,JSON.stringify(current));}catch{/* Keep the in-memory state when storage is blocked or full. */}listeners.forEach(fn=>fn());}
export function reset(){current={en:fresh(),ru:fresh()};loaded=true;save();}
export function useProgress(){return useSyncExternalStore(subscribe,load,()=>server);}
