'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useRef,useState} from 'react';
import {useLanguage} from '@/context/LanguageContext';
import booklet from './booklet.json';
import scripture from './scripture.json';
import {ui,counts,objects,type Lang} from './content';
import {useProgress,update,reset,type Progress} from './progress';
import './lesson.css';
const art='/images/lessons/words-and-deeds/';
export default function Lesson(){
 const {language,setLanguage}=useLanguage();const l=language === 'ru'?'ru':'en',t=ui[l],b=booklet[l],s=scripture[l];
 const w=useProgress()[l];const patch=(p:Partial<Progress>)=>update(l,p);
 const [confirm,setConfirm]=useState(false),[plan,setPlan]=useState('');const heading=useRef<HTMLHeadingElement>(null);
 const countDone=w.countChecked&&counts.every((n,i)=>String(n)===w.counts[i]);
 const sequenceDone=w.sequenceChecked&&w.sequence.length===4&&w.sequence.every((n,i)=>n===i);
 const complete=[countDone,w.clues.length===3&&w.motives.length===4,w.objects.length===6,sequenceDone,w.reflected];
 const go=(step:number)=>{patch({step});requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:'start'});});};
 const stories=[b.intro,b.bridge2,b.bridge3,b.bridge4,''];
 return <main className="wd" lang={l}>
 <div className="wd-top"><Link href="/lessons">← {t.home}</Link><div>{(['en','ru'] as const).map(x=><button key={x} aria-pressed={l===x} onClick={()=>{setLanguage(x);setPlan('');}}>{x==='en'?'English':'Русский'}</button>)}</div></div>
 <header className="wd-hero"><div><p className="wd-eyebrow">{s.book} 23:1–12 · {s.version}</p><h1>{t.title}</h1><p>{t.intro}</p><strong>{b.truth.replace(/<\/?b>/g,'')}</strong></div><img src={`${art}cover.webp`} width={1024} height={768} alt={t.artAlt}/></header>
 <nav className="wd-trail" aria-label={t.trail}>{t.steps.map((step,i)=><button data-step={i} key={step} aria-current={w.step===i?'step':undefined} onClick={()=>go(i)}><span>{complete[i]?'✓':i+1}</span>{step}</button>)}</nav>
 <div className="wd-progress"><progress max={5} value={complete.filter(Boolean).length} aria-label={t.completed}/><span data-progress aria-live="polite">{complete.filter(Boolean).length} / 5 · {t.completed}</span></div>
 <article><h2 ref={heading} tabIndex={-1}>{[t.countTitle,b.p2,b.p3,b.p4,t.responseTitle][w.step]}</h2>
 {stories[w.step]&&<div className="wd-story">{stories[w.step].split(/(?<=\.) (?=[“«])/u).map((p,i)=><p key={i}>{p}</p>)}</div>}
 {w.step<3&&<blockquote><p>{s.verses.slice(w.step===0?0:w.step===1?5:10,w.step===0?5:w.step===1?10:12).join(' ')}</p><cite><a href={s.url}>{s.book} {w.step===0?'23:1–5':w.step===1?'23:6–10':'23:11–12'} · {s.version}</a></cite></blockquote>}
 {w.step===0&&<details><summary>{t.words}</summary><p>{t.glossary}</p></details>}
 <div key={`${l}-${w.step}`}>
 {w.step===0&&<><p>{t.countHelp}</p><Picture l={l} w={w} patch={patch}/><div className="wd-counts">{t.countNames.map((name,i)=><label key={name}>{name}<input data-count={i} inputMode="numeric" pattern="[0-9]*" maxLength={2} value={w.counts[i]} onChange={e=>{const c=[...w.counts];c[i]=e.target.value.replace(/\D/g,'');patch({counts:c,countChecked:false});}}/>{w.countChecked&&<span>{String(counts[i])===w.counts[i]?'✓':'↻'}</span>}</label>)}</div><button className="wd-primary" data-check-count onClick={()=>patch({countChecked:true})}>{t.check}</button><p role="status">{w.countChecked?(countDone?t.success:t.retry):''}</p><p className="wd-truth">{t.countBridge}</p></>}
 {w.step===1&&<Detective l={l} w={w} patch={patch}/>}
 {w.step===2&&<><h3>{t.hiddenTitle}</h3><p>{t.hiddenHelp}</p><Picture l={l} w={w} patch={patch} hidden/><p className="wd-truth">{t.hiddenTruth}</p></>}
 {w.step===3&&<><h3>{t.sequenceTitle}</h3><p>{t.sequenceHelp}</p><ol className="wd-order">{w.sequence.map(i=><li key={i}>{t.events[i]}</li>)}</ol><div className="wd-events">{[2,0,3,1].map(i=><button data-event={i} disabled={w.sequence.includes(i)} key={i} onClick={()=>patch({sequence:[...w.sequence,i],sequenceChecked:false})}>{t.events[i]}</button>)}</div><button onClick={()=>patch({sequence:w.sequence.slice(0,-1),sequenceChecked:false})} disabled={!w.sequence.length}>{t.undo}</button><button className="wd-primary" data-check-sequence onClick={()=>patch({sequenceChecked:true})}>{t.check}</button><p role="status">{w.sequenceChecked?(sequenceDone?t.success:t.retry):''}</p>{sequenceDone&&<p className="wd-truth">{t.sequenceTruth}</p>}</>}
 {w.step===4&&<><p className="wd-truth">{b.grace}</p><blockquote><p>{s.gospel}</p><cite><a href={s.gospelUrl}>{s.book} 20:28 · {s.version}</a></cite></blockquote><p>{t.privatePrompt}</p><label className="wd-plan">{t.plan}<textarea maxLength={500} value={plan} placeholder={t.placeholder} onChange={e=>setPlan(e.target.value)}/></label><p>{t.planHelp}</p><h3>{t.prayer}</h3><p className="wd-prayer">{b.prayer}</p><button className="wd-primary" data-reflect onClick={()=>patch({reflected:true})}>{t.finish}</button>{w.reflected&&<section className="wd-finish" role="status"><h3>{t.finished}</h3><p>{t.finishBody}</p><Link href="/lessons">{t.home} →</Link></section>}</>}
 </div>
 <div className="wd-navigation"><button disabled={w.step===0} onClick={()=>go(w.step-1)}>← {t.back}</button>{w.step<4&&<button className="wd-primary" onClick={()=>go(w.step+1)}>{t.next} →</button>}</div>
 </article>
 <section className="wd-downloads"><h2>{t.downloads}</h2><p>{t.printHelp}</p>{(['en','ru'] as const).map(lang=><div key={lang}><h3>{lang==='en'?'English':'Русский'}</h3>{['READING','A4-LONG-EDGE','LETTER-LONG-EDGE'].map(size=><a key={size} download href={`/printables/words-and-deeds/Words-and-Deeds-${lang.toUpperCase()}-${size}.pdf`}>{size==='READING'?t.reading:`${t.print} · ${size.startsWith('A4')?'A4':'Letter'}`} · PDF</a>)}</div>)}</section>
 <details className="wd-adult"><summary>{t.adult}</summary><p>{t.notes}</p><a download href={`/printables/words-and-deeds/Words-and-Deeds-${l.toUpperCase()}-TEACHER.pdf`}>{t.teacher} · PDF</a><p lang="en">Scripture quotations marked ESV are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.</p></details>
 <p className="wd-small">{t.saved}</p><button onClick={()=>setConfirm(true)}>{t.reset}</button>{confirm&&<div role="group" aria-label={t.confirm}><p>{t.confirm}</p><button onClick={()=>setConfirm(false)}>{t.cancel}</button><button onClick={()=>{reset();setPlan('');setConfirm(false);}}>{t.yes}</button></div>}
 </main>;
}
type Props={l:Lang;w:Progress;patch:(p:Partial<Progress>)=>void};
function Detective({l,w,patch}:Props){
 const t=ui[l],s=scripture[l];const [feedback,setFeedback]=useState(''),[selected,setSelected]=useState<number|null>(null);
 const clue=[0,1,2].find(i=>!w.clues.includes(i));
 return <section><h3>{t.detectiveTitle}</h3><p>{t.detectiveHelp}</p><p className="wd-clue">{clue===undefined?t.success:t.clues[clue]}</p><div className="wd-fragments" aria-label={`${s.book} 23:11–12`}>{t.fragments.map((text,i)=><button data-fragment={i} key={text} aria-pressed={w.clues.some(c=>t.answerIndexes[c]===i)} onClick={()=>{if(clue===undefined)return;if(t.answerIndexes[clue]===i){patch({clues:[...w.clues,clue]});setFeedback(t.success);}else setFeedback(t.retry);}}>{text}</button>)}</div><p role="status">{feedback}</p><h3>{t.motiveTitle}</h3><p>{t.motiveHelp}</p><div className="wd-events">{t.motives.map((text,i)=><button data-motive={i} key={text} disabled={w.motives.includes(i)} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{w.motives.includes(i)?'✓ ':''}{text}</button>)}</div><div className="wd-bins">{t.bins.map((text,i)=><button data-bin={i} key={text} disabled={selected===null} onClick={()=>{if(selected!==null&&t.motiveAnswers[selected]===i){patch({motives:[...w.motives,selected]});setSelected(null);setFeedback(t.success);}else setFeedback(t.retry);}}>{text}</button>)}</div><p className="wd-truth">{t.motiveTruth}</p></section>;
}
function Picture({l,w,patch,hidden=false}:Props&{hidden?:boolean}){
 const t=ui[l];const [zoom,setZoom]=useState(false),[feedback,setFeedback]=useState(''),[cursor,setCursor]=useState([50,50]),[keyboard,setKeyboard]=useState(false);const scroll=useRef<HTMLDivElement>(null);
 const hit=(x:number,y:number)=>{const i=objects.findIndex(({box:[x1,y1,x2,y2]})=>x>=x1&&x<=x2&&y>=y1&&y<=y2);if(i<0){setFeedback(t.retry);return;}patch({objects:[...new Set([...w.objects,i])]});setFeedback(`${objects[i][l]} ✓`);};
 return <section><div className="wd-tools"><button onClick={()=>setZoom(!zoom)}>{zoom?t.shrink:t.enlarge}</button>{zoom&&<><button aria-label={t.left} onClick={()=>scroll.current?.scrollBy({left:-180})}>←</button><button aria-label={t.right} onClick={()=>scroll.current?.scrollBy({left:180})}>→</button></>}</div><div ref={scroll} className="wd-image-scroll"><div className={`wd-picture ${zoom?'wd-enlarged':''}`}><img src={`${art}${hidden?'coloring':'cover'}.webp`} width={1024} height={hidden?1024:768} alt={hidden?t.hiddenAlt:t.artAlt} draggable={false}/>{hidden&&<svg data-search viewBox="0 0 100 100" role="application" tabIndex={0} aria-label={t.keyboard} onClick={e=>{if(e.detail===0)return;const r=e.currentTarget.getBoundingClientRect();hit((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);}} onKeyDown={e=>{if(e.key.startsWith('Arrow')){e.preventDefault();setKeyboard(true);const n=e.shiftKey?10:1;setCursor(([x,y])=>[Math.max(0,Math.min(100,x+(e.key==='ArrowRight'?n:e.key==='ArrowLeft'?-n:0))),Math.max(0,Math.min(100,y+(e.key==='ArrowDown'?n:e.key==='ArrowUp'?-n:0)))]);}if(e.key==='Enter'||e.key===' '){e.preventDefault();hit(...cursor as [number,number]);}}}>
 {w.objects.map(i=>{const [x1,y1,x2,y2]=objects[i].box;return <rect key={i} data-ring x={x1} y={y1} width={x2-x1} height={y2-y1} rx={2} fill="none" stroke="#a51d25" strokeWidth={.6}/>;})}{keyboard&&<g stroke="#12566b" strokeWidth={.5}><circle cx={cursor[0]} cy={cursor[1]} r={2} fill="white"/><path d={`M${cursor[0]-3} ${cursor[1]}h6 M${cursor[0]} ${cursor[1]-3}v6`}/></g>}</svg>}</div></div>{hidden&&<><p className="wd-small">{t.keyboard}</p><p role="status">{t.found}: {w.objects.length} / 6 · {feedback}</p><div className="wd-found">{w.objects.map(i=><span key={i}>✓ {objects[i][l]}</span>)}</div><details><summary>{t.hint}</summary>{t.hints.map((hint,i)=><p key={hint}>{i+1}. {hint}</p>)}</details></>}</section>;
}
