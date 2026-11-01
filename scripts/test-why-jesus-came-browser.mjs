import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3127';
const out=process.env.EVIDENCE_DIR||'/home/helper/outputs/jd-why-jesus-web-qa';fs.mkdirSync(out,{recursive:true});
const p=JSON.parse(fs.readFileSync('app/lessons/why-did-jesus-come/puzzles.json','utf8'));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const result={base,cases:[],screenshots:[],errors:[]};
const record=name=>{result.cases.push(name);fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2));};
const contexts=[];
try{
 for(const lang of ['en','ru']){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});contexts.push(context);
  await context.addInitScript(l=>localStorage.setItem('language',l),lang);
  const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  await page.goto(base+'/lessons/why-did-jesus-come');await page.locator('.jl-top button[aria-pressed=true]').filter({hasText:lang==='en'?'English':'Русский'}).waitFor();
  const stage=async n=>{await page.locator('.jl-trail button').nth(n).click();await page.locator(`.jl-trail button:nth-child(${n+1})[aria-current=step]`).waitFor();};
  const puzzle=()=>page.locator('.jl-puzzle');
  const done=lang==='en'?'Puzzle discovered!':'Секрет разгадан!';const retry=lang==='en'?'Not quite yet':'Пока не всё верно';
  const check=()=>puzzle().getByRole('button',{name:lang==='en'?'Check my discovery':'Проверить открытие'}).click();
  const reset=()=>puzzle().getByRole('button',{name:lang==='en'?'Reset this puzzle':'Очистить это задание'}).click();
  await stage(1);await page.locator('.jl-search-image img').waitFor();
  assert.equal(await puzzle().locator('details[open]').count(),0);
  await page.locator('.jl-search-image').click({position:{x:10,y:10}});assert.match(await puzzle().innerText(),new RegExp(retry));
  for(const item of p.differences){const im=page.locator('.jl-search-image');const box=await im.boundingBox();const [x1,y1,x2,y2]=item.bbox;await im.click({position:{x:(x1+x2)/2048*box.width,y:(y1+y2)/2048*box.height}});}
  assert.match(await puzzle().innerText(),new RegExp(done));await page.reload();await page.locator('[data-puzzle=differences]').waitFor();assert.equal(await page.locator('.jl-found-ring').count(),5);
  await reset();assert.equal(await page.locator('.jl-found-ring').count(),0);await puzzle().locator('summary').first().click();assert.equal(await puzzle().locator('details[open]').count(),1);record(`${lang}: differences wrong tap, five real hits, reload, reset, optional hint`);
  await stage(3);await page.locator('[data-wcell="0-0"]').click();await page.locator('[data-wcell="8-8"]').click();assert.match(await puzzle().innerText(),new RegExp(retry));
  for(const [i,e] of p.wordsearch[lang].entries.entries()){
   const a=page.locator(`[data-wcell="${e.cells[0].join('-')}"]`),b=page.locator(`[data-wcell="${e.cells.at(-1).join('-')}"]`);
   if(i===0){await a.scrollIntoViewIfNeeded();const aa=await a.boundingBox(),bb=await b.boundingBox();await page.mouse.move(aa.x+aa.width/2,aa.y+aa.height/2);await page.mouse.down();await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:12});await page.mouse.up();}else{await a.tap();await b.tap();}
  }
  assert.match(await puzzle().innerText(),new RegExp(done));await page.reload();await page.locator('[data-puzzle=wordsearch]').waitFor();assert.equal(await page.locator('.jl-wordlist .jl-done').count(),5);await reset();assert.equal(await page.locator('.jl-wordlist .jl-done').count(),0);record(`${lang}: wordsearch retry, drag and tap solutions, reload, reset`);
  await stage(5);await check();assert.match(await puzzle().innerText(),new RegExp(retry));
  await puzzle().locator('summary').last().click();assert.equal(await puzzle().locator('.jl-scripture').count(),4);await puzzle().locator('summary').last().click();
  for(const e of p.crosswords[lang].entries)for(const [i,c]of e.cells.entries())await page.locator(`[data-cell="${c.join('-')}"]`).fill(e.word[i]);
  await check();assert.match(await puzzle().innerText(),new RegExp(done));await page.reload();await page.locator('[data-puzzle=crossword]').waitFor();assert.match(await puzzle().innerText(),new RegExp(done));await reset();assert.equal(await page.locator('[data-cell]').first().inputValue(),'');record(`${lang}: connected crossword retry, revisit all passages, solve, reload, reset`);
  await stage(7);for(const item of p.hidden_objects){const im=page.locator('.jl-search-image');const box=await im.boundingBox();const [x1,y1,x2,y2]=item.bbox;await im.click({position:{x:(x1+x2)/2048*box.width,y:(y1+y2)/2048*box.height}});}
  assert.match(await puzzle().innerText(),new RegExp(done));await page.reload();await page.locator('[data-puzzle=hidden]').waitFor();assert.equal(await page.locator('.jl-found-ring').count(),4);await reset();await page.locator('.jl-search-image').focus();await page.keyboard.press('ArrowLeft');await page.keyboard.press('Enter');assert.equal(await page.locator('.jl-cursor').count(),1);record(`${lang}: hidden objects four real hits, reload, reset, keyboard cursor/retry`);
  await stage(9);await check();assert.match(await puzzle().innerText(),new RegExp(retry));
  for(const [r,row] of p.messages[lang].rows.entries())for(const [c,ch] of [...row].entries())if(p.messages[lang].filler.includes(ch))await page.locator(`[data-letter="${r}-${c}"]`).click();
  await page.locator('.jl-message-input input').fill(p.messages[lang].answer);await check();assert.match(await puzzle().innerText(),new RegExp(done));await page.reload();await page.locator('[data-puzzle=message]').waitFor();assert.match(await puzzle().innerText(),new RegExp(done));await reset();record(`${lang}: hidden message retry, eliminate letters, solve, reload, reset`);
  await stage(8);await page.locator('.jl-top button').filter({hasText:lang==='en'?'Русский':'English'}).click();assert.equal((await page.locator('.jl-trail [aria-current]').innerText()).replace(/\s+/g,' '),`1 ${lang==='en'?'Зачем мы это делаем?':'A purpose worth finding'}`);await page.locator('.jl-top button').filter({hasText:lang==='en'?'English':'Русский'}).click();assert.match((await page.locator('.jl-trail [aria-current]').innerText()).replace(/\s+/g,' '),/^9/);record(`${lang}: independent language progress`);
  for(const [name,width,height]of [['phone-portrait',390,844],['phone-landscape',844,390],['ipad-portrait',820,1180],['ipad-landscape',1180,820]]){
   await page.setViewportSize({width,height});
   for(const step of [0,1,2,3,4,5,6,7,8,9,10]){await stage(step);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${lang} ${name} ${step} overflow`);const file=`${lang}-${name}-step-${step}.png`;await page.screenshot({path:out+'/'+file,fullPage:true});result.screenshots.push(file);if(lang==='ru')assert.equal(await page.locator('.jl-panel').evaluate(e=>/\b(Continue|Reset|Found|Across|Down|Michael|Rosie)\b/.test(e.innerText)),false);}
  }
  await page.goto(base+'/');await page.locator('a[href="/lessons/why-did-jesus-come"]').first().waitFor();await page.screenshot({path:out+`/${lang}-home.png`,fullPage:false});record(`${lang}: eleven stages × four responsive viewports, no overflow/English bleed; homepage feature`);
 }
 // Corrupted saves and readable stale saves with rejected writes.
 for(const mode of ['malformed','semantic','blocked']){
  const context=await browser.newContext({viewport:{width:390,height:844}});contexts.push(context);
  await context.addInitScript(mode=>{localStorage.setItem('jd-why-jesus-came-v1-en',mode==='malformed'?'{broken':mode==='semantic'?JSON.stringify({step:999,spots:[null,99],letters:[],message:{}}):JSON.stringify({step:0}));if(mode==='blocked')Storage.prototype.setItem=function(){throw Error('quota');};},mode);
  const page=await context.newPage();await page.goto(base+'/lessons/why-did-jesus-come');await page.locator('.jl-trail button').nth(3).click();await page.locator('[data-puzzle=wordsearch]').waitFor();await page.locator('[data-wcell="0-1"]').click();await page.locator('[data-wcell="0-5"]').click();assert.equal(await page.locator('.jl-wordlist .jl-done').count(),1);if(mode==='blocked')assert.match(await page.locator('.jl-save').innerText(),/temporary/);record(`${mode}: usable recovery and retained in-memory progress`);
 }
 assert.equal(result.errors.length,0,JSON.stringify(result.errors));record('No browser runtime errors');console.log(JSON.stringify(result,null,2));
}catch(e){result.failure=e.stack;fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2));throw e;}finally{await browser.close();}
