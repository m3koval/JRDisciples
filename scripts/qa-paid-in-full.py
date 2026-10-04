import json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('JD_BASE','http://127.0.0.1:3147')
root=Path(__file__).resolve().parents[1]
subprocess.run(['node','scripts/check-paid-in-full.mjs','--export-browser','/tmp/jd-paid-content.json'],cwd=root,check=True)
data=json.loads(Path('/tmp/jd-paid-content.json').read_text())
out=Path('/tmp/jd-paid-qa');out.mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for lang in ['en','ru']:
  context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,has_touch=True)
  page=context.new_page(); errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.add_init_script("localStorage.setItem('language', '%s')"%lang)
  page.goto(BASE+'/lessons/paid-in-full',wait_until='networkidle')
  # Language persistence contract verified separately against the site's actual key.
  if lang=='ru' and page.locator('h1').inner_text()!='Оплачено полностью':
   page.get_by_role('button',name='RU',exact=True).click()
  t=data['content'][lang];sc=data['scriptureRu' if lang=='ru' else 'scriptureEn']
  page.wait_for_function("document.querySelector('h1').textContent === "+json.dumps(t['title']))
  assert page.locator('progress').get_attribute('value')=='0'
  assert page.locator('[aria-label="'+t['progress']+'"] button:disabled').count()==4
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'horizontal overflow'
  page.screenshot(path=str(out/f'{lang}-mobile-hero.png'),full_page=True)
  def btn(text): return page.get_by_role('button',name=text,exact=True)
  def phase_finish():
   btn(t['continue']+' →').click()
   btn(t['continue']+' →').click()
  for stage in range(5):
   page.locator(f'[data-testid="stage-{stage}"]').wait_for()
   btn('Попробовать задание →' if lang=='ru' else 'Try the activity →').click()
   btn(t['hint']).click();btn(t['hideHint']).click()
   if stage<2:
    cards=t['matchCards'] if stage==0 else t['sortCards'];labels=t['matchLabels'] if stage==0 else t['sortLabels']
    for i,card in enumerate(cards):
     if i==0:
      page.get_by_text(labels[(card['category']+1)%len(labels)],exact=True).click()
      assert btn(t['continue']+' →').count()==0, 'wrong answer advanced'
     page.get_by_text(labels[card['category']],exact=True).click()
     page.get_by_text(card['why'],exact=False).wait_for()
     btn(t['continue']+' →').click()
    btn(t['continue']+' →').click()
   elif stage==2:
    btn(t['check']).click(); assert btn(t['continue']+' →').count()==0
    for target,text in enumerate(t['timeline']):
     up=btn(t['moveUp']+': '+text)
     while True:
      current=page.locator('ol li').filter(has_text=text).inner_text()
      if int(current.split('.')[0])==target+1:break
      up.click()
    btn(t['check']).click();phase_finish()
   elif stage==3:
    tray=page.locator('[aria-label="'+t['wordBank']+'"]')
    assert btn(t['check']).is_disabled()
    for word in sc['memory'].split(' '): tray.get_by_role('button',name=word,exact=True).and_(page.locator('button:enabled')).first.click()
    btn(t['check']).click();phase_finish()
   else:
    for i,q in enumerate(t['quiz']):
     if i==0:
      btn(q['options'][(q['correct']+1)%3]).click(); assert btn(t['continue']+' →').count()==0
     btn(q['options'][q['correct']]).click()
     page.get_by_text(q['explanation'],exact=False).wait_for()
     btn(t['continue']+' →').click()
    btn(t['continue']+' →').click()
   btn((t['finish'] if stage==4 else t['next'])+' →').click()
   assert page.locator('progress').get_attribute('value')==str(stage+1)
   if stage==0:
    page.reload(wait_until='networkidle');assert page.locator('progress').get_attribute('value')=='1'
  page.get_by_test_id('completion').wait_for();btn(t['missions'][0]).click()
  page.get_by_text(t['review'],exact=True).click()
  assert page.get_by_text(t['quiz'][5]['options'][2],exact=False).count()>0
  page.screenshot(path=str(out/f'{lang}-completion.png'),full_page=True)
  page.reload(wait_until='networkidle');page.get_by_test_id('completion').wait_for()
  # All generated lesson illustrations must load, including offscreen story images.
  for name in ['cover','father-judge','travelers','redemption']:
   response=context.request.get(BASE+f'/images/jr/lessons/paid-in-full/{name}.webp');assert response.status==200
  assert not errors,errors
  page.goto(BASE,wait_until='networkidle')
  assert page.locator('main a').first.get_attribute('href')=='/lessons/paid-in-full'
  assert ('Оплачено' if lang=='ru' else 'Paid in Full') in page.locator('main a').first.inner_text()
  page.screenshot(path=str(out/f'{lang}-homepage.png'),full_page=True)
  results.append({'language':lang,'flow':'all five discoveries, retries, hints, explicit timeline check, verse assembly, six quiz answers, completion, reload persistence, notebook, homepage first link','errors':errors})
  context.close()
 # Corrupt progress and storage-denied modes must remain playable.
 for mode,script in [('corrupt',"localStorage.setItem('jr-paid-in-full-v1:en','{bad')"),('quota',"localStorage.setItem('jr-paid-in-full-v1:en','0'); Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')}"),('blocked',"Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}})")]:
  ctx=browser.new_context(viewport={'width':1024,'height':768});ctx.add_init_script(script);page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE+'/lessons/paid-in-full',wait_until='networkidle')
  t=data['content']['en'];page.get_by_role('button',name='Try the activity →',exact=True).click()
  for card in t['matchCards']:
   page.get_by_text(t['matchLabels'][card['category']],exact=True).click();page.get_by_role('button',name=t['continue']+' →',exact=True).click()
  page.get_by_role('button',name=t['continue']+' →',exact=True).click();page.get_by_role('button',name=t['next']+' →',exact=True).click()
  assert page.locator('progress').get_attribute('value')=='1';assert not errors,errors
  page.screenshot(path=str(out/f'{mode}-desktop.png'))
  results.append({'storage':mode,'next_discovery_reachable':True,'errors':errors});ctx.close()
 browser.close()
(out/'results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False))
print(json.dumps(results,indent=2,ensure_ascii=False))
