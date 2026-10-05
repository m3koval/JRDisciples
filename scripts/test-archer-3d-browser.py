#!/usr/bin/env python3
"""Fresh ordinary-entrypoint 3D evidence; no game-state injection.

JD_BASE defaults to http://127.0.0.1:3113. JD_EVIDENCE selects the output directory.
JD_VIDEO=1 records one short video per fresh viewport (requires Playwright ffmpeg).
JD_CHROME overrides the Chrome executable; empty uses Playwright's Chromium.
Run against the parent's already-running server. The existing campaign/physics
suites remain separate and unchanged. Context-loss testing dispatches a synthetic
cancelable event: it tests the error/retry UX, NOT actual GPU/driver recovery.
"""
import base64
import json
import math
import os
from pathlib import Path
import subprocess
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

BASE = os.environ.get('JD_BASE', 'http://127.0.0.1:3113').rstrip('/')
OUT = Path(os.environ.get('JD_EVIDENCE', 'evidence/archer-3d')).resolve()
VIDEO = os.environ.get('JD_VIDEO') == '1'
SNAPSHOTS = OUT / 'archer-3d-snapshots.json'
checks, samples, errors, external, failures = [], [], [], [], []


def save():
    OUT.mkdir(parents=True, exist_ok=True)
    SNAPSHOTS.write_text(json.dumps({'schema': 1, 'base': BASE, 'samples': samples}, indent=2))
    (OUT / 'archer-3d-browser.json').write_text(json.dumps({
        'checks': checks, 'errors': errors, 'external_requests': external,
        'request_failures': failures, 'video_requested': VIDEO,
        'context_loss': 'synthetic cancelable event; not real GPU loss',
    }, indent=2))


def check(name, condition, detail=None):
    checks.append({'name': name, 'passed': bool(condition), 'detail': detail})
    save()
    assert condition, (name, detail)
    print('PASS', name, flush=True)


def origin(url):
    parsed = urlsplit(url)
    return parsed.scheme, parsed.hostname, parsed.port or (443 if parsed.scheme in ('https', 'wss') else 80)


def run_case(browser, mode, viewport):
    options = {'viewport': viewport, 'has_touch': True, 'device_scale_factor': 1,
               'reduced_motion': 'no-preference', 'service_workers': 'block'}
    if VIDEO:
        options.update(record_video_dir=str(OUT / 'videos'), record_video_size=viewport)
    context = browser.new_context(**options)
    video = None
    try:
        # A normal language preference, never a gameplay/debug flag.
        context.add_init_script("localStorage.setItem('language', 'en')")

        def guard(route):
            url = route.request.url
            if urlsplit(url).scheme in ('http', 'https') and origin(url) != origin(BASE):
                external.append({'mode': mode, 'url': url})
                route.abort()
            else:
                route.continue_()

        context.route('**/*', guard)
        page = context.new_page()
        page.set_default_timeout(15000)
        video = page.video
        page.on('pageerror', lambda error: errors.append({'mode': mode, 'error': str(error)}))
        page.on('response', lambda response: failures.append({'mode': mode, 'status': response.status, 'url': response.url}) if response.status >= 400 else None)
        page.on('requestfailed', lambda request: failures.append({'mode': mode, 'url': request.url, 'failure': request.failure}))
        page.on('websocket', lambda socket: external.append({'mode': mode, 'websocket': socket.url}) if origin(socket.url)[1:] != origin(BASE)[1:] else None)
        response = page.goto(BASE + '/games/faithful-archer', wait_until='domcontentloaded')
        check(mode + ' ordinary entrypoint', response is not None and response.ok and not urlsplit(page.url).query)
        page.get_by_role('button', name='Start Training', exact=True).first.click()
        canvas = page.locator('canvas')
        cdp = context.new_cdp_session(page)

        def ready():
            page.wait_for_function("""() => {
              const c = document.querySelector('canvas');
              if (!c?.dataset.state || !c.dataset.renderer) return false;
              const s = JSON.parse(c.dataset.state), r = JSON.parse(c.dataset.renderer);
              return s.running && s.targets.length && r.ready && r.frames > 1;
            }""")

        def state():
            return canvas.evaluate('(c) => JSON.parse(c.dataset.state)')

        def capture(label):
            # CDP captures the composed WebGL frame without waiting for fonts.
            shot = cdp.send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': False})
            (OUT / (label + '.png')).write_bytes(base64.b64decode(shot['data']))

        def observe(step):
            label = mode + '-' + step
            sample = canvas.evaluate("""(c) => {
              const renderer = JSON.parse(c.dataset.renderer);
              const gl = c.getContext('webgl2') || c.getContext('webgl');
              return {state: JSON.parse(c.dataset.state), renderer,
                webgl: !!gl && !gl.isContextLost(), canvasCount: document.querySelectorAll('canvas').length};
            }""")
            sample['label'] = label
            samples.append(sample)
            s, r = sample['state'], sample['renderer']
            check(label + ' WebGL geometry', sample['canvasCount'] == 1 and sample['webgl']
                  and r['kind'] == 'three-webgl' and r['ready'] is True
                  and r['drawCalls'] > 0 and r['triangles'] >= 100 and r['frames'] > 0, r)
            projected = {t['id']: t for t in r['targets']}
            check(label + ' complete projection telemetry', len(projected) == len(r['targets']) == len(s['targets'])
                  and set(projected) == {t['id'] for t in s['targets']})
            distances = [math.hypot(projected[t['id']]['x'] - t['x'], projected[t['id']]['y'] - t['y']) for t in s['targets']]
            check(label + ' centers <=1 CSS pixel', bool(distances) and all(math.isfinite(d) and d <= 1 for d in distances)
                  and math.isfinite(r['alignmentError']) and 0 <= r['alignmentError'] <= 1, distances)
            box = canvas.bounding_box()
            size = page.viewport_size
            check(label + ' visible range', box and box['width'] > 100 and box['height'] > 100
                  and box['x'] >= 0 and box['y'] >= 0
                  and box['x'] + box['width'] <= size['width'] + 1
                  and box['y'] + box['height'] <= size['height'] + 1, box)
            capture(label)
            return s

        ready()
        page.wait_for_timeout(150)
        initial = observe('gameplay')
        check(mode + ' fresh game', initial['level'] == 0 and initial['score'] == 0
              and initial['arrows'] == 18 and not any(t['hit'] for t in initial['targets']))
        # Hold only the evidence beats steady: actual inputs and physics remain real.
        page.clock.install()
        page.clock.pause_at(page.evaluate('new Date(Date.now()+5000).toISOString()'))
        box = canvas.bounding_box()
        sx, sy = box['x'] + box['width'] * .72, box['y'] + box['height'] * .40
        before = state()['arrows']
        page.mouse.move(sx, sy)
        page.mouse.down()
        page.mouse.move(sx - 80, sy + 60)
        page.clock.run_for(32)
        aimed = observe('aim')
        check(mode + ' one bow draw', aimed['aiming'] and aimed['arrows'] == before)
        page.mouse.up()
        page.clock.run_for(100)
        flight = observe('flight')
        check(mode + ' real flight spends exactly one', flight['arrows'] == before - 1
              and not flight['aiming'] and flight['review'] is not None
              and flight['review']['outcome'] == 'flying' and len(flight['review']['points']) > 1)
        page.clock.resume()
        page.wait_for_timeout(900)
        # Trusted touch cancellation must not release another arrow.
        before = state()['arrows']
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'id': 1, 'x': sx, 'y': sy}]})
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'id': 1, 'x': sx - 60, 'y': sy + 40}]})
        page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.state).aiming')
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchCancel', 'touchPoints': []})
        page.wait_for_function('!JSON.parse(document.querySelector("canvas").dataset.state).aiming')
        cancelled = observe('cancel')
        check(mode + ' touch cancel keeps ammunition', cancelled['arrows'] == before)
        # Rotate during a held draw; resize must cancel, not release or reset score.
        page.mouse.move(sx, sy)
        page.mouse.down()
        page.mouse.move(sx - 60, sy + 40)
        page.wait_for_function('JSON.parse(document.querySelector("canvas").dataset.state).aiming')
        prior = state()
        page.set_viewport_size({'width': viewport['height'], 'height': viewport['width']})
        page.wait_for_function('!JSON.parse(document.querySelector("canvas").dataset.state).aiming')
        page.mouse.up()
        page.wait_for_timeout(100)
        rotated = observe('orientation')
        check(mode + ' rotation preserves progress and cancels draw', rotated['arrows'] == prior['arrows']
              and rotated['score'] == prior['score'] and rotated['level'] == prior['level']
              and [t['hit'] for t in rotated['targets']] == [t['hit'] for t in prior['targets']]
              and rotated['review'] is None)
        # Deliberate failure, then the user-facing retry; no reload or fake readiness.
        canvas.evaluate("c => c.dispatchEvent(new Event('webglcontextlost', {cancelable: true}))")
        expect(page.get_by_text('The 3D range could not load.', exact=True)).to_be_visible()
        capture(mode + '-context-loss')
        page.get_by_role('button', name='Retry 3D range', exact=True).click()
        ready()
        expect(page.get_by_text('The 3D range could not load.', exact=True)).to_be_hidden()
        restored = observe('retry')
        frames = canvas.evaluate('c => JSON.parse(c.dataset.renderer).frames')
        page.wait_for_function('(n) => JSON.parse(document.querySelector("canvas").dataset.renderer).frames > n', arg=frames)
        check(mode + ' retry really resumes frames', restored['running'])
        check(mode + ' no runtime failures or external requests', not errors and not external and not failures,
              {'errors': errors, 'external': external, 'failures': failures})
    finally:
        context.close()
        if video:
            video.save_as(str(OUT / (mode + '-gameplay.webm')))
        save()


def main():
    save()  # Clear previous run's evidence index; absent cases cannot silently pass.
    with sync_playwright() as pw:
        launch = {'headless': True, 'args': ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader']}
        executable = os.environ.get('JD_CHROME', '/usr/bin/google-chrome')
        if executable:
            launch['executable_path'] = executable
        browser = pw.chromium.launch(**launch)
        try:
            for mode, viewport in [('landscape', {'width': 1024, 'height': 768}),
                                   ('portrait', {'width': 390, 'height': 844})]:
                run_case(browser, mode, viewport)
        finally:
            browser.close()
            save()
    subprocess.run(['node', str(Path(__file__).with_name('test-archer-3d-alignment.mjs')), str(SNAPSHOTS)], check=True)
    print(f'PASS {len(checks)} 3D browser checks; evidence: {OUT}', flush=True)


if __name__ == '__main__':
    main()
