"""Local browser regression. Requires Python Playwright and local dev server."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json

out = Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-01/daniel')
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:3107/games/escape-room-daniel', wait_until='networkidle')
    def button(name): return page.get_by_role('button', name=name, exact=True)
    button('Enter the first room →').click()
    button('🔎 Inspect the royal scroll').click()
    button('God').click()
    button('Remove God').click()
    for word in ['pray','to','God','for','30','days']: button(word).click()
    button('Test the word lock').click()
    button('Continue →').click()
    button('Egypt').click(); button('1').click(); button('Try the window lock').click()
    assert page.get_by_role('status').inner_text().startswith('Not yet')
    button('🔎 Inspect the window notebook').click()
    page.screenshot(path=str(out / 'en-mobile-room2-retry.png'), full_page=True)
    button('Jerusalem').click(); button('3').click(); button('Try the window lock').click()
    button('Continue →').click()
    for correct in [False, True, False, True, True]:
        button('True' if not correct else 'False').click()
        assert page.get_by_role('status').inner_text().startswith('Not yet')
        assert button('Continue →').count() == 0
        button('True' if correct else 'False').click()
        button('Continue →').click()
    button('🔎 Inspect Daniel’s scroll').click()
    button('soldier').click()
    assert page.get_by_role('status').inner_text().startswith('Not yet')
    button('angel').click(); button('Continue →').click()
    button('window').click(); button('lions’ mouths').click()
    button('Open the final door →').click()
    assert page.get_by_role('heading', name='The doors are open!').is_visible()
    page.screenshot(path=str(out / 'en-mobile-victory.png'), full_page=True)
    button('Play again').click()
    button('Enter the first room →').click()
    assert '0/4 keys' in page.get_by_role('region', name='Puzzle controls').inner_text()
    button('Pause').click(); assert button('Test the word lock').count() == 0
    button('Resume adventure').click()
    print('PASS EN mobile: full win, all wrong answers retry, replay, pause/resume')
    print('Storage keys:', page.evaluate('Object.keys(localStorage)'))
    print('Language buttons:', page.get_by_role('button').all_text_contents()[:15])
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    print('PASS mobile horizontal overflow check')
    (out / 'browser-errors.json').write_text(json.dumps(errors, ensure_ascii=False, indent=2))
    assert not errors, errors
    print('PASS no browser page errors')
    browser.close()
