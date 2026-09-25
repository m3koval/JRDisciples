"""Recheck the recovered foliage milestone and full frozen browser handoff."""
import hashlib
import json
from pathlib import Path
from PIL import Image
from verify_opening_foliage import JOBS
from verify_browser_snapshot import snapshot, validate
from check_block_release import check

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'docs/games/block-evidence/hourly-run-4'
manifest = json.loads((OUT/'after/tested-source-sha256.json').read_text())
for name, digest in manifest.items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest() == digest, name
rows = json.loads((OUT/'after/results.json').read_text())
assert {row['test'] for row in rows} == set(JOBS)
assert all(row['passed'] and row['exit_code'] == 0 and not row['errors'] for row in rows)
for view in ['bridge', 'grove']:
    for w,h in [(1280,720),(720,1280)]:
        with Image.open(OUT/'after'/f'jd-foliage-after-{view}-{w}.png') as image:
            assert image.size == (w,h)
            image.verify()
browser_dir = OUT/'browser-frozen'
status = json.loads((browser_dir/'verification.json').read_text())
assert status['passed'] is True
before = json.loads((browser_dir/'snapshot-before.json').read_text())
after = json.loads((browser_dir/'snapshot-after.json').read_text())
assert snapshot() == after, 'Current disk differs from tested app snapshot'
result = json.loads((browser_dir/'checks.json').read_text())
validate(result, before, after, status['exit_code'])
assert check()
budget = json.loads((ROOT/'docs/hourly-model-budget.json').read_text())
pending = sum(row['reserved_cents'] for row in budget['pending_commitments'])
unused = budget['cap_cents']-budget['actual_spent_cents']-pending
assert unused >= 0
print(json.dumps(dict(run=4, remaining_runs=2, frozen_game_files=len(manifest), native_jobs=len(rows), browser_checks=len(result['checks']), spent_cents=budget['actual_spent_cents'], pending_cents=pending, unused_cents=unused), indent=2))
