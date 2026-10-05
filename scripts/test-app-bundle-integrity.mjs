// Release-check regression: equal file sizes must not hide a stale offline bundle.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const checker = resolve('scripts/check-app-bundle.mjs')
const fixture = mkdtempSync(join(tmpdir(), 'jd-app-integrity-'))
const build = 'games/trail-of-truth-block-adventure/build'
function put(path, text) {
  const target = join(fixture, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, text)
}
function run() {
  return spawnSync(process.execPath, [checker], { cwd: fixture, encoding: 'utf8' })
}
try {
  put('capacitor.config.ts', "export default { webDir: 'out' }")
  for (const base of ['out', 'ios/App/App/public']) {
    put(`${base}/index.html`, '<main data-app-shell="capacitor"><script src="/_next/test.js"></script></main>')
    put(`${base}/games/trail-of-truth/index.html`, `<iframe src="/${build}/index.html"></iframe>`)
    put(`${base}/_next/test.js`, 'const version = 1;')
  }
  for (const file of ['index.html', 'index.js', 'index.wasm', 'index.pck', 'release-manifest.json']) {
    for (const base of ['public', 'out', 'ios/App/App/public']) put(`${base}/${build}/${file}`, 'fixture')
  }
  let result = run()
  assert.equal(result.status, 0, result.stderr)
  console.log('PASS exact fixture accepted')
  put('ios/App/App/public/_next/test.js', 'const version = 2;')
  result = run()
  assert.notEqual(result.status, 0, 'Same-size stale JavaScript was accepted')
  assert.match(result.stderr, /hash differs after sync: _next\/test\.js/)
  console.log('PASS same-size stale JavaScript rejected')
  put('ios/App/App/public/_next/test.js', 'const version = 1;')
  result = run()
  assert.equal(result.status, 0, result.stderr)
  console.log('PASS restored exact bundle accepted')
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
