"""Bounded run-3 runner; preserves original tests, hashes frozen source, isolates each job."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from verify_bridge_timber import manifest, ROOT, GAME, ENGINE

OUT = ROOT/'docs/games/block-evidence'/os.environ.get('FOLIAGE_EVIDENCE', 'hourly-run-3')
JOBS = {'opening_foliage_test':'OPENING_FOLIAGE_FAILURES=0', 'opening_foliage_capture':'OPENING_FOLIAGE_CAPTURE_COMPLETE', 'opening_art_playthrough':'localized true', 'scenery_clearance':'failed=false', 'bridge_timber_test':'BRIDGE_TIMBER_FAILURES=0', 'opening_terrain_test':'OPENING_TERRAIN_FAILURES=0', 'garden_art_test':'GARDEN_ART_FAILURES=0'}

def main():
    tag = os.environ.get('JD_ART_TAG', 'after')
    target = OUT/tag
    target.mkdir(parents=True, exist_ok=True)
    initial = manifest()
    rows = []
    for name in sys.argv[1:] or JOBS:
        with tempfile.TemporaryDirectory(prefix='jd-run3-'+name+'-') as home:
            env = dict(os.environ, XDG_DATA_HOME=home+'/data', XDG_CONFIG_HOME=home+'/config', XDG_CACHE_HOME=home+'/cache', JD_ART_TAG=tag)
            cmd = ['xvfb-run','-a',ENGINE,'--path',str(GAME),'--rendering-method','gl_compatibility','--fixed-fps','60','--script','res://tests/'+name+'.gd']
            log = target/(name+'.log')
            with log.open('w') as f:
                result = subprocess.run(cmd, env=env, stdout=f, stderr=subprocess.STDOUT, timeout=240)
            text = log.read_text()
            errors = re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL |.* false at=).*',text,re.M)
            passed = result.returncode == 0 and not errors and JOBS[name] in text
            rows.append(dict(test=name, passed=passed, exit_code=result.returncode, errors=errors, marker=JOBS[name], command=cmd))
            (target/'results.json').write_text(json.dumps(rows,indent=2)+'\n')
            print(json.dumps(rows[-1]),flush=True)
            if not passed: raise SystemExit(text[-4000:])
            for image in re.findall(r'^CAPTURE (/tmp/[^\s]+\.png)',text,re.M):
                shutil.copy2(image,target/Path(image).name)
    assert initial == manifest(), 'Source drift invalidates evidence'
    (target/'tested-source-sha256.json').write_text(json.dumps(initial,indent=2)+'\n')
    print('OPENING_FOLIAGE_GATE=PASS',flush=True)

if __name__ == '__main__': main()
