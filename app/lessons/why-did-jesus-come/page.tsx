'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { copy } from './content';
import booklet from './booklet.json';
import puzzles from './puzzles.json';
import { crosswordSolved, fresh, messageSolved, serverSnapshot, snapshot, subscribe, update, type Lang, type Progress } from './progress';
import './lesson.css';
const art='/images/lessons/why-did-jesus-come/';
export default function Lesson(){
 const {language,setLanguage}=useLanguage();
 const t=language === 'ru' ? copy.ru : copy.en;
 const p=useSyncExternalStore(subscribe,()=>snapshot(language),serverSnapshot);
 const [resetting,setResetting]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 const go=(step:number)=>{update(language,{step});requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:'start',behavior:'instant'});});};
 return <main className="jesus-lesson" lang={language}>
  <div className="jl-top"><Link href="/">← {t.home}</Link><div><button onClick={()=>setLanguage('en')} aria-pressed={language==='en'}>English</button><button onClick={()=>setLanguage('ru')} aria-pressed={language==='ru'}>Русский</button></div></div>
  <header className="jl-header"><p className="jl-eyebrow">{language==='ru'?'История и пять открытий':'A story and five discoveries'}</p><h1>{t.title}</h1><p>{t.intro}</p></header>
  <nav className="jl-trail" aria-label={language==='ru'?'Шаги истории':'Story steps'}>{t.steps.map((name,i)=><button key={i} onClick={()=>go(i)} aria-current={p.step===i?'step':undefined} title={name}>{i+1}<span className="sr-only"> {name}</span></button>)}</nav>
  <p className="jl-save" role="status">{p.temporary?t.temporary:t.saved}</p>
  <article className="jl-panel"><p className="jl-eyebrow">{t.step} {p.step+1} {t.of} {t.steps.length}</p><h2 ref={heading} tabIndex={-1}>{t.steps[p.step]}</h2>
   <Stage key={`${language}-${p.step}`} lang={language} p={p}/>
   <div className="jl-navigation"><button disabled={p.step===0} onClick={()=>go(p.step-1)}>← {t.back}</button>{p.step<10?<button className="jl-primary" onClick={()=>go(p.step+1)}>{t.next} →</button>:<Link className="jl-link-button" href="/lessons">{t.return} →</Link>}</div>
  </article>
  <details className="jl-adult"><summary>{t.teacher}</summary><p>{t.note}</p><Bible lang={language}/><details><summary>{t.key}</summary><p>{puzzles.differences.map(x=>x[language]).join(' • ')}</p><p>{puzzles.hidden_objects.map(x=>x[language]).join(' • ')}</p><p>{puzzles.crosswords[language].entries.map(e=>`${e.number} ${e.dir==='across'?t.across:t.down}: ${e.word}`).join(' • ')}</p><p>{puzzles.messages[language].answer}</p></details></details>
  <button className="jl-restart" onClick={()=>setResetting(true)}>{t.restart}</button>{resetting&&<div role="group" aria-label={t.confirm} className="jl-reset"><p>{t.confirm}</p><button autoFocus onClick={()=>setResetting(false)}>{t.cancel}</button><button onClick={()=>{update(language,fresh());setResetting(false);go(0);}}>{t.yes}</button></div>}
 </main>;
}
function Paragraphs({text}:{text:string}){return <>{text.split('\n\n').map((v,i)=><p key={i}>{v}</p>)}</>;}
function Quote({lang,index}:{lang:Lang;index:number}){const b=booklet[lang];return <blockquote className="jl-scripture"><p>{b.quotes[index][0]}</p><cite><a href={b.sources[index]} target="_blank" rel="noreferrer">{b.quotes[index][1]} · {lang==='en'?'ESV':'Синодальный (RST)'}</a></cite></blockquote>;}
function Bible({lang}:{lang:Lang}){return <div>{[0,1,2,3].map(i=><Quote key={i} lang={lang} index={i}/>)}</div>;}
function Help({lang,hint}:{lang:Lang;hint:string}){const t=copy[lang];return <div className="jl-help"><details><summary>{t.hint}</summary><p>{hint}</p></details><details><summary>{t.verse}</summary><Bible lang={lang}/></details></div>;}
function Stage({lang,p}:{lang:Lang;p:Progress}){
 const t=copy[lang],b=booklet[lang],step=p.step;
 const storyIndex=({0:0,4:1,6:2,8:3} as Record<number,number>)[step];
 return <>
  {step===0&&<img className="jl-cover" src={`${art}cover.webp`} alt={t.imageAlt} width={1024} height={1024}/>}
  {storyIndex!==undefined&&<Paragraphs text={b.story[storyIndex]}/>}
  <Paragraphs text={t.extra[step]}/>
  {step===2&&<><Quote lang={lang} index={0}/><p className="jl-truth">{b.joy}</p></>}
  {step===4&&<><Quote lang={lang} index={1}/><p className="jl-truth">{b.gospel}</p></>}
  {step===6&&<Quote lang={lang} index={2}/>}
  {step===8&&<><Quote lang={lang} index={3}/><p className="jl-truth">{b.life}</p></>}
  {step===1&&<Picture lang={lang} p={p} hidden={false}/>}
  {step===3&&<Wordsearch lang={lang} p={p}/>}
  {step===5&&<Crossword lang={lang} p={p}/>}
  {step===7&&<Picture lang={lang} p={p} hidden/>}
  {step===9&&<Message lang={lang} p={p}/>}
  {step===10&&<><h3>{t.response}</h3><p className="jl-truth">{b.closing}</p><Quote lang={lang} index={3}/></>}
 </>;
}
function Picture({lang,p,hidden}:{lang:Lang;p:Progress;hidden:boolean}){
 const t=copy[lang],items=hidden?puzzles.hidden_objects:puzzles.differences,found=hidden?p.hidden:p.spots;
 const [feedback,setFeedback]=useState('');const [zoom,setZoom]=useState(false);const [cursor,setCursor]=useState<[number,number]>([512,512]);const [keyboard,setKeyboard]=useState(false);
 const hit=(x:number,y:number)=>{const index=items.findIndex(({bbox:[x1,y1,x2,y2]})=>x>=x1-12&&x<=x2+12&&y>=y1-12&&y<=y2+12);if(index>=0){update(lang,{[hidden?'hidden':'spots']:[...new Set([...found,index])]});setFeedback(items[index][lang]);}else setFeedback(t.retry);};
 return <section className="jl-puzzle" data-puzzle={hidden?'hidden':'differences'}><p>{hidden?t.hidden:t.spot}</p><button onClick={()=>setZoom(!zoom)}>{zoom?t.unzoom:t.zoom}</button><div className={`jl-pictures ${hidden?'jl-single':''} ${zoom?'jl-zoom':''}`}>
 {!hidden&&<figure><figcaption>{t.pictureA}</figcaption><div className="jl-image-scroll"><img src={`${art}difference-a.webp`} width={1024} height={1024} alt={t.imageAlt}/></div></figure>}
 <figure><figcaption>{hidden?t.hidden:t.pictureB}</figcaption><div className="jl-image-scroll"><div className="jl-search-image" tabIndex={0} role="application" aria-label={`${hidden?t.hidden:t.pictureB}. ${t.keyboard}`} onKeyDown={e=>{if(e.key.startsWith('Arrow')){e.preventDefault();setKeyboard(true);const d=e.shiftKey?80:16;setCursor(([x,y])=>[Math.max(0,Math.min(1024,x+(e.key==='ArrowRight'?d:e.key==='ArrowLeft'?-d:0))),Math.max(0,Math.min(1024,y+(e.key==='ArrowDown'?d:e.key==='ArrowUp'?-d:0)))]);}if(e.key==='Enter'||e.key===' '){e.preventDefault();hit(...cursor);}}} onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();hit((e.clientX-rect.left)/rect.width*1024,(e.clientY-rect.top)/rect.height*1024);}}>
 <img src={`${art}${hidden?'coloring':'difference-b'}.webp`} width={1024} height={1024} alt={hidden?t.hiddenAlt:t.imageAlt} draggable={false}/>
 {found.map(i=>{const [x1,y1,x2,y2]=items[i].bbox;return <span key={i} className="jl-found-ring" style={{left:`${x1/10.24}%`,top:`${y1/10.24}%`,width:`${(x2-x1)/10.24}%`,height:`${(y2-y1)/10.24}%`}}>✓</span>;})}
 {keyboard&&<span className="jl-cursor" style={{left:`${cursor[0]/10.24}%`,top:`${cursor[1]/10.24}%`}}/>}
 </div></div></figure></div><p className="jl-small">{t.keyboard}</p><p role="status">{found.length===items.length?t.complete:`${t.found}: ${found.length} / ${items.length}`} {feedback}</p>
 <button onClick={()=>{update(lang,{[hidden?'hidden':'spots']:[]});setFeedback('');}}>{t.reset}</button>
 <details className="jl-help"><summary>{t.hint}</summary><p>{items.find((_,i)=>!found.includes(i))?.[lang]||t.complete}</p></details></section>;
}
function Wordsearch({lang,p}:{lang:Lang;p:Progress}){
 const t=copy[lang],data=puzzles.wordsearch[lang];const [start,setStart]=useState<string|null>(null),[feedback,setFeedback]=useState('');const down=useRef<string|null>(null),moved=useRef(false);
 const choose=(id:string,from=start)=>{if(!from){setStart(id);return;}const i=data.entries.findIndex(e=>{const a=e.cells[0].join('-'),b=e.cells.at(-1)!.join('-');return (a===from&&b===id)||(b===from&&a===id);});if(i>=0){update(lang,{words:[...new Set([...p.words,i])]});setFeedback(data.entries[i].word);}else setFeedback(t.retry);setStart(null);};
 const selected=new Set(p.words.flatMap(i=>data.entries[i].cells.map(c=>c.join('-'))));
 return <section className="jl-puzzle" data-puzzle="wordsearch"><p>{t.wordInstruction}</p><div className="jl-wordlist">{data.entries.map((e,i)=><span key={e.word} className={p.words.includes(i)?'jl-done':''}>{e.word}{p.words.includes(i)?' ✓':''}</span>)}</div>
 <div className="jl-wordgrid" onPointerMove={e=>{if(down.current&&e.buttons)moved.current=true;}} onPointerUp={e=>{if(down.current&&moved.current){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-wcell]');if(target?.dataset.wcell)choose(target.dataset.wcell,down.current);}down.current=null;}}>
 {data.grid.flatMap((row,r)=>[...row].map((ch,c)=>{const id=`${r}-${c}`;return <button key={id} data-wcell={id} aria-label={`${ch}, ${t.cell} ${r+1} / ${c+1}`} aria-pressed={selected.has(id)||start===id} onPointerDown={()=>{down.current=id;moved.current=false;}} onClick={()=>{if(!moved.current)choose(id);moved.current=false;}}>{ch}</button>;}))}</div>
 <p role="status">{p.words.length===5?t.complete:`${t.found}: ${p.words.length} / 5`} {feedback}</p><button onClick={()=>{update(lang,{words:[]});setStart(null);setFeedback('');}}>{t.reset}</button><Help lang={lang} hint={t.wordHint}/></section>;
}
function Crossword({lang,p}:{lang:Lang;p:Progress}){
 const t=copy[lang],data=puzzles.crosswords[lang];const cells:Record<string,{answer:string;number?:number}>={};
 data.entries.forEach(e=>e.cells.forEach((c,i)=>{const k=c.join('-');cells[k]={...cells[k],answer:e.word[i],...(i===0?{number:e.number}:{})};}));
 const done=p.checked&&crosswordSolved(p,lang);
 return <section className="jl-puzzle" data-puzzle="crossword"><p>{t.crossInstruction}</p><div className="jl-cross-layout"><div className="jl-crossgrid" style={{gridTemplateColumns:`repeat(${data.cols}, minmax(0,1fr))`}}>{Array.from({length:data.rows*data.cols},(_,i)=>{const r=Math.floor(i/data.cols),c=i%data.cols,k=`${r}-${c}`,cell=cells[k];return cell?<label className={p.checked&&p.letters[k]!==cell.answer?'jl-wrong':''} key={k}><span>{cell.number}</span><input data-cell={k} aria-label={`${t.cell} ${r+1} / ${c+1}`} value={p.letters[k]||''} maxLength={1} autoComplete="off" autoCapitalize="characters" spellCheck={false} onChange={e=>update(lang,{letters:{...p.letters,[k]:e.target.value.toUpperCase().replace(/[^A-ZА-ЯЁ]/gu,'').slice(-1)},checked:false})} onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const dr=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0,dc=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;let rr=r+dr,cc=c+dc;while(rr>=0&&rr<data.rows&&cc>=0&&cc<data.cols){if(cells[`${rr}-${cc}`]){document.querySelector<HTMLInputElement>(`[data-cell="${rr}-${cc}"]`)?.focus();break;}rr+=dr;cc+=dc;}}}/></label>:<div aria-hidden="true" className="jl-block" key={k}/>;})}</div><div>{(['across','down'] as const).map(dir=><div key={dir}><h3>{dir==='across'?t.across:t.down}</h3>{data.entries.filter(e=>e.dir===dir).map(e=><p className="jl-clue" key={`${e.number}-${dir}`}><strong>{e.number}.</strong> {e.clue} <span>({e.word.length})</span></p>)}</div>)}</div></div><button className="jl-primary" onClick={()=>update(lang,{checked:true})}>{t.check}</button><button onClick={()=>update(lang,{letters:{},checked:false})}>{t.reset}</button><p role="status">{p.checked?(done?t.complete:t.retry):''}</p><Help lang={lang} hint={t.crossHint}/></section>;
}
function Message({lang,p}:{lang:Lang;p:Progress}){
 const t=copy[lang],data=puzzles.messages[lang];return <section className="jl-puzzle" data-puzzle="message"><p>{t.messageInstruction}</p><div className="jl-message">{data.rows.map((row,r)=><div key={r}>{[...row].map((ch,c)=>{const id=`${r}-${c}`;return <button key={id} data-letter={id} aria-pressed={p.crossed.includes(id)} aria-label={`${ch}, ${t.cell} ${r+1} / ${c+1}`} onClick={()=>update(lang,{crossed:p.crossed.includes(id)?p.crossed.filter(v=>v!==id):[...p.crossed,id],messageChecked:false})}>{ch}</button>;})}</div>)}</div><label className="jl-message-input">{t.messageLabel}<input value={p.message} maxLength={80} onChange={e=>update(lang,{message:e.target.value,messageChecked:false})}/></label><button className="jl-primary" onClick={()=>update(lang,{messageChecked:true})}>{t.check}</button><button onClick={()=>update(lang,{message:'',crossed:[],messageChecked:false})}>{t.reset}</button><p role="status">{p.messageChecked?(messageSolved(p,lang)?t.complete:t.retry):''}</p><Help lang={lang} hint={t.messageHint}/></section>;
}
