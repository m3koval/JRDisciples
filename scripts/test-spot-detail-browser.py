"""Actual-input matched-detail campaign and accessibility checks, no save/progress injection."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,os
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SPOT_DETAIL_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-09/spot-detail'));OUT.mkdir(parents=True,exist_ok=True)
scenes=json.loads((ROOT/'app/games/spot-the-difference/object-edits.json').read_text());results=[];errors=[];failed=[]
def mark(name):
 results.append(name);(OUT/'results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failed},indent=2));print('PASS',name,flush=True)
def target(board,point):
 b=board.bounding_box();x,y,w,h=map(float,board.get_attribute('data-view').split(','));return {'x':b['x']+(point[0]-x)/w*b['width'],'y':b['y']+(point[1]-y)/h*b['height']}
def capture(page,name):page.screenshot(path=str(OUT/(name+'.png')))
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for lang in ['en','ru']:
   ctx=browser.new_context(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
   page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.url,r.status]) if r.status>=400 else None)
   def button(en,ru):return page.get_by_role('button',name=ru if lang=='ru' else en,exact=True)
   try:
    page.goto('http://127.0.0.1:3107/games/spot-the-difference',wait_until='domcontentloaded');main=page.locator('main[data-phase]')
    if os.environ.get('SPOT_GRAYSCALE')=='1':
     # Test-only display transform: no mutation of game state/hit data. This
     # checks the actual shipped images without relying on hue differences.
     page.add_style_tag(content='[data-picture] img { filter: grayscale(1) !important; }')
    for i,s in enumerate(scenes):
     button('Find the differences','Найти отличия').tap();expect(main).to_have_attribute('data-phase','play')
     page.wait_for_function("[...document.querySelectorAll('[data-picture] img')].every(i=>i.complete&&i.naturalWidth===768)")
     button('Look closer','Рассмотреть ближе').tap();expect(main).to_have_attribute('data-detail','true')
     if i==0:
      for w,h in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
       page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(50)
       for name,ru in [('Whole picture','Вся картина'),('Next area','Следующая область'),('Previous area','Предыдущая область')]:
        box=button(name,ru).bounding_box();assert box and box['width']>=43 and box['height']>=43,(w,h,name,box);assert box['x']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h,(w,h,name,box)
       board=page.locator('[data-picture=objects]');b=board.bounding_box();assert b and b['height']>120 and b['y']+b['height']<=h,(w,h,b)
       assert page.locator('[data-picture=before]').get_attribute('data-view')==board.get_attribute('data-view')
       assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
       capture(page,f'{lang}-{w}x{h}-detail');mark(f'{lang} {w}x{h} detail/control bounds and matched views')
      page.set_viewport_size({'width':390,'height':844})
      board=page.locator('[data-picture=objects]');board.focus();page.keyboard.press('Escape');expect(page.get_by_role('dialog')).to_be_visible()
      expect(button('Continue','Продолжить')).to_be_focused();page.keyboard.press('Shift+Tab');expect(page.get_by_role('link',name='Выйти к играм' if lang=='ru' else 'Exit to games',exact=True)).to_be_focused();page.keyboard.press('Tab');expect(button('Continue','Продолжить')).to_be_focused();page.keyboard.press('Escape');expect(board).to_be_focused();expect(main).to_have_attribute('data-found','0');mark(f'{lang} Escape modal focus trap and resume pointer focus')
      # A drag/cancel is not a find. Board center need not be a target for cancel.
      b=board.bounding_box();cdp=ctx.new_cdp_session(page);finger={'x':b['x']+b['width']/2,'y':b['y']+b['height']/2,'id':11}
      cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[finger]});cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});expect(main).to_have_attribute('data-found','0');mark(f'{lang} trusted detail touch cancel spends no discovery')
     for j,d in enumerate(s['differences']):
      ax,ay=d['anchor'];area=max(0,min(2,int((ax-192)/192+.5)) )+3*max(0,min(2,int((ay-256)/256+.5)))
      # Navigate by actual buttons until the anchor lies comfortably inside the view.
      for attempt in range(9):
       board=page.locator('[data-picture=objects]');x,y,w,h=map(float,board.get_attribute('data-view').split(','))
       if x+8<=ax<=x+w-8 and y+8<=ay<=y+h-8:break
       button('Next area','Следующая область').tap()
      else:raise AssertionError(('anchor unreachable',s['id'],d['anchor']))
      if os.environ.get('SPOT_GRAYSCALE')=='1':
       assert board.locator('img').evaluate("e=>getComputedStyle(e).filter")=='grayscale(1)'
       button('Picture A','Картина A').tap();capture(page,f'{lang}-{s["id"]}-{j+1}-grayscale-A')
       button('Picture B','Картина B').tap();capture(page,f'{lang}-{s["id"]}-{j+1}-grayscale-B')
       board=page.locator('[data-picture=objects]')
      if i==0 and j==0:
       button('Picture A','Картина A').tap();board=page.locator('[data-picture=before]');capture(page,f'{lang}-jar-detail-A')
       q=target(board,d['anchor']);page.touchscreen.tap(q['x'],q['y']);expect(main).to_have_attribute('data-found','1')
       button('Picture B','Картина B').tap();capture(page,f'{lang}-jar-detail-found')
      else:
       q=target(board,d['anchor']);page.touchscreen.tap(q['x'],q['y']);expect(main).to_have_attribute('data-found',str(j+1))
     expect(main).to_have_attribute('data-phase','reward');mark(f'{lang} {s["id"]} all3 real detail hits and reward (no skipped story)')
     button('Finish' if i==7 else 'Next story','Завершить' if i==7 else 'Следующая история').tap()
     if i<7:expect(main).to_have_attribute('data-detail','false')
    expect(main).to_have_attribute('data-phase','done');capture(page,f'{lang}-complete');button('Play again','Играть снова').tap();expect(main).to_have_attribute('data-phase','story');expect(main).to_have_attribute('data-found','0');mark(f'{lang} complete eight-story detail campaign and replay')
   except Exception:
    capture(page,f'{lang}-failure');(OUT/f'{lang}-failure.txt').write_text(page.locator('body').inner_text());raise
   finally:ctx.close()
  assert not errors,errors;assert not failed,failed
 finally:
  browser.close();(OUT/'results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failed},indent=2))
print('Accepted',len(results),'Spot detail groups',flush=True)
