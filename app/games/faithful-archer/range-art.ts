type RangeTarget = { x: number; y: number; r: number; hit: boolean; kind: string }

/** Original canvas range scenery. Presentation only: never introduces hidden colliders. */
export function drawRange(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, targets: RangeTarget[]) {
  const palettes = [
    ['#9cdcd7', '#edf2ce', '#729c83', '#355e50', '#4a7357', '#c9b181'],
    ['#88bab6', '#dde9c4', '#537e72', '#294c43', '#416c4b', '#b7a47b'],
    ['#afcddd', '#f6e6b9', '#748da0', '#3c6260', '#6e8f57', '#c8b591'],
    ['#747cad', '#f5cba6', '#596a88', '#334957', '#4f745a', '#c8a079'],
  ][level % 4]
  const sky = ctx.createLinearGradient(0, 0, 0, h * .8)
  sky.addColorStop(0, palettes[0]); sky.addColorStop(1, palettes[1])
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#fff5ce'; ctx.beginPath(); ctx.arc(w*.31, h*.18, Math.min(w,h)*.06, 0, Math.PI*2); ctx.fill()
  // Distant ridge and woodland frame keep the flight lane readable.
  for (let layer = 0; layer < 2; layer++) {
    ctx.fillStyle = layer ? palettes[3] : palettes[2]
    ctx.globalAlpha = layer ? .22 : .3
    ctx.beginPath(); ctx.moveTo(0,h)
    for (let i = 0; i <= 16; i++) {
      const x = i*w/16
      const y = h*(.4 + layer*.12 + Math.sin(i*.7 + level)*.045)
      ctx.lineTo(x,y)
    }
    ctx.lineTo(w,h); ctx.closePath(); ctx.fill()
  }
  ctx.globalAlpha = 1
  const ground = ctx.createLinearGradient(0,h*.6,0,h)
  ground.addColorStop(0,palettes[4]); ground.addColorStop(1,'#274b39')
  ctx.fillStyle=ground;ctx.beginPath();ctx.moveTo(0,h*.69);ctx.quadraticCurveTo(w*.5,h*.59,w,h*.7);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill()
  // A continuous practice lane and raised firing mat, not scattered objects.
  ctx.fillStyle=palettes[5];ctx.beginPath();ctx.moveTo(0,h*.79);ctx.bezierCurveTo(w*.28,h*.83,w*.62,h*.71,w,h*.77);ctx.lineTo(w,h*.94);ctx.bezierCurveTo(w*.7,h*.85,w*.28,h*.97,0,h*.97);ctx.closePath();ctx.fill()
  ctx.strokeStyle='rgba(255,245,210,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,h*.805);ctx.bezierCurveTo(w*.28,h*.845,w*.62,h*.725,w,h*.785);ctx.stroke()
  // Trees frame the rear of the range; their trunks do not block the flight path.
  for (const [fraction, scale] of [[.025,.95],[.96,1],[.12,.62],[.86,.62]]) {
    const x=w*fraction, base=h*.71, size=Math.min(w*.16,h*.23)*scale
    ctx.fillStyle='#4f5940';ctx.beginPath();ctx.moveTo(x-5,base);ctx.lineTo(x+5,base);ctx.lineTo(x+2,base-size*2.5);ctx.lineTo(x-2,base-size*2.5);ctx.closePath();ctx.fill()
    for(let i=0;i<3;i++) {
      const y=base-size*(1.55+i*.48), radius=size*(.85-i*.16)
      const foliage=ctx.createRadialGradient(x-radius*.3,y-radius*.4,2,x,y,radius)
      foliage.addColorStop(0, i%2 ? '#7b9d68' : '#95ac72');foliage.addColorStop(1,palettes[3])
      ctx.fillStyle=foliage;ctx.beginPath();ctx.ellipse(x,y,radius,radius*.67,0,0,Math.PI*2);ctx.fill()
    }
  }
  // Recognizable hanging supports. These are outside/behind target hit surfaces.
  for(const t of targets) {
    ctx.save();ctx.strokeStyle='rgba(70,65,44,.45)';ctx.lineWidth=2
    if(t.kind==='bell'||t.kind==='lantern') {
      ctx.beginPath();ctx.moveTo(t.x,Math.max(55,t.y-t.r-40));ctx.lineTo(t.x,t.y-t.r);ctx.stroke()
      ctx.fillStyle='#8b6843';ctx.fillRect(t.x-17,Math.max(52,t.y-t.r-43),34,5)
    } else {
      ctx.beginPath();ctx.moveTo(t.x,t.y+t.r*.6);ctx.lineTo(t.x,h*.79);ctx.stroke()
    }
    if(t.hit) {
      ctx.fillStyle='#fff4c8';ctx.strokeStyle='#2d5b40';ctx.lineWidth=3
      ctx.beginPath();ctx.arc(t.x+t.r*.75,t.y-t.r*.75,11,0,Math.PI*2);ctx.fill();ctx.stroke()
      ctx.beginPath();ctx.moveTo(t.x+t.r*.75-5,t.y-t.r*.75);ctx.lineTo(t.x+t.r*.75-1,t.y-t.r*.75+4);ctx.lineTo(t.x+t.r*.75+6,t.y-t.r*.75-5);ctx.stroke()
    }
    ctx.restore()
  }
  // Festival pennants celebrate the final course, without animated visual noise.
  if(level===3) {
    ctx.strokeStyle='#67534b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,h*.075);ctx.quadraticCurveTo(w*.5,h*.19,w,h*.075);ctx.stroke()
    for(let i=1;i<12;i++) {
      const f=i/12,x=w*f,y=h*(.075+.23*f*(1-f))
      ctx.fillStyle=['#d69a57','#6c9c9a','#e2c779'][i%3];ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+8,y);ctx.lineTo(x,y+17);ctx.closePath();ctx.fill()
    }
  }
}
