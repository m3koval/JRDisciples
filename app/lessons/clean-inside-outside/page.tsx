'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useRef,useState} from 'react';
import {useLanguage} from '@/context/LanguageContext';
import booklet from './booklet.json';
import scripture from './scripture.json';
import {ui,type Lang} from './content';
import {useProgress,update,reset,type Progress} from './progress';
import {WordSearch,Picture} from './puzzle-components';
import './lesson.css';
const art='/images/lessons/clean-inside-outside/';
function Prose({text}:{text:string}){return <>{text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((s,i)=>s.startsWith('**')?<strong key={i}>{s.slice(2,-2)}</strong>:s.startsWith('*')?<em key={i}>{s.slice(1,-1)}</em>:s)}</>;}
export default function Lesson(){
 const {language,setLanguage}=useLanguage(),l:Lang=language==='ru'?'ru':'en',t=ui[l],b=booklet[l];const state=useProgress(),w=state[l],patch=(p:Partial<Progress>)=>update(l,p);const [confirm,setConfirm]=useState(false),[plan,setPlan]=useState('');const heading=useRef<HTMLHeadingElement>(null);
 const complete=[w.decoded,w.words.length===12,w.motives.length===3,w.objects.length===4,w.reflected&&w.checked&&w.sequence.join(',')==='1,3,0,2'];
 const go=(step:number)=>{patch({step});requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:'start'});});};
 const slices=[[0,8],[8,13],[13,17]];
 return <main className="oh shiny" lang={l}>
 <div className="oh-top"><Link href="/lessons">← {t.home}</Link><div>{(['en','ru'] as const).map(x=><button data-lang={x} key={x} aria-pressed={l===x} onClick={()=>{setLanguage(x);setPlan('');setConfirm(false);}}>{x==='en'?'English':'Русский'}</button>)}</div></div>
 <header className="oh-hero"><div><p>{t.story} · {l==='en'?'Matthew':'Матфея'} 23:13–36</p><h1>{b.title}</h1><p><Prose text={b.remember}/></p></div><img src={`${art}stand.png`} width={1024} height={768} alt={t.alt}/></header>
 <nav className="oh-trail" aria-label={t.story}>{t.steps.map((x,i)=><button data-step={i} key={x} aria-current={w.step===i?'step':undefined} onClick={()=>go(i)}>{complete[i]?'✓ ':`${i+1}. `}{x}</button>)}</nav>
 <p data-progress aria-live="polite">{complete.filter(Boolean).length} / 5 · {t.complete}</p>{state.temporary&&<p role="status">{t.temporary}</p>}
 <article><h2 ref={heading} tabIndex={-1}>{t.steps[w.step]}</h2><div key={`${l}-${w.step}`}>
 {w.step<3&&<div className="oh-story-layout"><img src={`${art}${w.step===1?'picture-puzzle':'stand'}.png`} width={1024} height={768} alt={t.alt}/><div>{b.story.slice(...slices[w.step] as [number,number]).map((text,i)=><p data-story={slices[w.step][0]+i} key={i}><Prose text={text}/></p>)}</div></div>}
 {w.step===0&&<Discovery l={l} w={w} patch={patch}/>}
 {w.step===1&&<><Verse l={l} n={23}/><Verse l={l} n={24}/><figure><img src={`${art}imagination.png`} width={1024} height={768} alt={t.imagine}/><figcaption>{t.imagine}</figcaption></figure><WordSearch l={l} w={w} patch={patch}/></>}
 {w.step===2&&<>{b.connect.split('\n\n').map((text,i)=><p data-connect={i} key={i}><Prose text={text}/></p>)}<Scenarios l={l} w={w} patch={patch}/></>}
 {w.step===3&&<Picture l={l} w={w} patch={patch}/>}
 {w.step===4&&<><h3>{t.read}</h3>{[29,30,31,32,33,34].map(n=><Verse l={l} n={n} key={n}/>)}<p><Prose text={b.ask}/></p><h3>{t.sequence}</h3><p>{t.sequenceHelp}</p><ol>{w.sequence.map(i=><li key={i}>{t.events[i]}</li>)}</ol><div className="oh-choices">{[0,2,1,3].map(i=><button key={i} data-event={i} disabled={w.sequence.includes(i)} onClick={()=>patch({sequence:[...w.sequence,i],checked:false})}>{t.events[i]}</button>)}</div><button data-undo onClick={()=>patch({sequence:w.sequence.slice(0,-1),checked:false})}>{t.undo}</button><button data-check-sequence onClick={()=>patch({checked:true})}>{t.check}</button><p role="status">{w.checked?(w.sequence.join(',')==='1,3,0,2'?t.success:t.retry):''}</p><h3>{t.reflect}</h3><p>{t.private}</p><label>{t.prompt}<textarea data-plan value={plan} maxLength={500} onChange={e=>setPlan(e.target.value)}/></label><button data-reflect onClick={()=>patch({reflected:true})}>{t.finish}</button>{w.reflected&&<p role="status">{t.finished}</p>}</>}
 </div><div className="oh-navigation"><button disabled={w.step===0} onClick={()=>go(w.step-1)}>← {t.back}</button>{w.step<4&&<button onClick={()=>go(w.step+1)}>{t.next} →</button>}</div></article>
 <details className="oh-adult"><summary>{t.adult}</summary><h2>{t.activity}</h2><p>{t.setup}</p>{b.activity.map((x,i)=><p key={i}><Prose text={x}/></p>)}<p>{t.context}</p><p>{t.edition}</p><details data-passage><summary>{t.passage} · {l==='en'?'Matthew':'Матфея'} 23:13–36 · {l==='en'?'ESV':'RST 167'}</summary>{Object.keys(scripture[l]).map(n=><Verse key={n} l={l} n={Number(n)}/>)}</details><p lang="en">Scripture quotations marked ESV are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.</p></details>
 <section className="oh-downloads"><h2>{t.downloads}</h2><p>{t.printing}</p><p>{t.live}</p>{(['en','ru'] as const).map(lang=><div key={lang}><h3>{lang==='en'?'English':'Русский'}</h3>{['LETTER-LONG-EDGE','A4-LONG-EDGE','READING','TEACHER'].map(size=><a download key={size} href={`/printables/clean-inside-outside/Shiny-Cup-${lang.toUpperCase()}-${size}.pdf`}>{size==='READING'?t.reading:size==='TEACHER'?t.teacher:`${t.print} · ${size.startsWith('A4')?'A4':'Letter'}`} · PDF</a>)}</div>)}</section>
 <p>{t.saved}</p><button data-reset onClick={()=>setConfirm(true)}>{t.reset}</button>{confirm&&<div role="group" aria-label={t.confirm}><p>{t.confirm}</p><button onClick={()=>setConfirm(false)}>{t.cancel}</button><button data-reset-confirm onClick={()=>{reset(l);setPlan('');setConfirm(false);}}>{t.yes}</button></div>}
 </main>;
}
function Verse({l,n}:{l:Lang;n:number}){const v=(scripture[l] as Record<string,{text:string;url:string}>)[String(n)];return <blockquote data-verse={n}><p>{v.text}</p><cite><a href={v.url}>{l==='en'?'Matthew':'Матфея'} 23:{n} · {l==='en'?'ESV':'RST 167'}</a></cite></blockquote>;}
type Props={l:Lang;w:Progress;patch:(p:Partial<Progress>)=>void};
function Discovery({l,w,patch}:Props){const t=ui[l];const [recall,setRecall]=useState(false),[result,setResult]=useState<boolean|null>(null);return <section data-discovery><h3>{t.discover}</h3>{!recall?<><Verse l={l} n={25}/><Verse l={l} n={26}/><p>{t.gloss}</p><button data-recall onClick={()=>setRecall(true)}>{t.recall}</button></>:<><p>{t.question}</p><div className="oh-choices">{t.answers.map((x,i)=><button data-answer={i} key={x} onClick={()=>{setResult(i===1);if(i===1)patch({decoded:true});}}>{x}</button>)}</div><p role="status">{result===null?'':result?t.success:t.retry}</p><button data-study onClick={()=>{setRecall(false);setResult(null);}}>{t.study}</button></>}{w.decoded&&<span> ✓</span>}</section>;}
function Scenarios({l,w,patch}:Props){const t=ui[l],b=booklet[l];const [result,setResult]=useState<string>('');return <section><h3>{t.sortTitle}</h3><p>{t.sortHelp}</p>{[0,1,2].map(i=><section className="oh-scenario" key={i}><p>{b.activity[i+2].split('**')[0].replace(/^\s*- /,'')}</p><div className="oh-choices">{t.virtues.map((v,j)=><button data-virtue={`${i}-${j}`} key={v} aria-pressed={w.matches.includes(i)&&i===j} onClick={()=>{if(i===j){patch({matches:[...new Set([...w.matches,i])]});setResult(t.explain[i]);}else setResult(t.best);}}>{v}</button>)}</div>{w.matches.includes(i)&&<><p>{t.explain[i]}</p><p>{t.repair}</p>{t.repairs[i].map((x,j)=><button data-repair={`${i}-${j}`} key={j} aria-pressed={w.motives.includes(i)&&j===[0,1,0][i]} onClick={()=>{if(j===[0,1,0][i]){patch({motives:[...new Set([...w.motives,i])]});setResult(t.success);}else setResult(t.retry);}}>{x}</button>)}</>}</section>)}<p role="status">{result}</p></section>;}
