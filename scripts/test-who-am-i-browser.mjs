import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const exports = {};
new Function('exports',ts.transpileModule(fs.readFileSync('app/lessons/who-am-i/content.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exports);
const {copy}=exports;
const out=process.env.QA_DIR || '/home/helper/outputs/jd-who-am-i-web-qa';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for(const [device,viewport] of [['phone',{width:390,height:844}],['tablet',{width:820,height:1180}]]) {
  for(const lang of ['en','ru']) {
   const context=await browser.newContext({viewport,hasTouch:true,baseURL:'http://127.0.0.1:3094'});
   const page=await context.newPage(); const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await page.goto('http://127.0.0.1:3094/lessons/who-am-i');
   await page.getByTestId('start').waitFor();
   if(lang==='ru') {await page.getByRole('button',{name:'EN',exact:true}).click();await page.getByRole('button',{name:'Русский',exact:true}).click();}
   await page.waitForFunction(l=>document.querySelector('article').lang===l,lang);
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.juniordisciples.com/lessons/who-am-i');
   await page.getByTestId('word-mirror').click();
   assert((await page.getByTestId('mirror').innerText()).includes(copy[lang].names[1]));
   await page.screenshot({path:`${out}/${device}-${lang}-intro.png`,fullPage:true});
   await page.getByTestId('start').click();
   async function layout(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${device}/${lang} overflow`);}
   for(let i=0;i<8;i++) {
    const s=copy[lang].scenes[i];
    assert.equal(await page.locator('article h1').innerText(),s.title);
    await layout();
    if(i===3) await page.screenshot({path:`${out}/${device}-${lang}-story.png`,fullPage:true});
    if(i===7) assert.equal(await page.locator('article blockquote').count(),1);
    await page.getByTestId('play').click();
    assert.equal(await page.locator('article blockquote').count(),0);
    assert.equal(await page.getByTestId('mirror').count(),0);
    // Every practice supports a wrong attempt, feedback, hint, and a real retry.
    if(s.kind==='choice') {
     await page.getByTestId(`option-${s.answer[0]===0?1:0}`).click();
    } else if(s.kind==='match') {
     for(let row=0;row<3;row++) await page.getByTestId(`match-${row}-0`).click();
     await page.getByTestId('check').click();
    } else {
     await page.getByTestId('option-0').click(); await page.getByTestId('check').click();
    }
    assert.equal(await page.getByTestId('next').count(),0);
    assert((await page.locator('[data-testid="challenge"] [role="status"]').innerText()).length>10);
    await page.locator('[data-testid="challenge"] summary').click();
    assert(await page.locator('[data-testid="challenge"] details').getAttribute('open')!==null);
    if(s.kind==='choice') await page.getByTestId(`option-${s.answer[0]}`).click();
    else if(s.kind==='match') {
     for(let row=0;row<3;row++) await page.getByTestId(`match-${row}-${s.answer[row]}`).click();
     await page.getByTestId('check').click();
    } else {
     if(s.kind==='sequence') {
      // Return to study is available; returning resets the attempt, not the lesson.
      await page.getByTestId('read-again').click();
      assert.equal(await page.locator('article blockquote').count(),1);
      await page.getByTestId('play').click();
      await page.screenshot({path:`${out}/${device}-${lang}-recall.png`,fullPage:true});
     } else await page.getByTestId('option-0').click();
     for(const id of s.answer) await page.getByTestId(`option-${id}`).click();
     await page.getByTestId('check').click();
    }
    await page.getByTestId('next').waitFor(); await layout();
    if(i===3) await page.screenshot({path:`${out}/${device}-${lang}-feedback.png`,fullPage:true});
    await page.getByTestId('next').focus(); await page.keyboard.press('Enter');
   }
   await page.getByTestId('restart').waitFor();
   assert.equal(await page.locator('article progress').getAttribute('value'),'8');
   await page.locator('article input[type="radio"]').first().check();
   await layout(); await page.screenshot({path:`${out}/${device}-${lang}-complete.png`,fullPage:true});
   for(const a of await page.locator('article a[href$=".pdf"]').all()) {
    const res=await context.request.get(await a.getAttribute('href'));
    assert.equal(res.status(),200); assert((await res.body()).subarray(0,4).toString()==='%PDF');
   }
   await page.getByTestId('restart').click(); await page.getByTestId('start').waitFor();
   // Existing draft deliberately does not persist lesson answers; verify that contract and language persistence.
   await page.getByTestId('start').click(); await page.reload(); await page.getByTestId('start').waitFor();
   assert.equal(await page.locator('article').getAttribute('lang'),lang);
   assert.deepEqual(errors,[]);
   results.push({device,lang,activities:8,wrongRetry:8,overflow:false,consoleErrors:errors,status:'PASS'});
   await context.close();
  }
 }
 fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
