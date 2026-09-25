"""Frozen cave recovery native checks and six matched real-engine views."""
import hashlib,json,os,re,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
GAME=ROOT/'game/trail-of-truth-block-adventure'
ENGINE=os.environ.get('GODOT_BIN','/home/helper/tools/godot-4.7.2/godot')
OUT=ROOT/'docs/games/block-evidence/apex-cave-recovery'
JOBS={'cave_reveal_test':'CAVE_REVEAL_FAILURES=0','cave_presentation_test':'CAVE_PRESENTATION_FAILURES=0','cave_input_playthrough':'CAVE_INPUT_FAILURES=0','cave_campaign_test':'CAVE_FAILURES=0','cave_combat_test':'CAVE_COMBAT_FAILURES=0','cave_victory_test':'CAVE_VICTORY_FAILURES=0','garden_art_test':'GARDEN_ART_FAILURES=0'}
JOBS.update({'cave_shell_geometry_test':'CAVE_SHELL_GEOMETRY_PASS','cave_animal_motion_test':'ANIMAL_MOTION_FAILURES=0','cave_block_animal_test':'failures=0','escort_collisions':'rescue_reward_earned true'})
def snapshot():
    return {str(p.relative_to(GAME)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(GAME.rglob('*')) if p.is_file() and '.godot' not in p.parts and p.suffix in ('.gd','.gdshader','.glb','.gltf','.png','.jpg','.godot','.tscn','.tres')}
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    tag=os.environ.get('CAVE_QA_TAG','final');out=OUT/tag;out.mkdir(parents=True,exist_ok=True)
    before=snapshot(); rows=[]
    for name in sys.argv[1:] or JOBS:
        capture=name in ('cave_evidence_capture','cave_recovery_capture')
        with tempfile.TemporaryDirectory(prefix='jd-cave-qa-') as home:
            env=dict(os.environ,XDG_DATA_HOME=home+'/data',XDG_CONFIG_HOME=home+'/config',XDG_CACHE_HOME=home+'/cache',LP_NUM_THREADS='2',JD_CAVE_EVIDENCE_DIR=str(out))
            cmd=([ 'xvfb-run','-a'] if capture else [])+[ENGINE]+([] if capture else ['--headless'])+['--path',str(GAME),'--rendering-method','gl_compatibility','--fixed-fps','60','--script','res://tests/'+name+'.gd']
            log=out/(name+'.log')
            with log.open('w') as f:
                try: rc=subprocess.run(cmd,env=env,stdout=f,stderr=subprocess.STDOUT,timeout=240).returncode
                except subprocess.TimeoutExpired: rc=124
            text=log.read_text(); errors=re.findall(r'^(?:SCRIPT ERROR:|ERROR:|FAIL ).*',text,re.M)
            passed=rc==0 and not errors
            if capture:
                paths=[out/('cave-%s-%s.png'%(view,w)) for view in ('1-entrance','2-threshold','3-inside') for w in (1280,720)]
                from PIL import Image
                passed=passed and text.count('CAPTURE ')==6 and all(p.exists() for p in paths)
                if passed:
                    for p in paths:
                        with Image.open(p) as im:
                            expected=(1280,720) if p.stem.endswith('1280') else (720,1280)
                            passed=passed and im.size==expected
            else: passed=passed and JOBS[name] in text
            rows.append(dict(test=name,passed=passed,exit_code=rc,errors=errors,command=cmd))
            (out/'results.json').write_text(json.dumps(rows,indent=2)+'\n')
            print(json.dumps(rows[-1]),flush=True)
            if not passed: raise SystemExit(text[-5000:])
    if before!=snapshot(): raise SystemExit('SOURCE DRIFT: evidence invalid')
    (out/'source-sha256.json').write_text(json.dumps(before,indent=2)+'\n')
    print('CAVE_RECOVERY_QA_PASS',flush=True)
if __name__=='__main__':main()
