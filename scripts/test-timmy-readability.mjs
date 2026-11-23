import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3248',out=process.env.QA_DIR||'docs/timmy/readability-local',before=process.env.BEFORE==='1';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch(),results=[];
const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2];};
try{for(const [device,width,height] of [['narrow',320,740],['phone',390,844],['tablet',820,1180],['tablet-landscape',1180,820],['desktop',1440,1000]])for(const lang of ['en','ru']){
const page=await browser.newPage({viewport:{width,height}});await page.goto(base+'/lessons/clean-inside-outside');await page.locator(`.timmy [data-lang=${lang}]`).click();await page.waitForFunction(l=>document.querySelector('.timmy').lang===l,lang);await page.evaluate(()=>document.fonts.ready);await page.locator('.oh-hero img').evaluate(im=>im.decode());await page.evaluate(()=>scrollTo(0,0));
const data=await page.evaluate(()=>{const sample=s=>{const e=document.querySelector(s),c=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.innerText,font:c.fontFamily,size:parseFloat(c.fontSize),line:parseFloat(c.lineHeight),weight:c.fontWeight,color:c.color,background:c.backgroundColor,top:r.top,height:r.height,width:r.width};};return {title:sample('h1'),intro:sample('.oh-hero div p:nth-of-type(2)'),body:sample('[data-story]'),h2:sample('article h2'),h3:sample('article h3'),button:sample('.oh-top button'),art:sample('.oh-hero img'),background:getComputedStyle(document.querySelector('.timmy')).backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth};});
data.contrast=(Math.max(lum(data.title.color),lum(data.background))+.05)/(Math.min(lum(data.title.color),lum(data.background))+.05);
await page.screenshot({path:`${out}/${device}-${lang}-header.png`});await page.locator('article h2').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${device}-${lang}-story.png`});
if(!before){assert(!data.overflow);for(const k of ['title','intro','body','h2','h3','button'])assert.match(data[k].font,/nunito/i);assert(data.title.size<=36);assert(data.title.height<=data.title.line*2+1);assert(data.body.size>=18);assert(data.body.line/data.body.size<=1.6);assert(data.art.top<height);assert(data.contrast>=4.5);assert.match(await page.locator('.tm-reference').innerText(),/23:13–36/);}
results.push({device,lang,...data});await page.close();}
fs.writeFileSync(out+'/results.json',JSON.stringify({base,before,results},null,2));console.log('PASS readability',results.length,'renders',out);
}finally{await browser.close();}
