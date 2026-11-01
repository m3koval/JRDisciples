import puzzles from './puzzles.json';
export type Lang = 'en' | 'ru';
export type Progress = { step: number; spots: number[]; hidden: number[]; words: number[]; letters: Record<string,string>; crossed: string[]; message: string; checked: boolean; messageChecked: boolean; temporary: boolean };
export const fresh = (): Progress => ({step:0,spots:[],hidden:[],words:[],letters:{},crossed:[],message:'',checked:false,messageChecked:false,temporary:false});
const cache: Partial<Record<Lang, Progress>> = {};
const server = fresh();
export const storageKey = (lang: Lang) => `jd-why-jesus-came-v1-${lang}`;
export function normalize(raw: unknown, lang: Lang): Progress {
 const p = fresh();
 if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return p;
 const s = raw as Record<string,unknown>;
 if (Number.isInteger(s.step) && Number(s.step)>=0 && Number(s.step)<=10) p.step=Number(s.step);
 for (const [key,max] of [['spots',5],['hidden',4],['words',5]] as const) if (Array.isArray(s[key])) p[key]=[...new Set(s[key].filter((v:unknown):v is number => Number.isInteger(v) && Number(v)>=0 && Number(v)<max))];
 const cells = new Set(puzzles.crosswords[lang].entries.flatMap(e=>e.cells.map(c=>c.join('-'))));
 if(s.letters && typeof s.letters==='object' && !Array.isArray(s.letters)) for(const [k,v] of Object.entries(s.letters)) if(cells.has(k)&&typeof v==='string'&&/^[A-ZА-ЯЁ]$/u.test(v)) p.letters[k]=v;
 const crossIds = new Set(puzzles.messages[lang].rows.flatMap((row,r)=>[...row].map((_,c)=>`${r}-${c}`)));
 if(Array.isArray(s.crossed)) p.crossed=[...new Set(s.crossed.filter((v:unknown):v is string=>typeof v==='string'&&crossIds.has(v)))];
 if(typeof s.message==='string') p.message=s.message.slice(0,80);
 p.checked=s.checked===true;p.messageChecked=s.messageChecked===true;
 return p;
}
export const crosswordSolved=(p:Progress,l:Lang)=>puzzles.crosswords[l].entries.every(e=>e.cells.every((c,i)=>p.letters[c.join('-')]===e.word[i]));
export const messageSolved=(p:Progress,l:Lang)=>p.message.trim().replace(/\s+/g,' ').toUpperCase()===puzzles.messages[l].answer && puzzles.messages[l].rows.every((row,r)=>[...row].every((ch,c)=>p.crossed.includes(`${r}-${c}`)===puzzles.messages[l].filler.includes(ch)));
export function snapshot(lang:Lang){
 if(!cache[lang]) {try{cache[lang]=normalize(JSON.parse(localStorage.getItem(storageKey(lang))||'null'),lang);}catch{cache[lang]=fresh();}}
 return cache[lang]!;
}
export const serverSnapshot=()=>server;
export const subscribe=(cb:()=>void)=>{window.addEventListener('jd-jesus-progress',cb);return()=>window.removeEventListener('jd-jesus-progress',cb);};
export function update(lang:Lang,change:Partial<Progress>){
 const p={...snapshot(lang),...change}; cache[lang]=p;
 try{localStorage.setItem(storageKey(lang),JSON.stringify(p));}catch{cache[lang]={...p,temporary:true};}
 window.dispatchEvent(new Event('jd-jesus-progress'));
}
