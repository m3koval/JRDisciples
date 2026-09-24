"""Run Godot regressions with bounded time and fail on script errors, not only exit status."""
import pathlib, subprocess, sys, json
ROOT=pathlib.Path(__file__).resolve().parents[2]
PROJECT=ROOT/'game/trail-of-truth-block-adventure'
GODOT='/home/helper/tools/godot-4.7.2/godot'
OUT=ROOT/'docs/games/block-evidence/stabilization/native'
OUT.mkdir(parents=True,exist_ok=True)
tests=sys.argv[1:] or ['scenery_clearance','terrain_surfaces','ipad_player_test','player_motion_skin_test','mobile_ui_readability','world_tap_ui','search_regressions','rewards','rewards_mission','edge_cases','review_regressions','reward_layout']
results=[]
for test in tests:
    try:
        r=subprocess.run([GODOT,'--headless','--path',str(PROJECT),'--script',f'res://tests/{test}.gd','--quit-after','10000'],capture_output=True,text=True,timeout=150)
        log=r.stdout+r.stderr
        passed=r.returncode==0 and not any(s in log for s in ['SCRIPT ERROR:', 'FAIL ', 'FAILED=true'])
        (OUT/(test+'.log')).write_text(log)
        results.append({'test':test,'passed':passed,'exit':r.returncode})
        print(test,'PASS' if passed else 'FAIL',flush=True)
        if not passed: print(log[-4000:])
    except subprocess.TimeoutExpired as e:
        results.append({'test':test,'passed':False,'timeout':True})
        print(test,'TIMEOUT',flush=True)
    (OUT/'results.json').write_text(json.dumps(results,indent=2))
    if not results[-1]['passed']: sys.exit(1)
sys.exit(0)
