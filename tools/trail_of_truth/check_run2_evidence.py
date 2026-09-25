"""Read back run-2 evidence and source freeze. Fails on partial browser completion."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'docs/games/block-evidence/hourly-run-2'
manifest = json.loads((OUT/'native/tested-source-sha256.json').read_text())
for name, expected in manifest.items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest() == expected, name
rows = json.loads((OUT/'native/results.json').read_text())
expected_tests = {'bridge_timber_test', 'opening_art_test', 'opening_terrain_test', 'terrain_surfaces', 'opening_art_playthrough', 'scenery_clearance', 'bridge_timber_capture'}
assert {row['test'] for row in rows} == expected_tests
assert all(row['passed'] and row['exit_code'] == 0 and not row['errors'] for row in rows)
for stage in range(3):
    for width, height in [(1280,720), (720,1280)]:
        with Image.open(OUT/f'native/jd-bridge-stage-{stage}-{width}.png') as image:
            assert image.size == (width, height)
            image.verify()
browser = json.loads((OUT/'browser/checks.json').read_text())
assert browser['checks'] and all(browser['checks'].values())
for gate in ['browser_complete', 'russian', 'replay', 'reload_reward', 'touch_start', 'touch_jump', 'touch_camera', 'portrait_map', 'two_thumb_moves_while_looking', 'landscape_resume', 'no_runtime_errors']:
    assert browser['checks'].get(gate) is True, gate
assert not browser['errors'], browser['errors']
budget = json.loads((ROOT/'docs/hourly-model-budget.json').read_text())
pending = sum(item['reserved_cents'] for item in budget['pending_commitments'])
remaining = budget['cap_cents'] - budget['actual_spent_cents'] - pending
assert remaining >= 0
print(json.dumps({'frozen_game_files': len(manifest), 'native_jobs': len(rows), 'browser_checks': len(browser['checks']), 'browser_scope': 'full touch rescue/Russian completion/replay/reload/portrait/multitouch', 'run': 2, 'runs_remaining': 6-2, 'spent_cents': budget['actual_spent_cents'], 'pending_cents': pending, 'unused_cents': remaining}, indent=2))
