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
const titles = { en: 'When Everything Is Going Well', ru: 'Когда всё хорошо' }
const endings = { en: 'Jesus Is Better Than Life!', ru: 'Иисус дороже жизни!' }
assert.equal(scriptureEn.text, 'then take care lest you forget the LORD, who brought you out of the land of Egypt, out of the house of slavery.')
assert.equal(scriptureRu.text, 'тогда берегись, чтобы [не обольстилось сердце твое и] не забыл ты Господа, Который вывел тебя из земли Египетской, из дома рабства.')
assert.equal(copy.en.verseTiles.join(' '), scriptureEn.text)
assert.equal(copy.ru.verseTiles.join(' '), scriptureRu.text)
assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ru).sort())
for (const language of ['en', 'ru']) {
  const t = copy[language]
  assert.equal(t.title, titles[language])
  assert.equal(t.done, endings[language])
  assert.equal(t.scenes[5].title, endings[language])
  assert.equal(teacherGuide[language].pages[5].title, endings[language])
  assert.equal(teacherGuide[language].title, titles[language])
  const dangers = language === 'en' ? ['Forget God', 'Reject God’s authority', 'Replace God with His gifts'] : ['Забыть Бога', 'Отвергнуть Божью власть', 'Заменить Бога Его дарами']
  const responses = language === 'en' ? ['Remember Him', 'Listen to Him', 'Put Him first'] : ['Помни Его', 'Слушай Его', 'Ставь Его на первое место']
  dangers.forEach((danger, i) => {
    assert.ok(t.scenes[2].paragraphs[i].includes(danger))
    assert.ok(t.scenes[4].truth.includes(danger))
    assert.ok(t.plans[i].includes(danger))
    assert.ok(t.scenes[4].truth.includes(responses[i]))
  })
  assert.ok(t.scenes[4].options[t.scenes[4].answer].includes(language === 'en' ? 'listen to Him' : 'слушать Его'))
  assert.equal(t.scenes[0].paragraphs[1].split('\n').length, 3, 'Dialogue must have separate speaking lines')
  assert.doesNotMatch(JSON.stringify(t.scenes), /remember the giver|overlook the giver|замечать дарителя/i)
  assert.match(t.scenes[5].paragraphs.join(' '), language === 'en' ? /forgiveness and eternal life/ : /прощение и вечную жизнь/)
  assert.equal(t.scenes.length, 6)
  const example = t.scenes[2].paragraphs.slice(4).join(' ')
  assert.match(example, language === 'en' ? /Jack Whittaker.*millions.*help people.*torn up the winning ticket/ : /Джек Уиттакер.*миллионы.*помогать.*порвал выигрышный билет/)
  assert.match(example, language === 'en' ? /every toy and game.*thank you.*God’s help/ : /все игрушки и игры.*спасибо.*Божья помощь/)
  assert.equal(teacherGuide[language].exampleSource.url, 'https://abcnews.com/2020/powerball-winner-cursed/story?id=3012631')
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
  const registryLine = data.split('\n').find(line => line.includes('href: "/lessons/remember-the-giver"'))
  assert.ok(registryLine.includes(`title: "${titles[language]}"`))
  assert.match(data, /href: "\/lessons\/remember-the-giver"/)
}
assert.match(copy.en.scenes[5].paragraphs.join(' '), /don’t have to earn His forgiveness/)
assert.match(copy.en.scenes[5].paragraphs.join(' '), /He saves us by grace/)
assert.match(copy.ru.scenes[5].paragraphs.join(' '), /Не нужно заслуживать прощение/)
assert.match(copy.ru.scenes[5].paragraphs.join(' '), /Он спасает нас по благодати/)
assert.ok(fs.statSync('public/images/jr/lessons/remember-the-giver/cover.webp').size > 1000)
console.log('Remember the Giver: EN/RU six-section parity, exact sourced verse fixtures, verse tiles, challenges, grace safeguards, registry, and cover passed.')
