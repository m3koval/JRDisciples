"""Read-only final snapshot check for a bounded sprint evidence directory."""
import hashlib
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[2]
evidence = root / 'docs/games/block-evidence' / sys.argv[1]
manifest = json.loads((evidence / 'native/tested-source-sha256.json').read_text())
for name, expected in manifest.items():
    actual = hashlib.sha256((root / name).read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit(f'Source drift: {name}')
for filename in ('results.json', 'additional-results.json'):
    rows = json.loads((evidence / 'native' / filename).read_text())
    assert rows and all(row['passed'] for row in rows), filename
browser = json.loads((evidence / 'browser/checks.json').read_text())
assert browser['checks'] and all(browser['checks'].values())
assert not browser['errors'], browser['errors']
budget = json.loads((root / 'docs/hourly-model-budget.json').read_text())
pending = sum(item['reserved_cents'] for item in budget['pending_commitments'])
assert budget['actual_spent_cents'] + pending <= budget['cap_cents']
print(json.dumps({'source_files_unchanged': len(manifest),
                  'browser_checks_passed': len(browser['checks']),
                  'browser_scope': 'start/map/discovery/touch pickup; not complete browser campaign',
                  'spent_cents': budget['actual_spent_cents'],
                  'pending_cents': pending,
                  'remaining_cents': budget['cap_cents'] - budget['actual_spent_cents'] - pending}, indent=2))
