"""Report actual run-4 coverage without converting a timeout into a pass."""
import hashlib
import json
from pathlib import Path
from verify_browser_snapshot import snapshot, REQUIRED
from verify_opening_foliage import JOBS
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'docs/games/block-evidence/hourly-run-4'
manifest = json.loads((OUT/'after/tested-source-sha256.json').read_text())
assert all(hashlib.sha256((ROOT/name).read_bytes()).hexdigest() == value for name,value in manifest.items())
native = json.loads((OUT/'after/results.json').read_text())
assert {x['test'] for x in native} == set(JOBS)
assert all(x['passed'] and x['exit_code'] == 0 and not x['errors'] for x in native)
browser = json.loads((OUT/'browser-frozen/checks.json').read_text())
status = json.loads((OUT/'browser-frozen/verification.json').read_text())
before = json.loads((OUT/'browser-frozen/snapshot-before.json').read_text())
assert snapshot() == before
budget = json.loads((ROOT/'docs/hourly-model-budget.json').read_text())
pending = sum(x['reserved_cents'] for x in budget['pending_commitments'])
summary = dict(run=4, remaining_runs=2, status='development_milestone_full_browser_gate_open',
    frozen_game_files=len(manifest), native_jobs_passed=len(native),
    browser_recorded_checks=len(browser['checks']), browser_successful_checks=sum(v is True for v in browser['checks'].values()),
    browser_errors=browser['errors'], browser_wrapper=status,
    missing_full_browser_gates=[key for key in REQUIRED if browser['checks'].get(key) is not True],
    current_source_and_export_match_test_start=True,
    low_dpr_probe='intentionally stopped: observed 1fps; not acceptance evidence',
    spent_cents=budget['actual_spent_cents'], pending_cents=pending,
    unused_cents=budget['cap_cents']-budget['actual_spent_cents']-pending)
(OUT/'verification-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
