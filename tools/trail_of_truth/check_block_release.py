"""Guard the actual shipped block chapter, not the preserved legacy prototype."""
import hashlib,json,pathlib,sys,gzip
ROOT=pathlib.Path(__file__).resolve().parents[2]
PROJECT=ROOT/'game/trail-of-truth-block-adventure'
BUILD=ROOT/'public/games/trail-of-truth-block-adventure/build'
MANIFEST=BUILD/'release-manifest.json'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def sources():
    return {str(p.relative_to(PROJECT)):digest(p) for p in sorted(PROJECT.rglob('*')) if p.is_file() and '.godot' not in p.parts and p.suffix in ['.gd','.godot','.tscn','.cfg','.glb','.gltf','.bin','.png','.jpg','.jpeg','.webp','.tres','.md'] and 'tests' not in p.parts}
def artifacts():
    return {name:{'sha256':digest(BUILD/name),'bytes':(BUILD/name).stat().st_size,'gzip_bytes':len(gzip.compress((BUILD/name).read_bytes(),mtime=0))} for name in ['index.html','index.js','index.wasm','index.pck']}
def check():
    failures=[]
    def need(ok,msg):
        if not ok:failures.append(msg)
    manifest=json.loads(MANIFEST.read_text())
    need(manifest['sources']==sources(),'Source changed since final export/stamp')
    need(manifest['artifacts']==artifacts(),'Export changed since stamp')
    need((BUILD/'index.wasm').read_bytes()[:8]==b'\0asm\x01\0\0\0','Invalid WASM')
    need((BUILD/'index.pck').read_bytes()[:4]==b'GDPC','Invalid Godot package')
    route=(ROOT/'app/games/trail-of-truth/page.tsx').read_text()
    need('/games/trail-of-truth-block-adventure/build/index.html' in route,'Wrong hosted game')
    need('sandbox="allow-scripts allow-same-origin allow-pointer-lock"' in route,'Unsafe/missing iframe sandbox')
    need('allow="autoplay; fullscreen; gamepad"' in route,'Missing iframe feature policy')
    need("position: 'fixed', inset: 0" in route and "height: '100dvh'" in route,'Game must be viewport-filling')
    need('renderer/rendering_method="gl_compatibility"' in (PROJECT/'project.godot').read_text(),'Wrong renderer')
    text=(PROJECT/'scripts/main.gd').read_text()
    for quote in ['For the Son of Man came to seek and to save the lost.','ибо Сын Человеческий пришел взыскать и спасти погибшее','I am the good shepherd. The good shepherd lays down his life for the sheep.','Я есмь пастырь добрый: пастырь добрый полагает жизнь свою за овец']:
        need(quote in text,'Missing exact Scripture: '+quote)
    for token in ['ESV','Синодальный перевод','Jesus saves us. Rescue is not a prize we earn with points.','Спасение нельзя заработать очками.']:
        need(token in text,'Missing content guard '+token)
    for filename in ['michael.glb','lamb.glb']:
        p=PROJECT/'assets'/filename
        need(p.read_bytes()[:4]==b'glTF','Invalid model '+filename)
    # Pin the accepted upstream model without importing the unrelated legacy proof.
    need(digest(PROJECT/'assets/michael.glb')=='fddb290aae7b65da54640c1f67821a0c93940fccd89f5c3d88848a86ad88756d','Accepted Michael changed')
    need((PROJECT/'THIRD_PARTY_NOTICES.md').is_file(),'Missing provenance')
    print(json.dumps({'pass':not failures,'failures':failures,'artifacts':manifest['artifacts']},indent=2))
    return not failures
if __name__=='__main__':
    if '--stamp' in sys.argv:
        MANIFEST.write_text(json.dumps({'schema':1,'project':'faithful-trail-block-1','sources':sources(),'artifacts':artifacts()},indent=2)+'\n')
        print('Stamped real export/source hashes')
    sys.exit(0 if check() else 1)
