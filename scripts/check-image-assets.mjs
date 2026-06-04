#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourceDirs = ['app', 'components', 'context', 'data', 'lib']
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json'])
const imagePattern = /\/images\/jr\/[^"'`)\s,;]+/g

function walk(dir) {
  const full = path.join(root, dir)
  if (!fs.existsSync(full)) return []
  const out = []
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const p = path.join(full, entry.name)
    if (entry.isDirectory()) out.push(...walk(path.relative(root, p)))
    else if (sourceExtensions.has(path.extname(entry.name))) out.push(p)
  }
  return out
}

const files = sourceDirs.flatMap(walk)
const missing = []
const refs = new Map()

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  const rel = path.relative(root, file)
  for (const match of text.matchAll(imagePattern)) {
    const ref = match[0]
    const asset = path.join(root, 'public', ref)
    if (!fs.existsSync(asset)) missing.push(`${rel}: ${ref}`)
    if (!refs.has(ref)) refs.set(ref, new Set())
    refs.get(ref).add(rel)
  }
}

if (missing.length) {
  console.error('Missing Junior Disciples image assets:')
  for (const item of missing) console.error(`- ${item}`)
  process.exit(1)
}

console.log(`Junior Disciples image asset check passed for ${refs.size} unique referenced assets.`)
