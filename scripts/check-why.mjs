import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
const files=fs.readdirSync('data/why').filter(x=>/^lesson-\d\d.json$/.test(x)).sort();
const lessons=files.map(x=>JSON.parse(fs.readFileSync(path.join('data/why',x),'utf8')));
const errors=[];const check=(fn)=>{try{fn()}catch(e){errors.push(e.message)}};
const mod={exports:{}};new Function('exports','module',ts.transpileModule(fs.readFileSync('components/why/progress.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod.exports,mod);
const {initialAnswers,isCorrect,readProgress,moveItem}=mod.exports;
check(()=>assert.equal(lessons.length,52,'All 52 lessons must exist'));
for(const l of lessons){
 check(()=>{
 assert.equal(l.chapter,Math.ceil(l.id/4));assert.equal(l.kind,l.id%4===0?'lab':'lesson');assert.equal(l.scenes.length,4);
 const walk=(o)=>{if(!o||typeof o!=='object')return;if('en'in o||'ru'in o){assert.ok('en'in o&&'ru'in o,`${l.id} bilingual keys`);assert.equal(typeof o.en,typeof o.ru);if(Array.isArray(o.en))assert.equal(o.en.length,o.ru.length);else{assert.ok(o.en.length>0);assert.ok(/[А-Яа-яЁё]/.test(o.ru)||o.ru.startsWith('http'),`${l.id}: Russian missing ${o.ru}`);}}else Object.values(o).forEach(walk);};walk(l);
 // Scenes use structured `beats` (narration/dialogue, see components/why/types.ts)
 // once migrated, or legacy flat `paragraphs` before that. Support both.
 const sceneEnText=(s)=>s.beats?s.beats.map(b=>b.text.en):s.paragraphs.en;
 for(const s of l.scenes)if(s.beats)for(const b of s.beats){assert.ok(['narration','dialogue'].includes(b.kind),`${l.id} unknown beat kind`);if(b.kind==='dialogue')assert.ok(['michael','joseph','rosie','gracie','teacher'].includes(b.speaker),`${l.id} unknown speaker ${b.speaker}`);}
 const words=l.scenes.flatMap(sceneEnText).join(' ').split(/\s+/).length;assert.ok(words>=220,`${l.id} story too short: ${words}`);
 const a=l.activity;const ids=a.items.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);assert.ok(ids.length>=3);
 const answers=initialAnswers(a);assert.equal(isCorrect(a,answers),false,`${l.id} pre-solved activity`);
 if(a.type==='choose'){assert.ok(ids.includes(a.correctId));answers.choice=a.correctId;}
 else if(a.type==='sort'){assert.ok(a.groups.length>=2);for(const i of a.items){assert.ok(a.groups.some(g=>g.id===i.group));answers.groups[i.id]=i.group;}}
 else {assert.equal(a.type,'sequence');assert.deepEqual([...a.correctOrder].sort(),[...ids].sort());answers.order=a.correctOrder;}
 assert.equal(isCorrect(a,answers),true,`${l.id} cannot solve`);
 assert.equal(readProgress('{bad',l).step,0);
 assert.equal(readProgress(JSON.stringify({version:1,step:7,passed:true,completed:true,reflected:true}),l).completed,false);
 const saved={version:1,step:7,answers,passed:true,reflected:true,completed:true};assert.equal(readProgress(JSON.stringify(saved),l).completed,true);
 const ev=JSON.parse(fs.readFileSync(`docs/why/scripture-evidence/lesson-${String(l.id).padStart(2,'0')}.json`,'utf8'));assert.ok(ev);
 const verified=ev.verifiedVerses||ev;
 for(const lang of ['en','ru']) {assert.equal(l.scripture.text[lang],verified[lang].text,`${l.id} ${lang} Scripture mismatch`);assert.equal(l.scripture.url[lang],verified[lang].url);}
 for(const lang of ['en','ru'])assert.ok(l.scripture.url[lang].startsWith('https://www.bible.com/'));
 for(const source of l.sources)assert.ok(/^https?:\/\//.test(source.url));
 });
}
assert.deepEqual(moveItem(['a','b','c'],1,-1),['b','a','c']);
const missingImages=[...Array.from({length:13},(_,i)=>`public/images/jr/why/chapter-${String(i+1).padStart(2,'0')}.webp`),...lessons.flatMap(l=>[1,2,3,4].map(s=>`public/images/jr/why/lesson-${String(l.id).padStart(2,'0')}-scene-${s}.webp`))].filter(x=>!fs.existsSync(x));
const report={lessons:lessons.length,ids:lessons.map(x=>x.id),types:Object.fromEntries(['choose','sequence','sort'].map(t=>[t,lessons.filter(l=>l.activity.type===t).length])),errors,missingImages,contentAndLogicPass:!errors.length,releasePass:!errors.length&&!missingImages.length};
fs.mkdirSync('docs/why/qa',{recursive:true});fs.writeFileSync('docs/why/qa/content-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
if(errors.length||(!process.argv.includes('--content-only')&&missingImages.length))process.exitCode=1;
