"""Run-2 bridge presentation gate: original routes plus additive geometry/state.
No state assertions are replaced. Captures are seeded, not physical-route proof.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]
GAME = ROOT / 'game/trail-of-truth-block-adventure'
OUT = ROOT / 'docs/games/block-evidence/hourly-run-2/native'
ENGINE = os.environ.get('GODOT_BIN', '/home/helper/tools/godot-4.7.2/godot')

def manifest():
    return {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(GAME.rglob('*')) if p.is_file() and '.godot' not in p.parts
            and p.suffix in ('.gd', '.gdshader', '.godot', '.tscn', '.cfg', '.glb', '.gltf', '.bin', '.png', '.jpg', '.tres')}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    initial = manifest()
    jobs = [('bridge_timber_test', 'BRIDGE_TIMBER_FAILURES=0'),
            ('opening_art_test', 'OPENING_ART_FAILURES=0'),
            ('opening_terrain_test', 'OPENING_TERRAIN_FAILURES=0'),
            ('terrain_surfaces', 'bridge_child_scale true'),
            ('opening_art_playthrough', 'localized true'),
            ('scenery_clearance', 'failed=false'),
            ('bridge_timber_capture', 'BRIDGE_TIMBER_CAPTURE_COMPLETE')]
    results = []
    for name, marker in jobs:
        with tempfile.TemporaryDirectory(prefix='jd-run2-'+name+'-') as home:
            env = dict(os.environ, XDG_DATA_HOME=home+'/data', XDG_CONFIG_HOME=home+'/config', XDG_CACHE_HOME=home+'/cache')
            cmd = ['xvfb-run', '-a', ENGINE, '--path', str(GAME), '--rendering-method', 'gl_compatibility', '--fixed-fps', '60', '--script', 'res://tests/'+name+'.gd']
            log = OUT / (name+'.log')
            with log.open('w') as stream:
                run = subprocess.run(cmd, env=env, stdout=stream, stderr=subprocess.STDOUT, timeout=240)
            text = log.read_text()
            errors = re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL |.* false at=).*', text, re.M)
            passed = run.returncode == 0 and marker in text and not errors
            row = dict(test=name, passed=passed, exit_code=run.returncode, marker=marker, errors=errors, command=cmd)
            results.append(row)
            (OUT/'results.json').write_text(json.dumps(results, indent=2)+'\n')
            print(json.dumps(row), flush=True)
            if not passed:
                raise SystemExit(text[-4000:])
            for image in re.findall(r'^CAPTURE (/tmp/[^\s]+\.png)', text, re.M):
                shutil.copy2(image, OUT/Path(image).name)
    assert initial == manifest(), 'Source changed during evidence run'
    (OUT/'tested-source-sha256.json').write_text(json.dumps(initial, indent=2)+'\n')
    for width in [1280, 720]:
        # Historical comparison is optional on another checkout. Current-state
        # captures above remain mandatory, with marker/error/exit checks.
        before = Path(f'/tmp/jd-opening-run2-before-{width}.png')
        if before.exists():
            shutil.copy2(before, OUT)
    print('BRIDGE_TIMBER_NATIVE_GATE=PASS', flush=True)

if __name__ == '__main__':
    main()
