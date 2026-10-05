"""Real-input bilingual eight-story acceptance; retain failure evidence, never inject progress."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json
import os

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SPOT_EVIDENCE', '/mnt/hermes-storage/jd-games-overnight/evidence/pass-04/spot'))
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('JD_BASE','http://127.0.0.1:3107').rstrip('/')+'/games/spot-the-difference'
scenes = json.loads((ROOT / 'app/games/spot-the-difference/object-edits.json').read_text())
results, taps = [], []


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2))


def images_ready(page):
    page.wait_for_function("Array.from(document.querySelectorAll('[data-picture] img')).length===2 && Array.from(document.querySelectorAll('[data-picture] img')).every(i=>i.complete&&i.naturalWidth>0)")


def hit(page, board, anchor, language, scene, difference):
    box = board.bounding_box()
    assert box and box['width'] > 100, box
    x, y = anchor
    target = {'x': box['x'] + x / 768 * box['width'], 'y': box['y'] + y / 1024 * box['height']}
    observation = {'language': language, 'scene': scene, 'difference': difference,
                   'box': box, 'anchor': anchor, 'target': target,
                   'state': page.locator('main[data-phase]').evaluate('(e)=>({...e.dataset})'),
                   'at_target': page.evaluate('(p)=>document.elementFromPoint(p.x,p.y)?.outerHTML.slice(0,400)', target)}
    taps.append(observation)
    write('taps.json', taps)
    print(json.dumps(observation), flush=True)
    page.touchscreen.tap(target['x'], target['y'])


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True,
                                args=['--no-sandbox', '--disable-dev-shm-usage'])
    try:
        for lang in ['en', 'ru']:
            ctx = browser.new_context(viewport={'width': 768, 'height': 1024}, has_touch=True)
            ctx.add_init_script(f"localStorage.setItem('language','{lang}')")
            page = ctx.new_page()
            errors, failed = [], []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('response', lambda r: failed.append({'url': r.url, 'status': r.status}) if r.status >= 400 else None)
            checkpoint = 'navigation'
            try:
                page.goto(URL, wait_until='domcontentloaded', timeout=90000)
                def btn(en, ru):
                    return page.get_by_role('button', name=ru if lang == 'ru' else en, exact=True)
                main = page.locator('main[data-phase]')
                completed = []
                for index, scene in enumerate(scenes):
                    checkpoint = f"{scene['id']}:start"
                    expect(main).to_have_attribute('data-scene', scene['id'])
                    expect(main).to_have_attribute('data-phase', 'story')
                    btn('Find the differences', 'Найти отличия').tap()
                    expect(main).to_have_attribute('data-phase', 'play')
                    images_ready(page)
                    board = page.locator('[data-picture=objects]')
                    if index == 0:
                        hit(page, board, [15, 512], lang, scene['id'], 'miss')
                        expect(main).to_have_attribute('data-found', '0')
                        btn('Hint', 'Подсказка').tap()
                        btn('Show an area', 'Показать область').tap()
                        expect(board.locator('circle[stroke-dasharray]')).to_have_count(1)
                        page.screenshot(path=str(OUT / f'{lang}-portrait-hint.png'))
                        btn('Pause', 'Пауза').tap()
                        expect(page.get_by_role('dialog')).to_be_visible()
                        page.screenshot(path=str(OUT / f'{lang}-portrait-pause.png'))
                        btn('Continue', 'Продолжить').tap()
                        expect(page.get_by_role('dialog')).to_have_count(0)
                    if index == 3:
                        page.screenshot(path=str(OUT / f'{lang}-landscape-play.png'))
                    if index == 7:
                        page.screenshot(path=str(OUT / f'{lang}-phone-last-story.png'))
                    for j, difference in enumerate(scene['differences']):
                        checkpoint = f"{scene['id']}:hit:{j}"
                        hit(page, board, difference['anchor'], lang, scene['id'], j)
                        expect(main).to_have_attribute('data-found', str(j + 1), timeout=5000)
                        if index == 0 and j == 0:
                            page.wait_for_function("JSON.parse(localStorage.getItem('jd-spot-objects-v2')).found.length===1")
                            page.reload(wait_until='domcontentloaded')
                            expect(main).to_have_attribute('data-found', '1')
                            expect(main).to_have_attribute('data-phase', 'play')
                            images_ready(page)
                            board = page.locator('[data-picture=objects]')
                    expect(main).to_have_attribute('data-phase', 'reward')
                    completed.append(scene['id'])
                    if index == 3:
                        page.screenshot(path=str(OUT / f'{lang}-landscape-reward.png'))
                    btn('Finish' if index == 7 else 'Next story', 'Завершить' if index == 7 else 'Следующая история').tap()
                    if index == 2:
                        page.set_viewport_size({'width': 1024, 'height': 768})
                    if index == 6:
                        page.set_viewport_size({'width': 390, 'height': 844})
                checkpoint = 'final-replay'
                expect(main).to_have_attribute('data-phase', 'done')
                page.screenshot(path=str(OUT / f'{lang}-phone-complete.png'))
                assert len(set(completed)) == len(scenes) == 8
                btn('Play again', 'Играть снова').tap()
                expect(main).to_have_attribute('data-scene', 'water-to-wine')
                expect(main).to_have_attribute('data-found', '0')
                btn('Find the differences', 'Найти отличия').tap()
                images_ready(page)
                btn('Picture A', 'Картина A').tap()
                expect(page.locator('[data-picture=before]')).to_be_visible()
                expect(page.locator('[data-picture=objects]')).not_to_be_visible()
                hit(page, page.locator('[data-picture=before]'), scenes[0]['differences'][0]['anchor'], lang, scenes[0]['id'], 'replay-picture-A')
                expect(main).to_have_attribute('data-found', '1')
                btn('Picture B', 'Картина B').tap()
                page.screenshot(path=str(OUT / f'{lang}-phone-play.png'))
                board = page.locator('[data-picture=objects]')
                board.focus()
                page.keyboard.press('ArrowLeft')
                page.keyboard.press('Enter')
                expect(main).to_have_attribute('data-found', '1')
                for event in ['blur', 'orientationchange']:
                    page.evaluate('(event)=>window.dispatchEvent(new Event(event))', event)
                    expect(page.get_by_role('dialog')).to_be_visible()
                    btn('Continue', 'Продолжить').tap()
                    expect(main).to_have_attribute('data-found', '1')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                assert not errors, errors
                assert not failed, failed
                results.append({'language': lang, 'completed_scenes': completed, 'all_24_real_touch_hits': True,
                                'hints': True, 'reload_progress': True, 'pause_focus_orientation': True,
                                'replay_picture_A_hit': True, 'phone_toggle': True, 'keyboard_miss': True,
                                'console_errors': errors, 'asset_failures': failed})
                write('browser.json', results)
            except Exception as e:
                page.screenshot(path=str(OUT / f'{lang}-failure.png'))
                write(f'{lang}-failure.json', {'checkpoint': checkpoint, 'error': str(e), 'url': page.url,
                      'body': page.locator('body').inner_text(), 'errors': errors, 'failed': failed, 'last_tap': taps[-1] if taps else None})
                raise
            finally:
                ctx.close()
        ctx = browser.new_context(viewport={'width': 1024, 'height': 768}, has_touch=True)
        ctx.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('blocked','QuotaExceededError')};Storage.prototype.getItem=function(){throw new DOMException('blocked','SecurityError')}")
        page = ctx.new_page()
        page.goto(URL, wait_until='domcontentloaded', timeout=90000)
        page.get_by_role('button', name='Find the differences', exact=True).tap()
        page.get_by_text('You can keep playing. Progress will not survive closing this page.', exact=True).wait_for()
        images_ready(page)
        hit(page, page.locator('[data-picture=objects]'), scenes[0]['differences'][0]['anchor'], 'en', scenes[0]['id'], 'storage-blocked')
        expect(page.locator('main[data-phase]')).to_have_attribute('data-found', '1')
        page.screenshot(path=str(OUT / 'blocked-storage.png'))
        results.append({'blocked_storage_play': 'PASS'})
        write('browser.json', results)
        assert len(results) == 3
    finally:
        browser.close()
print(json.dumps(results, ensure_ascii=False, indent=2))
