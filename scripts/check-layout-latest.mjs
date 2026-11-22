import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root = process.env.SOURCE_ROOT || process.cwd();
const cache = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('exports','require',code)(exports, name => load(path.resolve(path.dirname(file), name + '.ts')));
  cache.set(file, exports); return exports;
}
const {lessonTopics} = load('data/lessons.ts');
const {lessonTopicsRu} = load('data/lessons-ru.ts');
const {getLessonCatalog, getLatestPublishedLesson} = load('data/lesson-catalog.ts');
assert.deepEqual([...lessonTopics.map(x=>x.href)].sort(), [...lessonTopicsRu.map(x=>x.href)].sort());
for (const lang of ['en','ru']) {
  const catalog = getLessonCatalog(lang);
  assert.equal(new Set(catalog.map(x=>x.href)).size, catalog.length);
  assert.deepEqual(catalog.map(x=>x.href), lessonTopics.map(x=>x.href));
  // Published releases are prepended, not chosen by file/SEO modification dates.
  assert.equal(getLatestPublishedLesson(lang).href, '/lessons/clean-inside-outside');
  assert.deepEqual(catalog.slice(0,3).map(x=>x.href), ['/lessons/clean-inside-outside','/lessons/words-and-deeds','/lessons/davids-lord']);
  assert.equal(getLatestPublishedLesson(lang), catalog[0]);
  assert.ok(fs.existsSync(path.join(root,'public',catalog[0].image)));
  assert.ok(fs.existsSync(path.join(root,'app',catalog[0].href,'page.tsx')));
}
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('app/HomePage.tsx');
assert.ok(home.indexOf('<section') < home.indexOf('<WhyJesusCameFeature />'));
assert.ok(home.includes('<LatestLessonFeature />'));
const latest=read('components/LatestLessonFeature.tsx');
for (const token of ['getLatestPublishedLesson(language)','href={lesson.href}','src={lesson.image}','{lesson.title}']) assert.ok(latest.includes(token),token);
assert.doesNotMatch(read('components/WhoAmIFeature.tsx'), /New lesson|Новый урок/);
assert.match(read('components/WhoAmIFeature.tsx'), /href="\/lessons\/who-am-i"/);
assert.doesNotMatch(read('components/AloneWithGodFeature.tsx'), /compact|Урок недели/);
assert.match(read('components/JrFullImageTile.tsx'), /marginTop: "auto"/);
assert.match(read('app/lessons/page.tsx'), /margin: "0 auto 20px"/);
for(const slug of ['holy-spirit','who-is-jesus']) assert.match(read(`app/lessons/${slug}/page.tsx`), /top: 'var\(--site-nav-height\)'/);
console.log(`PASS: latest localized title/art/link, ${lessonTopics.length} ordered bilingual lessons, preserved named destinations, hero and layout contracts`);
