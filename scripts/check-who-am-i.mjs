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
  const web = JSON.parse(fs.readFileSync('scripts/fixtures/who-am-i-web-copy.json','utf8'));
  assert.deepEqual(t,web[lang], `reviewed website copy drift: ${lang}`);
  const guards = lang === 'en' ? ['picked me last','one last chance to tie','missed the ball','The game ended','I’ve missed before','Come sit with us','I wanted to win','Jesus has been so kind','Missing a kick was not a sin','Jesus died for our sins and rose again','cannot earn salvation by being kind','through trusting Jesus','pray directly to God through Jesus'] : ['выбрали последним','последний шанс сравнять счёт','промахнулся по мячу','Игра закончилась','я тоже промахивался','посиди с нами','Я хотел выиграть','Иисус так добр','Промахнуться по мячу — не грех','Иисус умер за наши грехи и воскрес','Добротой нельзя заслужить спасение','через веру в Иисуса','молиться прямо Богу через Иисуса'];
  for(const text of guards) assert(narrative.includes(text), `plot/theology guard missing: ${text}`);
  assert(!/dropped the ball|уронил мяч/i.test(narrative));
  const recall=t.scenes.at(-1);
  assert.equal(recall.answer.map(id=>recall.options[id]).join(' '),approved.scripture10);
  t.scenes.forEach(s=>{assert(s.paragraphs.length);assert(s.answer.length);assert(s.hint);assert(s.truth);});
}
copy.en.scenes.forEach((s,i)=>{
 const ru=copy.ru.scenes[i];
 assert.equal(s.kind,ru.kind);assert.equal(s.options.length,ru.options.length);assert.deepEqual(s.answer,ru.answer);
});
assert(fs.readFileSync('app/lessons/who-am-i/layout.tsx','utf8').includes('https://www.juniordisciples.com/lessons/who-am-i'));
console.log('PASS: exact full ESV/RST; reviewed website fixture + plot/gospel guards; 8 bilingual activities; exact recall reconstruction; canonical.');
