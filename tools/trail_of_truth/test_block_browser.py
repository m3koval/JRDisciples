"""Real browser input acceptance. Never writes game state or invokes game methods."""
import json, math, time, pathlib, traceback, os
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/games/block-evidence'/os.environ.get('BLOCK_EVIDENCE','browser')
OUT.mkdir(parents=True,exist_ok=True)
checks={}; errors=[]
TOUCH=os.environ.get('BLOCK_TOUCH')=='1'

def run():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage'])
        context=browser.new_context(viewport={'width':844,'height':600} if TOUCH else {'width':960,'height':600},has_touch=True,device_scale_factor=float(os.environ.get('BLOCK_DPR','1')))
        page=context.new_page()
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.on('console',lambda m: errors.append(m.text) if m.type=='error' else None)
        url=os.environ.get('BLOCK_URL','http://127.0.0.1:8102/games/trail-of-truth-block-adventure/build/index.html')
        page.goto(url,wait_until='domcontentloaded')
        def engine():
            return next(f for f in page.frames if '/games/trail-of-truth-block-adventure/build/' in f.url)
        def ready():
            if '/build/' not in url:page.frame_locator('iframe').locator('canvas').wait_for(timeout=90000)
            engine().wait_for_function('window.__trailBlock && window.__trailBlock.ui',timeout=90000)
        ready()
        cdp=context.new_cdp_session(page)
        def touches(kind,points): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for i,x,y in points]})
        def state():
            s=engine().evaluate('window.__trailBlock')
            if not s: raise AssertionError('Runtime telemetry missing')
            return s
        def check(name,value):
            checks[name]=bool(value)
            (OUT/'checks.json').write_text(json.dumps({'checks':checks,'errors':errors,'state':state()},indent=2))
            print(name,value,flush=True)
            assert value,name
        def shot(name):
            page.screenshot(path=str(OUT/(name+'.png')))
        def settle():
            tick=state()['tick']
            engine().wait_for_function('window.__trailBlock.tick > '+str(tick+12),timeout=15000)
        def point(name):
            s=state(); x,y=s['ui'][name]; box=engine().locator('canvas').bounding_box()
            return box['x']+x*box['width']/s['viewport'][0],box['y']+y*box['height']/s['viewport'][1]
        def click(name):
            if state()['paused'] and name not in ('language','pause','map','rewards','primary','secondary','banner_blue','banner_gold','banner_green'):
                for _ in range(8):
                    x,y=point(name);box=engine().locator('canvas').bounding_box();s=state()
                    assert box is not None, 'Canvas must be visible before input'
                    h=min(460,s['viewport'][1]-28)*box['height']/s['viewport'][1]
                    top=box['y']+(box['height']-h)/2+30;bottom=top+h-60
                    if top<=y<=bottom:break
                    cx=box['x']+box['width']/2;cy=(top+bottom)/2
                    shift=-120 if y>bottom else 120
                    if TOUCH:
                        touches('touchStart',[(11,cx,cy)])
                        for step in range(1,7):
                            touches('touchMove',[(11,cx,cy+shift*step/6)]);page.wait_for_timeout(60)
                        touches('touchEnd',[])
                    else:
                        page.mouse.move(cx,cy);page.mouse.wheel(0,-shift*2)
                    settle()
            x,y=point(name)
            if TOUCH:page.touchscreen.tap(x,y)
            else:page.mouse.click(x,y)
            settle()
        def keypress(k):
            if TOUCH and k=='e' and state()['context']:
                click('action');return
            page.keyboard.down(k);settle();page.keyboard.up(k);settle()
        def walk(x,z,timeout=90):
            held=set();start=time.monotonic()
            box=engine().locator('canvas').bounding_box();initial=state();vw,vh=initial['viewport']
            assert box is not None, 'Canvas must be visible for joystick input'
            ox=box['x']+min(104,box['width']*.24)
            oy=box['y']+box['height']-(180 if box['width']<440 else 112)
            if TOUCH:touches('touchStart',[(7,ox,oy)])
            while time.monotonic()-start<timeout:
                s=state();p=s['position']; dx=x-p[0];dz=z-p[2]
                # Arrival means within ordinary reach, not exact-coordinate steering.
                # Delayed software-renderer frames make sub-step targeting oscillate.
                if math.hypot(dx,dz)<1.15:break
                yaw=s['yaw']; right=dx*math.cos(yaw)-dz*math.sin(yaw); backward=dx*math.sin(yaw)+dz*math.cos(yaw)
                want=set()
                if right>.28:want.add('d')
                if right<-.28:want.add('a')
                if backward>.28:want.add('s')
                if backward<-.28:want.add('w')
                if TOUCH:
                    length=max(math.hypot(right,backward),.001)
                    reach=min(60,length*18)
                    touches('touchMove',[(7,ox+reach*right/length,oy+reach*backward/length)])
                else:
                    for k in held-want:page.keyboard.up(k)
                    for k in want-held:page.keyboard.down(k)
                held=want;page.wait_for_timeout(150)
                with (OUT/'movement.jsonl').open('a') as log:log.write(json.dumps({'target':[x,z],'position':p,'tick':s['tick'],'fps':s['fps'],'held':list(held)})+'\n')
            if TOUCH:touches('touchEnd',[])
            else:
                for k in held:page.keyboard.up(k)
            settle()
            p=state()['position'];check('walk_'+str((x,z)),math.hypot(x-p[0],z-p[2])<1.9)
            check('joystick_keeps_camera_'+str((x,z)),abs(state()['yaw']-initial['yaw'])<.001)
        try:
            shot('desktop-intro'); click('primary');check('trusted_start',not state()['paused'])
            shot('desktop-start')
            if os.environ.get('BLOCK_REWARDS')=='1':
                check('starts_zero_points',state()['adventure_points']==0)
                click('rewards');shot('rewards-locked');click('primary')
            p0=state()['position'];click('map');check('map_opens',state()['map_open'] and state()['paused']);shot('map')
            keypress('w');check('map_pauses_player',math.dist(p0,state()['position'])<.1)
            click('primary');check('map_closes',not state()['map_open'] and not state()['paused'])
            keypress('e');check('invalid_action',state()['bridge']==0 and not state()['complete'])
            walk(-10,3);check('tracks_discovered',state()['trail_found'])
            walk(1.2,0);check('bridge_discovered',state()['crossing_found'])
            walk(-7,-2)
            if TOUCH and os.environ.get('BLOCK_WORLD_TAP')=='1':
                target=state().get('tap_target',{});check('world_tap_target_available',target.get('kind')=='pickup')
                box=engine().locator('canvas').bounding_box();assert box is not None
                s=state();tx,ty=target['position'];px=box['x']+tx*box['width']/s['viewport'][0];py=box['y']+ty*box['height']/s['viewport'][1]
                page.touchscreen.tap(px,py);settle();check('world_tap_pickup',state()['carrying']==0)
            else:keypress('e')
            check('pickup_1',state()['carrying']==0)
            shot('carrying-plank')
            if os.environ.get('BLOCK_CARRY_ONLY')=='1':
                check('no_runtime_errors',not errors)
                return
            walk(1.2,0);keypress('e');check('place_1',state()['bridge']==1)
            walk(-15,-5);keypress('e');check('pickup_2',state()['carrying']==1)
            walk(1.5,0);keypress('e');check('place_2',state()['bridge']==2)
            shot('desktop-bridge')
            walk(9,0);walk(14,-6);check('lamb_not_at_old_easy_spot',not state()['lamb_found'])
            walk(14,-10.8);walk(18.5,-11);keypress('e');check('call_lamb',state()['following'])
            shot('desktop-lamb')
            walk(14,-11);walk(13,-6)
            walk(8,0);page.wait_for_timeout(1600);walk(1.8,0);page.wait_for_timeout(1600)
            walk(-6,5);page.wait_for_timeout(1600);walk(-10,7)
            engine().wait_for_function('window.__trailBlock.complete',timeout=10000)
            check('browser_complete',state()['complete'] and state()['reward_saved'] and state()['save_ok'])
            if os.environ.get('BLOCK_REWARDS')=='1':
                check('rescue_points',state()['adventure_points']==100)
                click('banner_blue');check('banner_chosen',state()['camp_banner_color']=='blue');shot('earned-banner-choice')
            shot('desktop-complete');click('language');check('russian',state()['language']=='ru');shot('desktop-complete-ru')
            click('primary');click('pause')
            click('secondary');page.wait_for_timeout(600);check('replay',state()['bridge']==0 and not state()['complete'])
            check('reward_retained',state()['reward_saved'])
            # Match initial navigation: the engine's telemetry is the readiness
            # authority, not the outer document's load event on software WebGL.
            page.reload(wait_until='domcontentloaded', timeout=90000);ready()
            check('reload_reward',state()['reward_saved'])
            if os.environ.get('BLOCK_REWARDS')=='1':
                check('earned_choice_persists',state()['adventure_points']==100 and state()['camp_banner_color']=='blue')
            # Portrait composition and trusted touch start/movement/jump/camera.
            page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(600);shot('portrait-intro')
            x,y=point('primary');page.touchscreen.tap(x,y);settle()
            check('touch_start',not state()['paused']);shot('portrait-game')
            click('map');check('portrait_map',state()['map_open']);shot('portrait-map');click('primary')
            if os.environ.get('BLOCK_REWARDS')=='1':
                click('rewards');shot('portrait-rewards');click('primary')
            cdp=context.new_cdp_session(page)
            def touches(kind,points): cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':x,'y':y,'id':i} for i,x,y in points]})
            box=engine().locator('canvas').bounding_box();s=state();vw,vh=s['viewport']
            assert box is not None, 'Canvas must be visible for portrait input'
            ox=box['x']+min(104,box['width']*.24);oy=box['y']+box['height']-180
            yaw0=s['yaw'];p0=s['position'];touches('touchStart',[(1,ox,oy)]);touches('touchMove',[(1,ox,oy-55)]);settle();settle();touches('touchEnd',[]);settle()
            p1=state()['position'];check('joystick_moves',math.dist(p0,p1)>1)
            check('portrait_joystick_no_camera_rotation',abs(state()['yaw']-yaw0)<.001)
            settle();check('joystick_releases',math.dist(p1,state()['position'])<.25)
            y0=state()['position'][1];x,y=point('jump');page.touchscreen.tap(x,y);engine().wait_for_function('window.__trailBlock.position[1] > '+str(y0+.1),timeout=10000);check('touch_jump',True)
            yaw=state()['yaw'];touches('touchStart',[(2,300,410)]);touches('touchMove',[(2,240,410)]);touches('touchEnd',[]);settle();check('touch_camera',abs(state()['yaw']-yaw)>.05)
            # Exercise both thumbs concurrently, not two isolated input checks.
            box=engine().locator('canvas').bounding_box();s=state();vw,vh=s['viewport']
            assert box is not None
            ox=box['x']+min(104,box['width']*.24);oy=box['y']+box['height']-180
            rx=box['x']+box['width']*.77;ry=box['y']+box['height']*.50
            trace=[];before=state()
            assert box is not None
            touches('touchStart',[(31,ox,oy)])
            touches('touchMove',[(31,ox,oy-35)])
            touches('touchStart',[(31,ox,oy-35),(32,rx,ry)])
            for step in range(12):
                touches('touchMove',[(31,ox,oy-35),(32,rx-(step+1)*3,ry)])
                page.wait_for_timeout(65);trace.append(state())
            touches('touchEnd',[(31,ox,oy-35)])
            settle();after_look=state()
            touches('touchStart',[(31,ox,oy-35),(33,rx,ry)])
            for step in range(12):
                touches('touchMove',[(31,ox,oy-35),(33,rx+(step+1)*3,ry)])
                page.wait_for_timeout(65);trace.append(state())
            touches('touchEnd',[]);settle();settle()
            stopped=state();settle();settle()
            (OUT/'two-thumb-trace.json').write_text(json.dumps(trace,indent=2))
            check('two_thumb_moves_while_looking',math.dist(before['position'],after_look['position'])>.2)
            check('two_thumb_look_responds',abs(after_look['yaw']-before['yaw'])>.04)
            check('two_thumb_no_large_yaw_steps',all(abs(b['yaw']-a['yaw'])<.25 for a,b in zip(trace,trace[1:])))
            check('two_thumb_release_stops_walk',math.dist(stopped['position'],state()['position'])<.25)
            shot('two-thumb-finished')
            page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(500);shot('phone-landscape')
            click('pause');check('landscape_pause',state()['paused']);shot('phone-landscape-pause')
            page.mouse.move(440,230);page.mouse.wheel(0,500);settle();shot('phone-landscape-pause-scrolled')
            check('landscape_replay_reachable',0 < point('secondary')[1] < 390)
            click('primary');check('landscape_resume',not state()['paused'])
            page.set_viewport_size({'width':1024,'height':768});page.wait_for_timeout(500);shot('tablet-landscape')
            check('no_runtime_errors',not errors)
        except Exception:
            shot('failure');(OUT/'failure.txt').write_text(traceback.format_exc());raise
        finally:
            (OUT/'checks.json').write_text(json.dumps({'checks':checks,'errors':errors,'state':state()},indent=2));browser.close()
if __name__=='__main__':run()
