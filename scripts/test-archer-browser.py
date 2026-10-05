import json, math
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-02/archer'); OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'],headless=True)
 page=b.new_page(viewport={'width':1024,'height':768},device_scale_factor=1)
 errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto('http://127.0.0.1:3107/games/faithful-archer',wait_until='domcontentloaded')
 page.get_by_role('button',name='Start Training').first.click()
 canvas=page.locator('canvas'); canvas.scroll_into_view_if_needed(); box=canvas.bounding_box()
 assert box is not None
 # Solve a ballistic shot to the fixed shield from the game's seeded layout.
 w,h=box['width'],box['height']; bx=max(56,w*.13)+34; by=h*.69-58
 seed=lambda n: abs(math.sin(n*12.9898+78.233)*43758.5453)%1
 tx=min(w-42,w*.67+seed(4)*34-17); ty=h*.2+seed(19)*30-15
 t=.68; vx=(tx-bx)/t; vy=(ty-by-360*t*t)/t
 dx=-vx*132/720; dy=-vy*132/720
 sx=box['x']+w*.65; sy=box['y']+h*.5
 page.mouse.move(sx,sy); page.mouse.down(); page.mouse.move(sx+dx,sy+dy,steps=10)
 page.screenshot(path=str(OUT/'landscape-aim.png'))
 page.mouse.up(); page.wait_for_timeout(1000)
 score=page.locator('.archer-stats div').first.inner_text()
 assert score!='Score\n0',score
 # Cancel does not spend an arrow.
 before=page.locator('.archer-stats div').nth(2).inner_text()
 page.mouse.move(sx,sy); page.mouse.down()
 canvas.dispatch_event('pointercancel',{'pointerId':1,'isPrimary':True})
 page.mouse.up()
 assert page.locator('.archer-stats div').nth(2).inner_text()==before
 page.screenshot(path=str(OUT/'landscape-hit.png'))
 # Exhaust arrows by shooting into ground, then verify recovery.
 for i in range(17):
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx-35,sy-80);page.mouse.up();page.wait_for_timeout(80)
 page.get_by_role('button',name='Collect 12 arrows').wait_for(timeout=10000)
 page.screenshot(path=str(OUT/'recovery.png'))
 page.get_by_role('button',name='Collect 12 arrows').click()
 assert page.locator('.archer-stats div').nth(2).inner_text()=='Arrows\n12'
 assert page.locator('.archer-stats div').first.inner_text()==score
 page.set_viewport_size({'width':768,'height':1024});canvas.scroll_into_view_if_needed();page.screenshot(path=str(OUT/'portrait.png'))
 assert page.locator('.archer-stats div').first.inner_text()==score
 (OUT/'browser.json').write_text(json.dumps({'score_after_hit':score,'recovery':'PASS','resize_preserves_score':'PASS','page_errors':errors},indent=2))
 assert not errors,errors
 b.close()
 print('PASS real browser: aimed shield hit, cancel, 18-arrow exhaustion, refill, portrait resize; no page errors')
