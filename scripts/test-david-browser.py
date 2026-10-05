"""Trusted input; read-only angle telemetry synchronizes sling timing, no state injection."""
import json,re
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
OUT=Path(os.environ.get('DAVID_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-04/david'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];http=[]
def mark(s): checks.append(s);print('PASS',s,flush=True)
def visible_controls(page):
 for selector in ['.dsv2-game-btn.release','.dsv2-exit']:
  e=page.locator(selector);b=e.bounding_box();v=page.viewport_size
  assert b and b['y']>=0 and b['x']>=0 and b['y']+b['height']<=v['height']+1 and b['x']+b['width']<=v['width']+1,(selector,b,v)
  assert e.evaluate('(e)=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
def shot(page,hit=True,touch=False):
 hold=page.locator('.dsv2-game-btn.release');hold.wait_for();visible_controls(page)
 box=hold.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
 if touch:
  client=page.context.new_cdp_session(page);client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
 else: hold.focus();page.keyboard.down('Space')
 page.wait_for_function("(hit)=>{const e=document.querySelector('.dsv2-meter');const a=+e.dataset.angle,t=+e.dataset.target;return hit ? Math.abs(a-t)<3 : a>t+65 && a<t+90}",arg=hit,timeout=20000)
 if touch:
  client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-95,'y':y-30,'id':1}]});client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});client.detach()
 else: page.keyboard.up('Space')
 page.wait_for_timeout(1100)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 try:
  for lang,view in [('en',{'width':1024,'height':768}),('ru',{'width':768,'height':1024})]:
   ctx=browser.new_context(viewport=view,has_touch=True,reduced_motion='reduce');ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
   page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:http.append(r.url) if r.status>=400 else None)
   page.goto('http://127.0.0.1:3107/games/david-sling-challenge',wait_until='domcontentloaded');page.wait_for_function('(l)=>document.documentElement.dataset.lang===l',arg=lang)
   page.locator('.dsv2-hero-start').tap();page.locator('.dsv2-choice').nth(1).tap();expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-phase','question');mark(lang+' wrong answer cannot skip learning')
   source=(Path(__file__).resolve().parents[1]/'app/games/david-sling-challenge/page.tsx').read_text()
   exact=re.search(r"text"+('Ru' if lang=='ru' else 'En')+r": '([^']+)'",source).group(1)
   expect(page.locator('.dsv2-scripture p')).to_have_text(exact)
   page.screenshot(path=str(OUT/f'{lang}-exact-scripture.png'));mark(lang+' Scripture displays exact source value without added quotation wrapper')
   for level in range(1,4):
    page.locator('.dsv2-choice').first.tap();page.locator('.dsv2-game-btn.release').wait_for()
    expect(page.locator('[data-resource=wisdom] strong')).to_have_text(str(level*2))
    if level==2:page.set_viewport_size({'width':390,'height':844})
    if level==3:page.set_viewport_size({'width':844,'height':390})
    if level>1:
     expect(page.locator('.dsv2-pause-dialog')).to_be_visible()
     page.get_by_role('button',name='Resume' if lang=='en' else 'Продолжить',exact=True).click()
    page.screenshot(path=str(OUT/f'{lang}-level-{level}.png'));shot(page,touch=(level==1))
    if level<3:
     expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-level',str(level+1));assert page.locator('[data-resource=stones] strong').inner_text()=='5'
    else:expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-phase','result')
    mark(f'{lang} level {level}: visible controls and earned hit')
   page.screenshot(path=str(OUT/f'{lang}-win.png'));page.get_by_role('button',name='Play Again' if lang=='en' else 'Снова',exact=True).click();expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-level','1');mark(lang+' victory/replay')
   if lang=='en':
    page.set_viewport_size({'width':1024,'height':768});page.locator('.dsv2-choice').first.click();page.locator('.dsv2-power').nth(2).click()
    shot(page,hit=False);assert page.locator('[data-resource=stones] strong').inner_text()=='5';mark('Trust Shield saves exactly one missed stone')
    for i in range(5):
     shot(page,hit=False)
     expect(page.locator('[data-resource=stones] strong')).to_have_text(str(4-i))
    mark('visible numeric stone count follows every miss down to zero')
    expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-phase','result');page.screenshot(path=str(OUT/'failure.png'));page.get_by_role('button',name='Retry level · 5 stones',exact=True).click();expect(page.locator('.dsv2-play-shell')).to_have_attribute('data-phase','question');mark('finite stone failure and same-level retry')
    page.locator('.dsv2-choice').first.click();hold=page.locator('.dsv2-game-btn.release');hold.focus();page.keyboard.down('Space');page.keyboard.up('Space');page.locator('.dsv2-exit').click();page.wait_for_timeout(1200);assert page.locator('.dsv2-play-shell.fullscreen').count()==0;mark('exit cancels pending shot')
   ctx.close()
  assert not errors,errors;assert not http,http
 finally:
  (OUT/'browser.json').write_text(json.dumps({'checks':checks,'page_errors':errors,'http_failures':http},indent=2));browser.close()
print('PASS',len(checks),'Sling groups')
