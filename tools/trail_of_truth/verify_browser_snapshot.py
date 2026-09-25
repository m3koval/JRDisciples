"""Bind full exported touch acceptance to frozen source AND the served app copy.

Run after a genuine Web export, release stamp and app:sync. Never stamps builds.
Historical partial/failed attempts belong in separate evidence directories.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

from check_block_release import sources, artifacts, check, ROOT, BUILD

REQUIRED = ('browser_complete', 'russian', 'replay', 'reload_reward',
            'touch_start', 'touch_jump', 'touch_camera', 'portrait_map',
            'two_thumb_moves_while_looking', 'landscape_resume', 'no_runtime_errors')


def snapshot():
    exported = artifacts()
    hosted = ROOT / 'out/games/trail-of-truth-block-adventure/build'
    for name, info in exported.items():
        assert hashlib.sha256((hosted/name).read_bytes()).hexdigest() == info['sha256'], 'Stale app copy: '+name
    return {'sources': sources(), 'artifacts': exported,
            'browser_harness_sha256': hashlib.sha256((ROOT/'tools/trail_of_truth/test_block_browser.py').read_bytes()).hexdigest()}


def validate(result, before, after, exit_code):
    assert exit_code == 0, f'Browser runner exit {exit_code}'
    assert before == after, 'Source/export/harness drift during browser acceptance'
    assert result['checks'] and all(v is True for v in result['checks'].values()), 'Failed browser checks'
    assert all(result['checks'].get(key) is True for key in REQUIRED), 'Incomplete campaign/touch scope'
    assert not result['errors'], result['errors']


def main():
    folder = os.environ.get('BLOCK_EVIDENCE', 'hourly-run-4/browser-frozen')
    out = ROOT/'docs/games/block-evidence'/folder
    out.mkdir(parents=True, exist_ok=True)
    assert not (out/'checks.json').exists(), 'Use a fresh evidence directory, preserve old attempts'
    assert check(), 'Fresh export and app sync required before acceptance'
    before = snapshot()
    (out/'snapshot-before.json').write_text(json.dumps(before, indent=2)+'\n')
    env = dict(os.environ, BLOCK_TOUCH='1', BLOCK_EVIDENCE=folder)
    env.pop('BLOCK_CARRY_ONLY', None)
    cmd = [sys.executable, str(ROOT/'tools/trail_of_truth/test_block_browser.py')]
    status = {'passed': False, 'command': cmd, 'url': env.get('BLOCK_URL'),
              'device_scale_factor': float(env.get('BLOCK_DPR', '1')),
              'scope': 'full exported-browser touch campaign and reload; not physical iPad'}
    try:
        with (out/'runner.log').open('w') as log:
            run = subprocess.run(cmd, env=env, stdout=log, stderr=subprocess.STDOUT, timeout=min(2400, int(env.get('BLOCK_TIMEOUT', '2400'))))
        status['exit_code'] = run.returncode
        after = snapshot()
        (out/'snapshot-after.json').write_text(json.dumps(after, indent=2)+'\n')
        result = json.loads((out/'checks.json').read_text())
        validate(result, before, after, run.returncode)
        status.update(passed=True, checks=len(result['checks']), required=list(REQUIRED))
    except Exception as error:
        status['error'] = str(error)
    (out/'verification.json').write_text(json.dumps(status, indent=2)+'\n')
    print(json.dumps(status, indent=2))
    return 0 if status['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
