from pathlib import Path
p=Path('/home/helper/jd_motion_cleanup/fix_cast.py').read_text()
p=p.replace("Path('/home/helper/work/JRDisciples/source/character-library/revision-v2')","Path('/home/helper/jd_motion_cleanup/joseph-input')").replace("Path('/home/helper/jd_motion_cleanup/cast-fixed')","Path('/home/helper/jd_motion_cleanup/joseph-flex')").replace("for kind in ['walk','run']:","for kind in ['run']:")
p=p.replace("[(0,0),(4,0),(8,0),(12,0),(8,6),(12,6),(12,12),(16,8),(20,8)]","[(a,e) for a in [12,16] for e in [-12,-18,-24]]").replace("Matrix.Rotation(math.radians(-sign*forearm),4,'Y')","Matrix.Rotation(math.radians(forearm),4,'X')")
exec(compile(p,'joseph_flex_fix','exec'))
