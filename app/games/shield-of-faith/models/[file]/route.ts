import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

// Export model bytes as static routes for the offline Capacitor bundle too.
export const dynamic = 'force-static'
export const dynamicParams = false
export async function generateStaticParams() {
  const files = await readdir(path.join(process.cwd(), 'app/games/shield-of-faith/assets'))
  return files.filter(file => /^[a-z_]+\.glb$/.test(file)).map(file => ({ file }))
}
export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params
  if (!/^[a-z_]+\.glb$/.test(file)) return new Response('Not found', { status: 404 })
  try {
    const bytes = await readFile(path.join(process.cwd(), 'app/games/shield-of-faith/assets', file))
    return new Response(bytes, { headers: { 'Content-Type': 'model/gltf-binary', 'Cache-Control': 'public, max-age=3600' } })
  } catch { return new Response('Not found', { status: 404 }) }
}
