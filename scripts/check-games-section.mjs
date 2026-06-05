import fs from 'node:fs';
import path from 'node:path';

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
  'Level 10',
  'Уровень 10',
  'wisdomFuel',
  'powerups',
  'Promise Boss',
  'Страх-великан',
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
  'drawRagdollDummy',
  'getCanvasPoint',
  'launchArrowVelocity',
  'ARROW_SPEED',
  'ARROW_GRAVITY',
  'MOBILE_BREAKPOINT',
  'shoot(point.x, point.y)',
];

for (const snippet of requiredArcherSnippets) {
  if (!archer.includes(snippet)) failures.push(`Faithful Archer route must include: ${snippet}`);
}

if (!/function\s+drawRagdollDummy/.test(archer)) failures.push('Faithful Archer route must define drawRagdollDummy.');
if (!/function\s+getCanvasPoint/.test(archer)) failures.push('Faithful Archer route must define getCanvasPoint for mobile-safe touch coordinates.');
if (!/function\s+launchArrowVelocity/.test(archer)) failures.push('Faithful Archer route must define launchArrowVelocity for deterministic projectile math.');
if (/event\.offset[XY]/.test(archer)) failures.push('Faithful Archer route must not use PointerEvent.offsetX/offsetY; iOS Safari touch release can report bad offsets.');
if (/arrow\.[xy] \+= arrow\.v[xy] \* dt \* 60/.test(archer)) failures.push('Faithful Archer arrow physics must use px/sec units, not frame-scaled dt * 60 movement.');
if (!/type\s+Target/.test(archer)) failures.push('Faithful Archer route must define typed targets.');
if (!/const\s+SCRIPTURE/.test(archer)) failures.push('Faithful Archer route must define SCRIPTURE.');

if (failures.length) {
  console.error('Games section checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Games section checks passed, including Faith Over Giants.');
