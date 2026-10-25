import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
function load(name) {
  const exports = {};
  new Function('exports', ts.transpileModule(fs.readFileSync(`app/lessons/who-am-i/${name}.ts`, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exports);
  return exports;
}
const { copy } = load('content');
const { scripture } = load('scripture');
const source = JSON.parse(fs.readFileSync('scripts/fixtures/who-am-i-approved-v18.json','utf8'));
for (const lang of ['en','ru']) {
  const t=copy[lang], approved=source[lang];
  assert.equal(scripture[lang].text, `${approved.scripture9} ${approved.scripture10}`);
  assert.equal(t.scenes.length,8);
  const narrative=t.scenes.flatMap(s=>s.paragraphs).join('\n');
  for(const text of [...approved.story.slice(0,3),approved.speech,approved.gospel]) {
    for(const paragraph of text.replaceAll('**','').split('\n')) assert(narrative.includes(paragraph), `approved ${lang} paragraph absent: ${paragraph}`);
  }
  assert(!/dropped the ball|уронил мяч|try again|попробовать снова/i.test(narrative));
  const recall=t.scenes.at(-1);
  assert.equal(recall.answer.map(id=>recall.options[id]).join(' '),approved.scripture10);
  t.scenes.forEach(s=>{assert(s.paragraphs.length);assert(s.answer.length);assert(s.hint);assert(s.truth);});
}
copy.en.scenes.forEach((s,i)=>{
 const ru=copy.ru.scenes[i];
 assert.equal(s.kind,ru.kind);assert.equal(s.options.length,ru.options.length);assert.deepEqual(s.answer,ru.answer);
});
assert(fs.readFileSync('app/lessons/who-am-i/layout.tsx','utf8').includes('https://www.juniordisciples.com/lessons/who-am-i'));
console.log('PASS: exact full ESV/RST; approved v18 story/dialogue/gospel; 8 bilingual activities; exact recall reconstruction; canonical.');
