import assert from 'node:assert/strict'
import fs from 'node:fs'
const source = fs.readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const line = source.split('\n').find(line => line.includes("event.key === 'Escape'") && line.includes('resumeGame()'))
assert.ok(line, 'actual dialog Escape branch found')
let resumed = 0
const handler = new Function('event', 'resumeGame', line)
for (let i = 0; i < 10; i++) handler({ key: 'Escape', repeat: true, preventDefault() {}, stopPropagation() {} }, () => resumed++)
assert.equal(resumed, 0)
handler({ key: 'Escape', repeat: false, preventDefault() {}, stopPropagation() {} }, () => resumed++)
assert.equal(resumed, 1)
console.log('PASS Sling actual dialog Escape branch: repeats cannot resume; deliberate press resumes once')
