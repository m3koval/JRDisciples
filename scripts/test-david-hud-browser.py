"""Actual-input resource readability and spending; no game-state injection."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,os
OUT=Path(os.environ.get('DAVID_HUD_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-11/david-hud'));OUT.mkdir(parents=True,exist_ok=True)
results=[];errors=[];failed=[]
def mark(name):
 results.append(name);(OUT/'results.json').write_text(json.dumps({'passed':results,'errors':errors,'httpFailures':failed},indent=2));print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for lang in ['en','ru']:
   ctx=browser.new_context(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
   try:
    page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.url,r.status]) if r.status>=400 else None)
    page.goto('http://127.0.0.1:3107/games/david-sling-challenge',wait_until='domcontentloaded')
    page.locator('.dsv2-hero-start').tap();page.locator('.dsv2-choice').first.tap()
    expect(page.locator('[data-resource=stones] strong')).to_have_text('5');expect(page.locator('[data-resource=wisdom] strong')).to_have_text('2')
    for w,h in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
     page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(150)
     if page.locator('.dsv2-pause-dialog').count():page.get_by_role('button',name='Продолжить' if lang=='ru' else 'Resume',exact=True).click()
     for resource in ['stones','wisdom']:
      e=page.locator(f'[data-resource={resource}]');data=e.evaluate('''e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect(),n=e.querySelector('strong'),t=n.getBoundingClientRect();return {r:{x:r.x,y:r.y,w:r.width,h:r.height},p:{x:p.x,y:p.y,w:p.width,h:p.height},t:{x:t.x,y:t.y,w:t.width,h:t.height},font:parseFloat(getComputedStyle(n).fontSize),scroll:e.scrollWidth,client:e.clientWidth,label:e.getAttribute('aria-label'),number:n.textContent}}''')
      r,t=data['r'],data['t'];assert data['scroll']<=data['client']+1,(lang,w,h,resource,data)
      assert t['x']>=r['x'] and t['x']+t['w']<=r['x']+r['w']+1 and t['y']+t['h']<=h,(lang,w,h,resource,data)
      assert data['font']>=16 and data['label'].endswith(': '+data['number']),data
     meter=page.locator('.dsv2-meter small');assert meter.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=12
     hold=page.locator('.dsv2-game-btn.release');assert hold.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.bottom<=innerHeight&&e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
     page.screenshot(path=str(OUT/f'{lang}-{w}x{h}.png'));mark(f'{lang} {w}x{h} complete resource digits, accessible labels, readable meter and hold hit target')
    # Spend actual earned wisdom, not an injected number. The exact numeric
    # resource must track both purchases and reject an unaffordable third.
    page.locator('.dsv2-power').first.click();expect(page.locator('[data-resource=wisdom] strong')).to_have_text('1')
    page.locator('.dsv2-power').nth(1).click();expect(page.locator('[data-resource=wisdom] strong')).to_have_text('0')
    expect(page.locator('.dsv2-power').nth(2)).to_be_disabled();expect(page.locator('[data-resource=wisdom] strong')).to_have_text('0');expect(page.locator('[data-resource=stones] strong')).to_have_text('5')
    mark(lang+' wisdom resource follows two real purchases and cannot go negative')
   finally:ctx.close()
  assert not errors,errors;assert not failed,failed
 finally:browser.close()
print('PASS',len(results),'Sling HUD groups')
