"""High-density portrait: trusted touch input and read-only runtime evidence."""
import json,pathlib
from playwright.sync_api import sync_playwright
OUT=pathlib.Path(__file__).resolve().parents[2]/'docs/games/block-evidence/stabilization-density'
OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8123/games/trail-of-truth/',wait_until='domcontentloaded')
 page.frame_locator('iframe').locator('canvas').wait_for(timeout=90000)
 f=next(f for f in page.frames if '/build/' in f.url)
 f.wait_for_function('window.__trailBlock && window.__trailBlock.ui',timeout=90000)
 def state():return f.evaluate('window.__trailBlock')
 def settle():f.wait_for_function('window.__trailBlock.tick > '+str(state()['tick']+15),timeout=30000)
 def press(name):
  s=state();box=f.locator('canvas').bounding_box();x,y=s['ui'][name]
  assert box is not None
  page.touchscreen.tap(box['x']+x*box['width']/s['viewport'][0],box['y']+y*box['height']/s['viewport'][1]);settle()
 page.screenshot(path=str(OUT/'intro.png'));press('primary')
 s=state();box=f.locator('canvas').bounding_box();cdp=page.context.new_cdp_session(page)
 def touch(kind,pts):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'id':i,'x':x,'y':y} for i,x,y in pts]})
 assert box is not None
 ox=box['x']+93.6;oy=box['y']+box['height']-180
 touch('touchStart',[(1,ox,oy)]);touch('touchMove',[(1,ox,oy-40)]);settle();touch('touchEnd',[]);settle()
 moved=state();assert abs(moved['position'][2]-s['position'][2])>.2
 assert abs(moved['yaw']-s['yaw'])<.001
 page.screenshot(path=str(OUT/'play.png'))
 press('map');assert state()['map_open'];page.screenshot(path=str(OUT/'map.png'));press('primary')
 assert not errors
 (OUT/'checks.json').write_text(json.dumps({'dpr':2,'viewport':s['viewport'],'canvas':box,'movement':True,'joystick_no_camera':True,'map':True,'errors':errors},indent=2))
 print('DPR2 portrait move/look isolation and map PASS',flush=True)
 b.close()
