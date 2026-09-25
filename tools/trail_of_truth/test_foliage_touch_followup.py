"""Fresh-context touch/reload follow-up, NOT a replacement for full rescue acceptance."""
import json
import math
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parents[2]/'docs/games/block-evidence/hourly-run-3/touch-followup'
OUT.mkdir(parents=True,exist_ok=True)
checks = {}
errors = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage'])
    context = browser.new_context(viewport={'width':390,'height':844},has_touch=True,device_scale_factor=1)
    page = context.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.goto(os.environ.get('BLOCK_URL','http://127.0.0.1:8133/games/trail-of-truth/'),wait_until='domcontentloaded',timeout=90000)
    def engine(): return next(f for f in page.frames if '/games/trail-of-truth-block-adventure/build/' in f.url)
    def ready():
        page.frame_locator('iframe').locator('canvas').wait_for(timeout=90000)
        engine().wait_for_function('window.__trailBlock && window.__trailBlock.ui',timeout=90000)
    def state(): return engine().evaluate('window.__trailBlock')
    def check(name, value):
        checks[name]=bool(value)
        print(name,value,flush=True)
        assert value,name
    def settle():
        engine().wait_for_function('window.__trailBlock.tick > '+str(state()['tick']+12),timeout=20000)
    def point(name):
        s=state();x,y=s['ui'][name];b=engine().locator('canvas').bounding_box()
        assert b is not None, 'Visible game canvas required'
        return b['x']+x*b['width']/s['viewport'][0],b['y']+y*b['height']/s['viewport'][1]
    def tap(name): page.touchscreen.tap(*point(name));settle()
    def shot(name): page.screenshot(path=str(OUT/(name+'.png')))
    ready()
    cdp=context.new_cdp_session(page)
    def touches(kind, points):
        cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for i,x,y in points]})
    try:
        check('fresh_intro',state()['paused'] and not state()['reward_saved'])
        tap('primary');check('portrait_start',not state()['paused'])
        tap('map');before=state()['position'];settle();check('map_pause',state()['map_open'] and math.dist(before,state()['position'])<.05)
        tap('primary');check('map_close',not state()['map_open'])
        s=state();b=engine().locator('canvas').bounding_box()
        assert b is not None, 'Visible game canvas required'
        ox=b['x']+min(104,b['width']*.24);oy=b['y']+b['height']-180
        before=state();touches('touchStart',[(1,ox,oy)]);touches('touchMove',[(1,ox,oy-55)]);settle();settle();touches('touchEnd',[]);settle()
        after=state();check('portrait_walk',math.dist(before['position'],after['position'])>1)
        check('stick_does_not_turn_camera',abs(after['yaw']-before['yaw'])<.001)
        settle();check('release_stops',math.dist(after['position'],state()['position'])<.25)
        y=state()['position'][1];page.touchscreen.tap(*point('jump'));engine().wait_for_function('window.__trailBlock.position[1] > '+str(y+.1),timeout=10000);check('portrait_jump',True)
        yaw=state()['yaw'];touches('touchStart',[(2,300,410)]);touches('touchMove',[(2,240,410)]);touches('touchEnd',[]);settle();check('portrait_look',abs(state()['yaw']-yaw)>.05)
        shot('portrait-play')
        before=state();rx=b['x']+b['width']*.77;ry=b['y']+b['height']*.5
        touches('touchStart',[(31,ox,oy)]);touches('touchMove',[(31,ox,oy-35)])
        touches('touchStart',[(31,ox,oy-35),(32,rx,ry)])
        for step in range(12):
            touches('touchMove',[(31,ox,oy-35),(32,rx-(step+1)*3,ry)]);page.wait_for_timeout(100)
        settle();after=state();touches('touchEnd',[]);settle()
        check('two_thumb_movement',math.dist(before['position'],after['position'])>.2)
        check('two_thumb_look',abs(before['yaw']-after['yaw'])>.04)
        # Same DOM-ready + engine-ready sequence as corrected full runner.
        page.reload(wait_until='domcontentloaded',timeout=90000);ready()
        check('reload_engine_ready',state()['paused'] and 'primary' in state()['ui'])
        tap('primary');check('reload_touch_start',not state()['paused'])
        page.set_viewport_size({'width':844,'height':390});settle();tap('pause');check('landscape_pause',state()['paused']);tap('primary');check('landscape_resume',not state()['paused']);shot('landscape-play')
        check('no_runtime_errors',not errors)
        print('FRESH_TOUCH_RELOAD_FOLLOWUP=PASS',flush=True)
    finally:
        (OUT/'checks.json').write_text(json.dumps({'scope':'fresh context; no rescue or earned-reward persistence claim','checks':checks,'errors':errors,'state':state()},indent=2)+'\n')
        browser.close()
