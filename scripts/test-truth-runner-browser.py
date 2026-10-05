from playwright.sync_api import sync_playwright
from pathlib import Path
import json
OUT=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-01');checks=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for lang in ['en','ru']:
  ctx=b.new_context(viewport={'width':768,'height':1024},has_touch=True)
  ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
  page=ctx.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:3107/games/truth-runner')
  page.get_by_role('button',name=('Light the trail →' if lang=='en' else 'Осветить тропу →'),exact=True).click()
  left=page.get_by_role('button',name='Steer left' if lang=='en' else 'Двигаться влево',exact=True)
  player=page.get_by_test_id('runner');x0=player.bounding_box()['x'];r=left.bounding_box()
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.wait_for_timeout(450);page.mouse.up()
  assert player.bounding_box()['x']<x0-70;checks.append(f'{lang} held left steering')
  page.get_by_role('button',name='Pause' if lang=='en' else 'Пауза',exact=True).click();x=player.bounding_box()['x'];page.wait_for_timeout(200);assert player.bounding_box()['x']==x
  page.get_by_role('button',name='Keep going →' if lang=='en' else 'Продолжить →',exact=True).click()
  page.clock.install()
  for stage in range(4):
   for frame in range(150):
    if page.get_by_role('dialog').count():break
    p=player.bounding_box();lights=page.locator('[class*="_light"]')
    targets=lights.evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})')
    targets=[r for r in targets if r and r['y']<=p['y']+p['height']/2]
    if targets:
     r=max(targets,key=lambda r:r['y']);page.mouse.move(r['x']+r['width']/2,p['y']+p['height']/2);page.mouse.down();page.mouse.move(r['x']+r['width']/2,p['y']+p['height']/2)
    page.clock.run_for(200)
   page.mouse.up()
   text=page.get_by_role('dialog').inner_text();print(lang,stage,text[:100],flush=True)
   expected=('You lit all four trails!' if lang=='en' else 'Все четыре тропы освещены!') if stage==3 else ('Trail lit!' if lang=='en' else 'Тропа освещена!')
   assert expected in text,text
   checks.append(f'{lang} stage {stage+1} actual input win')
   (OUT/'truth-runner').mkdir(exist_ok=True)
   page.screenshot(path=str(OUT/'truth-runner'/f'{lang}-stage-{stage+1}.png'))
   if stage<3:page.get_by_role('button',name='Next trail →' if lang=='en' else 'Следующая тропа →',exact=True).click()
  page.get_by_role('button',name='Run again →' if lang=='en' else 'Пройти снова →',exact=True).click();page.clock.run_for(100)
  assert ('Trail 1/4' if lang=='en' else 'Тропа 1/4') in page.locator('body').inner_text()
  page.screenshot(path=str(OUT/'truth-runner'/f'{lang}-portrait-play.png'))
  page.set_viewport_size({'width':1024,'height':768});page.wait_for_timeout(200)
  page.screenshot(path=str(OUT/'truth-runner'/f'{lang}-landscape-pause.png'))
  assert not errors,errors;ctx.close()
 (OUT/'truth-runner'/'browser.json').write_text(json.dumps({'checks':checks,'errors':[]},indent=2))
 b.close()
print('PASS',checks)
