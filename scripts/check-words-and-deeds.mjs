import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from 'typescript';
import vm from 'node:vm';
const root='app/lessons/words-and-deeds/';
const read=f=>fs.readFileSync(root+f,'utf8');
function load(file){const exports={};vm.runInNewContext(ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:()=>({useSyncExternalStore:()=>{}}),Set,Array,Number,JSON});return exports;}
const {ui,counts,objects}=load('content.ts');const {normalize}=load('progress.ts');
assert.deepEqual([...counts],[10,4,3,2,9,8,5,7,6]);
assert.equal(objects.length,6);
assert.deepEqual(Object.keys(ui.en),Object.keys(ui.ru));
for(const k of Object.keys(ui.en))if(Array.isArray(ui.en[k]))assert.equal(ui.en[k].length,ui.ru[k].length,k);
// Full quote fixture reviewed against Bible.com ESV/RST Matthew 23:1–12 and 20:28.
// Narrative is the approved v17 revisions.json, with language keys lowercased only.
for(const [file,hash] of Object.entries({'scripture.json':'a7dac53548fd2bb136a14d5a9c14f733b5f0de28fef5aeab4bf6d5edaea0a58b','booklet.json':'be993e4ac4ed82ebed88c8a4891fcfe29bee94273c75e579d7dbe748cb401390'}))assert.equal(crypto.createHash('sha256').update(read(file)).digest('hex'),hash,`${file}: approved text drift`);
const b=JSON.parse(read('booklet.json')),s=JSON.parse(read('scripture.json'));
assert.deepEqual(Object.keys(b.en),Object.keys(b.ru));
for(const l of ['en','ru']){
 assert.equal(s[l].verses.length,12);
 assert.equal(ui[l].fragments.join(' '),s[l].verses.slice(10).join(' '));
 assert.ok(b[l].bridge2.length>300&&b[l].bridge3.length>300&&b[l].bridge4.length>300);
 assert.ok(fs.readFileSync(`data/lessons${l==='ru'?'-ru':''}.ts`,'utf8').includes('href: "/lessons/words-and-deeds"'));
}
assert.equal(s.en.verses[10],'The greatest among you shall be your servant.');
assert.equal(s.ru.verses[10],'Больший из вас да будет вам слуга:');
assert.equal(s.en.gospel,'even as the Son of Man came not to be served but to serve, and to give his life as a ransom for many.”');
assert.equal(s.ru.gospel,'так как Сын Человеческий не для того пришел, чтобы Ему служили, но чтобы послужить и отдать душу Свою для искупления многих.');
for(const a of JSON.parse(read('assets.json')))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(a.file)).digest('hex'),a.sha256,a.file);
for(const v of [null,[],7,'bad',{}, {step:99,objects:[-1,6,2,2,'3'],counts:['100','x'],sequence:[3,3,9]}]){
 const n=normalize(v);assert.ok(n.step>=0&&n.step<5);assert.equal(n.counts.length,9);assert.ok(n.objects.every(i=>Number.isInteger(i)&&i>=0&&i<6));assert.equal(new Set(n.sequence).size,n.sequence.length);
}
assert.equal(normalize({step:3,sequence:[0,1,2,3],sequenceChecked:false}).sequenceChecked,false);
assert.ok(!/\bWEB\b/.test(read('scripture.json')));
console.log('PASS: EN/RU key and array parity; Scripture reconstruction and gospel quotes; 9 counts; 6 hotspots; 10 asset hashes; malformed-save normalization; explicit sequence check.');
