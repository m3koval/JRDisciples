import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8')
const world = read('./ExpeditionWorld.tsx')
const page = read('./page.tsx')
const css = read('./ExpeditionWorld.module.css')

test('route and illustration component have valid TSX syntax', () => {
  for (const [fileName, source] of [['page.tsx', page], ['ExpeditionWorld.tsx', world]]) {
    const result = ts.transpileModule(source, { fileName, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } })
    assert.deepEqual(result.diagnostics, [])
  }
})

test('existing course progress drives both trail and Michael', () => {
  assert.match(page, /<ExpeditionWorld progress=\{progressPercent\} helpers=\{helpers\} isRu=\{isRu\}/)
  assert.match(world, /strokeDasharray=\{`\$\{progress\} 100`\}/)
  const factor = Number(world.match(/progress \* (\.[0-9]+)/)[1])
  assert.equal(12 + 0 * factor, 12)
  assert.equal(12 + 50 * factor, 44)
  assert.equal(12 + 100 * factor, 76)
  assert.match(world, /M120 470 H760/)
})

test('real HP controls cloud scale, opacity, and visible remaining count', () => {
  assert.match(page, /'--cloud-scale' as string\]: \.48 \+ \.52 \* hp \/ giantMaxHp/)
  assert.match(page, /'--cloud-opacity' as string\]: \.5 \+ \.5 \* hp \/ giantMaxHp/)
  assert.match(page, /\{copy.fear\} \{hp\}\/\{giantMaxHp\}/)
  assert.match(page, /disabled=\{phase !== 'play' \|\| resolve < 1\}/)
  assert.match(page, /onClick=\{\(\) => attackGiant\(index\)\}/)
  assert.match(page, /data-testid="giants-game" data-state=/)
})

test('one owned Michael, no canon recoloring, reduced motion and passive scenery', () => {
  assert.equal((world.match(/className=\{styles.sprite\}/g) || []).length, 1)
  assert.match(world, /'Майкл' : 'Michael'/)
  assert.match(css, /michael-trail-sprite.webp/)
  assert.match(css, /900% 400%/)
  assert.match(css, /pointer-events:none/)
  assert.match(css, /prefers-reduced-motion:reduce/)
  assert.doesNotMatch(page, /\.helper(?:\s|\.|::)|\.guide-avatar|\.giant::before|\.promise-light/)
  for (const asset of ['expedition-landscape.svg', 'expedition-camp.svg', 'fear-cloud.svg']) {
    const text = read(`../../../public/images/jr/games/faith-over-giants/${asset}`)
    assert.match(text, /<svg/)
    assert.doesNotMatch(text, /<script|https?:\/\/(?!www.w3.org)/)
  }
})
