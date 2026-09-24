from pathlib import Path
import os, subprocess, tempfile, re, json, hashlib, shutil
ROOT=Path(__file__).resolve().parents[1]
GAME=ROOT/'game/trail-of-truth-block-adventure'
OUT=Path('/tmp/jd-opening-evidence'); OUT.mkdir(exist_ok=True)
ENGINE='/home/helper/tools/godot-4.7.2/godot'
def manifest():
    paths=[GAME/'project.godot']
    for folder in ['scripts','tests','assets/opening_art']:
        paths.extend(p for p in (GAME/folder).rglob('*') if p.is_file() and p.suffix not in ['.uid','.import','.pyc'])
    return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
initial=manifest(); results=[]
jobs=[('terrain_surfaces','bridge_child_scale true'),('opening_art_test','OPENING_ART_FAILURES=0'),('opening_art_playthrough','localized true'),('irrigation_site_playthrough','CONSTRUCTION_HOST_FAILURES=0')]
for name,marker in jobs+[('capture','UNREPAIRED_STAGE=0')]:
    home=Path(tempfile.mkdtemp(prefix='jd-opening-verify-'))
    env=dict(os.environ,XDG_DATA_HOME=str(home/'data'),XDG_CONFIG_HOME=str(home/'config'),XDG_CACHE_HOME=str(home/'cache'),JD_ART_TAG='after')
    script='res://tests/opening_art_capture.gd' if name=='capture' else 'res://tests/'+name+'.gd'
    cmd=['xvfb-run','-a',ENGINE,'--path',str(GAME),'--rendering-method','gl_compatibility','--fixed-fps','60','--script',script]
    log=OUT/(name+'.log')
    with log.open('w') as f: run=subprocess.run(cmd,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=300)
    text=log.read_text()
    errors=re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL ).*',text,re.M)
    passed=run.returncode==0 and not errors and marker in text
    results.append(dict(test=name,passed=passed,exit_code=run.returncode,errors=errors,marker=marker,log=str(log)))
    (OUT/'results.json').write_text(json.dumps(results,indent=2))
    print(results[-1],flush=True)
    if not passed: raise SystemExit(1)
    if name=='irrigation_site_playthrough':
        for p in re.findall(r'^CAPTURE (/tmp/[^\s]+\.png)',text,re.M): shutil.copy2(p,OUT/Path(p).name)
assert manifest()==initial,'Source changed during verification'
(OUT/'tested-source-sha256.json').write_text(json.dumps(initial,indent=2))
for tag in ['before','after']:
    for width in [1280,720]:
        p=Path(f'/tmp/jd-opening-{tag}-{width}.png'); shutil.copy2(p,OUT/p.name)
shutil.copy2('/tmp/jd-opening-before.log',OUT/'before-capture.log')
print('OPENING_NATIVE_VERIFICATION=PASS',flush=True)
