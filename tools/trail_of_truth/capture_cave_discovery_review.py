"""Capture frozen-source native cave evidence. No export or device claims."""
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import time
import verify_cave_recovery as qa

OUT = qa.ROOT / 'docs/games/block-evidence/cave-discovery-polish/review'
JOBS = [
    ('cave_recovery_capture', 'CAPTURE ', ['cave-%s-%d.png' % (v,w) for v in ('1-entrance','2-threshold','3-inside') for w in (1280,720)]),
    ('cave_map_capture', 'CAVE_MAP_CAPTURE_PASS', ['map-%s-%d.png' % (lang,w) for lang in ('en','ru') for w in (1280,720)]),
    ('cave_discovery_capture', 'CAVE_DISCOVERY_CAPTURE_PASS', ['state-%d-%d.png' % (i,w) for i in range(3) for w in (1280,720)]),
    ('cave_animal_sculpt_review', 'SCULPT_REVIEW_COMPLETE', ['lion.png','bear.png']),
    ('cave_input_playthrough', 'CAVE_INPUT_FAILURES=0', ['jd-cave-play-%s.png' % s for s in ('animal-0-safe','animal-1-safe','lamb-found','complete')]),
]

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    before = qa.snapshot()
    rows = []
    for script,marker,files in JOBS:
        started = time.time()
        with tempfile.TemporaryDirectory(prefix='jd-cave-render-') as home:
            env=dict(os.environ,XDG_DATA_HOME=home,LP_NUM_THREADS='2',JD_CAVE_EVIDENCE_DIR=str(OUT),JD_ANIMAL_PREVIEW_DIR=str(OUT))
            cmd=['xvfb-run','-a',qa.ENGINE,'--path',str(qa.GAME),'--rendering-method','gl_compatibility','--fixed-fps','60','--script','res://tests/'+script+'.gd']
            try:
                r=subprocess.run(cmd,env=env,capture_output=True,text=True,timeout=240)
                text=r.stdout+r.stderr
                rc=r.returncode
            except subprocess.TimeoutExpired:
                text='CAPTURE TIMEOUT'; rc=124
        (OUT/(script+'.log')).write_text(text)
        if script == 'cave_input_playthrough':
            for name in files:
                source=Path('/tmp')/name
                if source.exists() and source.stat().st_mtime >= started: shutil.copy2(source,OUT/name)
        errors=re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL ).*',text,re.M)
        fresh=all((OUT/f).exists() and (OUT/f).stat().st_mtime >= started for f in files)
        passed=rc==0 and marker in text and not errors and fresh
        row=dict(test=script,passed=passed,exit_code=rc,errors=errors,files=files,command=cmd)
        rows.append(row)
        (OUT/'results.json').write_text(json.dumps(rows,indent=2)+'\n')
        print(json.dumps(row),flush=True)
        if not passed: raise SystemExit(text[-5000:])
    if before != qa.snapshot(): raise SystemExit('SOURCE DRIFT')
    (OUT/'source-sha256.json').write_text(json.dumps(before,indent=2)+'\n')
    print('CAVE_DISCOVERY_RENDER_PASS',sum(len(r['files']) for r in rows),flush=True)

if __name__ == '__main__':
    main()
