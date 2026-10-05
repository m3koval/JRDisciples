import json
from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-04/giants')
out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'],headless=True)
 try:
  page=b.new_page(viewport={'width':834,'height':1194},is_mobile=True,has_touch=True)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:3107/games/faith-over-giants',wait_until='domcontentloaded',timeout=60000)
  page.wait_for_function('document.documentElement.dataset.lang === "en"')
  page.get_by_role('button',name='Start the Journey').click()
  page.get_by_role('button',name='Proud and loud',exact=True).click()
  assert page.get_by_text('Good try. Look at the verse and try again.').is_visible()
  page.get_by_role('button',name='Strong and courageous',exact=True).click()
  page.get_by_role('button',name='Enter the course').click()
  advance=page.get_by_role('button',name='Advance −1',exact=True)
  advance.scroll_into_view_if_needed()
  assert advance.evaluate('(e)=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e}')
  advance.click()
  page.get_by_role('button',name='Rally +1',exact=True).click()
  advance.click()
  assert page.get_by_role('button',name='Next Level',exact=True).is_visible()
  page.screenshot(path=str(out/'checkpoint-ipad.png'),full_page=True)
  page.get_by_role('button',name='Next Level',exact=True).click()
  page.get_by_role('button',name='Because the LORD was with them',exact=True).click()
  page.get_by_role('button',name='Enter the course').click()
  page.screenshot(path=str(out/'course-ipad.png'),full_page=True)
  (out/'browser.json').write_text(json.dumps({'passed':['wrong answer retry','required learning gate','advance hit test','rally','level completion','next course'],'pageErrors':errors},indent=2))
  print((out/'browser.json').read_text())
 finally:
  b.close()
