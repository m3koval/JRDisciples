const { chromium } = await import(process.env.WHY_PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
// Real UI only: no injected answers, progress, or completion state.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs/why/qa');
fs.mkdirSync(out, { recursive: true });
const base = process.env.WHY_BASE_URL || 'http://127.0.0.1:3141';
const lessons = Array.from({ length: 52 }, (_, i) => JSON.parse(fs.readFileSync(path.join(root, `data/why/lesson-${String(i + 1).padStart(2, '0')}.json`))));
const report = { started: new Date().toISOString(), base, method: 'Fresh browser contexts; all actions through UI. No storage injection. Exact rendered copy checked against lesson fixtures, not external Scripture verification.', cases: lessons.flatMap(l => ['en', 'ru'].map(lang => ({ id: l.id, lang, type: l.activity.type, status: 'pending' }))), layouts: [], pageErrors: [], art: [], contentGate: 'RUNNING', visualGate: 'PENDING' };
function save() {
  fs.writeFileSync(out + '/all-browser-check.json', JSON.stringify(report, null, 2));
  const passed = report.cases.filter(c => c.status === 'passed').length;
  fs.writeFileSync(out + '/all-browser-report.md', `# WHY all-lesson browser QA\n\nStarted: ${report.started}\n\nContent gate: **${report.contentGate}** (${passed}/104 bilingual lesson cases passed).\n\nVisual readiness gate: **${report.visualGate}**. Image readiness is separate from content; screenshots are evidence, not an automatic art-direction approval.\n\n${report.method}\n\n## Failures\n${report.cases.filter(c => c.status === 'failed').map(c => `- Lesson ${c.id} ${c.lang}: ${c.error}`).join('\n') || '- None recorded so far.'}\n\n## Layouts\n${report.layouts.map(l => `- ${l.lang} ${l.name}: ${l.status}; missing/broken images: ${l.images?.filter(i => !i.ready).length ?? 'unknown'}`).join('\n')}\n\nSee all-browser-check.json for incremental per-case evidence, missing art, and runtime errors.\n`);
}
save();
const health = await fetch(base + '/why/01');
assert.equal(health.status, 200, 'Dev server must be ready');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
const norm = s => s.replace(/\s+/g, ' ').trim();
async function text(locator, expected) {
  // Click completion does not guarantee React's persisted-state rerender finished.
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (norm(await locator.innerText()) === norm(expected)) return;
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  assert.equal(norm(await locator.innerText()), norm(expected));
}
async function language(page, lang) {
  if (await page.locator('.why-player').getAttribute('lang') === lang) return;
  await page.getByRole('button', { name: /^(EN|РУ)$/ }).click();
  await page.getByRole('button', { name: lang === 'ru' ? 'Русский' : 'English', exact: true }).click();
  await page.locator(`.why-player[lang="${lang}"]`).waitFor();
}
async function images(page) {
  return page.locator('main img:visible').evaluateAll(imgs => imgs.map(i => ({ src: i.currentSrc || i.src, ready: i.complete && i.naturalWidth > 0 })));
}
async function runLanguage(lang, subset) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage(); page.setDefaultTimeout(7000);
  page.on('pageerror', e => { report.pageErrors.push({ lang, url: page.url(), message: e.message }); save(); });
  await page.goto(`${base}/why/01`); await page.locator('.why-story-text').waitFor(); await language(page, lang);
  for (const l of subset) {
    const result = report.cases.find(c => c.id === l.id && c.lang === lang);
    result.status = 'running'; save();
    try {
      await page.goto(`${base}/why/${String(l.id).padStart(2, '0')}`, { waitUntil: 'domcontentloaded' });
      await page.locator('.why-story-text').waitFor(); await page.locator(`.why-player[lang="${lang}"]`).waitFor();
      await text(page.locator('main h1'), l.title[lang]);
      assert.equal(await page.locator('.why-stage-nav button').nth(3).isDisabled(), true);
      for (let i = 0; i < l.scenes.length; i++) {
        await text(page.locator('.why-reading-body h2'), l.scenes[i].title[lang]);
        assert.deepEqual((await page.locator('.why-story-text p').allTextContents()).map(norm), l.scenes[i].paragraphs[lang].map(norm));
        report.art.push({ id: l.id, lang, scene: i + 1, images: await images(page) });
        await page.locator('.why-player-actions .why-primary').click();
      }
      result.storyScenes = l.scenes.length;
      await text(page.locator('.why-scripture blockquote'), l.scripture.text[lang]);
      assert.equal(await page.locator('.why-reading-body > a').getAttribute('href'), l.scripture.url[lang]);
      await page.locator('.why-player-footer > button').click();
      const dialog = page.locator('dialog[open]'); await dialog.waitFor();
      assert.equal(await dialog.locator('article').count(), l.sources.length + 1);
      for (let i = 0; i < l.sources.length; i++) {
        const article = dialog.locator('article').nth(i); const s = l.sources[i];
        assert.equal(await article.locator('h3 a').getAttribute('href'), s.url);
        assert.ok((await article.innerText()).includes(s.title[lang]));
        assert.ok((await article.innerText()).includes(s.supports[lang]));
        assert.ok((await article.innerText()).includes(s.limits[lang]));
      }
      assert.ok((await dialog.innerText()).includes(l.adultNote[lang]));
      for (const image of await dialog.locator('img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(i => i.decode()); assert.ok(await image.evaluate(i => i.complete && i.naturalWidth > 0)); }
      await page.keyboard.press('Escape'); assert.equal(await dialog.count(), 0); result.sources = true;
      await page.locator('.why-stage-nav button').nth(2).click();
      if (await page.locator('.why-lab-next').count()) await page.locator('.why-lab-next').click();
      const board = page.locator('.why-activity'); await board.waitFor(); const a = l.activity;
      for (const item of a.items) assert.ok((await board.innerText()).includes(item.text[lang]));
      if (a.type === 'choose') {
        assert.equal(await board.locator('.why-primary').isDisabled(), true);
        await board.locator(`[data-item="${a.items.find(i => i.id !== a.correctId).id}"]`).click();
      } else if (a.type === 'sort') {
        assert.equal(await board.locator('.why-primary').isDisabled(), true);
        for (const i of a.items) await board.locator(`[data-item="${i.id}"] [data-group="${a.groups.find(g => g.id !== i.group).id}"]`).click();
      } else {
        const order = await board.locator('li').evaluateAll(es => es.map(e => e.dataset.item));
        if (JSON.stringify(order) === JSON.stringify(a.correctOrder)) await board.locator('li').first().locator('button').last().click();
      }
      await board.locator('.why-primary').click(); await board.locator('.why-feedback:not(.why-correct)').waitFor();
      assert.ok((await board.innerText()).includes(a.hint[lang]));
      assert.equal(await page.locator('.why-player-actions .why-primary').count(), 0);
      assert.equal(await page.locator('.why-stage-nav button').nth(3).isDisabled(), true); result.wrongRetry = true;
      if (a.type === 'choose') await board.locator(`[data-item="${a.correctId}"]`).click();
      else if (a.type === 'sort') for (const i of a.items) await board.locator(`[data-item="${i.id}"] [data-group="${i.group}"]`).click();
      else for (let target = 0; target < a.correctOrder.length; target++) {
        let order = await board.locator('li').evaluateAll(es => es.map(e => e.dataset.item));
        for (let index = order.indexOf(a.correctOrder[target]); index > target; index--) await board.locator(`[data-item="${a.correctOrder[target]}"] button`).first().click();
      }
      assert.equal(await board.locator('.why-correct').count(), 0, 'Explicit Check required');
      await board.locator('.why-primary').click(); await board.locator('.why-correct').waitFor();
      assert.ok((await board.innerText()).includes(a.success[lang]));
      await page.locator('.why-player-actions .why-primary').click();
      assert.equal(await page.locator('.why-player-actions .why-primary').isDisabled(), true);
      await text(page.locator('.why-field-mission p'), l.fieldMission[lang]);
      await page.locator('.why-reflection input').check(); await page.locator('.why-player-actions .why-primary').click();
      await page.locator('.why-completion').waitFor(); await page.reload(); await page.locator('.why-completion').waitFor();
      await text(page.locator('.why-completion blockquote'), l.scripture.text[lang]);
      result.completionAndReload = true; result.status = 'passed';
    } catch (e) { result.status = 'failed'; result.error = e.message; }
    save(); console.log(`${lang} ${l.id}: ${result.status}${result.error ? ' ' + result.error : ''}`);
  }
  await context.close();
}
try {
  await Promise.all(['en', 'ru'].flatMap(lang => [lessons.slice(0,26), lessons.slice(26)].map(subset => runLanguage(lang, subset))));
  for (const lang of ['en', 'ru']) for (const [name, width, height] of [['phone', 390, 844], ['tablet', 1180, 820]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: true }); const page = await context.newPage(); page.setDefaultTimeout(7000);
    const result = { lang, name, status: 'running', images: [] }; report.layouts.push(result); save();
    try {
      for (const id of [1, 6, 29, 52]) {
        await page.goto(`${base}/why/${String(id).padStart(2, '0')}`); await page.locator('.why-story-text').waitFor(); if (id === 1) await language(page, lang); else await page.locator(`.why-player[lang="${lang}"]`).waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${id} overflow`);
        await page.locator('.why-scene-art img').evaluateAll(async imgs => { await Promise.all(imgs.map(i => i.decode().catch(() => {}))); });
        result.images.push(...(await images(page)).map(i => ({ id, ...i })));
        await page.screenshot({ path: `${out}/all-${id}-${lang}-${name}.png`, fullPage: true });
        await page.locator('.why-player-footer > button').click(); await page.locator('dialog[open]').waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'notebook overflow');
        await page.keyboard.press('Escape');
      }
      result.status = 'passed';
    } catch (e) { result.status = 'failed'; result.error = e.message; }
    await context.close(); save();
  }
  // Final filesystem inventory is separate: generation may finish during content tests.
  report.missingArt = lessons.flatMap(l => [1, 2, 3, 4].map(s => `/images/jr/why/lesson-${String(l.id).padStart(2, '0')}-scene-${s}.webp`)).filter(p => !fs.existsSync(root + '/public' + p) || fs.statSync(root + '/public' + p).size === 0);
  report.contentGate = report.cases.every(c => c.status === 'passed') && !report.pageErrors.length ? 'PASS' : 'FAIL';
  report.visualGate = report.layouts.length === 4 && report.layouts.every(l => l.status === 'passed' && l.images.every(i => i.ready)) && !report.missingArt.length ? 'READINESS PASS — art-direction review still required' : 'FAIL';
} finally { report.finished = new Date().toISOString(); save(); await browser.close(); }
console.log(JSON.stringify({ contentGate: report.contentGate, visualGate: report.visualGate, passed: report.cases.filter(c => c.status === 'passed').length, missingArt: report.missingArt?.length }));
process.exitCode = report.contentGate === 'PASS' && report.visualGate.startsWith('READINESS PASS') ? 0 : 1;
