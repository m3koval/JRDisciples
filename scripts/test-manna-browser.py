"""Input-driven first verse + failure/recovery, no game-state writes."""
from playwright.sync_api import sync_playwright
from pathlib import Path
from collections import deque
import json
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-01/manna');OUT.mkdir(parents=True,exist_ok=True)
checks=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for lang in ['en','ru']:
  c=b.new_context(viewport={'width':768,'height':1024},has_touch=True);c.add_init_script(f"localStorage.setItem('language','{lang}')")
  p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.goto('http://127.0.0.1:3107/games/manna-trail');p.get_by_role('button',name='▶ Start the Trail' if lang=='en' else '▶ Начать путь',exact=True).click()
  p.wait_for_timeout(100);p.clock.install()
  def state():return json.loads(p.locator('canvas').get_attribute('data-state'))
  # Deliberately let the trail reach the wall, then use the real recovery button.
  p.clock.run_for(5000);s=state();assert s['phase']=='over';assert s['words']==1
  p.screenshot(path=str(OUT/f'{lang}-failure.png'))
  p.get_by_role('button',name='Back to the trail' if lang=='en' else 'Вернуться на тропу',exact=True).click();p.clock.run_for(16)
  assert state()['words']==1;checks.append(f'{lang} failure recovery retains first word')
  dirs=[(0,-1,'ArrowUp'),(-1,0,'ArrowLeft'),(0,1,'ArrowDown'),(1,0,'ArrowRight')]
  for move in range(230):
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
   assert path,'no route'
   p.keyboard.press(path[0])
   for tick in range(35):
    p.clock.run_for(16);n=state()
    if n['phase']!='play' or n['snake'][0]!=s['snake'][0]:break
  assert state()['phase']=='levelUp',state();checks.append(f'{lang} first verse fully collected with actual directional input')
  p.screenshot(path=str(OUT/f'{lang}-verse.png'))
  p.get_by_role('button',name=('Keep Going → Level 2' if lang=='en' else 'Дальше → Уровень 2'),exact=True).click();p.clock.run_for(16)
  assert state()['level']==2
  p.get_by_role('button',name='Ⅱ Pause' if lang=='en' else 'Ⅱ Пауза',exact=True).click();s=state();p.clock.run_for(5000);assert state()['snake']==s['snake'];checks.append(f'{lang} pause freezes actual snake')
  p.get_by_role('button',name='Continue' if lang=='en' else 'Продолжить',exact=True).click();p.clock.run_for(16)
  p.screenshot(path=str(OUT/f'{lang}-portrait.png'));p.set_viewport_size({'width':1024,'height':768});p.clock.run_for(16);p.screenshot(path=str(OUT/f'{lang}-landscape.png'))
  assert not errors,errors;c.close()
 (OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':[]},indent=2));b.close()
print('PASS',checks)
