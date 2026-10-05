from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,os
OUT=Path(os.environ.get('ARCHER_REVIEW_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-10/archer-controls'));OUT.mkdir(parents=True,exist_ok=True)
passed=[];errors=[]
def mark(n):
 passed.append(n);(OUT/'results.json').write_text(json.dumps({'passed':passed,'errors':errors},indent=2));print('PASS',n,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader'])
 try:
  for lang in ['en','ru']:
   context=browser.new_context(viewport={'width':1024,'height':768},has_touch=True,reduced_motion='reduce');context.add_init_script(f"localStorage.setItem('language','{lang}')")
   try:
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(os.environ.get('JD_BASE','http://127.0.0.1:3107')+'/games/faithful-archer',wait_until='domcontentloaded')
    page.get_by_role('button',name='Начать тренировку' if lang=='ru' else 'Start Training',exact=True).first.click();canvas=page.locator('canvas');page.wait_for_function('!!document.querySelector("canvas")?.dataset.state && JSON.parse(document.querySelector("canvas").dataset.renderer || "{}").ready',timeout=60000);page.clock.install();page.clock.pause_at(page.evaluate('new Date(Date.now()+1000).toISOString()'))
    def state():return json.loads(canvas.get_attribute('data-state'))
    def ground():
     box=canvas.bounding_box();assert box
     x=box['x']+box['width']*.7;y=box['y']+box['height']*.4
     page.mouse.move(x,y);page.mouse.down();page.mouse.move(x-35,y-80);page.mouse.up();page.clock.run_for(700)
    ground();s=state();assert s['review']['outcome']=='ground';review=s['review'];mark(lang+' actual ground impact review available')
    page.get_by_role('button',name='Пауза' if lang=='ru' else 'Pause',exact=True).click();page.clock.run_for(4000);assert state()['review']==review
    page.get_by_role('button',name='Продолжить игру' if lang=='ru' else 'Resume',exact=True).click();page.clock.run_for(100);assert state()['review']==review;mark(lang+' paused/resumed measured path unchanged')
    page.screenshot(path=str(OUT/f'{lang}-ground-review.png'))
    guide=page.get_by_role('checkbox').nth(1);guide.uncheck();page.clock.run_for(32);assert not state()['guide'] and state()['review']==review
    guide.check();page.clock.run_for(32);assert state()['guide'] and state()['review']==review;mark(lang+' guide toggle preserves measured path without mutating results')
    for w,h in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
     page.set_viewport_size({'width':w,'height':h});page.clock.run_for(100)
     assist=page.get_by_role('button',name='Прицел без перетягивания' if lang=='ru' else 'Aim without dragging',exact=True)
     if assist.get_attribute('aria-pressed')!='true':assist.click();page.clock.run_for(50)
     angle=page.get_by_role('slider',name='Угол' if lang=='ru' else 'Angle',exact=True)
     power=page.get_by_role('slider',name='Сила' if lang=='ru' else 'Power',exact=True)
     for control in [angle,power]:
      control.scroll_into_view_if_needed();box=control.bounding_box();assert box and box['height']>=44 and box['y']>=0 and box['y']+box['height']<=h+1
      control.focus();old=int(control.input_value());page.keyboard.press('ArrowRight');assert int(control.input_value())==old+1
     shoot=page.get_by_role('button',name='Выстрел' if lang=='ru' else 'Shoot',exact=True);shoot.scroll_into_view_if_needed();box=shoot.bounding_box();assert box and box['height']>=44 and box['y']>=0 and box['y']+box['height']<=h+1
     before=state()['arrows'];shoot.click();page.clock.run_for(32);assert state()['arrows']==before-1
     page.clock.run_for(1200);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     page.screenshot(path=str(OUT/f'{lang}-{w}x{h}-controls.png'));mark(f'{lang} {w}x{h} scroll-reachable sliders and real non-drag shot')
    assert not errors,errors
   finally:context.close()
 finally:browser.close()
print('PASS',len(passed),'Archer review/control groups')
