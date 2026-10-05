export type View = { x: number; y: number; width: number; height: number }
export const AREA_LABELS = [
  { en: 'Top left', ru: 'Сверху слева' }, { en: 'Top middle', ru: 'Сверху в центре' }, { en: 'Top right', ru: 'Сверху справа' },
  { en: 'Middle left', ru: 'В середине слева' }, { en: 'Middle', ru: 'В центре' }, { en: 'Middle right', ru: 'В середине справа' },
  { en: 'Bottom left', ru: 'Снизу слева' }, { en: 'Bottom middle', ru: 'Снизу в центре' }, { en: 'Bottom right', ru: 'Снизу справа' },
]
// Overlapping views preserve full source coverage, including objects on seams.
export function inspectionView(detail: boolean, area: number): View {
  if (!detail) return { x: 0, y: 0, width: 768, height: 1024 }
  const index = Number.isFinite(area) ? Math.max(0, Math.min(8, Math.floor(area))) : 4
  return { x: (index % 3) * 192, y: Math.floor(index / 3) * 256, width: 384, height: 512 }
}
export function picturePoint(rx: number, ry: number, view: View): { x: number; y: number } | null {
  if (![rx, ry].every(Number.isFinite) || rx < 0 || ry < 0 || rx > 1 || ry > 1) return null
  return { x: Math.min(767.999, view.x + rx * view.width), y: Math.min(1023.999, view.y + ry * view.height) }
}
export function areaFor(x: number, y: number): number {
  const col = Math.max(0, Math.min(2, Math.round((x - 192) / 192)))
  const row = Math.max(0, Math.min(2, Math.round((y - 256) / 256)))
  return row * 3 + col
}
export function moveCursor(cursor: { x: number; y: number }, key: string, fine: boolean, view: View) {
  const delta = fine ? 4 : 24
  return { visible: true,
    x: Math.max(view.x + 4, Math.min(view.x + view.width - 4, cursor.x + (key === 'ArrowLeft' ? -delta : key === 'ArrowRight' ? delta : 0))),
    y: Math.max(view.y + 4, Math.min(view.y + view.height - 4, cursor.y + (key === 'ArrowUp' ? -delta : key === 'ArrowDown' ? delta : 0))),
  }
}
