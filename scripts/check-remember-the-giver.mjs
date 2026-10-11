import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function load(file) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const context = { exports: {} }
  vm.runInNewContext(js, context)
  return context.exports
}
const dir = 'app/lessons/remember-the-giver/'
const { copy, scriptureEn, scriptureRu } = load(`${dir}content.ts`)
const { teacherGuide } = load(`${dir}teacher-guide.ts`)
assert.equal(scriptureEn.text, 'then take care lest you forget the LORD, who brought you out of the land of Egypt, out of the house of slavery.')
assert.equal(scriptureRu.text, 'тогда берегись, чтобы [не обольстилось сердце твое и] не забыл ты Господа, Который вывел тебя из земли Египетской, из дома рабства.')
assert.equal(copy.en.verseTiles.join(' '), scriptureEn.text)
assert.equal(copy.ru.verseTiles.join(' '), scriptureRu.text)
assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ru).sort())
for (const language of ['en', 'ru']) {
  const t = copy[language]
  assert.equal(t.scenes.length, 6)
  assert.equal(teacherGuide[language].pages.length, 6)
  assert.equal(t.kingTiles.length, 3)
  t.scenes.forEach((s, i) => {
    assert.ok(s.paragraphs.length >= 3)
    assert.ok(s.task && s.hint && s.truth)
    assert.equal(s.paragraphs.length, copy.en.scenes[i].paragraphs.length)
    if (i === 1 || i === 3) assert.equal(s.answer, -1)
    else assert.ok(s.answer >= 0 && s.answer < s.options.length)
    if (language === 'ru') assert.match(s.paragraphs.join(' '), /[А-Яа-я]/)
  })
  const data = fs.readFileSync(`data/lessons${language === 'ru' ? '-ru' : ''}.ts`, 'utf8')
  assert.match(data, /href: "\/lessons\/remember-the-giver"/)
}
assert.match(copy.en.scenes[5].paragraphs.join(' '), /Gratitude grows because of His grace; it does not earn it/)
assert.match(copy.ru.scenes[5].paragraphs.join(' '), /Благодарность вырастает из Его благодати, а не зарабатывает её/)
assert.ok(fs.statSync('public/images/jr/lessons/remember-the-giver/cover.webp').size > 1000)
console.log('Remember the Giver: EN/RU six-section parity, exact sourced verse fixtures, verse tiles, challenges, grace safeguards, registry, and cover passed.')
