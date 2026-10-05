from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-04/shepherd')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 try:
  c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,reduced_motion='no-preference');page=c.new_page();page.goto('http://127.0.0.1:3107/games/shepherd-light-adventure');page.wait_for_selector('[data-hydrated=true]');page.get_by_role('button',name='Start Adventure').click();page.get_by_role('button',name='Open Trail').click()
  sprite=page.locator('.sla-sprite.michael');states=[]
  def pose():return sprite.evaluate('(e)=>({x:getComputedStyle(e).backgroundPositionX,y:getComputedStyle(e).backgroundPositionY,image:getComputedStyle(e).backgroundImage})')
  assert 'michael-trail-sprite.webp' in pose()['image']
  page.keyboard.down('ArrowRight')
  for i in range(4):
   page.wait_for_timeout(130);states.append(pose());page.screenshot(path=str(out/f'motion-{i}.png'))
  page.keyboard.up('ArrowRight');page.wait_for_timeout(150);assert pose()['x']=='0%';assert len(set(s['x'] for s in states))>1;assert all(s['y'].startswith('33.333') for s in states)
  page.keyboard.down('ArrowUp');page.wait_for_timeout(250);page.keyboard.up('ArrowUp');page.wait_for_timeout(100);assert pose()['y'].startswith('66.666')
  page.get_by_role('button',name='Pause',exact=True).click();frozen=pose();page.wait_for_timeout(350);assert pose()==frozen
  page.get_by_role('button',name='Resume',exact=True).last.click();page.emulate_media(reduced_motion='reduce');page.keyboard.down('ArrowLeft');page.wait_for_timeout(250);assert pose()['x']=='0%';page.keyboard.up('ArrowLeft')
  ring=page.locator('.sla-light').bounding_box();world=page.locator('.sla-world').bounding_box();assert abs(ring['width']/world['width']-.32)<.01
  (out/'sprite-browser.json').write_text(json.dumps({'actual_movement_frames':states,'idle_stops':True,'facing_follows_input':True,'pause_freezes':True,'reduced_motion_idle':True,'radius_matches_engine':True},indent=2))
  print('PASS actual sprite frames, facing, idle, pause, reduced motion and reach geometry')
 finally:b.close()
