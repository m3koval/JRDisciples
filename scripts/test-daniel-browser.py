"""Director real-touch EN/RU four-room acceptance, no state injection."""
from pathlib import Path
import os,json,re
from playwright.sync_api import sync_playwright,expect
OUT=Path(os.environ.get('DANIEL_EVIDENCE','/mnt/hermes-storage/jd-games-overnight/evidence/pass-06/daniel'));OUT.mkdir(parents=True,exist_ok=True)
results=[];errors=[];failed=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 try:
  for lang in ['en','ru']:
   ctx=browser.new_context(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce')
   ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
   page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:failed.append(f'{r.status} {r.url}') if r.status>=400 else None)
   page.goto(os.environ.get('JD_BASE','http://127.0.0.1:3107').rstrip('/')+'/games/escape-room-daniel',wait_until='networkidle')
   page.wait_for_function('(v)=>document.documentElement.dataset.lang===v',arg=lang)
   def t(en,ru):return ru if lang=='ru' else en
   def b(en,ru=None):return page.get_by_role('button',name=t(en,ru or en),exact=True)
   def tap(en,ru=None):
    e=b(en,ru);e.scroll_into_view_if_needed();assert e.evaluate('(e)=>{let r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
    e.tap()
   def record(name):
    results.append(lang+' '+name);(OUT/'browser.json').write_text(json.dumps({'checks':results,'errors':errors,'failedResponses':failed},ensure_ascii=False,indent=2));print('PASS',lang,name,flush=True)
   def wrong():expect(page.get_by_role('status').filter(has_text=t('Not yet.','Пока не получилось.'))).to_be_visible();expect(b('Continue →','Продолжить →')).to_have_count(0)
   tap('Enter the first room →','Войти в первую комнату →')
   tap('🔎 Inspect the royal scroll','🔎 Осмотреть царский свиток');expect(page.locator('#daniel-clue')).to_be_visible()
   tap('God','Богу');tap('Hide clue ↑','Скрыть подсказку ↑');expect(page.locator('#daniel-clue')).to_be_hidden()
   expect(b('Remove God','Убрать Богу')).to_be_visible();tap('Remove God','Убрать Богу')
   tap('Need a hint?','Нужна подсказка?');expect(page.locator('#daniel-clue')).to_be_visible()
   tap('Hide clue ↑','Скрыть подсказку ↑')
   record('clue disclosure and hint reopening retain placed words')
   for word in (['pray','to','God','for','30','days'] if lang=='en' else ['молиться','Богу','30','дней']):tap(word)
   tap('Test the word lock','Проверить замок слов');tap('Continue →','Продолжить →')
   expect(b('Try the window lock','Проверить замок окна')).to_be_disabled()
   if lang=='en':
    tap('Egypt','Египет');expect(page.locator('#daniel-window-guidance')).to_have_text('Now choose how many prayers each day.')
    expect(b('Try the window lock','Проверить замок окна')).to_be_disabled();tap('1')
   else:
    tap('1');expect(page.locator('#daniel-window-guidance')).to_have_text('Теперь выбери город, куда выходили окна.')
    expect(b('Try the window lock','Проверить замок окна')).to_be_disabled();tap('Egypt','Египет')
   tap('Try the window lock','Проверить замок окна');wrong()
   tap('🔎 Inspect the window notebook','🔎 Осмотреть запись у окна');tap('Hide clue ↑','Скрыть подсказку ↑')
   tap('Jerusalem','Иерусалим');tap('3')
   expect(b('Jerusalem','Иерусалим')).to_have_attribute('aria-pressed','true')
   assert '✓' in b('Jerusalem','Иерусалим').inner_text()
   for width in [320,390,768,1024]:
    height=844 if width<700 else 1024 if width==768 else 768
    page.set_viewport_size({'width':width,'height':height})
    city=b('Jerusalem','Иерусалим');city.scroll_into_view_if_needed();rect=city.bounding_box()
    assert rect and rect['height']>=44 and rect['x']>=0 and rect['x']+rect['width']<=width
    m=city.evaluate('(e)=>{let r=document.createRange();r.selectNodeContents(e);return {height:r.getBoundingClientRect().height,font:parseFloat(getComputedStyle(e).fontSize),wrap:getComputedStyle(e).overflowWrap}}')
    assert m['height']<=m['font']*1.6 and m['wrap']=='normal',m
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=str(OUT/f'{lang}-window-{width}.png'))
   record('both-part guidance, wrong retry, selection marks and four viewport word integrity')
   tap('Try the window lock','Проверить замок окна');tap('Continue →','Продолжить →')
   for correct in [False,True,False,True,True]:
    tap('True' if not correct else 'False','Верно' if not correct else 'Неверно');wrong()
    tap('True' if correct else 'False','Верно' if correct else 'Неверно');tap('Continue →','Продолжить →')
   tap('🔎 Inspect Daniel’s scroll','🔎 Осмотреть свиток Даниила')
   tap('soldier','воина');wrong();tap('angel','Ангела');tap('Continue →','Продолжить →')
   tap('window','окно');wrong();tap('lions’ mouths','пасть львам');tap('Open the final door →','Открыть последнюю дверь →')
   expect(page.get_by_role('heading',name=t('The doors are open!','Двери открыты!'))).to_be_visible()
   page.screenshot(path=str(OUT/f'{lang}-victory.png'));record('actual four-room victory and all witness/verse wrong retries')
   tap('Play again','Играть снова');tap('Enter the first room →','Войти в первую комнату →')
   expect(page.get_by_role('region',name=t('Puzzle controls','Управление загадкой'))).to_contain_text(t('0/4 keys','Ключи: 0/4'))
   tap('Pause','Пауза');expect(page.get_by_role('heading',name=t('Adventure paused','Приключение на паузе'))).to_be_focused()
   expect(b('Test the word lock','Проверить замок слов')).to_have_count(0)
   tap('Resume adventure','Продолжить приключение');assert page.evaluate('document.activeElement.tagName')=='H2'
   record('clean replay and pause/resume heading focus')
   ctx.close()
  assert not errors and not failed,{'errors':errors,'failed':failed}
 finally:browser.close()
print(json.dumps({'checks':len(results),'errors':errors,'failed':failed}))
