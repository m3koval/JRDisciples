"""Original soft pigment/grain map; no external source or paid API."""
from pathlib import Path
import numpy as np
from PIL import Image
rng=np.random.default_rng(714)
n=512
layers=[]
for channel in range(3):
    a=np.full((n,n),.5)
    for size,amp in [(8,.08),(24,.045),(64,.025),(256,.015)]:
        samples=np.uint8(rng.uniform(0,255,(size,size)))
        # Repeated tile padding makes bicubic edges consistent across repeat.
        padded=np.tile(samples,(3,3))
        large=np.asarray(Image.fromarray(padded).resize((n*3,n*3),Image.Resampling.BICUBIC),dtype=float)/255
        a+=(large[n:2*n,n:2*n]-.5)*amp*2
    a+=rng.normal(0,.01,(n,n))
    layers.append(np.clip(a,0,1))
Image.fromarray((np.stack(layers,axis=-1)*255).astype('uint8')).save(Path(__file__).with_name('painted_ground.png'))
