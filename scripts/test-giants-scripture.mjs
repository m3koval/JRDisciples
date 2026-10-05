import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const source = readFileSync(new URL('../app/games/faith-over-giants/page.tsx', import.meta.url), 'utf8')
const fixture = JSON.parse(readFileSync(new URL('./fixtures/giants-scripture.json', import.meta.url), 'utf8'))
assert.equal(fixture.length,14)
for (const lang of ['en','ru']) {
  const values = [...source.matchAll(new RegExp(`text${lang==='en'?'En':'Ru'}: '([^']*)',`, 'g'))].map(m=>m[1])
  assert.equal(values.length,7)
  for (const item of fixture.filter(x=>x.language===lang)) {
    assert.equal(values[item.index],item.text,`${lang} verse ${item.index} differs from source-verified excerpt`)
    assert.ok(item.url.startsWith(`https://www.bible.com/bible/${lang==='en'?'59':'400'}/`))
  }
}
assert.doesNotMatch(source,/&ldquo;\{isRu \? scripture.textRu/)
console.log('PASS: all 14 Giants ESV/Synodal excerpts match live-source fixtures; no duplicate quotation wrapper')
