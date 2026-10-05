import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const mechanics = readFileSync(new URL('../app/games/david-sling-challenge/mechanics.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(mechanics, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const { resolveShot, releaseError } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
for (const [target, wind, window] of [[42, 0, 17], [50, -5, 13], [58, 7, 10]]) {
  const perfect = resolveShot(target - wind, target, wind, window, false)
  assert.equal(perfect.result, 'perfect')
  assert.equal(perfect.points, 120)
  assert.equal(perfect.advance, true)
  assert.equal(resolveShot(target - wind + window, target, wind, window, false).result, 'hit')
  assert.equal(resolveShot(target - wind + window + 1, target, wind, window, false).result, 'near')
  const saved = resolveShot(target - wind + 100, target, wind, window, true)
  assert.equal(saved.result, 'saved')
  assert.equal(saved.stoneCost, 0, 'shield preserves even the final stone')
  assert.equal(saved.consumeShield, true, 'shield is single-use')
  assert.equal(resolveShot(target - wind + 100, target, wind, window, false).stoneCost, 1)
}
assert.equal(releaseError(359, 1, 0), -2)
const source = readFileSync(new URL('../app/games/david-sling-challenge/page.tsx', import.meta.url), 'utf8')
assert.match(source, /setScore\(checkpointScore\)/)
assert.match(source, /setCheckpointScore\(score \+ points\)/)
assert.match(source, /function exitGame\(\) \{\s+cancelPending\(\)/)
assert.match(source, /level\.targetAngle - effectiveWind/)
console.log('PASS: all 3 level timing boundaries, wind alignment, one-use shield, final-stone recovery, angle wrap; checkpoint/exit wiring guards')
