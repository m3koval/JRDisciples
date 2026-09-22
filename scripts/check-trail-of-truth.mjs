import { spawnSync } from 'node:child_process'
// The app now hosts the free-3D block chapter; the preserved legacy proof is not
// release evidence for this route. This guard binds current source to its export.
const result = spawnSync('python3', ['tools/trail_of_truth/check_block_release.py'], { stdio: 'inherit' })
if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
