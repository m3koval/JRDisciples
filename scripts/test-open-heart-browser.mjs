import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3217';
const out='docs/open-heart/qa';fs.mkdirSync(out,{recursive:true});
const puzzles=JSON.parse(fs.readFileSync('app/lessons/open-heart/puzzles.json','utf8'));
const booklet=JSON.parse(fs.readFileSync('app/lessons/open-heart/booklet.json','utf8'));
const boxes=[[0,64,7,76],[58,11,65,22],[69,37,74,45],[8,52,18,60],[66,79,83,95],[87,9,94,29]];
const browser=await chromium.launch({headless:true});const results=[];
async function shot(page,name){await page.screenshot({path:`${out}/${name}.png`,fullPage:true});}
async function click(page,selector){await page.locator(selector).click();}
async function state(page,l){return page.evaluate(l=>JSON.parse(localStorage.getItem('jd-open-heart-v1')||'{}')[l],l);}
for(const device of [{name:'phone',width:390,height:844,touch:true},{name:'ipad',width:820,height:1180,touch:true},{name:'desktop',width:1366,height:900,touch:false}]){
 for(const l of ['en','ru']){
 const ctx=await browser.newContext({viewport:{width:device.width,height:device.height},hasTouch:device.touch,isMobile:device.touch});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/lessons/open-heart`);await click(page,`.oh [data-lang=${l}]`);await page.waitForFunction(l=>document.querySelector('main.oh')?.getAttribute('lang')===l,l);
 assert.equal(await page.locator('.oh h1').innerText(),booklet[l].title);assert.equal(await page.locator('.oh img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0)),true);await shot(page,`${device.name}-${l}-start`);
 await click(page,'[data-warning="0"]');await click(page,'[data-example="1"]');assert.equal((await state(page,l))?.matches?.length||0,0);
 for(let i=0;i<6;i++){await click(page,`[data-warning="${i}"]`);await click(page,`[data-example="${i}"]`);}assert.equal((await state(page,l)).matches.length,6);
 await click(page,'[data-step="1"]');
 for(let i=0;i<6;i++){
 const cells=puzzles[l].words[i].cells;const a=cells[0][0]*12+cells[0][1],b=cells.at(-1)[0]*12+cells.at(-1)[1];
 if(i===0&&device.touch){
 await page.locator('.oh-wordgrid').scrollIntoViewIfNeeded();const aa=await page.locator(`[data-cell="${a}"]`).boundingBox(),bb=await page.locator(`[data-cell="${b}"]`).boundingBox();const cdp=await ctx.newCDPSession(page);
 const pt=(r)=>({x:r.x+r.width/2,y:r.y+r.height/2});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt(aa)]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[pt(bb)]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
 }else if(i===1){await page.locator(`[data-cell="${a}"]`).focus();await page.keyboard.press('Enter');await page.locator(`[data-cell="${b}"]`).focus();await page.keyboard.press('Enter');}
 else {await click(page,`[data-cell="${a}"]`);await click(page,`[data-cell="${b}"]`);}
 assert.equal((await state(page,l)).words.length,i+1,`${device.name} ${l} word ${i}`);
 }
 await shot(page,`${device.name}-${l}-words`);await click(page,'[data-step="2"]');
 for(const [a,b,c,d] of boxes){const svg=page.locator('[data-search]');await svg.scrollIntoViewIfNeeded();const rect=await svg.boundingBox();await page.mouse.click(rect.x+rect.width*(a+c)/200,rect.y+rect.height*(b+d)/200);}
 assert.equal((await state(page,l)).objects.length,6);await page.locator('[data-code]').fill('WRONG');await click(page,'[data-check-code]');assert.equal((await state(page,l)).decoded,false);await page.locator('[data-code]').fill(booklet[l].message);await click(page,'[data-check-code]');assert.equal((await state(page,l)).decoded,true);await shot(page,`${device.name}-${l}-picture`);
 await click(page,'[data-step="3"]');await click(page,'[data-check-sequence]');assert.equal((await state(page,l)).sequence.length,0);
 for(const i of [1,3,2,0])await click(page,`[data-event="${i}"]`);await click(page,'[data-check-sequence]');
 await click(page,'[data-motive="0"]');await click(page,'[data-bin="1"]');assert.equal((await state(page,l)).motives.length,0);
 for(let i=0;i<4;i++){await click(page,`[data-motive="${i}"]`);await click(page,`[data-bin="${i%2}"]`);}await shot(page,`${device.name}-${l}-repair`);
 await click(page,'[data-step="4"]');await page.locator('[data-plan]').fill('PRIVATE_SENTINEL');await click(page,'[data-reflect]');assert.match(await page.locator('[data-progress]').innerText(),/5 \/ 5/);
 assert.equal(await page.evaluate(()=>Object.values(localStorage).some(v=>String(v).includes('PRIVATE_SENTINEL'))),false);
 await page.reload();await page.waitForSelector('[data-plan]');assert.equal(await page.locator('[data-plan]').inputValue(),'');assert.match(await page.locator('[data-progress]').innerText(),/5 \/ 5/);await shot(page,`${device.name}-${l}-finish`);
 for(const step of [0,1,2,3,4]){await click(page,`[data-step="${step}"]`);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${device.name} ${l} overflow step ${step}`);}
 for(const size of ['READING','A4-LONG-EDGE','LETTER-LONG-EDGE','TEACHER']){const r=await ctx.request.get(`${base}/printables/open-heart/Open-Heart-${l.toUpperCase()}-${size}.pdf`);assert.equal(r.status(),200);assert.equal((await r.body()).subarray(0,5).toString(),'%PDF-');}
 const other=l==='en'?'ru':'en';await click(page,`.oh [data-lang=${other}]`);assert.match(await page.locator('[data-progress]').innerText(),/0 \/ 5/);await click(page,`.oh [data-lang=${l}]`);assert.match(await page.locator('[data-progress]').innerText(),/5 \/ 5/);
 await page.locator('.oh>button').last().click();await click(page,'[data-reset-confirm]');assert.match(await page.locator('[data-progress]').innerText(),/0 \/ 5/);
 assert.deepEqual(errors,[]);results.push({device:device.name,language:l,interactions:'PASS',reload:'PASS',privacy:'PASS',overflow:'PASS',pdfs:4,consoleErrors:errors});await ctx.close();
 }
}
for(const mode of ['malformed','blocked','stale-write-fails']){
 const ctx=await browser.newContext();await ctx.addInitScript(mode=>{if(mode==='malformed')localStorage.setItem('jd-open-heart-v1','{bad');if(mode==='stale-write-fails')localStorage.setItem('jd-open-heart-v1',JSON.stringify({en:{step:0,matches:[0]},ru:{}}));if(mode==='blocked')Object.defineProperty(Storage.prototype,'getItem',{value(){throw new Error('blocked');}});if(mode!=='malformed')Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('quota');}});},mode);
 const page=await ctx.newPage();await page.goto(`${base}/lessons/open-heart`);await click(page,'.oh [data-lang=en]');for(const i of mode==='stale-write-fails'?[1,2]:[0,1]){await click(page,`[data-warning="${i}"]`);await click(page,`[data-example="${i}"]`);assert.equal(await page.locator(`[data-warning="${i}"]`).isDisabled(),true);}
 if(mode!=='malformed')assert.equal(await page.locator('.oh-warning').isVisible(),true);results.push({storage:mode,result:'PASS'});await ctx.close();
}
await browser.close();fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify({base,results},null,2));console.log(JSON.stringify(results,null,2));
