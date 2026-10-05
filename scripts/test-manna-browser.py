"""Actual keyboard nine-verse campaigns and source quotes; read-only telemetry."""
from playwright.sync_api import sync_playwright
from pathlib import Path
from collections import deque
import json,os
OUT=Path(os.environ.get('MANNA_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-06/manna'));OUT.mkdir(parents=True,exist_ok=True)
fixtures=json.loads(Path('scripts/fixtures/manna-scripture.json').read_text())['verses'];checks=[];errors=[];failures=[]
def mark(name):
 checks.append(name);(OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors,'failures':failures},indent=2));print('PASS',name,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for lang in ['en','ru']:
   c=b.new_context(viewport={'width':768,'height':1024},has_touch=True);c.add_init_script(f"localStorage.setItem('language','{lang}')")
   p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:failures.append(f'{r.status} {r.url}') if r.status>=400 else None)
   p.goto('http://127.0.0.1:3107/games/manna-trail');p.get_by_role('button',name='▶ Start the Trail' if lang=='en' else '▶ Начать путь',exact=True).click()
   p.wait_for_timeout(100);p.clock.install()
   def state():return json.loads(p.locator('canvas').get_attribute('data-state'))
   p.clock.run_for(5000);s=state();assert s['phase']=='over' and s['words']==1,s
   p.screenshot(path=str(OUT/f'{lang}-failure.png'))
   p.get_by_role('button',name='Back to the trail' if lang=='en' else 'Вернуться на тропу',exact=True).click();p.clock.run_for(16)
   assert state()['words']==1;mark(f'{lang} failure recovery retains first word')
   dirs=[(0,-1,'ArrowUp'),(-1,0,'ArrowLeft'),(0,1,'ArrowDown'),(1,0,'ArrowRight')]
   for level in range(1,10):
    for move in range(500):
     s=state()
     if s['phase']!='play':break
     head=(s['snake'][0]['x'],s['snake'][0]['y']);goal=(s['word']['x'],s['word']['y'])
     blocked={(v['x'],v['y']) for v in s['snake'][1:]+s['rocks']}
     q=deque([(head,[])]);seen={head};path=[]
     while q:
      pos,path=q.popleft()
      if pos==goal:break
      for dx,dy,key in dirs:
       if not path and dx==-s['direction']['x'] and dy==-s['direction']['y']:continue
       n=(pos[0]+dx,pos[1]+dy)
       if n not in seen and n not in blocked and 0<=n[0]<21 and 0<=n[1]<21:seen.add(n);q.append((n,path+[key]))
     assert path and pos==goal,('no route',level,s)
     p.keyboard.press(path[0])
     for tick in range(35):
      p.clock.run_for(16);n=state()
      if n['phase']!='play' or n['snake'][0]!=s['snake'][0]:break
    assert state()['phase']=='levelUp',state()
    quote=next(f['quote'] for f in fixtures if f['language']==lang and f['index']==level-1)
    assert quote in p.locator('.mt-overlay').inner_text(),quote
    p.screenshot(path=str(OUT/f'{lang}-verse-{level}.png'));mark(f'{lang} verse {level} actual collection and exact reward quote')
    name=('In camp' if lang=='en' else 'В лагерь') if level==9 else (f'Keep Going → Level {level+1}' if lang=='en' else f'Дальше → Уровень {level+1}')
    if level==9:
     # Final action label is selected from the actual reward button, not injected state.
     p.locator('.mt-overlay .mt-btn').click()
    else:p.get_by_role('button',name=name,exact=True).click()
    p.clock.run_for(16)
    if level==1:
     assert state()['level']==2
     p.get_by_role('button',name='Ⅱ Pause' if lang=='en' else 'Ⅱ Пауза',exact=True).click();s=state();p.clock.run_for(5000);assert state()['snake']==s['snake'];mark(f'{lang} pause freezes actual snake')
     p.get_by_role('button',name='Continue' if lang=='en' else 'Продолжить',exact=True).click();p.clock.run_for(16)
   assert state()['phase']=='won';p.screenshot(path=str(OUT/f'{lang}-finale.png'));mark(f'{lang} nine-verse final victory')
   p.locator('.mt-overlay .mt-btn').click();p.clock.run_for(16);assert state()['level']==1 and state()['words']==0;mark(f'{lang} replay clears progression')
   p.screenshot(path=str(OUT/f'{lang}-portrait.png'));p.set_viewport_size({'width':1024,'height':768});p.clock.run_for(16);p.screenshot(path=str(OUT/f'{lang}-landscape.png'))
   c.close()
  assert not errors and not failures,{'errors':errors,'failures':failures}
 finally:b.close()
print('PASS',len(checks),'Manna browser groups')
