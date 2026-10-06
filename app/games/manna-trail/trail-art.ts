import { Cell, GRID } from './mechanics'

// Planning aid only: a snapshot route, never an auto-steer or a reward source.
export function scoutRoute(snake: Cell[], target: Cell | null, rocks: Cell[], direction: Cell): Cell[] {
  if (!snake.length || !target) return []
  const key=(c:Cell)=>`${c.x},${c.y}`
  const blocked=new Set([...snake.slice(1),...rocks].map(key))
  const queue: Cell[][]=[[snake[0]]], seen=new Set([key(snake[0])])
  for(let i=0;i<queue.length;i++) {
    const path=queue[i], c=path[path.length-1]
    if(c.x===target.x && c.y===target.y) return path
    for(const d of [{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]) {
      if(path.length===1 && d.x===-direction.x && d.y===-direction.y) continue
      const n={x:c.x+d.x,y:c.y+d.y}, k=key(n)
      if(n.x<0||n.y<0||n.x>=GRID||n.y>=GRID||blocked.has(k)||seen.has(k)) continue
      seen.add(k);queue.push([...path,n])
    }
  }
  return []
}

/** Bold illustrated caravan pieces, intentionally Canvas 2D, within one cell. */
export function drawTraveler(ctx: CanvasRenderingContext2D, x:number,y:number,size:number,leader:boolean,index:number) {
  ctx.save();ctx.translate(x,y)
  // A dark contour, broad robe and light hood survive an 18px portrait cell.
  ctx.strokeStyle='#263a3b';ctx.lineWidth=size*.07;ctx.lineJoin='round'
  ctx.fillStyle=leader?'#f9d366':index%2?'#eee2bf':'#58aaa9'
  ctx.beginPath();ctx.moveTo(-size*.23,-size*.2)
  ctx.quadraticCurveTo(-size*.43,size*.04,-size*.4,size*.36)
  ctx.quadraticCurveTo(0,size*.49,size*.4,size*.36)
  ctx.quadraticCurveTo(size*.43,size*.04,size*.23,-size*.2)
  ctx.closePath();ctx.fill();ctx.stroke()
  ctx.fillStyle=leader?'#fff4cc':'#fff8e7'
  ctx.beginPath();ctx.arc(0,-size*.18,size*.25,0,Math.PI*2);ctx.fill();ctx.stroke()
  ctx.fillStyle='#754529';ctx.beginPath();ctx.arc(0,-size*.15,size*.13,0,Math.PI*2);ctx.fill()
  if(leader){
    ctx.strokeStyle='#fff5cf';ctx.lineWidth=size*.06
    ctx.beginPath();ctx.moveTo(-size*.22,size*.07);ctx.lineTo(0,size*.22);ctx.lineTo(size*.22,size*.07);ctx.stroke()
  }
  ctx.restore()
}

/** Broad, low-contrast contour bands: no scatter/noise competing with pieces. */
export function drawSand(ctx:CanvasRenderingContext2D, ox:number,oy:number,size:number) {
  ctx.save();ctx.beginPath();ctx.rect(ox,oy,size,size);ctx.clip()
  ctx.fillStyle='#fff2cc0b';ctx.strokeStyle='#fce7bc18';ctx.lineWidth=size*.002
  for(const band of [.18,.55,.87]) {
    const y=oy+size*band
    ctx.beginPath();ctx.moveTo(ox,y)
    ctx.bezierCurveTo(ox+size*.3,y-size*.13,ox+size*.64,y+size*.12,ox+size,y-size*.06)
    ctx.lineTo(ox+size,y+size*.035)
    ctx.bezierCurveTo(ox+size*.64,y+size*.20,ox+size*.3,y-size*.05,ox,y+size*.09)
    ctx.closePath();ctx.fill();ctx.stroke()
  }
  ctx.restore()
}

/** Label dimensions use display pixels, not tiny grid-relative line heights. */
export function wordLabelLayout(cell:number,dpr:number,textWidth:number,wx:number,wy:number,ox:number,oy:number,size:number) {
  const height=Math.max(24*dpr,cell*.74), width=textWidth+16*dpr
  const x=Math.max(ox+width/2,Math.min(wx+cell/2,ox+size-width/2))
  const above=wy-4*dpr-height/2
  const y=above-height/2>=oy?above:wy+cell+4*dpr+height/2
  return { x, y:Math.min(oy+size-height/2,y), width, height }
}
