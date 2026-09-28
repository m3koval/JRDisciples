"""Frozen-source cave discovery QA; preserves the original recovery suites.

Usage: python tools/trail_of_truth/verify_cave_discovery.py [test ...]
Use cave_recovery_capture for the six native rendered gameplay views.
Native engine checks do not establish iPad performance or touch usability.
"""
from pathlib import Path
import verify_cave_recovery as recovery

recovery.OUT = Path(__file__).resolve().parents[2] / 'docs/games/block-evidence/cave-discovery-polish'
recovery.JOBS.update({
    'cave_discovery_test': 'CAVE_DISCOVERY_FAILURES=0',
    'cave_animal_anatomy_test': 'failures=0',
    'cave_camera_assist_test': 'CAVE_CAMERA_ASSIST_FAILURES=0',
    'cave_map_test': 'CAVE_MAP_FAILURES=0',
})

if __name__ == '__main__':
    recovery.main()
