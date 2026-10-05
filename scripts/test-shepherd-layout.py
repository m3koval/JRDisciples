"""Real-pointer responsive world acceptance; no injected game state."""
from pathlib import Path
import os,json,time,math,base64
from playwright.sync_api import sync_playwright
OUT=Path(os.environ.get('JD_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-06/shepherd'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
def record(name,detail):
 checks.append({'name':name,'detail':detail});(OUT/'layout.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));print('PASS',name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 try:
  for lang in ['en','ru']:
   context=browser.new_context(viewport={'width':844,'height':390},has_touch=True,reduced_motion='reduce')
   context.add_init_script(f"localStorage.setItem('language','{lang}')")
   page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
   page.goto('http://127.0.0.1:3107/games/shepherd-light-adventure');page.wait_for_selector('[data-hydrated=true]')
   page.wait_for_function('(v)=>document.documentElement.dataset.lang===v',arg=lang)
   page.get_by_role('checkbox').check();page.get_by_role('button',name='Start Adventure' if lang=='en' else 'Начать приключение').click()
   page.get_by_role('button',name='Open Trail' if lang=='en' else 'Открыть тропу').click()
   cdp=context.new_cdp_session(page)
   def capture(name):
    data=cdp.send('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data'];(OUT/f'{lang}-layout-{name}.png').write_bytes(base64.b64decode(data))
   for width,height in [(844,390),(667,375),(390,844),(768,1024),(1024,768)]:
    page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(200)
    arena=page.locator('.sla-arena').bounding_box();field=page.locator('.sla-playfield').bounding_box();ring=page.locator('.sla-light').bounding_box()
    assert field and arena and ring
    assert abs(field['width']-field['height'])<1 and field['width']>240,(width,height,field)
    assert abs(ring['width']-ring['height'])<1,ring
    for button in page.locator('.sla-hud button,.sla-controls button').all():
     b=button.bounding_box();assert b and b['height']>=44 and b['x']>=0 and b['y']>=0 and b['x']+b['width']<=width+1 and b['y']+b['height']<=height+1,b
    for sprite in page.locator('.sla-sprite').all():
     b=sprite.bounding_box();assert b and b['y']>=arena['y'] and b['y']+b['height']<=arena['y']+arena['height'],(arena,b)
    capture(f'{width}x{height}')
    record(f'{lang} {width}x{height} square units, actors and controls inside viewport',field)
   # At the smallest landscape, trusted pointer walks all four legal corners.
   page.set_viewport_size({'width':667,'height':375});page.wait_for_timeout(100)
   field=page.locator('.sla-playfield').bounding_box();assert field
   for x,y in [(7,9),(93,9),(93,91),(7,91)]:
    page.mouse.move(field['x']+field['width']*x/100,field['y']+field['height']*y/100);page.mouse.down()
    deadline=time.time()+12
    while time.time()<deadline:
     pos=page.locator('.sla-player').evaluate('(e)=>({x:parseFloat(e.style.left),y:parseFloat(e.style.top)})')
     if math.hypot(pos['x']-x,pos['y']-y)<1:break
     page.wait_for_timeout(60)
    page.mouse.up();assert math.hypot(pos['x']-x,pos['y']-y)<1.1,pos
    arena=page.locator('.sla-arena').bounding_box();b=page.locator('.sla-sprite.michael').bounding_box();assert b and arena
    assert b['x']>=arena['x'] and b['y']>=arena['y'] and b['x']+b['width']<=arena['x']+arena['width'] and b['y']+b['height']<=arena['y']+arena['height'],(arena,b)
    capture(f'corner-{x}-{y}');record(f'{lang} real pointer corner {x},{y} no clipping',b)
   page.get_by_role('button',name='Pause' if lang=='en' else 'Пауза',exact=True).click()
   page.get_by_role('button',name='Resume' if lang=='en' else 'Продолжить',exact=True).last.click()
   assert page.locator('.sla-page').get_attribute('data-phase')=='play'
   record(lang+' short-landscape pause resume reachable',True)
   context.close()
  assert not errors,errors
 finally:browser.close()
print(json.dumps({'checks':len(checks),'errors':errors}))
