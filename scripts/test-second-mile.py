#!/usr/bin/env python3
"""Real browser QA; only storage writes are deliberate malformed/blocked smoke fixtures.
Run: python scripts/test-second-mile.py --base-url http://127.0.0.1:3107
No progress injection, synthetic clicks, or force-clicks. Missing test IDs on shell
language/hint/plan/replay use explicit semantic selectors, recorded in results.
"""
import argparse
import json
import re
import time
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/second-mile-browser-qa'
VIEWS = {'desktop': (1280, 900), 'ipad-landscape': (1180, 820), 'ipad-portrait': (820, 1180), 'phone': (390, 844)}
RESULT = {'checks': [], 'screenshots': [], 'errors': [], 'selector_notes': ['Puzzle actions use existing data-testid. Language switch uses accessible shell label; hint uses lesson-scoped summary; plan uses lesson radio; replay uses localized accessible name because these controls initially have no testids.']}

def record(name, ok, detail=None):
    RESULT['checks'].append({'name': name, 'passed': bool(ok), 'detail': detail})
    print(('PASS ' if ok else 'FAIL ') + name + (': ' + str(detail) if detail is not None and not ok else ''), flush=True)
    (OUT / 'results.json').write_text(json.dumps(RESULT, ensure_ascii=False, indent=2))

def progress(page):
    return page.evaluate("JSON.parse(localStorage.getItem('second-mile-progress'))")

def mastery(page):
    return page.evaluate("JSON.parse(localStorage.getItem('jr-mastery:second-mile'))")

def click(page, testid):
    page.get_by_test_id(testid).click()

def switch(page, lang):
    if page.get_by_test_id('second-mile').get_attribute('lang') != lang:
        toggle = page.get_by_role('button', name=re.compile('Change language|Сменить язык'))
        if toggle.count():
            toggle.click()
        else:
            page.get_by_role('button', name=re.compile('^(EN|РУ)$')).click()
            page.get_by_role('button', name='English' if lang == 'en' else 'Русский', exact=True).click()
    expect(page.get_by_test_id('second-mile')).to_have_attribute('lang', lang)

def inspect_stage(page, label, screenshots=True):
    views = VIEWS if screenshots else {'desktop': VIEWS['desktop']}
    for name, (w, h) in views.items():
        page.set_viewport_size({'width': w, 'height': h})
        page.evaluate('window.scrollTo(0,0)')
        page.wait_for_timeout(80)
        page.wait_for_function("Array.from(document.querySelectorAll('[data-testid=second-mile] img')).every(i => i.complete)")
        metrics = page.evaluate("""() => ({width: innerWidth, scroll:document.documentElement.scrollWidth, images:Array.from(document.querySelectorAll('[data-testid=second-mile] img')).map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,alt:i.alt}))})""")
        record(f'{label}/{name}/no-overflow', metrics['scroll'] <= w, metrics)
        record(f'{label}/{name}/images', bool(metrics['images']) and all(i['loaded'] and i['alt'] for i in metrics['images']), metrics['images'])
        if screenshots:
            path = OUT / 'screenshots' / f'{label}-{name}.png'
            page.screenshot(path=str(path), full_page=True, animations='disabled')
            RESULT['screenshots'].append(str(path.relative_to(ROOT)))
    page.set_viewport_size({'width':1280,'height':900})

def navigate(page, url):
    for attempt in range(3):
        try:
            response = page.goto(url, wait_until='domcontentloaded', timeout=60000)
            assert response and response.status == 200
            expect(page.get_by_test_id('second-mile')).to_be_visible(timeout=20000)
            # Next dev can show SSR controls before event handlers hydrate.
            page.wait_for_load_state('load')
            page.wait_for_timeout(750)
            return
        except Exception:
            if attempt == 2: raise
            page.wait_for_timeout(1500)

def flow(browser, url, lang, blocked=False, capture=True):
    context = browser.new_context(viewport={'width':1280,'height':900}, reduced_motion='reduce')
    if blocked:
        context.add_init_script("for (const k of ['getItem','setItem','removeItem']) Storage.prototype[k] = function(){throw new DOMException('Storage disabled by QA','SecurityError')}")
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    label = ('blocked-' if blocked else '') + lang
    try:
        navigate(page, url)
        switch(page, lang)
        inspect_stage(page, label + '-00-cover', capture)
        click(page, 'start')
        for scene in range(1, 5):
            prefix = f'{label}-{scene:02}'
            expect(page.get_by_test_id('play')).to_be_visible()
            inspect_stage(page, prefix + '-learn', capture)
            click(page, 'play')
            hint = page.get_by_test_id('second-mile').locator('section details summary')
            hint.click()
            expect(hint.locator('..')).to_have_attribute('open', '')
            record(prefix + '/hint-open', True)
            inspect_stage(page, prefix + '-puzzle-hint', capture)
            if scene in (1,4):
                size = 5 if scene == 1 else 3
                expect(page.get_by_test_id('check')).to_be_disabled()
                for tile in reversed(range(size)): click(page, f'tile-{tile}')
                click(page, 'check')
            elif scene == 2:
                click(page, 'thought-0'); click(page, 'basket-1')
            else:
                click(page, 'need-0'); click(page, 'action-0')
            record(prefix + '/wrong-cannot-advance', page.get_by_test_id('next').count() == 0)
            expect(page.get_by_test_id('second-mile').get_by_role('status')).to_contain_text('Not yet' if lang == 'en' else 'Пока не так')
            if not blocked:
                record(prefix + '/wrong-stays-in-puzzle', progress(page)['scene'] == scene and progress(page)['phase'] == 'do', progress(page))
            if scene in (1,4):
                click(page, 'clear'); click(page, 'tile-0')
            elif scene == 2:
                click(page, 'thought-0'); click(page, 'basket-0')
            else:
                click(page, 'need-0'); click(page, 'action-1')
            # Preserve genuinely earned partial puzzle progress across language and reload.
            before = None if blocked else progress(page)
            other = 'ru' if lang == 'en' else 'en'
            switch(page, other)
            completed_id = 'tile-0' if scene in (1,4) else 'thought-0' if scene == 2 else 'need-0'
            expect(page.get_by_test_id(completed_id)).to_be_disabled()
            switch(page, lang)
            record(prefix + '/language-retains-progress', blocked or progress(page) == before)
            if not blocked:
                page.reload(wait_until='domcontentloaded')
                expect(page.get_by_test_id(completed_id)).to_be_disabled()
                expect(page.get_by_test_id('second-mile')).to_have_attribute('lang', lang)
                record(prefix + '/reload-resumes-partial', progress(page) == before)
            if scene in (1,4):
                for tile in range(1,size): click(page, f'tile-{tile}')
                click(page, 'check')
            elif scene == 2:
                for i in range(1,4): click(page, f'thought-{i}'); click(page, f'basket-{i%2}')
            else:
                for i, action in [(1,2),(2,0)]: click(page, f'need-{i}'); click(page, f'action-{action}')
            expect(page.get_by_test_id('next')).to_be_visible()
            status = page.get_by_test_id('second-mile').get_by_role('status').inner_text()
            record(prefix + '/correct-and-learning-feedback', len(status) > 40, status)
            inspect_stage(page, prefix + '-result', capture)
            click(page, 'next')
        lesson = page.get_by_test_id('second-mile')
        expect(lesson.get_by_role('heading', level=1)).to_have_text('A heart free to love' if lang=='en' else 'Сердце, свободное любить')
        if not blocked:
            m = mastery(page)
            record(label + '/mastery-first-attempt-only', m['completed'] and m['totalGraded']==9 and m['firstTryCorrect']==5, m)
            record(label + '/completion-progress', progress(page)['scene']==5)
        radio = lesson.get_by_role('radio').nth(1)
        radio.check()
        expect(radio).to_be_checked()
        expect(lesson.get_by_role('status')).to_contain_text('My step' if lang=='en' else 'Мой шаг')
        inspect_stage(page, label + '-05-completion-plan', capture)
        if not blocked:
            page.reload(wait_until='domcontentloaded')
            expect(lesson.get_by_role('radio').nth(1)).to_be_checked()
            record(label + '/plan-persists', progress(page)['plan']==1)
            record(label + '/completion-idempotent', mastery(page)==m)
        lesson.get_by_role('button', name='Explore again' if lang=='en' else 'Пройти ещё раз', exact=True).click()
        expect(page.get_by_test_id('start')).to_be_visible()
        record(label + '/replay', True)
        if not blocked:
            record(label + '/replay-resets-progress-and-mastery', progress(page)['scene']==0 and progress(page)['graded']==[] and mastery(page) is None)
    finally:
        record(label + '/no-page-errors', not errors, errors)
        context.close()

def smoke(browser, url, value, label):
    context = browser.new_context()
    context.add_init_script('localStorage.setItem("second-mile-progress", ' + json.dumps(value) + ')')
    page = context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    try:
        navigate(page,url)
        expect(page.get_by_test_id('start')).to_be_visible()
        click(page,'start'); click(page,'play'); click(page,'tile-0')
        expect(page.get_by_test_id('tile-0')).to_be_disabled()
        record(label + '/recover-and-interact', True)
        page.screenshot(path=str(OUT/'screenshots'/f'{label}.png'), full_page=True)
    finally:
        record(label + '/no-page-errors',not errors,errors)
        context.close()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url',default='http://127.0.0.1:3107')
    parser.add_argument('--browser',choices=['chromium','webkit'],default='chromium')
    parser.add_argument('--smoke-only',action='store_true')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True); (OUT/'screenshots').mkdir(exist_ok=True)
    RESULT.update({'started':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'url':args.base_url,'browser':args.browser})
    with sync_playwright() as p:
        try:
            browser=getattr(p,args.browser).launch(headless=True)
        except Exception as error:
            RESULT['errors'].append({'job':'browser-launch','error':str(error)})
            RESULT['summary']={'passed':0,'failed':1,'screenshots':0}
            record('browser-launch',False,str(error))
            return 1
        url=args.base_url.rstrip('/')+'/lessons/second-mile'
        jobs=[] if args.smoke_only else [('full-en',lambda:flow(browser,url,'en')),('full-ru',lambda:flow(browser,url,'ru'))]
        jobs += [('malformed-json',lambda:smoke(browser,url,'{broken','malformed-json')),('malformed-shape',lambda:smoke(browser,url,json.dumps({'scene':99,'order':'bad'}),'malformed-shape')),('blocked-storage',lambda:flow(browser,url,'en',blocked=True,capture=False))]
        for name,job in jobs:
            try: job()
            except Exception as e:
                RESULT['errors'].append({'job':name,'error':str(e),'traceback':traceback.format_exc()})
                record(name+'/uncaught',False,str(e))
        browser.close()
    RESULT['summary']={'passed':sum(c['passed'] for c in RESULT['checks']),'failed':sum(not c['passed'] for c in RESULT['checks']),'screenshots':len(RESULT['screenshots'])}
    (OUT/'results.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2))
    print(json.dumps(RESULT['summary']),flush=True)
    return 1 if RESULT['summary']['failed'] else 0

if __name__=='__main__': raise SystemExit(main())
