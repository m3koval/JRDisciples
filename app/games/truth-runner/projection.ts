/** Presentation adapter only: normalized collision coordinates remain authoritative.
 * Fit 100 horizontal units, deriving vertical extent from the actual canvas.
 * Meshes retain uniform scale; only normalized positions enter this mapping.
 */
export function runnerProjection(width:number,height:number) {
 const worldHeight=100*Math.max(1,height)/Math.max(1,width)
 return {worldHeight, y:(normalizedY:number)=>(100-normalizedY)*worldHeight/100}
}
