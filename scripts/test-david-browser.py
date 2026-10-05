import json
from pathlib import Path
from playwright.sync_api import sync_playwright
out = Path('/mnt/hermes-storage/jd-games-overnight/evidence/pass-02/david')
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1024, 'height': 768})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:3107/games/david-sling-challenge', wait_until='domcontentloaded', timeout=45000)
    page.locator('.dsv2-hero-start').click()
    page.locator('.dsv2-choice').first.click()
    page.locator('.dsv2-game-btn.release').wait_for()
    # One immediate release is inside the forgiving first-level window.
    hold = page.locator('.dsv2-game-btn.release')
    box = hold.bounding_box()
    assert box is not None
    page.mouse.move(box['x']+38, box['y']+38)
    page.mouse.down()
    page.wait_for_timeout(100)
    page.mouse.move(box['x']-50, box['y']-20)
    page.mouse.up()
    page.wait_for_timeout(1150)
    assert '2/3' in page.locator('.dsv2-stats').inner_text(), page.locator('.dsv2-stats').inner_text()
    assert page.locator('.dsv2-stat-icons').first.inner_text().count('🪨') == 5
    page.locator('.dsv2-choice').first.click()
    page.screenshot(path=str(out/'level-two-landscape.png'), full_page=True)
    # Exit during an active shot: an old completion timer must not reopen play.
    page.locator('.dsv2-game-btn.release').click()
    page.locator('.dsv2-exit').click()
    page.wait_for_timeout(1200)
    assert page.locator('.dsv2-play-shell.fullscreen').count() == 0
    assert not errors, errors
    (out/'browser.json').write_text(json.dumps({'passed': ['pointer capture release outside button', 'level advance', 'five-stone refill', 'exit cancels delayed transition'], 'page_errors': errors}, indent=2))
    browser.close()
print('PASS: browser pointer capture, progression/refill, exit timer cancellation; no page errors')
