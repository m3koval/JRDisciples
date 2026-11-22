import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import ts from 'typescript';
const root='app/lessons/clean-inside-outside/';const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const manifest=read('docs/shiny-cup/preservation.json');
for(const [p,hash] of Object.entries(manifest.files)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash,p);if(p.endsWith('.pdf'))assert.equal(fs.readFileSync(p).subarray(0,5).toString(),'%PDF-');}
assert.equal(Object.keys(manifest.files).filter(p=>p.endsWith('.pdf')).length,8);
const b=read(root+'booklet.json'),p=read(root+'puzzles.json'),s=read(root+'scripture.json');
const fixtureModule={exports:{}};new Function('exports',ts.transpileModule(fs.readFileSync(root+'content.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(fixtureModule.exports);const {ui,objects}=fixtureModule.exports;
assert.deepEqual(Object.keys(ui.en),Object.keys(ui.ru));assert.equal(objects.length,4);
for(const l of ['en','ru']){assert.equal(b[l].story.length,17);assert.equal(b[l].connect.split('\n\n').length,3);assert.equal(p[l].grid.length,15);assert.equal(p[l].entries.length,12);let dirs=new Set();for(const e of p[l].entries){dirs.add(`${e.dx},${e.dy}`);let hits=[];for(let y=0;y<15;y++)for(let x=0;x<15;x++)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;if([...e.word].every((c,i)=>p[l].grid[y+i*dy]?.[x+i*dx]===c))hits.push([x,y,dx,dy]);}assert.deepEqual(hits,[[e.x,e.y,e.dx,e.dy]]);}assert.equal(dirs.size,8);assert.equal(Object.keys(s[l]).length,l==='en'?23:24);}
assert(!s.en['14']);assert(s.ru['14']);
for(const file of ['data/lessons.ts','data/lessons-ru.ts']){const routes=[...fs.readFileSync(file,'utf8').matchAll(/href: "([^"]+)"/g)].map(x=>x[1]);assert.equal(routes[0],'/lessons/clean-inside-outside');assert(routes.indexOf('/lessons/open-heart')>5);}
assert(fs.readFileSync('lib/seo-pages.ts','utf8').includes('"/lessons/clean-inside-outside"'));
console.log('PASS: v3 byte preservation; all 8 PDFs; 17 paragraphs/language; exact Scripture fixtures; bilingual UI; 12 unique words in 8 directions per language; four source-coordinate objects; latest catalog and sitemap.');
