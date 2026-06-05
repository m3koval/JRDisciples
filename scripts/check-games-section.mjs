import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const hubPath = path.join(root, 'app/games/page.tsx');
const faithPath = path.join(root, 'app/games/faith-over-giants/page.tsx');

if (!fs.existsSync(hubPath)) failures.push('Games hub app/games/page.tsx must exist.');
if (!fs.existsSync(faithPath)) failures.push('Faith Over Giants route app/games/faith-over-giants/page.tsx must exist.');

const hub = fs.existsSync(hubPath) ? fs.readFileSync(hubPath, 'utf8') : '';
const faith = fs.existsSync(faithPath) ? fs.readFileSync(faithPath, 'utf8') : '';

if (!hub.includes('/games/faith-over-giants')) failures.push('Games hub must link to /games/faith-over-giants.');
if (!hub.includes('Faith Over Giants')) failures.push('Games hub must include the English Faith Over Giants title.');
if (!hub.includes('Вера сильнее великанов')) failures.push('Games hub must include the Russian Faith Over Giants title.');

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
];

for (const snippet of requiredFaithSnippets) {
  if (!faith.includes(snippet)) failures.push(`Faith Over Giants route must include: ${snippet}`);
}

if (!/type\s+Powerup/.test(faith)) failures.push('Faith Over Giants route must define typed powerups.');
if (!/const\s+LEVELS/.test(faith)) failures.push('Faith Over Giants route must define LEVELS.');
if (!/const\s+SCRIPTURE/.test(faith)) failures.push('Faith Over Giants route must define SCRIPTURE.');

if (failures.length) {
  console.error('Games section checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Games section checks passed, including Faith Over Giants.');
