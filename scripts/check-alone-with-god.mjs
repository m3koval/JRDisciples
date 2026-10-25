import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
function load(file){const box={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText,box);return box.exports}
const {copy}=load('app/lessons/alone-with-god/content.ts')
const {scriptureEn,scriptureRu}=load('app/lessons/alone-with-god/scripture.ts')
const fixtures=JSON.parse(fs.readFileSync('scripts/fixtures/alone-with-god-scripture.json','utf8'))
function parity(a,b,at='copy'){
 assert.equal(typeof a,typeof b,at)
 if(Array.isArray(a)){assert.equal(a.length,b.length,at);a.forEach((v,i)=>parity(v,b[i],`${at}[${i}]`));return}
 if(a&&typeof a==='object'){assert.deepEqual(Object.keys(a),Object.keys(b),at);Object.keys(a).forEach(k=>parity(a[k],b[k],`${at}.${k}`))}
}
parity(copy.en,copy.ru);parity(scriptureEn,scriptureRu)
for(const [lang,verses] of [['en',scriptureEn],['ru',scriptureRu]]){
 assert.equal(copy[lang].scenes.length,7)
 const byUrl=Object.fromEntries(Object.values(fixtures[lang]).map(v=>[v.url,v.text]))
 assert.equal(Object.keys(verses).length,11)
 for(const v of Object.values(verses))assert.equal(v.text,byUrl[v.url],`${lang} ${v.reference}`)
 assert.equal(verses.continual.text.split(' ').join(' '),verses.continual.text)
 for(const s of copy[lang].scenes){assert(s.paragraphs.length>=3);for(const key of s.verses)assert(verses[key]);for(const id of s.answer)assert(id>=0&&id<s.options.length)}
 assert.equal(new Set(copy[lang].scenes.map(s=>s.kind)).size,5)
 for(const suffix of ['LETTER-LONG-EDGE','READING-ORDER','TEACHER-ANSWERS'])assert(fs.statSync(`public/printables/alone-with-god/Alone-with-God-${lang.toUpperCase()}-${suffix}.pdf`).size>1000)
}
const home=fs.readFileSync('app/page.tsx','utf8');const at=home.indexOf('<AloneWithGodFeature compact')
assert(at>=0&&at<home.indexOf('href: "/stories"'))
// The newly released Who Am I lesson leads; preserve prayer directly after it.
for(const file of ['data/lessons.ts','data/lessons-ru.ts'])assert.deepEqual([...fs.readFileSync(file,'utf8').matchAll(/href: "([^"]+)"/g)].slice(0,2).map(m=>m[1]),['/lessons/who-am-i','/lessons/alone-with-god'])
assert(fs.readFileSync('components/AloneWithGodFeature.tsx','utf8').includes('/images/lessons/alone-with-god/hero.png'))
console.log('Alone with God PASS: 22 exact Scripture entries, EN/RU structural parity, 7 scenes / 5 activity types, six print PDFs, retained home placement and listing directly after Who Am I.')
