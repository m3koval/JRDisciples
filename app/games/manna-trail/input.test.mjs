import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const match = source.match(/function onKey\(e: KeyboardEvent\) \{([\s\S]*?)\n    window.addEventListener\('keydown', onKey/)
assert.ok(match, 'actual key handler found')
const compiled = ts.transpileModule(`function onKey(e: KeyboardEvent) {${match[1]}`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText
for (const key of ['Escape', 'p', 'P']) {
 const phaseRef = { current: 'play' }
 const onKey = new Function('phaseRef', 'changePhase', 'pushDir', compiled + ';return onKey')(phaseRef, phase => { phaseRef.current = phase }, () => {})
 onKey({ key, repeat: false, preventDefault() {} }); assert.equal(phaseRef.current, 'paused')
 for (let i = 0; i < 10; i++) onKey({ key, repeat: true, preventDefault() {} })
 assert.equal(phaseRef.current, 'paused')
 onKey({ key, repeat: false, preventDefault() {} }); assert.equal(phaseRef.current, 'play')
}
console.log('PASS Manna actual key handler: held pause keys cannot auto-resume; deliberate next press resumes')
