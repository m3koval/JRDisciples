"""Follow only visible guide marks using real pointer input; no progress/position injection."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,os,re
OUT=Path(os.environ.get('SHEPHERD_GUIDE_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-09/shepherd-guide'));OUT.mkdir(parents=True,exist_ok=True)
results=[];errors=[];failed=[]
def mark(name):
 results.append(name);(OUT/'results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failed},indent=2));print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for lang in ['en','ru']:
   ctx=browser.new_context(viewport={'width':1024,'height':768},has_touch=True,reduced_motion='reduce');ctx.add_init_script(f"localStorage.setItem('language','{lang}')");page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.url,r.status]) if r.status>=400 else None)
   def btn(en,ru):return page.get_by_role('button',name=re.compile('^'+re.escape(ru if lang=='ru' else en)+r'(?: →)?$'))
   try:
    page.goto('http://127.0.0.1:3107/games/shepherd-light-adventure',wait_until='domcontentloaded');page.wait_for_selector('[data-hydrated=true]');page.clock.install();btn('Start Adventure','Начать приключение').click()
    for level in range(1,4):
     btn('Open Trail','Открыть тропу').click();page.wait_for_selector('[data-phase=play]')
     if level==1:
      assert page.locator('.sla-guide-map').count()==0
      btn('Show guide','Покажи путь').click();expect(btn('Hide guide','Скрыть путь')).to_have_attribute('aria-pressed','true')
      for w,h in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
       page.set_viewport_size({'width':w,'height':h});page.clock.run_for(50)
       b=page.locator('.sla-playfield').bounding_box();assert b and b['height']>=180 and abs(b['width']-b['height'])<2,(w,h,b)
       guide=btn('Hide guide','Скрыть путь');guide.scroll_into_view_if_needed();bb=guide.bounding_box();assert bb and bb['height']>=43 and bb['y']+bb['height']<=h+1,(w,h,bb)
       assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
       page.screenshot(path=str(OUT/f'{lang}-{w}x{h}-guide.png'));mark(f'{lang} {w}x{h} square world and reachable guide')
      page.set_viewport_size({'width':1024,'height':768})
      btn('Pause','Пауза').click();expect(page.locator('.sla-page')).to_have_attribute('data-phase','paused');assert page.locator('.sla-guide-map').count()==0;page.clock.run_for(1000);btn('Resume','Продолжить').last.click();assert page.locator('.sla-guide-map').count()==1;mark(f'{lang} guide hides during pause and resumes')
     # Freeze between input steps: host wall time must not hide brief catch-up cues.
     # The observer reads rendered attributes only; it never mutates game state.
     page.clock.pause_at(page.evaluate('Date.now()'))
     page.evaluate("""() => { window.__guideObserver?.disconnect(); window.__guideStates=[]; const el=document.querySelector('[data-guide-state]'); window.__guideObserver=new MutationObserver(()=>window.__guideStates.push(el.dataset.guideState)); window.__guideObserver.observe(el,{attributes:true,attributeFilter:['data-guide-state']}); }""")
     seen=set();trace=[]
     for step in range(350):
      snapshot=page.evaluate("""() => ({phase:document.querySelector('.sla-page')?.dataset.phase,state:document.querySelector('[data-guide-state]')?.dataset.guideState,points:document.querySelector('.sla-guide-map polyline')?.getAttribute('points')})""")
      phase=snapshot['phase']
      if phase!='play':break
      state=snapshot['state'];seen.add(state)
      if snapshot.get('points'):
       points=[tuple(map(float,pair.split(','))) for pair in snapshot['points'].split()];x,y=points[1];box=page.locator('.sla-playfield').bounding_box()
       page.mouse.move(box['x']+box['width']*x/100,box['y']+box['height']*y/100);page.mouse.down()
      else:
       assert state in ['wait','home'],(level,state,page.locator('.sla-message').inner_text())
       page.mouse.up()
      page.clock.run_for(120)
      page.mouse.up()
      hp=page.locator('.sla-page').get_attribute('data-hp');assert hp=='3',(lang,level,step,hp)
      if step%20==0:trace.append({'step':step,'state':state,'hp':hp})
      if state=='return' and not (OUT/f'{lang}-trail-{level}-return.png').exists():page.screenshot(path=str(OUT/f'{lang}-trail-{level}-return.png'))
     page.mouse.up();seen.update(page.evaluate('window.__guideStates'));expect(page.locator('.sla-page')).to_have_attribute('data-phase','reward');assert {'collect','return','escort','wait'}<=seen,(lang,level,seen)
     page.screenshot(path=str(OUT/f'{lang}-trail-{level}-reward.png'));(OUT/f'{lang}-trail-{level}-trace.json').write_text(json.dumps(trace,indent=2));mark(f'{lang} trail{level} actual-pointer guide-only victory, collect/return/wait/escort, no shield/helper/damage')
     page.locator('.sla-panel .sla-btn').click()
    expect(page.locator('.sla-page')).to_have_attribute('data-phase','complete');page.screenshot(path=str(OUT/f'{lang}-complete.png'));btn('Play Again','Играть снова').click();expect(page.locator('.sla-page')).to_have_attribute('data-level','1');mark(f'{lang} three-trail guide-only campaign and replay')
   except Exception:
    page.screenshot(path=str(OUT/f'{lang}-failure.png'));(OUT/f'{lang}-failure.txt').write_text(page.locator('body').inner_text());raise
   finally:ctx.close()
  assert not errors,errors;assert not failed,failed
 finally:
  browser.close();(OUT/'results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failed},indent=2))
print('Accepted',len(results),'Shepherd guide groups',flush=True)
