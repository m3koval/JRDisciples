import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const page=fs.readFileSync('app/games/truth-runner/page.tsx','utf8')
const match=page.match(/const WISDOM = (\[[\s\S]*?\n\])/)
assert.ok(match)
const actual=JSON.parse(JSON.stringify(vm.runInNewContext(match[1])))
const fixture=JSON.parse(fs.readFileSync('scripts/fixtures/truth-runner-scripture.json','utf8'))
assert.equal(actual.length,4)
assert.equal(fixture.verses.length,4)
for(let i=0;i<4;i++) {
 for(const key of ['en','ru','refEn','refRu']) assert.equal(actual[i][key],fixture.verses[i][key],`${i} ${key}`)
 assert.match(fixture.verses[i].sourceEn,/^https:\/\/www.bible.com\/bible\/59\//)
 assert.match(fixture.verses[i].sourceRu,/^https:\/\/www.bible.com\/bible\/400\//)
}
console.log('PASS Truth Runner: all 4 exact ESV/Synodal verse pairs and references')
