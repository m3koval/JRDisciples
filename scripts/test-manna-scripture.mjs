import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const page=fs.readFileSync('app/games/manna-trail/page.tsx','utf8')
const block=page.slice(page.indexOf('function verseWords('),page.indexOf('// ─── Component'))
const js=ts.transpileModule(block+'\nglobalThis.verses={en:VERSES_EN,ru:VERSES_RU}',{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText
const scope={};vm.runInNewContext(js,scope)
const fixtures=JSON.parse(fs.readFileSync('scripts/fixtures/manna-scripture.json','utf8'))
assert.equal(fixtures.verses.length,18)
for(const f of fixtures.verses) {
 const v=scope.verses[f.language][f.index]
 assert.equal(v.quote,f.quote);assert.equal(v.ref,f.ref)
 assert.equal(v.words.join(' '),v.quote.replace(/[.,;!—]/g,'').split(/\s+/).filter(Boolean).join(' '))
 assert.ok(v.words.length>=4 && v.words.length<=12)
}
assert.ok(page.includes('&ldquo;{verse.quote}&rdquo;'))
console.log('PASS Manna: 18 exact ESV/Synodal excerpts and punctuation-free word sequences')
