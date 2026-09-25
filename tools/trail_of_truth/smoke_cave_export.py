"""Trusted-touch boot/movement smoke of the actual static app iframe, not cave traversal."""
import json,math,os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/games/block-evidence/apex-cave-recovery/browser-smoke'
OUT.mkdir(parents=True,exist_ok=True)
checks={};errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage'])
    context=browser.new_context(viewport={'width':844,'height':600},has_touch=True)
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' else None)
    try:
        page.goto(os.environ.get('BLOCK_URL','http://127.0.0.1:8216/games/trail-of-truth/'),wait_until='domcontentloaded')
        page.frame_locator('iframe').locator('canvas').wait_for(timeout=90000)
        engine=next(f for f in page.frames if '/trail-of-truth-block-adventure/build/' in f.url)
        engine.wait_for_function('window.__trailBlock && window.__trailBlock.ui',timeout=90000)
        def state(): return engine.evaluate('window.__trailBlock')
        def settle():
            tick=state()['tick'];engine.wait_for_function('window.__trailBlock.tick > '+str(tick+5),timeout=45000)
        def tap(name):
            s=state();box=engine.locator('canvas').bounding_box();x,y=s['ui'][name]
            assert box is not None, 'Engine canvas must be visible for trusted touch'
            page.touchscreen.tap(box['x']+x*box['width']/s['viewport'][0],box['y']+y*box['height']/s['viewport'][1]);settle()
        tap('primary');checks['trusted_touch_starts_export']=not state()['paused'];assert checks['trusted_touch_starts_export']
        start=state()['position'];page.keyboard.down('w');settle();page.keyboard.up('w');settle()
        checks['trusted_keyboard_moves_player']=math.dist(start,state()['position'])>.05;assert checks['trusted_keyboard_moves_player']
        tap('map');checks['touch_map_opens_and_pauses']=state()['map_open'] and state()['paused'];assert checks['touch_map_opens_and_pauses']
        tap('primary');checks['touch_map_closes_and_resumes']=not state()['map_open'] and not state()['paused'];assert checks['touch_map_closes_and_resumes']
        page.screenshot(path=str(OUT/'export-start.png'))
        checks['no_runtime_errors']=not errors;assert not errors,errors
    finally:
        (OUT/'results.json').write_text(json.dumps({'checks':checks,'errors':errors,'scope':'Static app iframe boot, trusted touch start/map, keyboard movement only. Not full cave browser route or physical iPad QA.'},indent=2)+'\n')
        browser.close()
print(json.dumps(checks));print('CAVE_EXPORT_SMOKE_PASS')
