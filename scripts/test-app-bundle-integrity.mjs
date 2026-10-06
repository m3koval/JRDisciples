// Release-check regression: equal file sizes must not hide a stale offline bundle.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const checker = resolve('scripts/check-app-bundle.mjs')
const fixture = mkdtempSync(join(tmpdir(), 'jd-app-integrity-'))
const build = 'games/trail-of-truth-block-adventure/build'
const bases = ['out', 'ios/App/App/public']
const chunk = '_next/static/chunks/app/games/trail-of-truth/page-fixture.js'
const client = `self.webpackChunk_N_E.push([[1],{1:()=>{const src="/${build}/index.html";return src}}]);`
function put(path, text) {
  const target = join(fixture, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, text)
}
function run() {
  return spawnSync(process.execPath, [checker], { cwd: fixture, encoding: 'utf8' })
}
function accepted(label) {
  const result = run()
  assert.equal(result.status, 0, result.stderr)
  console.log(`PASS ${label}`)
}
try {
  put('capacitor.config.ts', "export default { webDir: 'out' }")
  for (const base of bases) {
    put(`${base}/index.html`, '<main data-app-shell="capacitor"><script src="/_next/test.js"></script></main>')
    // Tap-to-start renders no iframe or engine URL until client hydration.
    put(`${base}/games/trail-of-truth/index.html`, `<main><button>Open adventure</button></main><script src="/${chunk}" async=""></script>`)
    put(`${base}/${chunk}`, client)
    // An unreferenced chunk must not hide a broken route bundle.
    put(`${base}/_next/static/chunks/unrelated.js`, client)
    put(`${base}/_next/test.js`, 'const version = 1;')
  }
  const artifacts = ['index.html', 'index.js', 'index.wasm', 'index.pck', 'release-manifest.json']
  for (const file of artifacts) {
    for (const base of ['public', ...bases]) put(`${base}/${build}/${file}`, 'fixture')
  }
  accepted('exact tap-to-start fixture accepted')
  put('ios/App/App/public/_next/test.js', 'const version = 2;')
  let result = run()
  assert.notEqual(result.status, 0, 'Same-size stale JavaScript was accepted')
  assert.match(result.stderr, /hash differs after sync: _next\/test\.js/)
  console.log('PASS same-size stale JavaScript rejected')
  put('ios/App/App/public/_next/test.js', 'const version = 1;')
  accepted('restored exact bundle accepted')

  for (const base of bases) {
    for (const corruption of ['missing', 'wrong-engine']) {
      if (corruption === 'missing') rmSync(join(fixture, base, chunk))
      else put(`${base}/${chunk}`, client.replace('/index.html', '/wrong.html'))
      result = run()
      assert.notEqual(result.status, 0, `${base} ${corruption} client chunk was accepted`)
      assert.ok(result.stderr.includes(`Trail of Truth client bundle does not reference the expected engine: ${join(fixture, base)}`), result.stderr)
      console.log(`PASS ${base} ${corruption} client rejected despite unrelated valid chunk`)
      put(`${base}/${chunk}`, client)
      accepted(`${base} client restored`)
    }
  }
  // Even byte-identical stale bundles must fail the engine-reference check.
  for (const base of bases) put(`${base}/${chunk}`, client.replace('/index.html', '/wrong.html'))
  result = run()
  assert.notEqual(result.status, 0, 'Identically corrupt client chunks were accepted')
  for (const base of bases) {
    assert.ok(result.stderr.includes(`Trail of Truth client bundle does not reference the expected engine: ${join(fixture, base)}`), result.stderr)
    put(`${base}/${chunk}`, client)
  }
  console.log('PASS identically corrupt client chunks rejected')

  for (const base of ['public', ...bases]) {
    for (const file of artifacts) {
      const target = `${base}/${build}/${file}`
      for (const corruption of ['missing', 'same-size']) {
        if (corruption === 'missing') rmSync(join(fixture, target))
        else put(target, 'fixturE')
        result = run()
        assert.notEqual(result.status, 0, `${target} ${corruption} artifact was accepted`)
        const expected = base === 'public' && corruption === 'missing'
          ? `Missing Trail of Truth source artifact: ${file}`
          : `Trail of Truth artifact hash mismatch or missing file: ${join(fixture, base === 'public' ? 'out' : base, build, file)}`
        assert.ok(result.stderr.includes(expected), result.stderr)
        put(target, 'fixture')
      }
    }
    console.log(`PASS ${base} all engine artifacts reject missing and same-size corruption`)
  }
  accepted('fully restored exact bundle accepted')
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
