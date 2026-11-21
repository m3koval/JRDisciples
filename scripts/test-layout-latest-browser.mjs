import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.BASE_URL || 'http://127.0.0.1:3159';
const out = process.env.QA_DIR || '/home/helper/jd-layout-release-qa/local';
fs.mkdirSync(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const report=[];
try {
 for(const mobile of [false,true]) for(const lang of ['en','ru']) {
  const name=`${mobile?'mobile':'desktop'}-${lang}`;
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
  await context.addInitScript(lang=>localStorage.setItem('language',lang),lang);
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const go=async route=>{await page.goto(base+route);await page.waitForFunction(l=>document.documentElement.lang===l,lang);await page.evaluate(()=>document.fonts.ready);};
  await go('/');
  await page.locator('[data-latest-lesson]').waitFor();
  const home=await page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   return {nav:rect(document.querySelector('nav')),hero:rect(document.querySelector('section')),feature:rect(document.querySelector('a[href="/lessons/why-did-jesus-come"]').closest('section'))};
  });
  assert.ok(Math.abs(home.hero.top-home.nav.bottom)<1,JSON.stringify(home));
  assert.ok(home.feature.top>=home.hero.bottom-1);
  await page.screenshot({path:`${out}/${name}-home.png`});
  const latest=page.locator('[data-latest-lesson]');
  assert.equal(await latest.getAttribute('href'),'/lessons/open-heart');
  assert.match(await latest.innerText(),lang==='ru'?/Новый урок: Религия, которая закрывает Бога/:/New lesson: Religion that shuts God out/);
  await latest.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${name}-latest.png`});
  await latest.click();await page.waitForURL('**/lessons/open-heart');
  await page.waitForFunction(l=>document.querySelector('.oh')?.lang===l,lang);
  assert.match(await page.locator('h1').innerText(),lang==='ru'?/Религия, которая закрывает Бога/:/Religion that shuts God out/);
  report.push({name,home,latestDestination:page.url(),latestHeading:await page.locator('h1').innerText()});
  // Preserve the named older feature's real destination as well.
  await go('/');await page.locator('a[href="/lessons/who-am-i"]').click();await page.waitForURL('**/lessons/who-am-i');
  assert.match(await page.locator('h1').innerText(),lang==='ru'?/Кто я/:/Who am I/i);
  for(const route of ['/lessons','/stories','/quiz','/memory','/puzzles','/rebus']) {
   await go(route); await page.locator('[data-full-image-tile]').first().waitFor();
   const geometry=await page.locator('[data-full-image-tile]').evaluateAll(tiles=>tiles.map(a=>{
    const r=a.getBoundingClientRect(),content=a.lastElementChild,c=content.getBoundingClientRect(),b=content.lastElementChild.getBoundingClientRect();
    return {href:a.getAttribute('href'),top:r.top,height:r.height,bottom:r.bottom,ctaTop:b.top,ctaBottom:b.bottom,contentBottom:c.bottom,overflow:content.scrollHeight>content.clientHeight+1,image:a.querySelector('img').naturalWidth};
   }));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for(const g of geometry){assert.ok(!g.overflow,JSON.stringify(g));assert.ok(g.ctaBottom<=g.bottom,JSON.stringify(g));assert.ok(g.image>0);}
   const rows=new Map();for(const g of geometry){const key=Math.round(g.top);rows.set(key,[...(rows.get(key)||[]),g]);}
   const spreads=[...rows.values()].map(row=>Math.max(...row.map(g=>g.ctaBottom))-Math.min(...row.map(g=>g.ctaBottom)));
   assert.ok(spreads.every(n=>n<1),`${route} ${name} ${spreads}`);
   if(route==='/lessons') {
    assert.equal(geometry.length,28);
    assert.deepEqual(geometry.slice(0,3).map(g=>g.href),['/lessons/open-heart','/lessons/words-and-deeds','/lessons/davids-lord']);
    const center=await page.evaluate(()=>{const i=document.querySelector('img[src="/images/jr/lessons-hero.png"]').getBoundingClientRect(),h=document.querySelector('h1').getBoundingClientRect();return (i.left+i.width/2)-(h.left+h.width/2);});assert.ok(Math.abs(center)<1);
    await page.screenshot({path:`${out}/${name}-directory-header.png`});
    const previous=report.find(r=>r.route==='/lessons'&&r.name===`${mobile?'mobile':'desktop'}-en`);if(lang==='ru')assert.deepEqual(geometry.map(g=>g.href),previous.geometry.map(g=>g.href));
   }
   await page.locator('[data-full-image-tile]').first().scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${name}-${route.slice(1)}-grid.png`});
   report.push({name,route,geometry,maxCtaSpread:Math.max(...spreads)});
  }
  for(const slug of ['holy-spirit','who-is-jesus']) {
   await go('/lessons/'+slug);await page.evaluate(()=>scrollTo(0,1300));await page.waitForTimeout(100);
   const sticky=await page.evaluate(()=>{const n=document.querySelector('nav').getBoundingClientRect();const p=[...document.querySelectorAll('div')].find(e=>e.style.position==='sticky').getBoundingClientRect();return {navBottom:n.bottom,progressTop:p.top};});
   assert.ok(sticky.progressTop>=sticky.navBottom,JSON.stringify(sticky));await page.screenshot({path:`${out}/${name}-${slug}-sticky.png`});report.push({name,slug,sticky});
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 // Network failure must retain the original hero artwork and reserved media area.
 const c=await browser.newContext();await c.route('**/videos/hero-main.mp4',r=>r.abort());const p=await c.newPage();await p.goto(base+'/');await p.locator('section > img[src="/images/jr/home-hero.png"]').waitFor();await c.close();
 fs.writeFileSync(`${out}/report.json`,JSON.stringify({base,status:'PASS',report},null,2));console.log(`PASS ${report.length} recorded cases: EN/RU desktop/mobile, all shared tile consumers, actual latest/named clicks, sticky bars, video failure`);
} catch(error) {fs.writeFileSync(`${out}/failure.json`,JSON.stringify({error:String(error),report},null,2));throw error;} finally {await browser.close();}
