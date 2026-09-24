"""Native, isolated irrigation regression/evidence runner. Never changes source/tests."""
from pathlib import Path
import os, subprocess, tempfile, re, json, shutil, hashlib
ROOT = Path(__file__).resolve().parents[1]
GAME = ROOT/'game/trail-of-truth-block-adventure'
ENGINE = '/home/helper/tools/godot-4.7.2/godot'
OUT = Path('/tmp/jd-reference-quality-evidence')
OUT.mkdir(exist_ok=True)
def source_manifest():
    return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for sub in ['scripts','tests','assets/garden_art'] for p in (GAME/sub).rglob('*') if p.is_file() and p.suffix not in ('.uid','.import','.pyc')}
initial_manifest = source_manifest()
results=[]
for script in ['irrigation_construction_test','irrigation_construction_playthrough','irrigation_geometry_playthrough','irrigation_site_playthrough','garden_art_test','garden_art_capture']:
    home=Path(tempfile.mkdtemp(prefix='jd-art-'+script+'-'))
    env=dict(os.environ,XDG_DATA_HOME=str(home/'data'),XDG_CONFIG_HOME=str(home/'config'),XDG_CACHE_HOME=str(home/'cache'))
    cmd=['xvfb-run','-a',ENGINE,'--path',str(GAME),'--rendering-method','gl_compatibility','--fixed-fps','60','--script','res://tests/'+script+'.gd']
    log=OUT/(script+'.log')
    with log.open('w') as f:
        result=subprocess.run(cmd,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=240)
    text=log.read_text()
    errors=re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL ).*',text,re.M)
    expected='ART_FIXTURE_COMPLETE' if script=='garden_art_capture' else ('GARDEN_ART_FAILURES=0' if script=='garden_art_test' else ('CONSTRUCTION_FAILURES=0' if script=='irrigation_construction_test' else 'CONSTRUCTION_HOST_FAILURES=0'))
    passed=result.returncode==0 and not errors and expected in text
    row={'test':script,'exit_code':result.returncode,'passed':passed,'marker':expected,'log':str(log),'errors':errors,'command':cmd}
    results.append(row)
    print(json.dumps(row),flush=True)
    if script in ('irrigation_geometry_playthrough','irrigation_site_playthrough','garden_art_capture'):
        folder=OUT/('seeded-study-fixture' if script=='garden_art_capture' else 'normal-route')
        folder.mkdir(exist_ok=True)
        for filename in re.findall(r'(?:FIXTURE_CAPTURE|CAPTURE) (/tmp/[^\s]+\.png)',text):
            shutil.copy2(filename,folder/Path(filename).name)
    (OUT/'results.json').write_text(json.dumps(results,indent=2))
    if not passed: raise SystemExit(1)
manifest = source_manifest()
if manifest != initial_manifest:
    raise SystemExit('SOURCE_CHANGED_DURING_TESTS: rerun against frozen source')
(OUT/'tested-source-sha256.json').write_text(json.dumps(manifest,indent=2))
print('IRRIGATION_ART_NATIVE_SUITE=PASS',flush=True)
