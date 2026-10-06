import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const mechanics = readFileSync(new URL('../app/games/david-sling-challenge/mechanics.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(mechanics, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const { resolveShot, releaseError, slingScene, shotCurve, curvePoint } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
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
for (const [width, height] of [[320,300],[390,390],[660,540],[280,260],[768,600]]) {
  const scene = slingScene(width,height)
  assert.ok(scene.left >= 0 && scene.top >= (height<340 ? 0 : 88))
  assert.ok(scene.left+scene.width <= width && scene.top+scene.height <= height-(height<340 ? 0 : 100)+.001)
  assert.ok(Math.abs(scene.width/scene.height-4/3)<1e-9)
  for (const window of [10,13,17,25]) {
    for (const error of [-170,-30,-window,0,window,30,170]) {
      const curve=shotCurve(scene,error,window)
      assert.deepEqual(curvePoint(curve,0),scene.origin)
      assert.deepEqual(curvePoint(curve,1),curve.end)
      const offset=Math.abs(curve.end.y-scene.target.y)/scene.height
      assert.ok(Math.abs(error)<=window ? offset<=.055001 : offset>=.12)
      for (let t=0;t<=1;t+=.1) { const p=curvePoint(curve,t);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)) }
    }
  }
}
assert.match(source,/transitionRef.current = \{ remaining: 950/)
assert.match(source,/if \(pausedRef.current \|\| !worldReady.current\) return/)
assert.match(source,/worldReady.current=status==='ready'/)
assert.match(source,/pointerRef.current !== event.pointerId/)
console.log('PASS: 5 scene sizes × 4 timing windows × 7 errors: uncropped art, shared cue/stone curve, target hit/miss agreement; pause/owner wiring')
