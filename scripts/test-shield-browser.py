"""Trusted input plus accelerated Playwright clock; never writes game state."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os
OUT=Path(os.environ.get('JD_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-01/shield'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
LANG=os.environ.get('SHIELD_LANG','en')
def text(en,ru):return ru if LANG=='ru' else en
def record(name,ok):
 checks.append({'name':name,'passed':bool(ok)})
 (OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2))
 assert ok,name
 print('PASS',name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  context=browser.new_context(viewport={'width':1024,'height':768},has_touch=True)
  context.add_init_script(f"localStorage.setItem('language','{LANG}')")
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:errors.append(f'HTTP {r.status} {r.url}') if r.status>=400 else None)
  page.goto(os.environ.get('JD_BASE','http://127.0.0.1:3107')+'/games/shield-of-faith')
  page.wait_for_function('(lang)=>document.documentElement.dataset.lang===lang',arg=LANG)
  page.get_by_role('button',name=text('Play →','Играть →'),exact=True).click()
  page.wait_for_timeout(300)
  def state():return json.loads(page.locator('canvas').get_attribute('data-state'))
  cdp=context.new_cdp_session(page)
  def touch(kind,points):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'id':i,'x':x,'y':y}for i,x,y in points]})
  old=state()
  touch('touchStart',[(1,80,650)]);touch('touchMove',[(1,130,650)])
  page.wait_for_timeout(250)
  box=page.get_by_role('button',name=text('Hold shield','Держи щит'),exact=False).bounding_box();gx=box['x']+box['width']/2;gy=box['y']+box['height']/2
  touch('touchStart',[(1,130,650),(2,gx,gy)]);page.wait_for_timeout(250)
  s=state();record('two-thumb move plus held shield',s['x']>old['x']+30 and s['guard']['active'] and s['guard']['energy']<100)
  page.screenshot(path=str(OUT/'two-thumb-landscape.png'))
  touch('touchCancel',[]);page.wait_for_timeout(120);s=state();x=s['x'];e=s['guard']['energy'];page.wait_for_timeout(200)
  record('touch cancel stops movement and recharges',abs(state()['x']-x)<1 and state()['guard']['energy']>e)
  page.get_by_role('button',name=text('Pause','Пауза'),exact=True).click();s=state();page.wait_for_timeout(300)
  record('pause freezes simulation',state()==s)
  page.get_by_role('button',name=text('Resume','Продолжить'),exact=True).click();page.wait_for_timeout(100)
  page.keyboard.down('d');page.wait_for_timeout(100);page.evaluate("window.dispatchEvent(new Event('blur'))")
  page.keyboard.up('d');record('focus loss pauses',page.get_by_role('button',name=text('Resume','Продолжить'),exact=True).is_visible())
  page.get_by_role('button',name=text('Resume','Продолжить'),exact=True).click()
  page.set_viewport_size({'width':768,'height':1024});page.wait_for_timeout(200)
  s=state();record('orientation keeps avatar inside arena',0<=s['x']<=768 and 0<=s['y']<=1024)
  page.screenshot(path=str(OUT/'portrait-final.png'))
  # Accelerated clock still executes the actual RAF loop and collision code.
  page.clock.install()
  for _ in range(160):
   if state().get('warnings'):break
   page.clock.run_for(16)
  record('real spawned dart has a readable arrival-warning interval',bool(state().get('warnings')))
  page.screenshot(path=str(OUT/'arrival-warning.png'))
  page.get_by_role('button',name=text('Pause','Пауза'),exact=True).click();before=state()['warnings'];page.clock.run_for(1500)
  record('pause freezes arrival timer',state()['warnings']==before)
  page.get_by_role('button',name=text('Resume','Продолжить'),exact=True).click()
  for wave in range(1,11):
   # Move off the central crossing and guard approaching darts with actual input.
   page.keyboard.down('a');page.keyboard.down('w');page.clock.run_for(3000);page.keyboard.up('a');page.keyboard.up('w')
   for attempt in range(600):
    s=state()
    if s['phase']!='playing':break
    if s['nearestThreat']<110:page.keyboard.down('Space')
    else:page.keyboard.up('Space')
    page.clock.run_for(200)
   page.keyboard.up('Space')
   s=state()
   (OUT/f'wave-{wave}.json').write_text(json.dumps(s))
   record(f'wave {wave} resolves without deadlock',s['phase']==('victory' if wave==10 else 'verse'))
   if wave==10:break
   next_button=page.get_by_role('button',name=(f'Волна {wave+1} →' if LANG=='ru' else f'Wave {wave+1} →'),exact=True)
   record(f'wave {wave} requires practical response',not next_button.is_enabled())
   if wave==1:
    page.get_by_role('button',name=text('Forget God and do whatever I feel like.','Забыть о Боге и поступать как хочется.'),exact=True).click()
    record('wrong answer retains retry',not next_button.is_enabled())
    page.screenshot(path=str(OUT/'verse-retry.png'))
   # Correct response is the other response, not the next-wave button.
   page.get_by_role('button').filter(has_text='Forget God').count()
   choices=page.locator('button').filter(has_not=page.locator('svg'))
   texts=['Ask God for help when you feel afraid.','Keep doing what is right, even when it is hard.','Tell the truth, even after a mistake.','Make peace instead of starting a quarrel.','Trust God rather than a tempting lie.','Remember what God says when choosing what to do.','Stand firm: you do not have to follow a bad choice.','Pray for someone who needs help.','Our strength comes from the Lord.']
   if LANG=='ru':texts=['Проси Бога о помощи, когда страшно.','Поступай правильно, даже когда трудно.','Говори правду, даже если ошибся.','Мирись, а не начинай ссору.','Доверяй Богу, а не заманчивой лжи.','Вспоминай Божье Слово, когда выбираешь, как поступить.','Стой твёрдо: не нужно повторять чужой плохой выбор.','Помолись о том, кому нужна помощь.','Наша сила — в Господе.']
   page.get_by_role('button',name=texts[wave-1],exact=True).click();next_button.click()
  page.screenshot(path=str(OUT/'victory.png'))
  page.get_by_role('button',name=text('Play again','Ещё раз'),exact=True).click();page.clock.run_for(32)
  record('victory replay resets wave health armor',state()['wave']==1 and state()['hp']==3 and state()['armor']==[])
  record('no runtime errors',not errors)
  context.close()
  # Verify Russian and unavailable storage on a fresh browser context.
  context=browser.new_context(viewport={'width':390,'height':844},has_touch=True)
  context.add_init_script("localStorage.setItem('language','ru'); const g=Storage.prototype.getItem; Storage.prototype.getItem=function(k){if(k==='shield-of-faith-best')throw Error('blocked');return g.call(this,k)}; Storage.prototype.setItem=function(){throw Error('quota')}")
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('JD_BASE','http://127.0.0.1:3107')+'/games/shield-of-faith');page.get_by_role('button',name='Играть →',exact=True).click();page.wait_for_timeout(200)
  record('Russian play works with blocked score storage',page.get_by_role('button',name='Держи щит',exact=False).is_visible())
  page.screenshot(path=str(OUT/'ru-mobile.png'))
  record('no runtime errors including storage failure',not errors)
 finally:
  browser.close()
print(json.dumps({'checks':len(checks),'errors':errors}))
