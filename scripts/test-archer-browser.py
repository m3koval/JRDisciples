"""Actual Archer play: trusted mouse/touch/keyboard, read-only observation, no game-state injection."""
from pathlib import Path
import json, math, os, base64
from playwright.sync_api import sync_playwright
OUT=Path(os.environ.get('JD_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-05/archer'));OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('JD_BASE','http://127.0.0.1:3107')
checks=[];errors=[];requests=[]
def record(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'detail':detail})
 (OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors,'asset_failures':requests},indent=2))
 assert ok,(name,detail)
 print('PASS',name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for lang in ['en','ru']:
   context=browser.new_context(viewport={'width':1024,'height':768},has_touch=True,reduced_motion='reduce' if lang=='ru' else 'no-preference')
   if lang=='ru':
    context.add_init_script("localStorage.setItem('language','ru');const g=Storage.prototype.getItem;Storage.prototype.getItem=function(k){if(k==='faithful-archer-best')throw Error('blocked');return g.call(this,k)};const s=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='faithful-archer-best')throw Error('quota');return s.call(this,k,v)}")
   page=context.new_page();page.set_default_timeout(12000)
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:requests.append({'status':r.status,'url':r.url}) if r.status>=400 and '/_next/' in r.url else None)
   page.goto(BASE+'/games/faithful-archer',wait_until='domcontentloaded')
   page.wait_for_function(f'document.documentElement.dataset.lang === "{lang}"')
   page.get_by_role('button',name='Начать тренировку' if lang=='ru' else 'Start Training',exact=True).first.click()
   canvas=page.locator('canvas');page.wait_for_function('!!document.querySelector("canvas")?.dataset.state')
   page.wait_for_timeout(250)
   cdp=context.new_cdp_session(page)
   def capture(name):
    payload=cdp.send('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})
    (OUT/f'{lang}-{name}.png').write_bytes(base64.b64decode(payload['data']))
   def state():return json.loads(canvas.get_attribute('data-state'))
   def touch(kind,pts):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'id':i,'x':x,'y':y}for i,x,y in pts]})
   def pause():
    page.get_by_role('button',name='Пауза' if lang=='ru' else 'Pause',exact=True).click()
    page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.state).paused')
   def resume():page.get_by_role('button',name='Продолжить игру' if lang=='ru' else 'Resume',exact=True).click()
   s=state();box=canvas.bounding_box()
   record(lang+' fullscreen range visible',box['y']>=0 and box['y']+box['height']<=768 and box['height']>350,box)
   pause();old=state();page.wait_for_timeout(200);record(lang+' pause freezes actual simulation',state()==old)
   capture('pause');resume()
   page.evaluate("window.dispatchEvent(new Event('blur'))")
   page.get_by_role('button',name='Продолжить игру' if lang=='ru' else 'Resume',exact=True).wait_for()
   record(lang+' focus loss pauses',state()['paused']);resume()
   box=canvas.bounding_box();sx=box['x']+box['width']*.72;sy=box['y']+box['height']*.4
   before=state()['arrows'];touch('touchStart',[(1,sx,sy)]);touch('touchMove',[(1,sx-80,sy+60)])
   record(lang+' first touch owns draw',state()['aiming'])
   touch('touchStart',[(1,sx-80,sy+60),(2,sx+20,sy+20)])
   touch('touchCancel',[]);page.wait_for_timeout(50)
   record(lang+' two-thumb cancel spends no arrow',state()['arrows']==before and not state()['aiming'])
   # Actual non-drag input: keyboard steers angle/power and Space releases one arrow.
   canvas.focus();page.keyboard.press('ArrowUp');page.keyboard.press('ArrowRight')
   record(lang+' keyboard exposes accessible aim',page.get_by_role('slider',name='Угол' if lang=='ru' else 'Angle',exact=True).input_value()=='36')
   page.keyboard.press('Space');page.wait_for_timeout(50)
   record(lang+' keyboard fire spends exactly one',state()['arrows']==before-1)
   # Close the optional controls before direct-drag campaign play.
   page.get_by_role('button',name='Прицел без перетягивания' if lang=='ru' else 'Aim without dragging',exact=True).click()
   page.wait_for_timeout(1000)
   page.clock.install()
   # Actual ballistic shots to visible targets. Test reads their rendered coordinates,
   # never writes target hits/score/course. Moving target error is handled by retry.
   completed=set(); shots=0; modal_count=0; review_outcomes=set(); blocked_tested=False
   for attempt in range(120):
    keep=page.get_by_role('button',name='Продолжить' if lang=='ru' else 'Keep Practicing',exact=True)
    if keep.count() and keep.is_visible():
     modal_count+=1;capture(f'wisdom-{modal_count}');keep.click();page.clock.run_for(50)
    victory=page.get_by_role('heading',name='Все четыре курса пройдены!' if lang=='ru' else 'All four courses complete!',exact=True)
    if victory.count() and victory.is_visible():break
    refill=page.get_by_role('button',name='Взять 12 стрел' if lang=='ru' else 'Collect 12 arrows',exact=True)
    if refill.count() and refill.is_visible():
     old=state();refill.click();page.clock.run_for(50)
     record(lang+' refill retains earned hits',state()['score']==old['score'] and [t['hit'] for t in state()['targets']]==[t['hit']for t in old['targets']])
    s=state()
    if s.get('review'):review_outcomes.add(s['review']['outcome'])
    for prior in range(s['level']):completed.add(prior)
    pending=[t for t in s['targets'] if not t['hit']]
    if not pending:page.clock.run_for(100);continue
    t=pending[0];bx=s['bow']['x'];by=s['bow']['y']
    testing_post=s['level']==1 and not blocked_tested
    if testing_post:t={'x':s['width']*.46+15,'y':s['height']*.74}
    flight=.35 if testing_post else .6 if attempt%3!=2 else .8
    vx=(t['x']-bx)/flight;vy=(t['y']-by-360*flight*flight)/flight
    dx=-vx*132/720;dy=-vy*132/720
    assert 13<math.hypot(dx,dy)<190,(s,t,dx,dy)
    box=canvas.bounding_box();sx=box['x']+box['width']*.72;sy=box['y']+box['height']*.4
    if lang=='ru':
     touch('touchStart',[(1,sx,sy)]);touch('touchMove',[(1,sx+dx,sy+dy)]);page.clock.run_for(32)
     if s['level'] not in completed:capture(f'course-{s["level"]+1}-aim')
     touch('touchEnd',[])
    else:
     page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx+dx,sy+dy);page.clock.run_for(32)
     if attempt<2 or s['level'] not in completed:capture(f'course-{s["level"]+1}-aim')
     page.mouse.up()
    shots+=1;page.clock.run_for(1200)
    review=state().get('review')
    if review:
     assert len(review['points'])<=160
     review_outcomes.add(review['outcome'])
    if testing_post:
     record(lang+' actual obstacle flight produces retained blocked trail',review and review['outcome']=='blocked' and len(review['points'])>2,review)
     record(lang+' blocked teaching names the real post',page.locator('.shot-review').get_attribute('data-outcome')=='blocked')
     capture('blocked-review');blocked_tested=True
   record(lang+' actual four-course victory',victory.count()>0 and victory.is_visible(),{'shots':shots,'state':state()})
   record(lang+' Scripture cards encountered',modal_count>=3,modal_count)
   record(lang+' actual target shot review observed', 'target' in review_outcomes,sorted(review_outcomes))
   capture('victory')
   page.get_by_role('button',name='Играть снова' if lang=='ru' else 'Play again',exact=True).click();page.clock.run_for(100)
   record(lang+' replay resets course targets score',state()['level']==0 and state()['score']==0 and not any(t['hit'] for t in state()['targets']))
   record(lang+' replay clears measured shot trail',state()['review'] is None)
   # Exhaust real arrows into the ground and recover without resetting progress.
   s=state();box=canvas.bounding_box();sx=box['x']+box['width']*.72;sy=box['y']+box['height']*.45
   for _ in range(s['arrows']):
    page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx-35,sy-80);page.mouse.up();page.clock.run_for(80)
   page.clock.run_for(4000)
   review=state()['review'];record(lang+' last actual ground shot retained with cause',review and review['outcome']=='ground' and len(review['points'])>2,review)
   before_review=review;page.clock.run_for(8000);record(lang+' measured ground trail persists after arrow cleanup',state()['review']==before_review)
   refill=page.get_by_role('button',name='Взять 12 стрел' if lang=='ru' else 'Collect 12 arrows',exact=True)
   record(lang+' exhaustion offers recovery',refill.is_visible());capture('refill')
   old=state();refill.click();page.clock.run_for(50)
   record(lang+' refill restores arrows not score',state()['arrows']==12 and state()['score']==old['score'])
   for width,height,label in [(768,1024,'ipad-portrait'),(390,844,'phone-portrait'),(844,390,'phone-landscape')]:
    page.set_viewport_size({'width':width,'height':height});page.clock.run_for(100)
    box=canvas.bounding_box();record(lang+' '+label+' range and pause in viewport',box['x']>=0 and box['y']>=0 and box['x']+box['width']<=width+1 and box['y']+box['height']<=height+1,box)
    record(lang+' '+label+' resize clears obsolete flight geometry',state()['review'] is None)
    capture(label)
   record(lang+' no runtime or JS asset errors',not errors and not requests)
   context.close()
 finally:browser.close()
print(json.dumps({'checks':len(checks),'errors':errors,'asset_failures':requests}))
