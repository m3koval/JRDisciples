from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
P=Path(__file__).resolve().parents[1]/'docs/living-word/browser-qa'
checks=[]
def check(n,b):checks.append({'name':n,'passed':bool(b)});assert b,n
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 try:
  c=b.new_context(viewport={'width':820,'height':1180},has_touch=True)
  # Readable old storage plus failed writes: state must remain usable in memory.
  c.add_init_script("localStorage.setItem('living-word-progress-v1',JSON.stringify({scene:0,phase:'see',order:[],matched:[],classified:[],plan:null,completed:false}));Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError')}")
  pg=c.new_page();pg.goto('http://127.0.0.1:3111/lessons/living-word',wait_until='networkidle');pg.get_by_test_id('start').tap();expect(pg.get_by_test_id('play')).to_be_visible();pg.get_by_test_id('play').tap();pg.get_by_test_id('choice-1').tap();expect(pg.get_by_test_id('learn')).to_be_visible();pg.get_by_test_id('learn').tap();expect(pg.get_by_test_id('next')).to_be_visible();check('stale-readable-storage-quota-does-not-reset-flow',True)
  check('storage-warning-visible','Saving is unavailable. You can keep learning here; reloading may lose your place.' in pg.get_by_test_id('living-word').inner_text())
  c.close()
  c=b.new_context(viewport={'width':1180,'height':820});pg=c.new_page();pg.goto('http://127.0.0.1:3111/lessons/living-word',wait_until='networkidle');pg.get_by_test_id('start').focus();pg.keyboard.press('Enter');expect(pg.get_by_test_id('play')).to_be_visible();pg.get_by_test_id('play').focus();pg.keyboard.press('Enter');expect(pg.get_by_test_id('choice-1')).to_be_visible()
  buttons=pg.get_by_test_id('living-word').get_by_role('button').evaluate_all('(es)=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({text:e.innerText,h:e.getBoundingClientRect().height,w:e.getBoundingClientRect().width}))');check('active-lesson-buttons-44px-targets',all(x['h']>=44 and x['w']>=44 for x in buttons))
  c.set_offline(True);pg.get_by_test_id('choice-1').focus();pg.keyboard.press('Enter');expect(pg.get_by_test_id('learn')).to_be_visible();pg.get_by_test_id('learn').focus();pg.keyboard.press('Enter');expect(pg.get_by_test_id('next')).to_be_visible();check('keyboard-completes-already-loaded-activity-offline',True);c.close()
 finally:
  P.mkdir(parents=True,exist_ok=True);(P/'extra-results.json').write_text(json.dumps(checks,indent=2));b.close()
print(json.dumps(checks))
