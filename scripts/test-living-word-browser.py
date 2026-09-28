from pathlib import Path
import json,re,os
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('QA_OUTPUT',str(ROOT/'docs/living-word/browser-qa')));OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('BASE_URL','http://127.0.0.1:3111').rstrip('/')
checks=[];errors=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'detail':detail});assert ok,(name,detail)
def inspect(pg,label):
 pg.wait_for_function("Array.from(document.querySelectorAll('[data-testid=living-word] img')).every(i=>i.complete && i.naturalWidth>0)")
 check(label+'/width',pg.evaluate('document.documentElement.scrollWidth <= innerWidth'))
 check(label+'/images',pg.locator('[data-testid=living-word] img').evaluate_all('(es)=>es.every(e=>e.alt.length>0&&e.naturalWidth>0)'))
 pg.screenshot(path=str(OUT/(label+'.png')),full_page=True,animations='disabled')
def switch(pg,lang):
 root=pg.get_by_test_id('living-word')
 if root.get_attribute('lang')!=lang:
  toggle=pg.get_by_role('button',name=re.compile('Change language|Сменить язык'))
  if toggle.count():toggle.click()
  else:
   pg.get_by_role('button',name=re.compile('^(EN|РУ)$')).click();pg.get_by_role('button',name='English' if lang=='en' else 'Русский',exact=True).click()
 expect(root).to_have_attribute('lang',lang)
def click(pg,id):pg.get_by_test_id(id).click()
def flow(b,name,wh,lang,blocked=False):
 c=b.new_context(viewport={'width':wh[0],'height':wh[1]},reduced_motion='reduce')
 if blocked:c.add_init_script("for(const k of ['getItem','setItem','removeItem'])Storage.prototype[k]=function(){throw new DOMException('QA blocked','SecurityError')}")
 pg=c.new_page();pg.on('pageerror',lambda e:errors.append(str(e)));resp=pg.goto(BASE+'/lessons/living-word',wait_until='networkidle');check(name+'/http',resp.status==200);switch(pg,lang);root=pg.get_by_test_id('living-word');inspect(pg,name+'-cover');click(pg,'start')
 for scene in range(1,5):
  expect(pg.get_by_test_id('play')).to_be_visible();click(pg,'play');root.locator('summary').first.click();inspect(pg,f'{name}-{scene}-activity')
  if scene==1:click(pg,'choice-0')
  elif scene==2:
   for i in [2,1,0]:click(pg,f'tile-{i}')
   click(pg,'check')
  elif scene==3:click(pg,'moment-0');click(pg,'action-0')
  else:click(pg,'bucket-0')
  check(f'{name}/{scene}/retry',pg.get_by_test_id('learn').count()==0 and pg.get_by_test_id('next').count()==0)
  if scene==1:click(pg,'choice-1')
  elif scene==2:
   click(pg,'clear');click(pg,'tile-0');switch(pg,'ru' if lang=='en' else 'en');expect(pg.get_by_test_id('tile-0')).to_be_disabled();switch(pg,lang)
   if not blocked:pg.reload(wait_until='networkidle');expect(pg.get_by_test_id('tile-0')).to_be_disabled()
   click(pg,'tile-1');click(pg,'tile-2');click(pg,'check')
  elif scene==3:
   for i,a in [(0,1),(1,2),(2,0)]:click(pg,f'moment-{i}');click(pg,f'action-{a}')
  else:
   for a in [1,0,1]:click(pg,f'bucket-{a}')
  expect(pg.get_by_test_id('learn')).to_be_visible();check(f'{name}/{scene}/solved',True);click(pg,'learn');expect(pg.get_by_test_id('next')).to_be_visible();click(pg,'next')
 expect(pg.get_by_test_id('commit')).to_be_disabled();root.get_by_role('radio').nth(1).check();click(pg,'commit');expect(root.get_by_role('link',name=re.compile('Explore grace next|Дальше — о благодати'))).to_be_visible();inspect(pg,name+'-complete')
 if not blocked:
  state=pg.evaluate("JSON.parse(localStorage.getItem('living-word-progress-v1'))");check(name+'/saved',state['completed'] and state['plan']==1);pg.reload(wait_until='networkidle');check(name+'/resumes-completion',pg.get_by_test_id('commit').count()==0)
 check(name+'/no-errors',not errors,errors);c.close()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 try:
  for name,wh in [('phone',(390,844)),('ipad-portrait',(820,1180)),('ipad-landscape',(1180,820)),('desktop',(1440,1000))]:
   for lang in ['en','ru']:flow(b,name+'-'+lang,wh,lang)
  flow(b,'storage-disabled-en',(390,844),'en',True)
  for raw in ['{bad',json.dumps({'scene':3,'phase':'do','matched':[0,1,2]}),json.dumps({'scene':2,'phase':'learn','order':[2,1,0]})]:
   c=b.new_context();c.add_init_script(f"localStorage.setItem('living-word-progress-v1',{json.dumps(raw)})");pg=c.new_page();pg.goto(BASE+'/lessons/living-word',wait_until='networkidle');check('malformed-resume/'+raw,pg.get_by_test_id('start').count()+pg.get_by_test_id('learn').count()+pg.get_by_test_id('check').count()>0);c.close()
 finally:
  (OUT/'results.json').write_text(json.dumps({'checks':checks,'errors':errors,'passed':sum(x['passed'] for x in checks),'total':len(checks)},ensure_ascii=False,indent=2));b.close()
print(json.dumps({'passed':sum(x['passed'] for x in checks),'total':len(checks),'errors':errors}))
