const { chromium } = await import(process.env.WHY_PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=process.cwd();const out=root+'/docs/why/qa';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath: process.env.CHROME_PATH || undefined});const errors=[];const results=[];
const page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>errors.push(e.message));
const base=process.env.WHY_BASE_URL || 'http://127.0.0.1:3141';
await page.goto(base+'/why/01');await page.locator('.why-reading-body h2').waitFor();await page.screenshot({path:out+'/lesson-01-desktop.png',fullPage:true});
// Actual UI completion for all three activity mechanisms (no progress injection).
for(const id of [1,2,3,4]){
 const l=JSON.parse(fs.readFileSync(`${root}/data/why/lesson-${String(id).padStart(2,'0')}.json`));
 await page.goto(base+`/why/${String(id).padStart(2,'0')}`);await page.locator('.why-stage-nav button').nth(2).click();
 if(await page.locator('.why-lab-next').isVisible()) await page.locator('.why-lab-next').click();
 const a=l.activity;const board=page.locator('.why-activity');await board.waitFor();
 if(a.type==='choose'){
  const wrong=a.items.find(i=>i.id!==a.correctId);await board.locator(`[data-item="${wrong.id}"]`).click();await board.locator('.why-primary').click();assert.equal(await board.locator('.why-correct').count(),0);await board.locator(`[data-item="${a.correctId}"]`).click();
 }else if(a.type==='sort'){
  for(const i of a.items)await board.locator(`[data-item="${i.id}"] [data-group="${a.groups.find(g=>g.id!==i.group).id}"]`).click();
  await board.locator('.why-primary').click();assert.equal(await board.locator('.why-correct').count(),0);
  for(const i of a.items)await board.locator(`[data-item="${i.id}"] [data-group="${i.group}"]`).click();
 }else{
  await board.locator('.why-primary').click();assert.equal(await board.locator('.why-correct').count(),0);
  for(let target=0;target<a.correctOrder.length;target++){
   let order=await board.locator('li').evaluateAll(es=>es.map(e=>e.dataset.item));let index=order.indexOf(a.correctOrder[target]);
   while(index>target){await board.locator(`[data-item="${a.correctOrder[target]}"] button`).first().click();index--;}
  }
 }
 await board.locator('.why-primary').click();await board.locator('.why-correct').waitFor();
 await page.locator('.why-player-actions .why-primary').click();assert.equal(await page.locator('.why-player-actions .why-primary').isDisabled(),true);
 await page.locator('.why-reflection input').check();await page.locator('.why-player-actions .why-primary').click();await page.locator('.why-completion').waitFor();
 await page.reload();await page.locator('.why-completion').waitFor();results.push({id,type:a.type,wrongRetry:true,completionAndReload:true});
}
// Observatory touch and keyboard paths.
await page.goto(base+'/why/01');await page.locator('.why-stage-nav button').nth(2).click();const sky=page.locator('.why-sky');const bounds=await sky.boundingBox();
for(const t of [{x:22,y:28},{x:70,y:24},{x:55,y:72}]){await sky.click({position:{x:bounds.width*t.x/100,y:bounds.height*t.y/100}});await page.locator('.why-observatory > .why-primary').click();}
assert.equal(await page.locator('.why-sky-target.is-found').count(),3);await sky.focus();await page.keyboard.press('ArrowLeft');await page.keyboard.press('Enter');
await page.screenshot({path:out+'/observatory-desktop.png',fullPage:true});
for(const lang of ['en','ru'])for(const [name,width,height] of [['phone',390,844],['ipad-landscape',1180,820]]){
 await page.setViewportSize({width,height});await page.evaluate(l=>{localStorage.setItem('language',l);localStorage.removeItem('jd-why-v1-1')},lang);await page.reload();await page.locator(`.why-player[lang="${lang}"]`).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${lang} ${name} overflow`);
 await page.screenshot({path:`${out}/lesson-01-${lang}-${name}.png`,fullPage:true});
 assert.ok(await page.locator('.why-scene-art img').evaluate(i=>i.complete&&i.naturalWidth>0));
}
// Corrupt save and storage-disabled runtime both remain usable.
await page.evaluate(()=>localStorage.setItem('jd-why-v1-1','broken'));await page.reload();await page.locator('.why-story-text').waitFor();
const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')}});await blocked.goto(base+'/why/01');await blocked.locator('.why-player-actions .why-primary').click();await blocked.locator('.why-reading-body h2').filter({hasText:'Follow the movement'}).waitFor();
await browser.close();assert.deepEqual(errors,[]);fs.writeFileSync(out+'/browser-check.json',JSON.stringify({results,observatory:true,layouts:4,corruptStorage:true,blockedStorage:true,pageErrors:errors},null,2));console.log('PASS',JSON.stringify(results));
