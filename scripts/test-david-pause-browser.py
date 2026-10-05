"""Serial actual-input Sling interruption coverage. No game-state mutation.
Blur/hidden notifications are explicit browser-lifecycle fixtures; touch is trusted CDP.
Run via qa_serial.py with a production server on 3107.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path(os.environ.get('DAVID_PAUSE_EVIDENCE', '/mnt/hermes-storage/jd-games-overnight/evidence/pass-08/david-pause'))
OUT.mkdir(parents=True, exist_ok=True)
checks, errors, failures = [], [], []

def mark(name):
    checks.append(name)
    print('PASS', name, flush=True)

def state(page):
    return page.locator('.dsv2-play-shell').evaluate("e => ({phase:e.dataset.phase,level:e.dataset.level,paused:e.dataset.paused,pending:e.dataset.pending,holding:e.dataset.holding,stats:e.querySelector('.dsv2-stats').innerText,angle:e.querySelector('.dsv2-meter').dataset.angle})")

def snap(page, name):
    page.screenshot(path=str(OUT / (name + '.png')))

def hit(locator):
    assert locator.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
        try:
            for lang in ['en', 'ru']:
                context = browser.new_context(viewport={'width': 1024, 'height': 768}, has_touch=True, reduced_motion='reduce')
                try:
                    page = context.new_page()
                    page.on('pageerror', lambda e: errors.append(str(e)))
                    page.on('response', lambda r: failures.append(f'{r.status} {r.url}') if r.status >= 400 else None)
                    page.goto('http://127.0.0.1:3107/games/david-sling-challenge', wait_until='networkidle')
                    if lang == 'ru':
                        page.get_by_role('button', name='EN', exact=True).click()
                        page.get_by_role('button', name='Русский', exact=True).click()
                        page.wait_for_function("document.documentElement.dataset.lang==='ru'")
                    page.locator('.dsv2-hero-start').click()
                    page.locator('.dsv2-choice').first.click()
                    hold = page.locator('.dsv2-game-btn.release')
                    pause = page.locator('.dsv2-session-actions .dsv2-pause')
                    resume = page.get_by_role('button', name='Resume' if lang == 'en' else 'Продолжить', exact=True)
                    shell = page.locator('.dsv2-play-shell')
                    hold.focus()
                    page.keyboard.down('Space')
                    page.wait_for_timeout(80)
                    page.keyboard.press('Escape')
                    expect(shell).to_have_attribute('data-paused', 'true')
                    frozen = state(page)
                    page.keyboard.up('Space')
                    page.wait_for_timeout(1150)
                    assert state(page) == frozen
                    expect(resume).to_be_focused()
                    page.keyboard.press('Shift+Tab')
                    expect(page.get_by_role('dialog').get_by_role('button').last).to_be_focused()
                    page.keyboard.press('Tab')
                    expect(resume).to_be_focused()
                    snap(page, lang + '-paused')
                    resume.click()
                    expect(hold).to_be_focused()
                    assert state(page)['holding'] == 'false'
                    mark(lang + ': hold interruption loses no stone, freeze, modal focus trap and resume')
                    # Release a genuinely timed successful shot, then pause before result handoff.
                    hold.focus()
                    page.keyboard.down('Space')
                    page.wait_for_function("()=>{let e=document.querySelector('.dsv2-meter');return Math.abs(+e.dataset.angle-+e.dataset.target)<2}")
                    page.keyboard.up('Space')
                    expect(shell).to_have_attribute('data-pending', 'true')
                    pause.click()
                    frozen = state(page)
                    page.wait_for_timeout(1400)
                    assert state(page) == frozen and frozen['level'] == '1'
                    resume.click()
                    expect(shell).to_have_attribute('data-level', '2', timeout=4000)
                    expect(shell).to_have_attribute('data-phase', 'question')
                    assert page.locator('.dsv2-stat-icons').first.inner_text().count('🪨') == 5
                    mark(lang + ': in-flight result waits behind pause, resumes once, level refills')
                    page.locator('.dsv2-choice').first.click()
                    # OS-style loss of focus while holding is a fixture, not a gameplay shortcut.
                    hold.focus(); page.keyboard.down('Space')
                    page.evaluate("window.dispatchEvent(new Event('blur'))")
                    expect(shell).to_have_attribute('data-paused', 'true')
                    frozen = state(page)
                    page.keyboard.up('Space'); page.wait_for_timeout(1100)
                    assert state(page) == frozen
                    resume.click()
                    mark(lang + ': blur notification cancels held input without release')
                    # Real trusted touch, two pointers on Hold: secondary release cannot fire.
                    cdp = context.new_cdp_session(page)
                    page.evaluate("window.__touchEvents=[];for(const type of ['pointerdown','pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,e=>window.__touchEvents.push({type,id:e.pointerId,button:e.button,primary:e.isPrimary,target:e.target.className}),true)")
                    b = hold.bounding_box(); assert b; x=b['x']+b['width']/2; y=b['y']+b['height']/2
                    a={'x':x-9,'y':y,'id':1}; b={'x':x+9,'y':y,'id':2}
                    before = page.locator('.dsv2-stat-icons').first.inner_text()
                    cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[a]})
                    cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[a,b]})
                    cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[b]})
                    page.wait_for_timeout(100)
                    events = page.evaluate('window.__touchEvents')
                    assert any(e['type']=='pointerup' and not e['primary'] for e in events), events
                    assert not any(e['type']=='pointerup' and e['primary'] for e in events), events
                    assert state(page)['holding']=='true' and state(page)['pending']=='false', {'state':state(page),'events':events}
                    assert page.locator('.dsv2-stat-icons').first.inner_text()==before
                    cdp.send('Input.dispatchTouchEvent', {'type':'touchCancel','touchPoints':[]})
                    page.wait_for_timeout(100)
                    assert state(page)['holding']=='false' and state(page)['pending']=='false'
                    mark(lang + ': exclusive touch owner and cancel preserve stones')
                    for width,height in [(320,568),(390,844),(768,1024),(1024,768),(667,375)]:
                        page.set_viewport_size({'width':width,'height':height})
                        expect(shell).to_have_attribute('data-paused','true')
                        resume.click()
                        for control in [hold,pause,page.locator('.dsv2-exit')]: hit(control)
                        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                        pause.click(); snap(page,f'{lang}-pause-{width}x{height}'); resume.click()
                        mark(f'{lang}: {width}x{height} rotation safely pauses, controls reachable')
                    # Exit from pause invalidates any pending result; resume cannot resurrect it.
                    hold.focus();page.keyboard.down('Space');page.keyboard.up('Space')
                    pause.click()
                    page.get_by_role('dialog').get_by_role('button').last.click()
                    page.wait_for_timeout(1300)
                    expect(shell).to_have_attribute('data-phase','intro')
                    expect(shell).to_have_attribute('data-pending','false')
                    expect(page.get_by_role('dialog')).to_have_count(0)
                    mark(lang + ': paused exit cancels transaction')
                    cdp.detach()
                finally:
                    context.close()
            assert not errors and not failures, (errors,failures)
        finally:
            browser.close()
            (OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors,'failedResponses':failures},ensure_ascii=False,indent=2))
    print('PASS',len(checks),'Sling pause/input/layout groups')

if __name__ == '__main__': main()
