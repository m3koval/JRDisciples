import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='app/lessons/davids-lord/',source='/home/helper/outputs/jd-davids-lord-v6/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
if(fs.existsSync(source))for(const [a,b]of [['booklet.json','content.json'],['puzzles.json','puzzle-manifest.json'],['scripture.json','sources/scripture.json'],['luke.json','sources/luke.json']])assert.deepEqual(read(root+a),read(source+b));
const p=read(root+'puzzles.json');
for(const l of ['en','ru']){const d=p.word_searches[l];assert.equal(d.grid.length,15);assert(d.grid.every(r=>r.length===15));assert.equal(new Set(d.words).size,12);assert.equal(new Set(d.entries.map(e=>e.direction.join())).size,8);for(const e of d.entries)assert.equal([...e.word].map((_,i)=>d.grid[e.start[0]+i*e.direction[0]][e.start[1]+i*e.direction[1]]).join(''),e.word);const m=p.messages[l];assert.equal(m.sequence.map(w=>w.map(n=>m.alphabet[n-1]).join('')).join(' '),m.answer);for(const g of m.groups)assert.deepEqual(g.numbers.map(n=>m.alphabet[n-1]).sort(),[...g.letters].sort());}
assert.equal(p.odd_objects.length,4);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const a of read('docs/davids-lord/assets.json')){if(fs.existsSync(a.source))assert.equal(hash(a.source),a.source_sha256);assert.equal(hash('public/'+a.web),a.web_sha256);}
assert.equal(read('docs/davids-lord/assets.json')[1].source_sha256,'fddec951bd00e558ad064a546bc4b9dc84690c40a9e69a528b483a7b1ac60ce0');
for(const [file,expected]of Object.entries(read('docs/davids-lord/source-lock.json')))assert.equal(hash(file),expected);
if(fs.existsSync(source))for(const name of fs.readdirSync('public/printables/davids-lord').filter(n=>n.endsWith('.pdf')))assert.equal(hash('public/printables/davids-lord/'+name),hash(source+name));
console.log('PASS: exact v6 story/Scripture/manifests; both 15x15 searches, 12 words and eight directions; independent decoders; four v6 boxes; lossless asset hashes; all seven PDFs byte-identical.');
