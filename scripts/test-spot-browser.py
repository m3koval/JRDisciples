"""Actual-input bilingual eight-story completion and interruption/storage checks."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-02/spot');OUT.mkdir(parents=True,exist_ok=True)
scenes=json.loads((ROOT/'app/games/spot-the-difference/object-edits.json').read_text())
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for lang in ['en','ru']:
  ctx=browser.new_context(viewport={'width':768,'height':1024},has_touch=True)
  ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
  page=ctx.new_page(); errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  page.goto('http://127.0.0.1:3107/games/spot-the-difference',wait_until='networkidle',timeout=90000)
  def btn(en,ru):return page.get_by_role('button',name=ru if lang=='ru' else en,exact=True)
  main=page.locator('main[data-phase]')
  for index,scene in enumerate(scenes):
   assert main.get_attribute('data-scene')==scene['id']
   btn('Find the differences','Найти отличия').click()
   page.locator('[data-picture=objects] img').wait_for()
   page.wait_for_function("Array.from(document.querySelectorAll('[data-picture] img')).every(i=>i.complete&&i.naturalWidth>0)")
   board=page.locator('[data-picture=objects]')
   b=board.bounding_box(); assert b and b['width']>100
   if index==0:
    page.touchscreen.tap(b['x']+b['width']*.02,b['y']+b['height']*.5)
    assert main.get_attribute('data-found')=='0'
    btn('Hint','Подсказка').click();btn('Show an area','Показать область').click()
    page.screenshot(path=str(OUT/f'{lang}-portrait-hint.png'))
    btn('Pause','Пауза').click();assert page.get_by_role('dialog').is_visible();btn('Continue','Продолжить').click()
   for j,d in enumerate(scene['differences']):
    b=board.bounding_box();x,y=d['anchor']
    page.touchscreen.tap(b['x']+x/768*b['width'],b['y']+y/1024*b['height'])
    page.wait_for_function('(n)=>document.querySelector("main[data-found]").dataset.found===String(n)',arg=j+1)
    if index==0 and j==0:
     page.wait_for_function("JSON.parse(localStorage.getItem('jd-spot-objects-v2')).found.length===1")
     page.reload(wait_until='networkidle');page.wait_for_function("document.querySelector('main[data-found]').dataset.found==='1'");assert main.get_attribute('data-phase')=='play';board=page.locator('[data-picture=objects]')
   assert main.get_attribute('data-phase')=='reward'
   if index==3:page.screenshot(path=str(OUT/f'{lang}-reward.png'))
   btn('Finish' if index==7 else 'Next story','Завершить' if index==7 else 'Следующая история').click()
   if index==2:
    page.set_viewport_size({'width':1024,'height':768})
   if index==6:
    page.set_viewport_size({'width':390,'height':844})
  assert main.get_attribute('data-phase')=='done';page.screenshot(path=str(OUT/f'{lang}-phone-complete.png'))
  btn('Play again','Играть снова').click();assert main.get_attribute('data-scene')=='water-to-wine';assert main.get_attribute('data-found')=='0'
  btn('Find the differences','Найти отличия').click()
  btn('Picture A','Картина A').click();assert page.locator('[data-picture=before]').is_visible();assert not page.locator('[data-picture=objects]').is_visible()
  btn('Picture B','Картина B').click()
  page.screenshot(path=str(OUT/f'{lang}-phone-play.png'))
  board=page.locator('[data-picture=objects]');board.focus();page.keyboard.press('ArrowLeft');page.keyboard.press('Enter');assert main.get_attribute('data-found')=='0'
  page.evaluate("window.dispatchEvent(new Event('blur'))");assert page.get_by_role('dialog').is_visible();btn('Continue','Продолжить').click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors;assert not failed,failed
  results.append({'language':lang,'eight_story_touch_completion':True,'replay':True,'pause_focus':True,'phone_toggle':True,'reload_progress':True,'console_errors':errors,'asset_failures':failed})
  ctx.close()
 # Storage failures: real play remains live and honestly warns.
 ctx=browser.new_context(viewport={'width':1024,'height':768})
 ctx.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('blocked','QuotaExceededError')};Storage.prototype.getItem=function(){throw new DOMException('blocked','SecurityError')}")
 page=ctx.new_page();page.goto('http://127.0.0.1:3107/games/spot-the-difference',wait_until='networkidle')
 page.get_by_role('button',name='Find the differences',exact=True).click()
 page.get_by_text('You can keep playing. Progress will not survive closing this page.',exact=True).wait_for()
 board=page.locator('[data-picture=objects]');b=board.bounding_box();x,y=scenes[0]['differences'][0]['anchor'];page.mouse.click(b['x']+x/768*b['width'],b['y']+y/1024*b['height'])
 assert page.locator('main').get_attribute('data-found')=='1'
 results.append({'blocked_storage_play':'PASS'})
 browser.close()
(OUT/'browser.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
