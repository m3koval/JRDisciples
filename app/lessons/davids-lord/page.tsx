'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useRef,useState} from 'react';
import {useLanguage} from '@/context/LanguageContext';
import booklet from './booklet.json';
import puzzles from './puzzles.json';
import scripture from './scripture.json';
import luke from './luke.json';
import teacher from './teacher.json';
import {ui,type Lang} from './ui';
import './lesson.css';
type Stroke={color:string;width:number;points:[number,number][]};
type Work={step:number;flowers:Stroke[];colors:Stroke[];drawn:boolean;objects:number[];words:number[];pairs:number[];letters:Record<string,string>;decoded:boolean;reflection:string;finished:boolean};
const fresh=():Work=>({step:0,flowers:[],colors:[],drawn:false,objects:[],words:[],pairs:[],letters:{},decoded:false,reflection:'',finished:false});
const art='/images/lessons/davids-lord/';
export default function Lesson(){
 const {language,setLanguage}=useLanguage();const l=language === 'ru' ? 'ru' : 'en',t=ui[l],b=booklet[l];
 const [works,setWorks]=useState<Record<Lang,Work>>({en:fresh(),ru:fresh()}),[confirm,setConfirm]=useState(false);
 const w=works[l],heading=useRef<HTMLHeadingElement>(null),patch=(v:Partial<Work>)=>setWorks(prev=>({...prev,[l]:{...prev[l],...v}}));
 const complete=[w.drawn,w.words.length===12,w.objects.length===4&&w.colors.length>0,w.decoded];
 const go=(step:number)=>{patch({step});requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:'start'});});};
 return <main className="dl" lang={l}><div className="dl-top"><Link href="/lessons">← {t.home}</Link><div>{(['en','ru'] as const).map(x=><button key={x} aria-pressed={l===x} onClick={()=>setLanguage(x)}>{x==='en'?'English':'Русский'}</button>)}</div></div>
 <header><p className="dl-eyebrow">{b.version}</p><h1>{t.title}</h1><p>{t.intro}</p></header>
 <nav className="dl-trail" aria-label={t.step}>{b.activities.map((a,i)=><button key={a} data-step={i} aria-current={w.step===i?'step':undefined} onClick={()=>go(i)}>{a}<span>{complete[i]?' ✓':''}</span></button>)}</nav>
 <p className="dl-session">{t.session}</p>
 <article><h2 ref={heading} tabIndex={-1}>{b.titles[w.step]}</h2><Rich text={b.story[w.step]}/>
 {w.step<2&&<blockquote><p>{w.step===0?scripture[l].chunks[0]:scripture[l].chunks.slice(1).join(' ')}</p><cite><a href={scripture[l].url}>{l==='en'?'Matthew':'Матфея'} {w.step===0?'22:41–42':'22:43–46'} · {l==='en'?'ESV':'Синодальный перевод'}</a></cite></blockquote>}
 {w.step===2&&<blockquote><p>{luke[l].text}</p><cite><a href={luke[l].url}>{luke[l].ref}</a></cite></blockquote>}
 {b.teaching[w.step]&&<div className="dl-truth"><Rich text={b.teaching[w.step]}/></div>}
 <h3>{b.activities[w.step]}</h3><p>{b.instructions[w.step]}</p>
 <div key={`${l}-${w.step}`}>
 {w.step===0&&<Picture l={l} w={w} patch={patch} drawing/>}
 {w.step===1&&<Wordsearch l={l} w={w} patch={patch}/>}
 {w.step===2&&<Picture l={l} w={w} patch={patch}/>}
 {w.step===3&&<Decoder l={l} w={w} patch={patch}/>}
 </div>
 {w.step===3&&<section className="dl-response"><label>{b.response}<textarea value={w.reflection} onChange={e=>patch({reflection:e.target.value})} maxLength={1000}/></label><small>{t.response}</small><p>{t.apply}</p><strong>{b.prayer}</strong></section>}
 <p className="dl-progress" aria-live="polite">{complete.filter(Boolean).length} / 4 · {t.completed}</p>
 <div className="dl-navigation"><button disabled={w.step===0} onClick={()=>go(w.step-1)}>← {t.back}</button>{w.step<3?<button className="dl-primary" onClick={()=>go(w.step+1)}>{t.next} →</button>:<button className="dl-primary" disabled={!complete.every(Boolean)} onClick={()=>patch({finished:true})}>{t.finish}</button>}</div>
 {w.step===3&&!complete.every(Boolean)&&<p>{t.remaining}</p>}
 {w.finished&&complete.every(Boolean)&&<section className="dl-finished" role="status"><h3>{t.finished}</h3><p>{b.prayer}</p><Link href="/lessons">{t.home} →</Link></section>}
 </article>
 <section className="dl-downloads"><h2>{t.downloads}</h2><a href={`/printables/davids-lord/Davids-Lord-${l.toUpperCase()}-READING-ORDER.pdf`} download>{t.read} · PDF</a>{['A4','LETTER'].map(size=><a key={size} href={`/printables/davids-lord/Davids-Lord-${l.toUpperCase()}-${size}-LONG-EDGE.pdf`} download>{size} · {t.print}</a>)}</section>
 <details className="dl-adult"><summary>{t.teacher}</summary>{teacher[l].map((text,i)=><p key={i}>{text}</p>)}<a href="/printables/davids-lord/Davids-Lord-BILINGUAL-TEACHER-KEY.pdf" download>{t.key} · PDF</a></details>
 <button onClick={()=>setConfirm(true)}>{t.restart}</button>{confirm&&<div className="dl-confirm" role="group" aria-label={t.confirm}><p>{t.confirm}</p><button onClick={()=>setConfirm(false)}>{t.cancel}</button><button onClick={()=>{setWorks(prev=>({...prev,[l]:fresh()}));setConfirm(false);}}>{t.yes}</button></div>}
 </main>;
}
function Rich({text}:{text:string}){return <div className="dl-story">{text.split('\n').map((line,i)=><p key={i}>{line.split(/(\*\*.*?\*\*)/g).map((s,j)=>s.startsWith('**')?<mark key={j}><strong>{s.slice(2,-2)}</strong></mark>:s)}</p>)}</div>;}
type Props={l:Lang;w:Work;patch:(v:Partial<Work>)=>void};
function Picture({l,w,patch,drawing=false}:Props&{drawing?:boolean}){
 const pictureScroll=useRef<HTMLDivElement>(null);const t=ui[l],h=drawing?595:768,strokes=drawing?w.flowers:w.colors;
 const [mode,setMode]=useState(drawing?'draw':'search'),[color,setColor]=useState('#d22e43'),[width,setWidth]=useState(12),[zoom,setZoom]=useState(false),[feedback,setFeedback]=useState(''),[cursor,setCursor]=useState<[number,number]>([512,384]),[keyboard,setKeyboard]=useState(false),[draft,setDraft]=useState<Stroke|null>(null);
 const live=useRef<Stroke|null>(null);const setStrokes=(value:Stroke[])=>patch(drawing?{flowers:value,drawn:false}:{colors:value});
 const point=(e:React.PointerEvent<SVGSVGElement>):[number,number]=>{const r=e.currentTarget.getBoundingClientRect();return [(e.clientX-r.left)/r.width*1024,(e.clientY-r.top)/r.height*h];};
 const hit=(x:number,y:number)=>{const i=puzzles.odd_objects.findIndex(({box:[x1,y1,x2,y2]})=>x>=x1&&x<=x2&&y>=y1&&y<=y2);if(i<0){setFeedback(t.retry);return;}patch({objects:[...new Set([...w.objects,i])]});setFeedback(puzzles.odd_objects[i][l]);};
 const finish=()=>{if(live.current){setStrokes([...strokes,live.current]);live.current=null;setDraft(null);}};
 const flower=()=>{const x=440+(strokes.length%4)*65,y=410+(Math.floor(strokes.length/4)%2)*32;const pts:[number,number][]=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,r=12+6*Math.cos(a*5);pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}setStrokes([...strokes,{color,width:3,points:pts},{color:'#178250',width:3,points:[[x,y+12],[x,y+37],[x-10,y+25]]}]);};
 return <section className="dl-puzzle" data-puzzle={drawing?'drawing':'picture'}>
 <div className="dl-tools">{!drawing&&<><button aria-pressed={mode==='search'} onClick={()=>setMode('search')}>{t.search}</button><button aria-pressed={mode==='draw'} onClick={()=>setMode('draw')}>{t.draw}</button></>}<button onClick={()=>setZoom(!zoom)}>{zoom?t.small:t.zoom}</button></div>
 {mode==='draw'&&<div className="dl-tools"><div role="group" aria-label={t.color}>{['#d22e43','#c48a10','#178250','#276bb5','#7e45aa','#e67ca4'].map((c,i)=><button key={c} className="dl-swatch" aria-label={t.colorNames[i]} title={t.colorNames[i]} aria-pressed={c===color} onClick={()=>setColor(c)} style={{background:c}}>{c===color?'✓':''}</button>)}</div><label>{t.size}<input type="range" min={2} max={30} value={width} onChange={e=>setWidth(Number(e.target.value))}/></label><button disabled={!strokes.length} onClick={()=>setStrokes(strokes.slice(0,-1))}>{t.undo}</button>{drawing&&<button onClick={flower}>{t.flower}</button>}</div>}
 {zoom&&<div><button aria-label={t.gridLeft} onClick={()=>pictureScroll.current?.scrollBy({left:-220})}>←</button><button aria-label={t.gridRight} onClick={()=>pictureScroll.current?.scrollBy({left:220})}>→</button></div>}<div className="dl-image-scroll" ref={pictureScroll}><div className={`dl-picture ${zoom?'dl-enlarged':''}`} style={{aspectRatio:`1024/${h}`}}>
 <img src={`${art}${drawing?'complete-scene':'odd-scene'}.webp`} width={1024} height={h} alt={t.artAlt} draggable={false}/>
 <svg data-artboard viewBox={`0 0 1024 ${h}`} tabIndex={0} role="application" aria-label={mode==='search'?t.keyboard:t.draw} onPointerDown={e=>{if(mode==='search'){hit(...point(e));return;}e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);const p=point(e);live.current={color,width,points:[p,[p[0]+.1,p[1]+.1]]};setDraft(live.current);}} onPointerMove={e=>{if(live.current){live.current={...live.current,points:[...live.current.points,point(e)]};setDraft(live.current);}}} onPointerUp={finish} onPointerCancel={finish} onKeyDown={e=>{if(e.key.startsWith('Arrow')){e.preventDefault();setKeyboard(true);const d=e.shiftKey?80:16;setCursor(([x,y])=>[Math.max(0,Math.min(1024,x+(e.key==='ArrowRight'?d:e.key==='ArrowLeft'?-d:0))),Math.max(0,Math.min(h,y+(e.key==='ArrowDown'?d:e.key==='ArrowUp'?-d:0)))]);}if(e.key==='Enter'||e.key===' '){e.preventDefault();if(mode==='search')hit(...cursor);else setStrokes([...strokes,{color,width,points:[cursor,[cursor[0]+.1,cursor[1]+.1]]}]);}}}>
 <defs><clipPath id="dl-paper"><polygon points="327,373 669,356 771,458 376,500"/></clipPath></defs>
 <g className="dl-ink" clipPath={drawing?'url(#dl-paper)':undefined}>{[...strokes,...(draft?[draft]:[])].map((s,i)=><polyline key={i} points={s.points.map(p=>p.join(',')).join(' ')} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round"/>)}</g>
 {!drawing&&w.objects.map(i=>{const [x1,y1,x2,y2]=puzzles.odd_objects[i].box;return <ellipse data-ring key={i} cx={(x1+x2)/2} cy={(y1+y2)/2} rx={(x2-x1)/2} ry={(y2-y1)/2} fill="none" stroke="#a51d25" strokeWidth={6}/>;})}
 {keyboard&&<g stroke="#0c5974" strokeWidth={3}><circle cx={cursor[0]} cy={cursor[1]} r={13} fill="white" fillOpacity={.7}/><path d={`M ${cursor[0]-20} ${cursor[1]} h40 M ${cursor[0]} ${cursor[1]-20} v40`}/></g>}
 </svg></div></div><small>{booklet[l].caption}</small>
 {!drawing&&<p className="dl-small">{t.keyboard}</p>}
 <p role="status">{drawing?(w.drawn?t.complete:''):`${t.found}: ${w.objects.length} / 4${w.objects.length===4&&w.colors.length?' · '+t.complete:''}`} {feedback}</p>
 {drawing&&<button className="dl-primary" disabled={!strokes.length} onClick={()=>patch({drawn:true})}>{t.doneDrawing}</button>}
 <button onClick={()=>{setStrokes([]);patch(drawing?{drawn:false}:{objects:[]});setFeedback('');}}>{t.reset}</button>
 <details><summary>{t.hint}</summary><p>{drawing?t.drawHint:t.colorHint}</p></details>
 {!drawing&&<details><summary>{t.answers}</summary>{puzzles.odd_objects.map((x,i)=><p key={i}>{x[l]}</p>)}</details>}
 </section>;
}
function Wordsearch({l,w,patch}:Props){
 const gridScroll=useRef<HTMLDivElement>(null);const t=ui[l],data=puzzles.word_searches[l];const [start,setStart]=useState<string|null>(null),[feedback,setFeedback]=useState('');const down=useRef<string|null>(null),moved=useRef(false),origin=useRef<[number,number]>([0,0]);
 const choose=(id:string,from=start)=>{if(!from){setStart(id);return;}const i=data.entries.findIndex(e=>{const a=e.start.join('-'),b=e.end.join('-');return a===from&&b===id||b===from&&a===id;});if(i>=0){patch({words:[...new Set([...w.words,i])]});setFeedback(data.entries[i].word);}else setFeedback(t.retry);setStart(null);};
 const beginSelection=(e:React.PointerEvent<HTMLButtonElement>)=>{down.current=e.currentTarget.dataset.cell!;moved.current=false;origin.current=[e.clientX,e.clientY];if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 const selected=new Set(w.words.flatMap(i=>{const e=data.entries[i];return [...e.word].map((_,j)=>`${e.start[0]+j*e.direction[0]}-${e.start[1]+j*e.direction[1]}`);}));
 return <section className="dl-puzzle" data-puzzle="words"><p>{t.wordHelp}</p><div className="dl-wordlist">{data.entries.map((e,i)=><span key={e.word} className={w.words.includes(i)?'dl-done':''}>{e.word}{w.words.includes(i)?' ✓':''}</span>)}</div><div className="dl-grid-controls"><button onClick={()=>gridScroll.current?.scrollBy({left:-180})}>← {t.gridLeft}</button><button onClick={()=>gridScroll.current?.scrollBy({left:180})}>{t.gridRight} →</button></div><div className="dl-grid-scroll" ref={gridScroll}><div className="dl-wordgrid" onPointerMove={e=>{if(down.current&&Math.hypot(e.clientX-origin.current[0],e.clientY-origin.current[1])>8)moved.current=true;}} onPointerUp={e=>{if(down.current){if(moved.current){const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-cell]');if(cell?.dataset.cell)choose(cell.dataset.cell,down.current);}else choose(down.current);}down.current=null;}} onPointerCancel={()=>{down.current=null;setStart(null);}}>
 {data.grid.flatMap((row,r)=>[...row].map((ch,c)=>{const id=`${r}-${c}`;return <button key={id} data-cell={id} aria-label={`${ch}, ${t.cell} ${r+1}, ${c+1}`} aria-pressed={selected.has(id)||start===id} onPointerDown={beginSelection} onClick={e=>{if(e.detail===0)choose(id);}} onKeyDown={e=>{const d:Record<string,number[]>={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};if(d[e.key]){e.preventDefault();const [dr,dc]=d[e.key];document.querySelector<HTMLButtonElement>(`[data-cell="${Math.max(0,Math.min(14,r+dr))}-${Math.max(0,Math.min(14,c+dc))}"]`)?.focus();}if(e.key==='Escape')setStart(null);}}>{ch}</button>;}))}</div></div>
 <p role="status">{t.found}: {w.words.length} / 12 {w.words.length===12?t.complete:''} {feedback}</p><button onClick={()=>{patch({words:[]});setStart(null);setFeedback('');}}>{t.reset}</button><details><summary>{t.hint}</summary><p>{t.wordHint}</p></details><details><summary>{t.answers}</summary>{data.entries.map(e=><p key={e.word}>{e.word}: {e.start.map(n=>n+1).join(', ')} → {e.end.map(n=>n+1).join(', ')}</p>)}</details></section>;
}
function Decoder({l,w,patch}:Props){
 const t=ui[l],d=puzzles.messages[l];const [number,setNumber]=useState<number|null>(null),[feedback,setFeedback]=useState('');
 const match=(letter:string)=>{if(number===null){setFeedback(t.choose);return;}if(d.alphabet[number-1]!==letter){setFeedback(t.retry);return;}patch({pairs:[...new Set([...w.pairs,number])]});setFeedback(`${number} → ${letter} ✓`);setNumber(null);};
 const total=d.groups.reduce((n,g)=>n+g.numbers.length,0);
 const check=()=>{const ok=w.pairs.length===total&&d.sequence.every((word,r)=>word.every((n,c)=>w.letters[`${r}-${c}`]===d.alphabet[n-1]));patch({decoded:ok});setFeedback(ok?t.complete:t.retry);};
 return <section className="dl-puzzle" data-puzzle="decoder"><h4>{t.code}</h4><div className="dl-alphabet">{[...d.alphabet].map((ch,i)=><span key={ch}>{i+1}={ch}</span>)}</div><h4>{t.matching}</h4><div className="dl-pairs">{d.groups.map((g,i)=><div key={i} className="dl-pairgroup"><div>{g.numbers.map(n=><button key={n} data-number={n} disabled={w.pairs.includes(n)} aria-pressed={number===n} onClick={()=>setNumber(n)}>{n}{w.pairs.includes(n)?` → ${d.alphabet[n-1]} ✓`:''}</button>)}</div><div>{g.letters.map(ch=><button data-match={ch} key={ch} disabled={w.pairs.includes(d.alphabet.indexOf(ch)+1)} onClick={()=>match(ch)}>{ch}</button>)}</div></div>)}</div><p>{t.matched}: {w.pairs.length} / {total}</p><h4>{t.message}</h4><div className="dl-message">{d.sequence.map((word,r)=><div key={r}>{word.map((n,c)=><label key={c}><input data-code={`${r}-${c}`} aria-label={`${t.cell} ${r+1}, ${c+1}; ${n}`} maxLength={1} value={w.letters[`${r}-${c}`]||''} autoCapitalize="characters" autoComplete="off" spellCheck={false} onChange={e=>patch({letters:{...w.letters,[`${r}-${c}`]:e.target.value.toUpperCase().replace(/[^A-ZА-ЯЁ]/gu,'').slice(-1)},decoded:false})}/><span>{n}</span></label>)}</div>)}</div><button className="dl-primary" onClick={check}>{t.check}</button><button onClick={()=>{patch({pairs:[],letters:{},decoded:false});setNumber(null);setFeedback('');}}>{t.reset}</button><p role="status">{feedback}</p><details><summary>{t.hint}</summary><p>{t.decodeHint}</p></details><details><summary>{t.answers}</summary><p>{d.answer}</p></details></section>;
}
