import * as T from 'three'

// Reserve the entire HUD/cue stack, not just the canvas edge. Fit in camera
// space so elevation and the oblique 39:32 viewing angle are both accounted for.
export function frameEncounter(camera: T.OrthographicCamera, bounds: T.Box3, width: number, height: number) {
  camera.updateMatrixWorld(true)
  const view = bounds.clone().applyMatrix4(camera.matrixWorldInverse)
  const topPixels = Math.min(254, height * .34)
  const bottomPixels = Math.min(130, height * .18)
  const usable = 1 - (topPixels + bottomPixels) / height
  const span = Math.max((view.max.y - view.min.y) / usable, (view.max.x - view.min.x + 4) * height / width)
  const centerY = (view.min.y + view.max.y) / 2 + (topPixels - bottomPixels) / height * span / 2
  const centerX = (view.min.x + view.max.x) / 2
  camera.left = centerX - span * width / height / 2
  camera.right = centerX + span * width / height / 2
  camera.top = centerY + span / 2
  camera.bottom = centerY - span / 2
  camera.updateProjectionMatrix()
}
