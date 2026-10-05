"""Manna board/control composition and modal focus; trusted input, read-only pixels.
Run through qa_serial.py against normal production on loopback3107.
Clock fixtures make resize captures deterministic, not device performance evidence.
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
OUT=Path(os.environ.get('MANNA_LAYOUT_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-12/manna-layout'))
OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];failures=[];measurements=[]
def mark(name):
 checks.append(name);(OUT/'results.json').write_text(json.dumps(dict(checks=checks,errors=errors,failures=failures,measurements=measurements),indent=2));print('PASS',name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=None
 try:
  for lang in ['en','ru']:
   context=browser.new_context(viewport={'width':1024,'height':768},has_touch=True,reduced_motion='reduce')
   try:
    context.add_init_script(f"localStorage.setItem('language','{lang}')")
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failures.append(f'{r.status} {r.url}') if r.status>=400 else None)
    page.goto(os.environ.get('MANNA_URL','http://127.0.0.1:3107/games/manna-trail'));page.wait_for_function('(lang)=>document.documentElement.dataset.lang===lang',arg=lang)
    page.clock.install();page.clock.pause_at(page.evaluate('new Date(Date.now()+1000).toISOString()'))
    page.get_by_role('button',name='▶ Start the Trail' if lang=='en' else '▶ Начать путь',exact=True).click();page.clock.run_for(32)
    canvas=page.locator('canvas')
    for width,height in [(667,375),(320,568),(390,844),(768,1024),(1024,768)]:
     page.set_viewport_size({'width':width,'height':height})
     # ResizeObserver runs outside the virtual RAF clock. Wait for backing-store
     # agreement, THEN draw; bounds alone can pass while the canvas is blank.
     page.wait_for_function("()=>{const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);return c.width===Math.floor(r.width*d)&&c.height===Math.floor(r.height*d)}")
     page.wait_for_timeout(80);page.clock.run_for(32)
     board=canvas.evaluate("e=>{const r=e.getBoundingClientRect(),d=Math.min(devicePixelRatio,2),size=Math.min(e.width,e.height)-8*d;const x=(e.width-size)/2,y=(e.height-size)/2;return {x:r.x+x/d,y:r.y+y/d,size:size/d,pixel:[...e.getContext('2d').getImageData(x+size*.2,y+size*.2,1,1).data]}}")
     assert board['pixel'][0]>85 and board['pixel'][3]==255,('blank or non-board pixels',board)
     assert board['size']>=min(width,height)-32,(width,height,'wasted playable area',board)
     controls=page.locator('.mt-controls button');assert controls.count()==4
     positions=[]
     for i in range(4):
      r=controls.nth(i).bounding_box();assert r and r['width']>=44 and r['height']>=44 and r['x']>=0 and r['y']>=0 and r['x']+r['width']<=width+.5 and r['y']+r['height']<=height+.5,(width,height,r)
      assert controls.nth(i).evaluate('(e)=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
      assert r['x']+r['width']<=board['x'] or r['x']>=board['x']+board['size'] or r['y']+r['height']<=board['y'] or r['y']>=board['y']+board['size'],('control covers board',r,board)
      positions.append(r)
     if width>height:
      up,left,down,right=positions
      assert up['y']<left['y']<down['y'] and left['x']<up['x']<right['x'],'recognizable compass D-pad'
     assert page.locator('.mt-fullscreen').evaluate('e=>e.scrollWidth<=e.clientWidth&&e.scrollHeight<=e.clientHeight'),(width,height,'shell overflow')
     measurements.append(dict(language=lang,width=width,height=height,board=board))
     page.screenshot(path=str(OUT/f'{lang}-{width}x{height}.png'));mark(f'{lang} {width}x{height} painted board, useful scale, nonoverlapping hit-tested controls')
    pause=page.get_by_role('button',name='Ⅱ Pause' if lang=='en' else 'Ⅱ Пауза',exact=True)
    pause.click();page.clock.run_for(16)
    dialog=page.get_by_role('dialog');resume=dialog.get_by_role('button',name='Continue' if lang=='en' else 'Продолжить',exact=True)
    expect(resume).to_be_focused();page.keyboard.press('Tab');expect(resume).to_be_focused();page.keyboard.press('Shift+Tab');expect(resume).to_be_focused()
    state=canvas.get_attribute('data-state');page.clock.run_for(2000);assert canvas.get_attribute('data-state')==state
    page.keyboard.press('Escape');page.clock.run_for(16);expect(dialog).to_have_count(0);expect(canvas).to_be_focused();mark(lang+' pause focus trap, frozen gameplay and Escape recovery')
    # Let normal forward movement hit the edge; progress must survive real recovery.
    page.keyboard.press('ArrowRight');page.clock.run_for(5000);expect(dialog).to_be_visible()
    retry=dialog.get_by_role('button',name='Back to the trail' if lang=='en' else 'Вернуться на тропу',exact=True)
    expect(retry).to_be_focused();page.keyboard.press('Shift+Tab');expect(dialog.get_by_role('button').last).to_be_focused();page.keyboard.press('Tab');expect(retry).to_be_focused()
    before=json.loads(canvas.get_attribute('data-state'));retry.click();page.clock.run_for(32);after=json.loads(canvas.get_attribute('data-state'));assert after['phase']=='play' and after['words']==before['words'];expect(canvas).to_be_focused();mark(lang+' real edge collision traps recovery focus and preserves words')
   finally:context.close()
  assert not errors and not failures,(errors,failures)
 except Exception:
  if page and not page.is_closed():page.screenshot(path=str(OUT/'failure.png'))
  raise
 finally:browser.close()
print('PASS',len(checks),'Manna composition/focus groups')
