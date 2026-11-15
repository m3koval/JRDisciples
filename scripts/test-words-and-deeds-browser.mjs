import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.BASE_URL||'http://127.0.0.1:3147';
const out=process.env.QA_DIR||'/home/helper/outputs/words-and-deeds-web-qa';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const report=[];
try{
 for(const mobile of [false,true])for(const lang of ['en','ru']){
 const name=`${mobile?'mobile':'desktop'}-${lang}`;
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base+'/lessons/words-and-deeds');await page.locator('.wd').waitFor();
 if(lang==='ru')await page.locator('.wd-top').getByRole('button',{name:'Русский',exact:true}).click();
 await page.waitForFunction(l=>document.querySelector('.wd')?.lang===l,lang);
 const contrast=await page.locator('.wd-top button[aria-pressed=true]').evaluate(el=>{const s=getComputedStyle(el);const lum=c=>{const rgb=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};const a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert.ok(contrast>=4.5,`selected language contrast ${contrast}`);
 await page.screenshot({path:`${out}/${name}-hero.png`,fullPage:false});
 const step=async i=>{await page.locator(`[data-step="${i}"]`).click();await page.waitForTimeout(80);};
 await page.locator('[data-check-count]').click();assert.match(await page.locator('article [role=status]').innerText(),lang==='en'?/Not quite/:/Пока/);
 for(const [i,n]of [10,4,3,2,9,8,5,7,6].entries())await page.locator(`[data-count="${i}"]`).fill(String(n));
 await page.locator('[data-check-count]').click();assert.match(await page.locator('[data-progress]').innerText(),/^1 \/ 5/);
 await page.reload();await page.locator('[data-count="0"]').waitFor();assert.equal(await page.locator('[data-count="0"]').inputValue(),'10');
 await step(1);await page.locator('[data-fragment="0"]').click();assert.match(await page.locator('article [role=status]').innerText(),lang==='en'?/Not quite/:/Пока/);
 for(const n of [1,3,5])await page.locator(`[data-fragment="${n}"]`).click();
 await page.locator('[data-motive="0"]').click();await page.locator('[data-bin="1"]').click();assert.equal(await page.locator('[data-motive="0"]').isDisabled(),false);
 for(const [n,bin]of [0,1,0,1].entries()){await page.locator(`[data-motive="${n}"]`).click();await page.locator(`[data-bin="${bin}"]`).click();}
 await page.screenshot({path:`${out}/${name}-detective.png`,fullPage:false});
 await step(2);const svg=page.locator('[data-search]');await svg.scrollIntoViewIfNeeded();
 for(const [x,y]of [[3.5,70],[61.5,16.5],[71.5,41],[13,56],[74.5,87]]){const box=await svg.boundingBox();if(mobile)await page.touchscreen.tap(box.x+box.width*x/100,box.y+box.height*y/100);else await page.mouse.click(box.x+box.width*x/100,box.y+box.height*y/100);}
 // Last object by keyboard; cursor starts at 50,50. No direct state injection.
 await svg.focus();for(let i=0;i<4;i++)await page.keyboard.press('Shift+ArrowRight');for(let i=0;i<3;i++)await page.keyboard.press('Shift+ArrowUp');await page.keyboard.press('Enter');
 assert.equal(await page.locator('[data-ring]').count(),6);
 const zoom=page.getByRole('button',{name:lang==='en'?'Enlarge picture':'Увеличить рисунок',exact:true});await zoom.click();assert.equal(await page.locator('.wd-enlarged').evaluate(el=>Math.round(el.getBoundingClientRect().width)),1024);
 await page.getByRole('button',{name:lang==='en'?'Pan right':'Сдвинуть вправо',exact:true}).click();if(mobile)assert.ok(await page.locator('.wd-image-scroll').evaluate(el=>el.scrollLeft)>0);
 await page.getByRole('button',{name:lang==='en'?'Fit picture':'Уместить рисунок',exact:true}).click();await svg.scrollIntoViewIfNeeded();
 await page.screenshot({path:`${out}/${name}-hidden.png`,fullPage:false});
 await step(3);for(const n of [1,0,2,3])await page.locator(`[data-event="${n}"]`).click();await page.locator('[data-check-sequence]').click();assert.match(await page.locator('article [role=status]').innerText(),lang==='en'?/Not quite/:/Пока/);
 const undo=page.getByRole('button',{name:lang==='en'?'Undo last event':'Отменить последний шаг',exact:true});for(let i=0;i<4;i++)await undo.click();
 for(const n of [0,1,2,3])await page.locator(`[data-event="${n}"]`).click();assert.match(await page.locator('[data-progress]').innerText(),/^3 \/ 5/);await page.locator('[data-check-sequence]').click();
 await step(4);await page.locator('textarea').fill('PRIVATE_TEST_NOT_STORED');await page.locator('[data-reflect]').click();assert.match(await page.locator('[data-progress]').innerText(),/^5 \/ 5/);
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage).includes('PRIVATE_TEST_NOT_STORED')),false);
 await page.screenshot({path:`${out}/${name}-response.png`,fullPage:false});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.equal(await page.locator('.wd img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
 const links=await page.locator('.wd a[download]').evaluateAll(a=>a.map(x=>x.href));assert.equal(links.length,7);for(const url of links){const response=await context.request.get(url);assert.equal(response.status(),200);assert.ok((await response.body()).subarray(0,4).toString()==='%PDF');}
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-progress]')?.textContent.startsWith('5 / 5'));assert.equal(await page.locator('textarea').inputValue(),'');
 await page.getByRole('button',{name:lang==='en'?'Start over':'Начать заново',exact:true}).click();await page.getByRole('button',{name:lang==='en'?'Clear progress':'Удалить ответы',exact:true}).click();assert.match(await page.locator('[data-progress]').innerText(),/^0 \/ 5/);
 await page.reload();await page.locator('[data-count="0"]').waitFor();assert.equal(await page.locator('[data-count="0"]').inputValue(),'');
 assert.deepEqual(errors,[]);report.push({name,status:'PASS',checks:'wrong/correct count, reload, exact-fragment discovery, wrong/correct motives, 5 real art taps + keyboard target, wrong/correct sequence, explicit grading, reflection privacy, all PDF downloads, reset+reload, no overflow, no page errors'});await context.close();
 }
 // Corrupt saves and blocked writes must not break interaction or replace in-memory progress.
 for(const mode of ['invalid-json','invalid-shape','blocked-write']){
 const context=await browser.newContext();await context.addInitScript(mode=>{localStorage.setItem('jd-words-and-deeds-v1',mode==='invalid-json'?'{oops':mode==='invalid-shape'?JSON.stringify({en:{step:80,objects:[99],counts:7}}):'{}');if(mode==='blocked-write')Storage.prototype.setItem=function(){throw new Error('quota');};},mode);
 const page=await context.newPage();await page.goto(base+'/lessons/words-and-deeds');await page.locator('[data-count="0"]').fill('10');await page.locator('[data-count="1"]').fill('4');assert.equal(await page.locator('[data-count="0"]').inputValue(),'10');report.push({name:mode,status:'PASS'});await context.close();
 }
 fs.writeFileSync(`${out}/browser-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){fs.writeFileSync(`${out}/failure.json`,JSON.stringify({error:String(e),completed:report},null,2));throw e;}finally{await browser.close();}
