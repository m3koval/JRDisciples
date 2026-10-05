"""Extra renderer/save recovery on ordinary route; storage setup only, never gameplay injection."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import os,json,math
OUT=Path(os.environ['JD_EVIDENCE']);OUT.mkdir(parents=True,exist_ok=True);BASE=os.environ['JD_BASE'];checks=[]
def mark(name):
 checks.append(name);(OUT/'recovery.json').write_text(json.dumps({'passed':checks},indent=2));print('PASS',name,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader'])
 try:
  for case,stored in [('restored','123'),('corrupt','not-a-number'),('quota','5')]:
   c=b.new_context(viewport={'width':1024,'height':768})
   try:
    c.add_init_script("localStorage.setItem('faithful-archer-best',"+json.dumps(stored)+");"+("const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='faithful-archer-best')throw new DOMException('quota','QuotaExceededError');return original.call(this,k,v)}"if case=='quota'else''))
    page=c.new_page();page.goto(BASE+'/games/faithful-archer');page.get_by_role('button',name='Start Training',exact=True).first.click();cv=page.locator('canvas')
    page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.renderer||"{}").ready',timeout=60000)
    def best():return int(page.locator('.archer-stats > div').nth(1).inner_text().splitlines()[-1])
    def state():return cv.evaluate('c=>JSON.parse(c.dataset.state)')
    assert best()==(0 if case=='corrupt'else int(stored));mark(case+' best safely loaded')
    if case!='quota':continue
    page.clock.install();page.clock.pause_at(page.evaluate('new Date(Date.now()+5000).toISOString()'))
    for attempt in range(8):
     s=state();t=s['targets'][0];flight=.6;dx=-(t['x']-s['bow']['x'])/flight*132/720;dy=-(t['y']-s['bow']['y']-360*flight*flight)/flight*132/720
     box=cv.bounding_box();assert box;x=box['x']+box['width']*.72;y=box['y']+box['height']*.4
     page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+dx,y+dy);page.mouse.up();page.clock.run_for(1000)
     if state()['score']>5:break
    earned=state()['score'];assert earned>5 and best()==earned;mark('quota actual hit retained in memory')
    page.get_by_role('button',name='Pause',exact=True).click();page.get_by_role('dialog',name='Paused',exact=True).get_by_role('button',name='Restart',exact=True).click();page.clock.run_for(50)
    assert state()['score']==0 and best()==earned;mark('quota restart cannot overwrite earned best with stale disk value')
   finally:c.close()
  c=b.new_context(viewport={'width':390,'height':844});page=c.new_page()
  try:
   c.route('**/michael.glb',lambda route:route.abort());page.goto(BASE+'/games/faithful-archer');page.get_by_role('button',name='Start Training',exact=True).first.click()
   expect(page.get_by_text('The 3D range could not load.',exact=True)).to_be_visible(timeout=60000);page.screenshot(path=str(OUT/'asset-failure.png'));mark('real required GLB failure shows honest error')
   c.unroute('**/michael.glb');page.get_by_role('button',name='Retry 3D range',exact=True).click();page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.renderer||"{}").ready',timeout=60000)
   resume=page.get_by_role('button',name='Resume',exact=True)
   if resume.is_visible():resume.click()
   page.wait_for_function('!JSON.parse(document.querySelector("canvas").dataset.state).paused');mark('required asset retry restores real renderer and play')
   before=page.locator('canvas').evaluate('c=>JSON.parse(c.dataset.state)')
   supported=page.evaluate("""() => {const c=document.querySelector('canvas');const gl=c.getContext('webgl2');const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return false;ext.loseContext();return true}""")
   assert supported,'WEBGL_lose_context extension unavailable; actual loss unverified'
   expect(page.get_by_text('The 3D range could not load.',exact=True)).to_be_visible(timeout=60000)
   page.screenshot(path=str(OUT/'actual-context-loss.png'));mark('actual WebGL context loss shows reachable retry')
   page.get_by_role('button',name='Retry 3D range',exact=True).click()
   page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.renderer||"{}").ready',timeout=60000)
   resume=page.get_by_role('button',name='Resume',exact=True)
   if resume.is_visible():resume.click()
   after=page.locator('canvas').evaluate('c=>JSON.parse(c.dataset.state)')
   assert after['score']==before['score'] and after['arrows']==before['arrows']
   assert page.locator('canvas').evaluate("c=>!c.getContext('webgl2').isContextLost()")
   mark('actual context loss retry creates working WebGL without losing score/arrows')
   page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))")
   expect(page.get_by_role('button',name='Resume',exact=True)).to_be_visible();mark('visibility fixture pauses safely')
  finally:c.close()
 finally:b.close()
