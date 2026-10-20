from pathlib import Path
R=Path('/home/helper/jd_motion_cleanup')
p=(R/'finalize_and_check.py').read_text();exec(compile(p[p.index('src=(R/'):],'scan_exported_final','exec'))
