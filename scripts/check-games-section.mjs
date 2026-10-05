import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const hubPath = path.join(root, 'app/games/page.tsx');
const faithPath = path.join(root, 'app/games/faith-over-giants/page.tsx');
const archerPath = path.join(root, 'app/games/faithful-archer/page.tsx');

if (!fs.existsSync(hubPath)) failures.push('Games hub app/games/page.tsx must exist.');
if (!fs.existsSync(faithPath)) failures.push('Faith Over Giants route app/games/faith-over-giants/page.tsx must exist.');
if (!fs.existsSync(archerPath)) failures.push('Faithful Archer route app/games/faithful-archer/page.tsx must exist.');

const hub = fs.existsSync(hubPath) ? fs.readFileSync(hubPath, 'utf8') : '';
const faith = fs.existsSync(faithPath) ? fs.readFileSync(faithPath, 'utf8') : '';
const archer = fs.existsSync(archerPath) ? fs.readFileSync(archerPath, 'utf8') : '';

if (!hub.includes('/games/faith-over-giants')) failures.push('Games hub must link to /games/faith-over-giants.');
if (!hub.includes('/games/faithful-archer')) failures.push('Games hub must link to /games/faithful-archer.');
if (!hub.includes('Faith Over Giants')) failures.push('Games hub must include the English Faith Over Giants title.');
if (!hub.includes('Вера сильнее великанов')) failures.push('Games hub must include the Russian Faith Over Giants title.');
if (!hub.includes('Faithful Archer')) failures.push('Games hub must include the English Faithful Archer title.');
if (!hub.includes('Верный лучник')) failures.push('Games hub must include the Russian Faithful Archer title.');

const requiredFaithSnippets = [
  'Joshua 1:9',
  'Иисуса Навина 1:9',
  'Have I not commanded you? Be strong and courageous.',
  'будь тверд и мужествен',
  'Face the Big Fear',
  'Встреча с большим страхом',
  'coins',
  'powerups',
  'bossWarning',
  'большой страх',
  'GUIDES',
  'badgeEn',
  'pressure-meter',
  'reward-medal',
];

for (const snippet of requiredFaithSnippets) {
  if (!faith.includes(snippet)) failures.push(`Faith Over Giants route must include: ${snippet}`);
}

if (!/type\s+Powerup/.test(faith)) failures.push('Faith Over Giants route must define typed powerups.');
if (!/const\s+LEVELS/.test(faith)) failures.push('Faith Over Giants route must define LEVELS.');
if (!/const\s+SCRIPTURE/.test(faith)) failures.push('Faith Over Giants route must define SCRIPTURE.');

const requiredArcherSnippets = [
  'Faithful Archer',
  'Верный лучник',
  'Psalm 119:105',
  'Псалом 118:105',
  'Your word is a lamp to my feet',
  'Слово Твое — светильник ноге моей',
  'localStorage',
  'pointerdown',
  'touch-action: none',
  'requestAnimationFrame',
  'wisdomMeter',
  'target-course',
  'mobile-release',
  'new Range3D(canvas, fail',
  'getCanvasPoint',
  'launchArrowVelocity',
  'ARROW_SPEED',
  'ARROW_GRAVITY',
  'MOBILE_BREAKPOINT',
  'shoot(point.x, point.y)',
  'visualRef.current?.render',
  'trail: Point[]',
  'target.squash',
  'target.spin',
  'FAITH_POPUPS',
  'HIT_ASSIST',
  'core: 0.64',
  'getHitAssistRadius',
  'distancePointToSegment',
  'snapArrowToTarget',
  'hitCooldown',
  'Hit each target once',
  'type Emotion',
  'visual.dispose()',
  'EMOTION_BEATS',
  "setArcherEmotion('happy'",
  "setArcherEmotion('surprised'",
  "setArcherEmotion('celebrate'",
  'targetMotion(kind, model.levelIndex)',
  'stepFlight',
  'roundOutcome',
  'All four courses complete!',
  'Collect 12 arrows',
  'motionAmp',
  'motionY',
  'stuckTargetId',
  'stuckOffset',
  'moveStuckArrowWithTarget',
  'type Obstacle',
  'obstaclesRef',
  'spawnObstacles',
  'arrowHitsObstacle',
  'obstaclesRef.current.map(o => getObstacleBounds(o, modelRef.current.time))',
  'farAnchor',
  'courseShrink',
  'impactDistance',
  'getObstacleBounds',
  'hitFlash',
  'obstacle.hitFlash',
  'spawnMissDust',
  'arrowHitsObstacle(p, next, getObstacleBounds(o, modelRef.current.time))',
  'releasePointerCapture',
  'lostpointercapture',
  'getTargetFeedback',
  'ring!',
];

for (const snippet of requiredArcherSnippets) {
  if (!archer.includes(snippet)) failures.push(`Faithful Archer route must include: ${snippet}`);
}

// Renderer replacement: test real mesh/rig construction and normal-route binding,
// not names of retired Canvas2D/stickman routines. Physics checks remain intact.
const rangePath = path.join(root, 'app/games/faithful-archer/range-3d.ts');
const range = fs.existsSync(rangePath) ? fs.readFileSync(rangePath, 'utf8') : '';
for (const snippet of ['THREE.WebGLRenderer', 'GLTFLoader', 'poseArm', 'makeTarget', 'makeArrow',
  'this.renderer.render(this.scene,this.camera)', 'webglcontextlost', 'this.renderer.dispose()',
  "t.kind==='bell'", "t.kind==='scroll'", "t.kind==='lantern'", "this.fitModel('michael'"])
  if (!range.includes(snippet)) failures.push(`Faithful Archer 3D renderer must include: ${snippet}`);
if (/getContext\(['"]2d/.test(archer + range)) failures.push('Faithful Archer world must not silently fall back to rejected Canvas2D artwork.');
if (!/function\s+getCanvasPoint/.test(archer)) failures.push('Faithful Archer route must define getCanvasPoint for mobile-safe touch coordinates.');
if (!/function\s+launchArrowVelocity/.test(archer)) failures.push('Faithful Archer route must define launchArrowVelocity for deterministic projectile math.');
if (/event\.offset[XY]/.test(archer)) failures.push('Faithful Archer route must not use PointerEvent.offsetX/offsetY; iOS Safari touch release can report bad offsets.');
if (/arrow\.[xy] \+= arrow\.v[xy] \* dt \* 60/.test(archer)) failures.push('Faithful Archer arrow physics must use px/sec units, not frame-scaled dt * 60 movement.');
// Finite target courses award each target once; refill must retain that progress.
if (!archer.includes('if (target.hit || target.hitCooldown > 0) continue')) failures.push('Faithful Archer must prevent duplicate target credit.');
if (/m\.levelIndex === 0 \? 0/.test(archer)) failures.push('Faithful Archer targets should move even on the first course; Mike asked for larger, more aggressive motion.');
if (/if \(arrow\.stuck\) continue/.test(archer)) failures.push('Faithful Archer stuck arrows must follow moving targets via stuckTargetId/stuckOffset, not freeze in world space.');
if (/return target\.r \+/.test(archer)) failures.push('Faithful Archer hitbox must use a reduced core radius so target placement matters; do not count the whole visual radius plus assist.');
if (/const count = width < MOBILE_BREAKPOINT \? 5 : 6/.test(archer)) failures.push('Faithful Archer targets should be fewer/smaller/farther now, not the older close dense target layout.');
if (/const bullseye = Math\.hypot\(arrow\.x - target\.x/.test(archer)) failures.push('Faithful Archer bullseye scoring must use pre-snap impactDistance, not snapped arrow coordinates.');
if (/ctx\.translate\(obstacle\.x \+ sway/.test(archer)) failures.push('Faithful Archer obstacle drawing and collision must share getObstacleBounds so visible obstacle position matches collision.');
if (!/type\s+Target/.test(archer)) failures.push('Faithful Archer route must define typed targets.');
if (!/const\s+SCRIPTURE/.test(archer)) failures.push('Faithful Archer route must define SCRIPTURE.');

// Exercise the extracted mechanics, rather than trusting the presence of UI copy.
for (const script of ['test-archer-physics.mjs', 'test-giants-course.mjs', 'test-david-recovery.mjs', 'test-spot-regression.mjs', 'test-shepherd-mechanics.mjs']) {
  try { execFileSync(process.execPath, [path.join(root, 'scripts', script)], { cwd: root, stdio: 'pipe', timeout: 30000 }); }
  catch { failures.push(`Gameplay regression failed: ${script}`); }
}

if (failures.length) {
  console.error('Games section checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Games section checks passed, including Faith Over Giants.');
