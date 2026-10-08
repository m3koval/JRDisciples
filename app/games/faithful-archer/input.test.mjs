import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const match = source.match(/const onPointerCancel = ([\s\S]*?)\n    const onBlur/)
assert.ok(match, 'actual cancellation callback found')
const callback = ts.transpileModule(`const cancel = ${match[1]};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText
const pointerRef = { current: { down: true } }, ownedPointer = { current: 7 }
const cancel = new Function('pointerRef', 'ownedPointer', callback + ';return cancel')(pointerRef, ownedPointer)
cancel({ pointerId: 8 }); assert.equal(pointerRef.current.down, true); assert.equal(ownedPointer.current, 7)
cancel({ pointerId: 7 }); assert.equal(pointerRef.current.down, false); assert.equal(ownedPointer.current, null)
pointerRef.current.down = true; ownedPointer.current = 7
cancel(); assert.equal(pointerRef.current.down, false); assert.equal(ownedPointer.current, null)
assert.match(source, /const onLostPointerCapture = onPointerCancel/)
console.log('PASS Archer actual callback: secondary cancellation ignored, owner cancellation and blur clear aim')
