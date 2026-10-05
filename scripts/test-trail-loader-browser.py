"""Actual hosted loader with intentionally blocked asset scenarios; no fake success runtime."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import os,json,re,base64,time
OUT=Path(os.environ.get('TRAIL_LOADER_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-10/trail-loader'));OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('TRAIL_HOST_URL','http://127.0.0.1:3107/games/trail-of-truth')
results=[]
def record(name):
 results.append(name);(OUT/'results.json').write_text(json.dumps({'passed':results},indent=2));print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 try:
  for lang in ['en','ru']:
   context=browser.new_context(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce')
   try:
    context.add_init_script(f"localStorage.setItem('language','{lang}');localStorage.setItem('trail-loader-save-sentinel','preserve-me')")
    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    # A dropped loader script cannot provide an engine error notice. The host must still recover.
    context.route('**/build/index.js',lambda r:r.abort())
    page.goto(URL,wait_until='domcontentloaded');expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','loading')
    page.clock.install();page.clock.fast_forward(46000)
    expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','slow')
    retry=page.get_by_role('button',name='Попробовать снова' if lang=='ru' else 'Try again',exact=True)
    wait=page.get_by_role('button',name='Подождать' if lang=='ru' else 'Keep waiting',exact=True)
    expect(retry).to_be_visible();expect(wait).to_be_visible();assert page.locator('video').count()==0
    record(f'{lang} blocked script offers finite wait/retry/exit, no competing autoplay video')
    for w,h in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
     page.set_viewport_size({'width':w,'height':h})
     for el in [retry,wait,page.get_by_role('link',name='Выбрать другую игру' if lang=='ru' else 'Choose another game')]:
      el.scroll_into_view_if_needed();b=el.bounding_box();assert b and b['height']>=44 and b['x']>=0 and b['x']+b['width']<=w+1 and b['y']>=0 and b['y']+b['height']<=h+1,(w,h,b)
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     page.screenshot(path=str(OUT/f'{lang}-{w}x{h}-slow.png'));record(f'{lang} {w}x{h} recovery controls reachable')
    wait.click();expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','loading');assert 'attempt=0' in (page.locator('iframe').get_attribute('src') or '')
    page.clock.fast_forward(46000);expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','slow')
    retry.click();expect(page.locator('iframe')).to_have_attribute('src',re.compile('attempt=1'));expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','loading');assert page.evaluate("localStorage.getItem('trail-loader-save-sentinel')")=='preserve-me'
    record(f'{lang} keep waiting retains frame, retry creates fresh frame without clearing storage')
   finally:context.close()
  # Real generated loader detects a missing pack. This is a deliberate network fault.
  context=browser.new_context(viewport={'width':667,'height':375},has_touch=True)
  try:
   context.route('**/build/index.pck',lambda r:r.abort())
   page=context.new_page();page.goto(URL,wait_until='domcontentloaded');expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','failed',timeout=90000)
   page.screenshot(path=str(OUT/'blocked-pack-error.png'));expect(page.get_by_role('button',name='Try again',exact=True)).to_be_visible();record('actual generated loader pack failure exposed by host with retry')
   # Remove only the deliberate network fault, then use the actual recovery button.
   context.unroute('**/build/index.pck');page.set_viewport_size({'width':1024,'height':768})
   runtime_errors=[];failed=[];page.on('pageerror',lambda e:runtime_errors.append(str(e)));page.on('response',lambda r:failed.append([r.url,r.status]) if r.status>=400 else None)
   page.get_by_role('button',name='Try again',exact=True).click();expect(page.locator('iframe')).to_have_attribute('src',re.compile('attempt=1'))
   expect(page.locator('[data-boot-state]')).to_have_attribute('data-boot-state','ready',timeout=150000)
   frame=next(f for f in page.frames if '/build/' in f.url);s=frame.evaluate('window.__trailBlock');assert s and s['ui'];assert page.locator('iframe').get_attribute('aria-hidden')=='false'
   box=frame.locator('canvas').bounding_box();assert box is not None
   x,y=s['ui']['primary'];page.touchscreen.tap(box['x']+x*box['width']/s['viewport'][0],box['y']+y*box['height']/s['viewport'][1]);frame.wait_for_function('window.__trailBlock && !window.__trailBlock.paused',timeout=30000)
   cdp=context.new_cdp_session(page);(OUT/'actual-hosted-start.png').write_bytes(base64.b64decode(cdp.send('Page.captureScreenshot',{'format':'png'})['data']))
   assert not runtime_errors,runtime_errors;assert not failed,failed
   (OUT/'runtime.json').write_text(json.dumps({'state':frame.evaluate('window.__trailBlock'),'errors':runtime_errors,'httpFailures':failed},indent=2))
   assert s['viewport'][0]>=1000,s['viewport']
   record('actual failed-pack retry to engine readiness, native-DPR trusted touch start, zero runtime/HTTP errors')
  finally:context.close()
 finally:browser.close()
print('Accepted',len(results),'loader groups',flush=True)
