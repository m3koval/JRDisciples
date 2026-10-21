import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.WHY_BASE_URL||'http://127.0.0.1:3142';
const out='docs/why/qa';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/why/01');await page.locator('.why-story-text').waitFor();assert.equal(await page.getByRole('main').count(),1);
await page.locator('.why-player-actions .why-primary').click();await page.waitForFunction(()=>document.querySelector('.why-reading-body h2')?.textContent==='Follow the movement');
const scroll=await page.locator('.why-reading-body h2').boundingBox();assert.ok(scroll.y>=60&&scroll.y<700,'New scene returns to readable viewport instead of leaving child at bottom');
await page.screenshot({path:out+'/detail-phone-scene2.png',fullPage:true});
await page.locator('.why-player-footer > button').click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
for(const lang of ['en','ru']){
 await page.goto(base+'/why/06');await page.locator('.why-player').waitFor();
 if((await page.locator('.why-player').getAttribute('lang'))!==lang){await page.getByRole('button',{name:/^(EN|РУ)$/}).click();await page.getByRole('button',{name:lang==='ru'?'Русский':'English',exact:true}).click();}
 await page.locator(`.why-player[lang="${lang}"]`).waitFor();await page.locator('.why-stage-nav button').nth(2).click();const lab=page.locator('.why-copy-lab');await lab.waitFor();
 await lab.getByRole('button',{name:lang==='ru'?'Синий':'Blue',exact:true}).click();await lab.getByRole('button',{name:lang==='ru'?'К мосту':'To the bridge',exact:true}).click();await lab.locator('.why-primary').click();assert.equal(await lab.locator('.why-correct').count(),0);await lab.getByRole('button',{name:lang==='ru'?'Красный':'Red',exact:true}).click();await lab.getByRole('button',{name:lang==='ru'?'К воротам':'To the gate',exact:true}).click();await lab.locator('.why-primary').click();await lab.locator('.why-correct').waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${out}/detail-copy-${lang}.png`,fullPage:true});
}
await page.goto(base+'/why');await page.locator('.why-hub').waitFor();assert.equal(await page.getByRole('main').count(),1);await page.screenshot({path:out+'/detail-hub-phone.png',fullPage:true});
await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:out+'/detail-hub-desktop.png',fullPage:true});
assert.deepEqual(errors,[]);await browser.close();fs.writeFileSync(out+'/detail-check.json',JSON.stringify({singleMain:true,mobileSceneScroll:true,dialogEscape:true,copyLabENRU:true,wrongRetry:true,pageErrors:errors},null,2));console.log('PASS: detail interaction checks');
