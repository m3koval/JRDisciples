import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const route='app/lessons/why-did-jesus-come/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const b=read(route+'booklet.json'),p=read(route+'puzzles.json'),sources=read('docs/why-jesus-came/scripture-fixtures.json');
for(const l of ['en','ru']){
 for(const q of b[l].quotes)assert.equal(q[0],sources[l][q[2]].text);
 assert.equal(b[l].quotes.length,4);
 const cw=p.crosswords[l],grid=new Map(),owners=new Map();
 cw.entries.forEach((e,i)=>e.cells.forEach((c,j)=>{const id=c.join('-');assert.ok(!grid.has(id)||grid.get(id)===e.word[j]);grid.set(id,e.word[j]);owners.set(id,[...(owners.get(id)||[]),i]);}));
 const seen=new Set([0]);let old=-1;while(old!==seen.size){old=seen.size;for(const ids of owners.values())if(ids.some(i=>seen.has(i)))ids.forEach(i=>seen.add(i));}assert.equal(seen.size,8);
 for(const e of p.wordsearch[l].entries)assert.equal(e.cells.map(([r,c])=>p.wordsearch[l].grid[r][c]).join(''),e.word);
 assert.equal(p.messages[l].rows.map(row=>[...row].filter(ch=>!p.messages[l].filler.includes(ch)).join('')).join(' '),p.messages[l].answer);
}
assert.equal(p.differences.length,5);assert.equal(p.hidden_objects.length,4);
const compiled=ts.transpileModule(fs.readFileSync(route+'progress.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const sandbox={exports:{},require:id=>{assert.equal(id,'./puzzles.json');return p;},Set,JSON,Number,Object,Array,localStorage:{getItem:()=>'{broken',setItem:()=>{throw Error('quota');}},window:{dispatchEvent:()=>{}},Event:class{}};
vm.runInNewContext(compiled,sandbox);const m=sandbox.exports;
for(const raw of [null,[],7,'oops',{step:-1,spots:[0,0,9,'1'],letters:{'0-3':{}},crossed:[{}],message:44}]){const n=m.normalize(raw,'en');assert.equal(n.step,0);assert.equal(n.message,'');}
assert.equal(m.snapshot('en').step,0);m.update('en',{step:3});assert.equal(m.snapshot('en').step,3);assert.equal(m.snapshot('en').temporary,true);assert.equal(m.snapshot('ru').step,0);
for(const l of ['en','ru']){const n=m.fresh();for(const e of p.crosswords[l].entries)e.cells.forEach((c,i)=>n.letters[c.join('-')]=e.word[i]);assert.equal(m.crosswordSolved(n,l),true);n.message=p.messages[l].answer;assert.equal(m.messageSolved(n,l),false);p.messages[l].rows.forEach((row,r)=>[...row].forEach((ch,c)=>{if(p.messages[l].filler.includes(ch))n.crossed.push(`${r}-${c}`);}));assert.equal(m.messageSolved(n,l),true);}
console.log('PASS: 8 full exact-source quotes; connected independent EN/RU crosswords; word paths; messages; geometry counts; malformed and stale/blocked-storage recovery; semantic solutions.');
