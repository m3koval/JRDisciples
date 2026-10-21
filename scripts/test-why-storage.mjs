import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.WHY_BASE_URL || 'http://127.0.0.1:41927';
const out = 'docs/why/qa';
const report = { base, started: new Date().toISOString(), cases: [], pageErrors: [] };
const save = () => fs.writeFileSync(`${out}/storage-check.json`, JSON.stringify(report, null, 2));
const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH || undefined});
async function language(page, lang) {
  await page.getByRole('button',{name:/^(EN|РУ)$/}).click();
  await page.getByRole('button',{name:lang==='ru'?'Русский':'English',exact:true}).click();
  await page.locator(`.why-shell[lang="${lang}"]`).waitFor();
}
try {
 for (const mode of ['writes-blocked-stale-en', 'reads-and-writes-blocked']) {
  const result={mode,status:'running'};report.cases.push(result);save();
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();page.setDefaultTimeout(10000);
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  await context.addInitScript(mode=>{
   localStorage.setItem('language','en');
   Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError');};
   if(mode==='reads-and-writes-blocked')Storage.prototype.getItem=function(){throw new DOMException('blocked','SecurityError');};
   window.__documentIdentity='same-document';
  },mode);
  try {
   await page.goto(base+'/why/01');await page.locator('.why-story-text').waitFor();
   await language(page,'ru');
   if(mode==='writes-blocked-stale-en')assert.equal(await page.evaluate(()=>localStorage.getItem('language')),'en');
   await page.locator('.why-stage-nav button').nth(2).click();
   const lab=page.locator('.why-observatory');await lab.waitFor();
   await lab.locator(':scope > .why-primary').click();
   assert.match(await lab.locator('[aria-live]').innerText(),/Пока виден/);
   await language(page,'en');assert.match(await lab.locator('[aria-live]').innerText(),/Only the background/);
   await lab.locator('summary').click();await lab.getByRole('button',{name:'The bright Moon',exact:true}).click();
   assert.match(await lab.locator('[aria-live]').innerText(),/Light and dark/);
   await language(page,'ru');assert.match(await lab.locator('[aria-live]').innerText(),/На Луне/);
   assert.equal(await page.locator('.why-lab-next').innerText(),'Перейти к заданию →');
   await language(page,'en');assert.equal(await page.locator('.why-lab-next').innerText(),'Continue to the activity →');
   await page.locator('.why-lab-next').click();
   const a=JSON.parse(fs.readFileSync('data/why/lesson-01.json')).activity;
   const board=page.locator('.why-activity');await board.waitFor();
   assert.equal(a.type,'sort');
   for(const item of a.items)await board.locator(`[data-item="${item.id}"] [data-group="${item.group}"]`).click();
   await board.locator('.why-primary').click();await board.locator('.why-correct').waitFor();
   await page.locator('.why-player-actions .why-primary').click();
   await page.locator('.why-reflection input').check();await page.locator('.why-player-actions .why-primary').click();
   await page.locator('.why-completion').waitFor();
   assert.match(await page.locator('.why-player-footer [role=status]').innerText(),/this visit only/);
   await page.evaluate(()=>window.__documentIdentity='navigation-proof');
   await page.locator('.why-back').click();await page.locator('.why-hub').waitFor();
   assert.equal(await page.evaluate(()=>window.__documentIdentity),'navigation-proof','Must use client navigation');
   const note=page.locator('.why-local-note');await note.scrollIntoViewIfNeeded();
   assert.equal(await note.isVisible(),true);assert.match(await note.innerText(),/this visit only/);
   assert.equal(await page.locator('[role=progressbar]').getAttribute('aria-valuenow'),'1');
   const box=await note.boundingBox();assert.ok(box.width>0 && box.y>=0 && box.y+box.height<=844,'Temporary map notice fits mobile viewport');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`${out}/storage-${mode}-mobile.png`});
   await page.reload();await page.locator('.why-hub').waitFor();
   assert.equal(await page.locator('[role=progressbar]').getAttribute('aria-valuenow'),'0');
   result.status='passed';result.checks=['RU with failed storage','EN/RU background and target feedback','honest optional lab label','real UI completion','client navigation','mobile temporary notice','reload loses temporary completion'];
  } catch(e) {result.status='failed';result.error=e.stack;throw e;} finally {await context.close();save();}
 }
 assert.deepEqual(report.pageErrors,[]);
 console.log('PASS storage regressions:',report.cases.length);
} finally {report.finished=new Date().toISOString();save();await browser.close();}
