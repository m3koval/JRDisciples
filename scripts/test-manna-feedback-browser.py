"""Read-only forecasts plus trusted input/layout checks for Manna feedback."""
from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
OUT=Path(os.environ.get('MANNA_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-07/manna-final'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];failures=[]
def mark(name):
 checks.append(name);(OUT/'feedback.json').write_text(json.dumps(dict(checks=checks,errors=errors,failures=failures),indent=2));print('PASS',name,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 p=None
 try:
  for lang in ['en','ru']:
   c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,reduced_motion='reduce');c.add_init_script(f"localStorage.setItem('language','{lang}')")
   p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:failures.append(str(r.status)+' '+r.url) if r.status>=400 else None)
   p.goto('http://127.0.0.1:3107/games/manna-trail');p.wait_for_function('(lang)=>document.documentElement.dataset.lang===lang',arg=lang)
   p.get_by_role('button',name='▶ Start the Trail' if lang=='en' else '▶ Начать путь',exact=True).click();p.locator('canvas').wait_for();p.wait_for_timeout(60);p.clock.install();p.clock.pause_at(p.evaluate('Date.now()'));p.clock.run_for(32)
   canvas=p.locator('canvas')
   def state():return json.loads(canvas.get_attribute('data-state'))
   def forecast():return json.loads(canvas.get_attribute('data-next-step'))
   assert canvas.evaluate('(e)=>e===document.activeElement');s=state();f=forecast();assert f['x']==s['snake'][0]['x']+1 and f['danger'] is None
   p.keyboard.press('ArrowUp');p.clock.run_for(16);s=state();f=forecast();assert f['x']==s['snake'][0]['x'] and f['y']==s['snake'][0]['y']-1;mark(f'{lang} trusted queued turn changes visible exact next-step forecast')
   for _ in range(300):
    if forecast()['danger']=='edge':break
    p.clock.run_for(16)
   assert forecast()['danger']=='edge' and state()['phase']=='play';p.screenshot(path=str(OUT/f'{lang}-edge-warning.png'));mark(f'{lang} edge warning visible before real collision')
   p.clock.run_for(500);assert state()['phase']=='over';assert ('The edge!' if lang=='en' else 'Край тропы!') in p.get_by_role('dialog').inner_text();mark(f'{lang} actual collision reports correct reason')
   p.get_by_role('button',name='Back to the trail' if lang=='en' else 'Вернуться на тропу',exact=True).click();p.clock.run_for(32);assert canvas.evaluate('(e)=>e===document.activeElement');assert state()['phase']=='play';mark(f'{lang} recovery restores keyboard focus')
   cdp=c.new_cdp_session(p)
   def touches(kind,points):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'id':i,'x':x,'y':y} for i,x,y in points]})
   r=canvas.bounding_box();assert r is not None;cx=r['x']+r['width']*.5;cy=r['y']+r['height']*.5
   touches('touchStart',[(1,cx,cy)]);touches('touchMove',[(1,cx,cy-45)]);p.clock.run_for(300);assert state()['direction']=={'x':0,'y':-1}
   touches('touchStart',[(1,cx,cy-45),(2,cx+80,cy)]);touches('touchMove',[(1,cx,cy-45),(2,cx-80,cy)]);p.clock.run_for(260);assert state()['direction']=={'x':0,'y':-1};mark(f'{lang} actual held touch steering ignores second finger')
   touches('touchCancel',[]);p.get_by_role('button',name='Right' if lang=='en' else 'Вправо',exact=True).tap();p.clock.run_for(600);assert state()['direction']=={'x':1,'y':0};mark(f'{lang} pointer cancel releases joystick and touch direction button takes over')
   for width,height in [(320,740),(390,844),(667,375),(768,1024),(1024,768)]:
    p.set_viewport_size({'width':width,'height':height});p.clock.run_for(32)
    controls=p.locator('.mt-controls button');assert controls.count()==4
    for i in range(4):
     r=controls.nth(i).bounding_box();assert r['width']>=44 and r['height']>=44 and r['x']>=0 and r['y']>=0 and r['x']+r['width']<=width+.5 and r['y']+r['height']<=height+.5,(width,height,r)
     assert controls.nth(i).evaluate('(e)=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}'),(width,height,i)
    assert p.locator('.mt-fullscreen').evaluate('(e)=>e.scrollWidth<=e.clientWidth'),(width,height)
    p.screenshot(path=str(OUT/f'{lang}-{width}x{height}.png'));mark(f'{lang} {width}x{height} four reachable non-drag controls and no horizontal overflow')
   p.get_by_role('button',name='Ⅱ Pause' if lang=='en' else 'Ⅱ Пауза',exact=True).click();p.clock.run_for(32);s=state();p.clock.run_for(2000);assert state()==s
   p.get_by_role('button',name='Continue' if lang=='en' else 'Продолжить',exact=True).click();p.clock.run_for(32);assert canvas.evaluate('(e)=>e===document.activeElement');mark(f'{lang} pause freezes and resume restores focus')
   p.get_by_role('button',name='✕ Exit' if lang=='en' else '✕ Выход',exact=True).click()
   p.get_by_role('button',name='Brisk trail' if lang=='en' else 'Бодрый путь',exact=True).click();p.get_by_role('button',name='▶ Start the Trail' if lang=='en' else '▶ Начать путь',exact=True).click();p.clock.run_for(32);assert canvas.get_attribute('data-next-step') is None;mark(f'{lang} Brisk mode keeps unassisted challenge')
   c.close()
  assert not errors and not failures,(errors,failures)
 except Exception:
  if p is not None:
   p.screenshot(path=str(OUT/'failure.png'))
   (OUT/'failure-state.json').write_text(json.dumps({'errors':errors,'failures':failures,'text':p.locator('body').inner_text()},indent=2))
  raise
 finally:b.close()
print('PASS',len(checks),'Manna feedback/layout groups')
