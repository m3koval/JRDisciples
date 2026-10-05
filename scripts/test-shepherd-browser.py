import json, math, time, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-04/shepherd')
levels=json.loads((OUT/'levels.json').read_text()); results=[]; errors=[]; failures=[]
def mark(name):
 results.append(name); print('PASS',name,flush=True); (OUT/'browser-progress.json').write_text(json.dumps(results,indent=2))
def phase(page): return page.locator('.sla-page').get_attribute('data-phase')
def position(page): return page.locator('.sla-player').evaluate('(el)=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)})')
def goto_point(page, target, timeout=15000):
 box=page.locator('.sla-arena').bounding_box()
 page.mouse.move(box['x']+box['width']*target['x']/100, box['y']+box['height']*target['y']/100)
 page.mouse.down()
 until=time.time()+timeout/1000
 while time.time()<until:
  p=position(page)
  if math.hypot(p['x']-target['x'],p['y']-target['y'])<1.5 or phase(page)!='play': break
  page.wait_for_timeout(80)
 page.mouse.up()
 assert math.hypot(position(page)['x']-target['x'],position(page)['y']-target['y'])<1.6 or phase(page) in ['reward','failed'], (target,position(page),phase(page))
def open_page(browser, lang='en', viewport=None, storage_block=False):
 context=browser.new_context(viewport=viewport or {'width':1024,'height':768},has_touch=True, reduced_motion='reduce')
 context.add_init_script(f"localStorage.setItem('language','{lang}')")
 if storage_block: context.add_init_script("Storage.prototype.getItem=function(){throw new Error('blocked')}; Storage.prototype.setItem=function(){throw new Error('blocked')}")
 page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:failures.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
 page.goto('http://127.0.0.1:3107/games/shepherd-light-adventure',wait_until='domcontentloaded',timeout=90000)
 page.wait_for_selector('.sla-page[data-hydrated="true"]',timeout=30000)
 if not storage_block: page.wait_for_function('(lang)=>document.documentElement.dataset.lang===lang',arg=lang)
 return context,page
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 try:
  context,page=open_page(browser)
  page.screenshot(path=str(OUT/'intro-owned-art.png'))
  page.get_by_role('button',name='Start Adventure').click(); page.wait_for_selector('[data-phase="briefing"]')
  assert page.get_by_role('button',name='Pause',exact=True).is_disabled()
  page.get_by_role('button',name='Open Trail').click(); page.wait_for_selector('[data-phase="play"]')
  page.screenshot(path=str(OUT/'normal-landscape.png'))
  # Unprotected deliberate collisions exercise real health, defeat and retry.
  goto_point(page,levels[0]['orbs'][0]); found=page.locator('.sla-orb').count()
  h=levels[0]['hazards'][0]
  box=page.locator('.sla-arena').bounding_box(); page.mouse.move(box['x']+box['width']*h['x']/100,box['y']+box['height']*h['y']/100); page.mouse.down()
  page.wait_for_selector('[data-phase="failed"]',timeout=20000); page.mouse.up()
  page.screenshot(path=str(OUT/'failure.png')); mark('normal actual-pointer hazard defeat')
  page.get_by_role('button',name='Try Again').click(); page.wait_for_selector('[data-phase="play"]')
  assert page.locator('.sla-page').get_attribute('data-hp')=='3'; assert page.locator('.sla-orb').count()<=found
  mark('checkpoint retries retain collected light and restore HP')
  page.get_by_role('button',name='Pause',exact=True).click(); before=position(page); page.wait_for_timeout(500); assert position(page)==before
  page.screenshot(path=str(OUT/'pause.png')); page.get_by_role('button',name='Resume',exact=True).last.click(); mark('pause freezes and resumes')
  page.keyboard.down('ArrowRight'); page.wait_for_timeout(150); page.evaluate("window.dispatchEvent(new Event('blur'))"); page.keyboard.up('ArrowRight')
  page.wait_for_selector('[data-phase="paused"]'); page.get_by_role('button',name='Resume',exact=True).last.click(); before=position(page); page.wait_for_timeout(300); assert position(page)==before; mark('focus interruption clears held movement')
  page.get_by_role('button',name='Pause',exact=True).click(); page.get_by_role('button',name='Exit',exact=True).click(); context.close()
  for lang, viewport in [('en',{'width':1024,'height':768}),('ru',{'width':768,'height':1024})]:
   context,page=open_page(browser,lang,viewport)
   if lang == 'ru': page.get_by_role('checkbox').check()
   page.get_by_role('button',name='Start Adventure' if lang=='en' else 'Начать приключение').click()
   for i,level in enumerate(levels):
    page.get_by_role('button',name='Open Trail' if lang=='en' else 'Открыть тропу').click()
    page.wait_for_selector('[data-phase="play"]')
    assert page.locator('.sla-page').get_attribute('data-level')==str(i+1)
    for orb in level['orbs']:
     if lang == 'en': page.keyboard.press('h'); page.keyboard.down('Space')
     goto_point(page,orb)
     if lang == 'en': page.keyboard.up('Space'); page.wait_for_timeout(2000)
    assert page.locator('.sla-orb').count()==0
    if lang == 'en': page.keyboard.press('h'); page.keyboard.down('Space')
    goto_point(page,level['lambStart']); page.keyboard.up('Space'); page.wait_for_timeout(2500); page.keyboard.press('c'); page.keyboard.down('Space')
    # Releasing to recharge while stationary also lets the lamb catch up.
    page.wait_for_timeout(800)
    page.screenshot(path=str(OUT/f'{lang}-trail-{i+1}-escort.png'))
    start=position(page); gate=level['gate']
    for j in range(1,5):
     goto_point(page,{'x':start['x']+(gate['x']-start['x'])*j/4,'y':start['y']+(gate['y']-start['y'])*j/4})
     if phase(page)=='reward': break
     page.keyboard.up('Space'); page.keyboard.press('c'); page.keyboard.press('h'); page.wait_for_timeout(600); page.keyboard.down('Space')
    page.keyboard.up('Space'); page.keyboard.press('c')
    page.wait_for_selector('[data-phase="reward"]',timeout=12000)
    page.screenshot(path=str(OUT/f'{lang}-trail-{i+1}-reward.png'))
    mark(f'{lang} trail {i+1}: collect, call, escort, gate, scripture reward ({"Calm Mode" if lang=="ru" else "Normal Mode: actual shield/helper inputs"})')
    page.locator('.sla-panel .sla-btn').click()
   page.wait_for_selector('[data-phase="complete"]'); page.screenshot(path=str(OUT/f'{lang}-complete.png')); mark(f'{lang} three-trail final victory')
   assert page.evaluate("Number(localStorage.getItem('shepherd-light-adventure-best'))")>0
   page.get_by_role('button',name='Play Again' if lang=='en' else 'Играть снова').click(); page.wait_for_selector('[data-phase="briefing"]'); assert page.locator('.sla-page').get_attribute('data-level')=='1'; mark(f'{lang} replay resets progression')
   context.close()
  context,page=open_page(browser,viewport={'width':390,'height':844},storage_block=True)
  page.get_by_role('button',name='Start Adventure').click(); page.get_by_role('button',name='Open Trail').click(); page.screenshot(path=str(OUT/'phone-storage-blocked.png'))
  assert page.locator('.sla-arena').bounding_box()['height']>200
  mark('blocked storage remains playable; phone viewport')
  # Real simultaneous CDP touches: moving finger plus shield finger.
  client=context.new_cdp_session(page); arena=page.locator('.sla-arena').bounding_box(); shield=page.locator('.sla-control').first.bounding_box()
  a={'x':arena['x']+arena['width']*.5,'y':arena['y']+arena['height']*.8,'id':1}; b={'x':shield['x']+shield['width']/2,'y':shield['y']+shield['height']/2,'id':2}
  start=position(page); client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[a]}); page.wait_for_timeout(200)
  client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[a,b]}); page.wait_for_timeout(400)
  assert page.locator('.sla-control').first.get_attribute('aria-pressed')=='true'; assert position(page)['x']>start['x']
  client.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]}); page.wait_for_timeout(200); assert page.locator('.sla-control').first.get_attribute('aria-pressed')=='false'
  pos=position(page); page.wait_for_timeout(250); assert position(page)==pos; mark('real two-touch move+shield and cancel release')
  page.set_viewport_size({'width':844,'height':390}); page.screenshot(path=str(OUT/'phone-landscape.png')); assert page.locator('.sla-arena').bounding_box()['height']>120; mark('orientation resize remains usable')
  context.close()
 except Exception as e:
  errors.append(traceback.format_exc()); print(traceback.format_exc(),flush=True)
  try: page.screenshot(path=str(OUT/'browser-failure.png'))
  except Exception: pass
 finally:
  browser.close(); (OUT/'browser-results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failures},indent=2,ensure_ascii=False))
 assert not errors, errors
 assert not failures, failures
 print('Browser accepted',len(results),'groups',flush=True)
