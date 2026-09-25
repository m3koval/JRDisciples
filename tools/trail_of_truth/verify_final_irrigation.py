"""Finish final irrigation coverage without rerunning already passed jobs.

Keeps the earlier timeout as failed evidence. Separate isolated, frozen reruns
must return zero and their original completion markers without engine errors.
"""
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import tempfile
from verify_bridge_timber import manifest, ROOT, GAME, ENGINE

OUT = ROOT/'docs/games/block-evidence/hourly-run-6/irrigation-followup'
JOBS = {'irrigation_site_playthrough': 'CONSTRUCTION_HOST_FAILURES=0',
        'garden_art_test': 'GARDEN_ART_FAILURES=0',
        'garden_art_capture': 'ART_FIXTURE_COMPLETE'}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    assert not (OUT/'results.json').exists(), 'Preserve existing attempts'
    before = manifest()
    rows = []
    for name, marker in JOBS.items():
        with tempfile.TemporaryDirectory(prefix='jd-final-'+name+'-') as home:
            env = dict(os.environ, XDG_DATA_HOME=home+'/data', XDG_CONFIG_HOME=home+'/config', XDG_CACHE_HOME=home+'/cache')
            cmd = ['xvfb-run', '-a', ENGINE, '--path', str(GAME), '--rendering-method', 'gl_compatibility', '--fixed-fps', '60', '--script', 'res://tests/'+name+'.gd']
            log = OUT/(name+'.log')
            timed_out = False
            with log.open('w') as stream:
                process = subprocess.Popen(cmd, env=env, stdout=stream, stderr=subprocess.STDOUT, start_new_session=True)
                try:
                    code = process.wait(timeout=360)
                except subprocess.TimeoutExpired:
                    timed_out = True
                    os.killpg(process.pid, signal.SIGTERM)
                    code = process.wait(timeout=15)
            text = log.read_text()
            errors = re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL ).*', text, re.M)
            passed = not timed_out and code == 0 and marker in text and not errors
            rows.append(dict(test=name, passed=passed, exit_code=code, timed_out=timed_out, errors=errors, marker=marker, command=cmd))
            (OUT/'results.json').write_text(json.dumps(rows, indent=2)+'\n')
            print(json.dumps(rows[-1]), flush=True)
            assert passed, 'Final irrigation followup failed: '+name
            for image in re.findall(r'(?:FIXTURE_CAPTURE|CAPTURE) (/tmp/[^\s]+\.png)', text):
                shutil.copy2(image, OUT/Path(image).name)
    assert before == manifest(), 'Source drift invalidates evidence'
    (OUT/'tested-source-sha256.json').write_text(json.dumps(before, indent=2)+'\n')
    print('FINAL_IRRIGATION_FOLLOWUP=PASS', flush=True)

if __name__ == '__main__':
    main()
