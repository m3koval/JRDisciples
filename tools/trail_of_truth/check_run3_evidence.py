"""Run-3 frozen-source/native/full exported-browser evidence gate."""
import hashlib
import json
from pathlib import Path
from PIL import Image
from verify_opening_foliage import JOBS
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'docs/games/block-evidence/hourly-run-3'
manifest = json.loads((OUT/'after/tested-source-sha256.json').read_text())
for name, digest in manifest.items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest() == digest, name
rows = json.loads((OUT/'after/results.json').read_text())
assert {row['test'] for row in rows} == set(JOBS)
assert all(row['passed'] and row['exit_code'] == 0 and not row['errors'] for row in rows)
for tag in ['before', 'after']:
    for view in ['bridge', 'grove']:
        for w,h in [(1280,720),(720,1280)]:
            with Image.open(OUT/tag/f'jd-foliage-{tag}-{view}-{w}.png') as image:
                assert image.size == (w,h)
                image.verify()
browser = json.loads((OUT/'browser/checks.json').read_text())
assert browser['checks'] and all(browser['checks'].values())
for gate in ['browser_complete','russian','replay','reload_reward','touch_start','touch_jump','touch_camera','portrait_map','two_thumb_moves_while_looking','landscape_resume','no_runtime_errors']:
    assert browser['checks'].get(gate) is True, gate
assert not browser['errors'], browser['errors']
budget = json.loads((ROOT/'docs/hourly-model-budget.json').read_text())
pending = sum(row['reserved_cents'] for row in budget['pending_commitments'])
unused = budget['cap_cents'] - budget['actual_spent_cents'] - pending
assert unused >= 0
print(json.dumps({'run':3,'runs_remaining':3,'frozen_files':len(manifest),'native_jobs':len(rows),'browser_checks':len(browser['checks']),'spent_cents':budget['actual_spent_cents'],'pending_cents':pending,'unused_cents':unused},indent=2))
