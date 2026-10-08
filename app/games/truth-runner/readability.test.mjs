import assert from 'node:assert/strict'
import fs from 'node:fs'
const css=fs.readFileSync(new URL('./runner.module.css',import.meta.url),'utf8')
const feedback=css.match(/\.feedback \{([^}]+)\}/)[1]
assert.match(feedback,/background:#12352ef2/)
assert.match(feedback,/color:#fff6dd/)
assert.match(feedback,/pointer-events:none/)
assert.match(feedback,/max-width:90%/)
assert.match(css,/\.feedback:empty \{ display:none; \}/)
assert.match(css,/\.controls small \{ display:block; color:#263d30; \}/)
console.log('PASS 6 readability CSS contracts (not raster/device evidence)')
