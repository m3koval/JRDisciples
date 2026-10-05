"""Director-only real-input acceptance. Run through qa_serial.py against a running build.
No injected game state, storage seeds, synthetic DOM events, or engine calls.
GIANTS_BASE_URL / GIANTS_EVIDENCE / CHROME_BIN optionally override defaults.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path(os.environ.get('GIANTS_EVIDENCE', '/mnt/hermes-storage/jd-games-overnight/evidence/pass-05/giants'))
URL = os.environ.get('GIANTS_BASE_URL', 'http://127.0.0.1:3107').rstrip('/') + '/games/faith-over-giants'
ANSWERS = {
    'en': ['Strong and courageous', 'Because the LORD was with them', "God's battle, not ours", 'Because the LORD was with them', 'God goes with His people', 'Strengthen, help, and uphold them', 'We fall into a trap', 'Light and stronghold', 'Strengthen, help, and uphold them', 'God goes with His people'],
    'ru': ['Твердым и мужественным', 'Потому что с ними был Господь', 'Битва Бога, не наша', 'Потому что с ними был Господь', 'Бог идет со Своим народом', 'Укрепить, помочь и поддержать', 'Мы попадаем в ловушку', 'Свет и крепость', 'Укрепить, помочь и поддержать', 'Бог идет со Своим народом'],
}
LABELS = {
    'en': ['Enter the course', 'Advance −1', 'Rally +1', 'Next Level', 'Run It Back', 'Retry this checkpoint'],
    'ru': ['В путь!', 'Шаг вперёд −1', 'Сплотиться +1', 'Следующий уровень', 'Повторить путь', 'Повторить этот уровень'],
}

def state(page):
    return json.loads(page.get_by_test_id('giants-game').get_attribute('data-state'))

def phase(page, value):
    page.wait_for_function("v => JSON.parse(document.querySelector('[data-testid=giants-game]').dataset.state).phase === v", arg=value)

def tap(page, locator):
    locator.scroll_into_view_if_needed()
    hit = locator.evaluate('(e) => {const r=e.getBoundingClientRect(); const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2); return {ok:e.contains(hit),rect:r.toJSON(),hit:hit?.outerHTML}}')
    if not hit['ok']:
        page.screenshot(path=str(OUT/'obstructed-control.png'))
        (OUT/'obstructed-control.json').write_text(json.dumps(hit,indent=2))
    assert hit['ok'], hit
    locator.tap()

def button(page, label):
    return page.get_by_role('button', name=label, exact=True)

def act(page, locator):
    old = page.get_by_test_id('giants-game').get_attribute('data-state')
    tap(page, locator)
    page.wait_for_function("old => document.querySelector('[data-testid=giants-game]').dataset.state !== old", arg=old)
    current = state(page)
    if current['phase'] == 'play' and (current['health'] <= 0 or all(hp <= 0 for hp in current['obstacles'])):
        page.wait_for_function("JSON.parse(document.querySelector('[data-testid=giants-game]').dataset.state).phase !== 'play'")
    return state(page)

def gate(page, lang, index):
    phase(page, 'question')
    before = state(page)
    assert before['levelIndex'] == index
    expect(page.locator('.course-scripture')).to_have_attribute('open', '')
    expect(button(page, LABELS[lang][0])).to_have_count(0)
    choices = page.locator('.answer-grid button')
    wrong = next(choices.nth(i) for i in range(3) if choices.nth(i).inner_text() != ANSWERS[lang][index])
    tap(page, wrong)
    assert not state(page)['answerLocked'] and state(page)['coins'] == before['coins']
    expect(button(page, LABELS[lang][0])).to_have_count(0)
    expect(page.get_by_text('Хорошая попытка. Посмотри на стих и попробуй снова.' if lang == 'ru' else 'Good try. Look at the verse and try again.', exact=True)).to_be_visible()
    act(page, button(page, ANSWERS[lang][index]))
    assert state(page)['coins'] == before['coins'] + 3
    for i in range(3):
        expect(choices.nth(i)).to_be_disabled()
    act(page, button(page, LABELS[lang][0]))
    phase(page, 'play')
    return before

def play_course(page, lang, careful=True):
    labels = LABELS[lang]
    for _ in range(400):
        s = state(page)
        if s['phase'] != 'play':
            return s
        pressure = 18 + s['levelIndex'] * 2
        rally = s['resolve'] == 0 or (careful and s['fear'] + pressure >= 100)
        if s['resolve'] == 0:
            expect(button(page, labels[1])).to_be_disabled()
        after = act(page, button(page, labels[2 if rally else 1]))
        if rally:
            assert after['resolve'] == min(3, s['resolve'] + 1)
            assert after['fear'] == max(0, s['fear'] - 8 - s['helpers'] * 3)
        else:
            assert sum(after['obstacles']) < sum(s['obstacles'])
            assert after['progress'] >= s['progress']
            if careful:
                assert after['health'] == s['health']
    raise AssertionError('course did not terminate')

def run_language(browser, lang, results):
    context = browser.new_context(viewport={'width': 834, 'height': 1194}, is_mobile=True, has_touch=True, reduced_motion='reduce')
    try:
        page = context.new_page()
        errors, failed = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('response', lambda r: failed.append(f'{r.status} {r.url}') if r.status >= 400 else None)
        page.goto(URL, wait_until='networkidle', timeout=60000)
        page.wait_for_function('document.documentElement.dataset.lang === "en"')
        tap(page, button(page, 'Start the Journey'))
        if lang == 'ru':
            tap(page, button(page, 'EN'))
            tap(page, button(page, 'Русский'))
            page.wait_for_function('document.documentElement.dataset.lang === "ru"')
        completed = []
        for index in range(10):
            gate(page, lang, index)
            if index == 0:
                while state(page)['fear'] > 0:
                    act(page, button(page, LABELS[lang][2]))
                expect(button(page, LABELS[lang][2])).to_be_disabled()
                act(page, button(page, LABELS[lang][1]))
                assert state(page)['progress'] == 50, 'first step visibly advances progress'
            if index == 1:
                before = state(page)
                after = act(page, page.get_by_test_id('power-people'))
                assert after['helpers'] == before['helpers'] + 1 and after['coins'] == before['coins'] - 4
            if index == 3:
                before = state(page)
                after = act(page, page.get_by_test_id('power-strength'))
                assert after['strength'] == 3 and after['coins'] == before['coins'] - 5
                after = act(page, button(page, LABELS[lang][1]))
                assert sum(before['obstacles']) - sum(after['obstacles']) == 2
                assert after['strength'] == 2
            if index in (0, 4, 9):
                size = {'width': 390, 'height': 844} if index == 0 else {'width': 1194, 'height': 834} if index == 4 else {'width': 834, 'height': 1194}
                page.set_viewport_size(size)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'horizontal overflow'
                before = state(page)
                page.wait_for_timeout(400)
                assert state(page) == before, 'turn-based game changed while idle'
                bounds = page.get_by_test_id('giants-game').bounding_box()
                assert bounds is not None and abs(bounds['y']) < 1 and abs(bounds['height'] - size['height']) < 2, bounds
                page.screenshot(path=str(OUT / f'{lang}-course-{index+1}.png'), full_page=False)
            s = play_course(page, lang)
            phase(page, 'victory' if index == 9 else 'levelComplete')
            assert s['badges'] == index + 1 and s['progress'] == 100
            completed.append(index + 1)
            if index < 9:
                act(page, button(page, LABELS[lang][3]))
        page.screenshot(path=str(OUT / f'{lang}-victory.png'), full_page=True)
        act(page, button(page, LABELS[lang][4]))
        assert state(page)['levelIndex'] == 0 and state(page)['badges'] == 0 and state(page)['coins'] == 0
        # A second, reckless journey exercises real pressure damage and checkpoint recovery.
        healed = False
        recovered = False
        for index in range(10):
            checkpoint = gate(page, lang, index)
            for _ in range(400):
                s = state(page)
                if s['phase'] != 'play':
                    break
                if not healed and s['health'] < 6 and s['coins'] >= 3:
                    after = act(page, page.get_by_test_id('power-health'))
                    assert after['health'] == min(6, s['health'] + 2) and after['coins'] == s['coins'] - 3
                    healed = True
                else:
                    act(page, button(page, LABELS[lang][2 if s['resolve'] == 0 else 1]))
            s = state(page)
            if s['health'] == 0:
                phase(page, 'defeat')
                page.screenshot(path=str(OUT / f'{lang}-defeat.png'), full_page=True)
                act(page, button(page, LABELS[lang][5]))
                retry = state(page)
                assert retry['phase'] == 'question' and retry['levelIndex'] == index
                assert retry['coins'] == checkpoint['coins'] and retry['helpers'] == checkpoint['helpers']
                assert retry['badges'] == checkpoint['badges'] and retry['health'] == 6
                gate(page, lang, index)
                assert play_course(page, lang)['phase'] in ('levelComplete', 'victory')
                recovered = True
                break
            assert s['phase'] == 'levelComplete', 'reckless strategy must encounter defeat before victory'
            act(page, button(page, LABELS[lang][3]))
        assert healed and recovered
        assert completed == list(range(1, 11))
        assert not errors and not failed, {'errors': errors, 'failed': failed}
        results.append({'language': lang, 'courses': completed, 'wrongRetryEveryCourse': True, 'powerups': ['people', 'strength', 'health'], 'realDefeatCheckpointRecovery': recovered, 'replay': True, 'pageErrors': errors, 'failedResponses': failed})
    finally:
        context.close()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME_BIN', '/usr/bin/google-chrome'), args=['--no-sandbox'], headless=True)
        try:
            languages = os.environ.get('GIANTS_LANGS', 'en,ru').split(',')
            for lang in languages:
                run_language(browser, lang, results)
                (OUT / 'browser.json').write_text(json.dumps({'results': results, 'complete': len(results) == len(languages), 'requestedLanguages': languages}, ensure_ascii=False, indent=2))
        finally:
            browser.close()
    print(json.dumps({'PASS': results}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
