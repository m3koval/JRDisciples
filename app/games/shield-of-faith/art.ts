// Canvas-only artwork: a shield training court, not walls or a second character canon.
export function drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, raised = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 32, size / 32)
  ctx.fillStyle = raised ? '#edfaff' : '#e8c578'; ctx.strokeStyle = '#493923'; ctx.lineWidth = 2.5
  const metal = ctx.createLinearGradient(-18, -22, 18, 22)
  metal.addColorStop(0, raised ? '#ffffff' : '#fff2bf'); metal.addColorStop(.45, raised ? '#bbebf5' : '#deb66b'); metal.addColorStop(1, raised ? '#57879d' : '#927041')
  ctx.fillStyle = metal
  ctx.beginPath(); ctx.moveTo(-15, -19); ctx.quadraticCurveTo(0, -26, 15, -19)
  ctx.lineTo(13, 5); ctx.quadraticCurveTo(9, 16, 0, 22)
  ctx.quadraticCurveTo(-9, 16, -13, 5); ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#256a80'; ctx.beginPath(); ctx.moveTo(-10, -15); ctx.lineTo(10, -15)
  ctx.lineTo(8, 4); ctx.quadraticCurveTo(5, 12, 0, 16); ctx.quadraticCurveTo(-5, 12, -8, 4); ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#fff0bd'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 9); ctx.moveTo(-6, -4); ctx.lineTo(6, -4); ctx.stroke()
  ctx.restore()
}

export function drawCourt(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#203c44'; ctx.fillRect(0, 0, width, height)
  const daylight = ctx.createLinearGradient(0, 0, width, height)
  daylight.addColorStop(0, '#658078'); daylight.addColorStop(.6, '#314f55'); daylight.addColorStop(1, '#162e3a')
  ctx.fillStyle = daylight; ctx.fillRect(0, 0, width, height)
  // Broad inlaid paths make the center/reward location legible without fake obstacles.
  ctx.fillStyle = '#34525a'; ctx.fillRect(width / 2 - 42, 0, 84, height)
  ctx.fillRect(0, height / 2 - 42, width, 84)
  ctx.strokeStyle = '#75908335'; ctx.lineWidth = 1
  for (let y = 0; y < height; y += 72) {
    for (let x = (Math.floor(y / 72) % 2) * -48; x < width; x += 96) ctx.strokeRect(x, y, 96, 72)
  }
  const radius = Math.min(width, height) * .24
  ctx.fillStyle = '#294650'; ctx.strokeStyle = '#b5ad7b'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.strokeStyle = '#b5ad7b55'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(width / 2, height / 2, radius - 9, 0, Math.PI * 2); ctx.stroke()
  ctx.save(); ctx.globalAlpha = .22; drawShield(ctx, width / 2, height / 2, 52); ctx.restore()
  // Dark control/HUD aprons remain visually separate from the court.
  const shade = ctx.createLinearGradient(0, height - 180, 0, height)
  shade.addColorStop(0, '#10293100'); shade.addColorStop(1, '#102931dd')
  ctx.fillStyle = shade; ctx.fillRect(0, height - 180, width, 180)
  ctx.fillStyle = '#102931dd'; ctx.fillRect(0, 0, width, 55)
}

export function drawArrival(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, progress: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle)
  // Preview the actual heading, not an invented target.
  ctx.strokeStyle = '#ffcf7a88'; ctx.lineWidth = 2; ctx.setLineDash([5, 5])
  ctx.beginPath(); ctx.moveTo(27, 0); ctx.lineTo(74, 0); ctx.stroke(); ctx.setLineDash([])
  ctx.fillStyle = '#382618'; ctx.strokeStyle = '#ffcf7a'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.strokeStyle = '#fff4ce'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(7, 0); ctx.moveTo(1, -6); ctx.lineTo(7, 0); ctx.lineTo(1, 6); ctx.stroke()
  ctx.strokeStyle = '#ffad54'; ctx.lineWidth = 4
  ctx.beginPath(); ctx.arc(0, 0, 24, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2); ctx.stroke()
  ctx.restore()
}

// Follows the simulation cue clock: pause cannot consume the impact.
export function drawBlockImpact(ctx: CanvasRenderingContext2D, x: number, y: number, remainingMs: number, isRu: boolean, width = Infinity, height = Infinity) {
  if (remainingMs <= 0) return
  const progress = 1 - Math.min(850, remainingMs) / 850
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = 1 - progress
  ctx.strokeStyle = '#d9f8ff'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(0, 0, 12 + progress * 22, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-2, 5); ctx.lineTo(9, -7); ctx.stroke()
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'
  ctx.lineWidth = 4; ctx.strokeStyle = '#102931'; ctx.fillStyle = '#ecfeff'
  const text = isRu ? 'Защищено +15' : 'Blocked +15'
  // Contact may be outside the court when the broad guard catches an entering dart.
  // Keep the contact ring honest, but keep its label inside the HUD/control safe area.
  const labelX = Math.max(64, Math.min(width - 64, x)) - x
  const labelY = Math.max(124, Math.min(height - 112, y - 26)) - y
  ctx.strokeText(text, labelX, labelY); ctx.fillText(text, labelX, labelY)
  ctx.restore()
}
