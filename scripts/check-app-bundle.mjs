import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { extname, join, relative } from 'node:path'

const root = process.cwd()
const out = join(root, 'out')
const iosPublic = join(root, 'ios', 'App', 'App', 'public')
const configPath = join(root, 'capacitor.config.ts')
const journeyPath = join(root, 'data', 'journey.ts')
const failures = []

function walk(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function routeLabel(path) {
  const route = relative(out, path).replaceAll('\\', '/')
  return route === 'index.html' ? '/' : `/${route.replace(/\/index\.html$/, '')}`
}

if (!existsSync(out)) failures.push('Static app export is missing: run npm run build:app')
if (!existsSync(configPath)) failures.push('capacitor.config.ts is missing')

if (existsSync(journeyPath)) {
  const journeySource = readFileSync(journeyPath, 'utf8')
  const matches = [...journeySource.matchAll(/step\('([^']+)',\s*'[^']+',\s*'([^']+)'/g)]
  const ids = matches.map((match) => match[1])
  if (new Set(ids).size !== ids.length) failures.push('Disciple Journey contains duplicate step IDs')
  for (const [, id, href] of matches) {
    const route = join(out, href.replace(/^\//, ''), 'index.html')
    if (!existsSync(route)) failures.push(`Disciple Journey step ${id} points to a missing route: ${href}`)
  }
}

const htmlFiles = walk(out).filter((path) => extname(path) === '.html')
const indexFiles = htmlFiles.filter((path) => path.endsWith('index.html'))
if (indexFiles.length < 2) failures.push('Static export contains no navigable route set')

const remotePattern = /\b(?:href|src|poster)=["'](?:https?:)?\/\//gi
const rootReferencePattern = /\b(?:href|src|poster)=["'](\/[^"'#?]*)/gi

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8')
  if (remotePattern.test(html)) failures.push(`Remote URL remains in app HTML: ${routeLabel(path)}`)
  remotePattern.lastIndex = 0

  for (const match of html.matchAll(rootReferencePattern)) {
    const decoded = decodeURIComponent(match[1]).replace(/^\//, '')
    if (!decoded || decoded.startsWith('_next/image')) continue
    const direct = join(out, decoded)
    const directoryIndex = join(direct, 'index.html')
    if (!existsSync(direct) && !existsSync(directoryIndex)) {
      failures.push(`Broken bundled reference on ${routeLabel(path)}: ${match[1]}`)
    }
  }
}

const rootIndex = join(out, 'index.html')
if (existsSync(rootIndex)) {
  const html = readFileSync(rootIndex, 'utf8')
  if (!html.includes('data-app-shell="capacitor"')) failures.push('App export is missing the Capacitor shell marker')
}

if (existsSync(configPath)) {
  const config = readFileSync(configPath, 'utf8')
  if (!config.includes("webDir: 'out'")) failures.push('Capacitor webDir must point to the static out directory')
  if (/server\s*:\s*\{[\s\S]*?url\s*:/.test(config)) failures.push('Remote server.url is forbidden: the app must bundle its content')
}

for (const path of walk(out)) {
  const relativePath = relative(out, path)
  const nativePath = join(iosPublic, relativePath)
  if (!existsSync(nativePath)) {
    failures.push(`iOS bundle is missing exported file: ${relativePath}`)
  } else if (statSync(path).size !== statSync(nativePath).size) {
    failures.push(`iOS bundle file size differs after sync: ${relativePath}`)
  }
}

// The embedded engine must survive both static export and Capacitor sync intact.
const gameRoute = 'games/trail-of-truth/index.html'
const gameBuild = 'games/trail-of-truth-block-adventure/build'
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
const requiredGameFiles = ['index.html', 'index.js', 'index.wasm', 'index.pck', 'release-manifest.json']
for (const base of [out, iosPublic]) {
  const route = join(base, gameRoute)
  if (!existsSync(route) || !statSync(route).size) {
    failures.push(`Missing Trail of Truth route: ${route}`)
  } else if (!readFileSync(route, 'utf8').includes(`/${gameBuild}/index.html`)) {
    failures.push(`Trail of Truth route does not embed the expected engine: ${route}`)
  }
}
if (existsSync(join(out, gameRoute)) && existsSync(join(iosPublic, gameRoute)) &&
    sha256(join(out, gameRoute)) !== sha256(join(iosPublic, gameRoute))) {
  failures.push('Trail of Truth route hash differs after iOS sync')
}
for (const name of requiredGameFiles) {
  const source = join(root, 'public', gameBuild, name)
  if (!existsSync(source) || !statSync(source).size) {
    failures.push(`Missing Trail of Truth source artifact: ${name}`)
    continue
  }
  for (const base of [out, iosPublic]) {
    const bundled = join(base, gameBuild, name)
    if (!existsSync(bundled) || sha256(bundled) !== sha256(source)) {
      failures.push(`Trail of Truth artifact hash mismatch or missing file: ${bundled}`)
    }
  }
}

if (failures.length) {
  console.error([...new Set(failures)].map((item) => `- ${item}`).join('\n'))
  process.exit(1)
}

console.log(`App bundle checks passed for ${indexFiles.length} offline routes.`)
console.log('All HTML references resolve locally; no remote links or resources remain in the app export.')
console.log('Every exported file is present in the synced iOS bundle.')
console.log('Trail of Truth route and engine artifacts verified with exact SHA-256 copies into iOS.')
