type Threat = { x: number; y: number; vx: number; vy: number; r: number; warningMs: number }
// Only approaching darts in the player's local area warrant an urgency cue.
export function nearestApproach(darts: Threat[], x: number, y: number) {
  return darts.filter(d => d.warningMs <= 0 && (x-d.x)*d.vx+(y-d.y)*d.vy > 0)
    .map(d => ({ ...d, distance: Math.hypot(d.x-x,d.y-y)-d.r }))
    .filter(d => d.distance < 190).sort((a,b) => a.distance-b.distance)[0] ?? null
}
export function drawGuardReadability(ctx: CanvasRenderingContext2D, x: number, y: number, energy: number, active: boolean, threat: ReturnType<typeof nearestApproach>, isRu: boolean) {
  ctx.save()
  if (threat) {
    const angle = Math.atan2(threat.y-y, threat.x-x)
    ctx.strokeStyle = active ? '#b9f4ff' : '#ffd08b'; ctx.lineWidth=6
    ctx.beginPath(); ctx.arc(x,y,active ? 69 : 43,angle-.38,angle+.38); ctx.stroke()
  }
  // A grounded plaque stays readable when the ring is hidden by a dart or burst.
  ctx.fillStyle='#10252ee8'; ctx.strokeStyle=active?'#b9f4ff':'#8aabac';ctx.lineWidth=1
  ctx.beginPath();ctx.roundRect(x-43,y+55,86,23,7);ctx.fill();ctx.stroke()
  ctx.fillStyle='#fff2ce';ctx.font='bold 11px sans-serif';ctx.textAlign='center'
  ctx.fillText(`${active ? (isRu?'ЩИТ':'GUARD') : (isRu?'ЗАРЯД':'ENERGY')} ${Math.round(energy)}%`,x,y+70)
  ctx.restore()
}
