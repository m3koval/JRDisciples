from pathlib import Path
p=Path('/home/helper/jd_motion_cleanup/fix_cast.py').read_text()
p=p.replace("Path('/home/helper/jd_motion_cleanup/cast-fixed')","Path('/home/helper/jd_motion_cleanup/michael-flex')")
p=p.replace("for kind in ['walk','run']:","for kind in ['run']:")
p=p.replace("[(0,0),(4,0),(8,0),(12,0),(8,6),(12,6),(12,12),(16,8),(20,8)]","[(a,e) for a in [0,4,8,12] for e in [0,-12,12,-24,24,-36,36]]")
p=p.replace("Matrix.Rotation(math.radians(-sign*forearm),4,'Y')","Matrix.Rotation(math.radians(forearm),4,'X')")
exec(compile(p,'michael_flex_fix','exec'))
