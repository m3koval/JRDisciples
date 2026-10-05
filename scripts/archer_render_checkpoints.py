"""Software-renderer QA: trusted input/physics always run; GPU draws at captures.
Use only in campaign/control tests. Separate 3D and recovery suites draw every frame.
This is not continuous motion or physical-device performance evidence.
"""
import os

def install(page):
 if os.environ.get('JD_SPARSE_WEBGL','0')!='1':return False
 page.evaluate("""() => {
  window.__archerCheckpointDraw = false;
  for (const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype]) {
   for(const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced','drawRangeElements']) {
    if(!Object.prototype.hasOwnProperty.call(proto,key))continue;
    const original=proto[key];
    proto[key]=function(...args){if(window.__archerCheckpointDraw)return original.apply(this,args)};
   }
  }
 }""")
 print('QA_MODE: input/physics continuous; WebGL draws at verified screenshot checkpoints; separate full-render suite required',flush=True)
 return True

def begin_capture(page):
 active=page.evaluate("() => typeof window.__archerCheckpointDraw === 'boolean'")
 if active:
  page.evaluate('window.__archerCheckpointDraw=true')
  page.clock.run_for(34)
 return active

def end_capture(page,active):
 if active:page.evaluate('window.__archerCheckpointDraw=false')
