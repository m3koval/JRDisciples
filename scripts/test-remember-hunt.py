"""Requires Python Playwright + Chromium. Pass the site base URL as the argument."""
import sys,json
from playwright.sync_api import sync_playwright,expect
base=sys.argv[1].rstrip('/')
objects=[('zipper',.052,.196),('watch',.841,.184),('car',.134,.636),('headphones',.697,.62),('flashlight',.332,.904),('shoe',.765,.86)]
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for lang in ['en','ru']:
  for width,height in [(390,844),(844,390),(1024,768),(1440,900)]:
   ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
   ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
   page=ctx.new_page(); errors=[]
   page.on('pageerror',lambda e: errors.append(str(e)))
   page.goto(base+'/lessons/remember-the-giver')
   expect(page.locator('article')).to_have_attribute('lang',lang)
   picture=page.get_by_test_id('hunt-picture'); status=page.get_by_test_id('hunt-status')
   expect(status).to_contain_text('0 / 6')
   picture.scroll_into_view_if_needed()
   box=picture.bounding_box()
   assert box is not None
   page.touchscreen.tap(box['x']+box['width']*.5,box['y']+box['height']*.4)
   expect(status).to_contain_text('0 / 6')
   for count,(id,x,y) in enumerate(objects,1):
    target=page.get_by_test_id('hunt-'+id)
    target.scroll_into_view_if_needed()
    box=picture.bounding_box()
    assert box is not None
    page.touchscreen.tap(box['x']+box['width']*x,box['y']+box['height']*y)
    expect(target).to_have_attribute('aria-pressed','true')
    target.tap()
    assert page.locator('[aria-pressed=true]').count()==count
   expect(status).to_contain_text('Все шесть найдены!' if lang=='ru' else 'You found all six!')
   if width==390:
    picture.screenshot(path=f'/tmp/hunt-{lang}.png')
   page.get_by_role('button',name='Найти ещё раз' if lang=='ru' else 'Find them again',exact=True).click()
   expect(status).to_contain_text('0 / 6')
   page.get_by_test_id('hunt-watch').focus();page.keyboard.press('Enter')
   expect(status).to_contain_text('1 / 6')
   text=page.locator('article').inner_text()
   assert 'Your place lasts' not in text and 'Твой шаг сохраняется' not in text
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
   page.get_by_test_id('start').click()
   expect(page.get_by_test_id('play')).to_be_visible()
   assert not errors, errors
   results.append({'language':lang,'viewport':[width,height],'tap_six_miss_duplicates_replay_keyboard':'PASS','console_errors':errors})
   ctx.close()
 browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
