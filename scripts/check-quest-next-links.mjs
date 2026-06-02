import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const componentPath = path.join(root, 'app/quests/components/QuestAdventure.tsx');
const component = fs.readFileSync(componentPath, 'utf8');

const failures = [];

if (!component.includes('nextQuest:')) {
  failures.push('QuestAdventureProps must require a nextQuest prop.');
}

if (!component.includes('href={nextQuest.href}')) {
  failures.push('QuestAdventure completion screen must link to nextQuest.href.');
}

if (!component.includes('nextQuest.label[lang]')) {
  failures.push('QuestAdventure completion screen must render the localized nextQuest label.');
}

const questRoot = path.join(root, 'app/quests');
const questPages = fs.readdirSync(questRoot)
  .filter(name => !['components'].includes(name))
  .map(name => path.join(questRoot, name, 'page.tsx'))
  .filter(file => fs.existsSync(file));

for (const file of questPages) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  if (!text.includes('nextQuest={')) {
    failures.push(`${rel} must pass nextQuest to QuestAdventure.`);
  }
  if (!/href:\s*['"]\/quests\//.test(text)) {
    failures.push(`${rel} nextQuest must include a /quests/... href.`);
  }
}

if (failures.length) {
  console.error('Quest next-link checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Quest next-link checks passed for ${questPages.length} quest pages.`);
