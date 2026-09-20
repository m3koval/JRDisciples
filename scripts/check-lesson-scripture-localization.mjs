import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const lessonDir = path.join(root, 'app', 'lessons')
const ruDataPath = path.join(root, 'data', 'lessons-ru.ts')
const ruData = fs.readFileSync(ruDataPath, 'utf8')

const caseLessonSlugs = fs
  .readdirSync(lessonDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('case-for-christ-'))
  .map((entry) => entry.name)
  .sort()

const failures = []

const verifiedLessonRequirements = {
  'gods-cutting': [
    ['defines English Scripture before rendering', /const\s+scriptureEn\s*=/],
    ['defines Russian Scripture before rendering', /const\s+scriptureRu\s*=/],
    ['uses Bible.com Genesis ESV source links', /https:\/\/www\.bible\.com\/bible\/59\/GEN\.44\.33\.ESV/],
    ['uses Bible.com Genesis RST source links', /https:\/\/www\.bible\.com\/bible\/167\/GEN\.44\.33\.RST/],
    ['uses Bible.com Gospel ESV and RST source links', /ROM\.5\.8\.ESV[\s\S]*ROM\.5\.8\.RST/],
    ['contains the bilingual six-step sermon story', /const\s+storyEn[\s\S]*const\s+storyRu/],
    ['contains the bilingual five-scenario application challenge', /const\s+scenariosEn[\s\S]*const\s+scenariosRu/],
    ['contains the bilingual Gospel truth check', /const\s+truthsEn[\s\S]*const\s+truthsRu/],
    ['preserves the sermon’s Genesis 37 to Genesis 44 contrast', /give Joseph away to save himself[\s\S]*offered himself so Benjamin could go free/],
    ['guards children from unsafe hardship teaching', /Never stay in danger to “prove faith.”/],
    ['guards against automatic holiness by suffering', /Hard circumstances do not automatically make anyone holy/],
    ['guards salvation by works', /changed choices are fruit of His work, not payment for salvation/],
    ['keeps blocked-storage progress playable', /in-memory fallback/],
  ],
  'jesus-builds-his-church': [
    ['defines exact English Scripture before rendering', /const\s+SCRIPTURE_EN\s*=/],
    ['defines exact Russian Scripture before rendering', /const\s+SCRIPTURE_RU\s*=/],
    ['uses Bible.com ESV source links', /https:\/\/www\.bible\.com\/bible\/59\/MAT\.16\.18\.ESV[\s\S]*MAT\.28\.19\.ESV/],
    ['uses Bible.com RST source links', /https:\/\/www\.bible\.com\/bible\/167\/MAT\.16\.18\.RST[\s\S]*MAT\.28\.19\.RST/],
    ['preserves the bilingual sermon title', /The Church — How Jesus Built It[\s\S]*Церковь — как строил её Иисус|Церковь — как строил её Иисус[\s\S]*The Church — How Jesus Built It/],
    ['preserves the four Luke 2:52 growth directions', /wisdom[\s\S]*body[\s\S]*god[\s\S]*people/],
    ['preserves the three BUILD movements', /built relationships[\s\S]*deed and word[\s\S]*assigned and sent disciples/],
    ['preserves the MANY ONE NEW reach sequence', /The Many, the One, and the New[\s\S]*Многие, один и новые|Многие, один и новые[\s\S]*The Many, the One, and the New/],
    ['guards salvation from works', /We do not earn salvation by growing, serving, attending church, or finishing this lesson/],
    ['conditions church membership on faith in Jesus', /When you trust and follow Him, He joins you to His people/],
    ['protects child outreach with trusted-adult framing', /With a parent, teacher, or trusted adult/],
    ['uses normalized hydration-safe progress', /normalizeProgress[\s\S]*useSyncExternalStore/],
  ],
  'every-one-matters': [
    ['defines English Scripture before rendering', /const\s+scriptureEn\s*=/],
    ['defines Russian Scripture before rendering', /const\s+scriptureRu\s*=/],
    ['uses Bible.com ESV source links', /https:\/\/www\.bible\.com\/bible\/59\/MAT\.18\./],
    ['uses Bible.com RST source links', /https:\/\/www\.bible\.com\/bible\/167\/MAT\.18\./],
    ['contains the bilingual child application challenge', /const\s+scenariosEn[\s\S]*const\s+scenariosRu/],
    ['contains the bilingual sermon-truth check', /const\s+truthsEn[\s\S]*const\s+truthsRu/],
    ['guards against valuing the one above the ninety-nine', /the one sheep is not more valuable than the ninety-nine/],
    ['guards against teaching salvation by kind deeds', /No good deed purchases salvation/],
    ['embeds the find-the-one interaction', /data-sheep=\{item\.wandering/],
    ['links the existing Lost Sheep quest for deeper replay', /href=\"\/quests\/lost-sheep\"/],
  ],
  'grace-in-the-kingdom': [
    ['defines English Scripture before rendering', /const\s+scriptureEn\s*=/],
    ['defines Russian Scripture before rendering', /const\s+scriptureRu\s*=/],
    ['uses Bible.com Matthew 20 ESV source links', /https:\/\/www\.bible\.com\/bible\/59\/MAT\.20\./],
    ['uses Bible.com Matthew 20 RST source links', /https:\/\/www\.bible\.com\/bible\/167\/MAT\.20\./],
    ['preserves exact Matthew 20:1 ESV wording', /For the kingdom of heaven is like a master of a house who went out early in the morning to hire laborers for his vineyard\./],
    ['preserves exact Matthew 20:1 RST wording', /Ибо Царство Небесное подобно хозяину дома, который вышел рано поутру нанять работников в виноградник свой/],
    ['preserves exact Matthew 20:15 ESV wording', /Am I not allowed to do what I choose with what belongs to me\? Or do you begrudge my generosity\?/],
    ['preserves exact Matthew 20:15 RST wording', /разве я не властен в своем делать, что́ хочу\? или глаз твой завистлив оттого, что я добр\?/],
    ['uses exact-source Ephesians 2:8–9 ESV and RST links', /EPH\.2\.8-9\.ESV[\s\S]*EPH\.2\.8-9\.RST/],
    ['contains the bilingual grace-choice challenge', /const\s+scenariosEn[\s\S]*const\s+scenariosRu/],
    ['contains the bilingual Gospel truth check', /const\s+truthsEn[\s\S]*const\s+truthsRu/],
    ['guards against salvation by behavior', /good behavior purchases eternal life/],
    ['guards against minimizing sin', /Grace does not rename evil as good/],
    ['teaches that Jesus is the treasure', /Jesus is the treasure/],
    ['teaches the comparison trap', /Comparison turns gratitude into grumbling/],
    ['preserves the sermon’s sentry pardon illustration', /Civil War sentry who fell asleep on duty/],
  ],
  'one-thing-you-lack': [
    ['defines English Scripture before rendering', /const\s+scriptureEn\s*=/],
    ['defines Russian Scripture before rendering', /const\s+scriptureRu\s*=/],
    ['uses Bible.com ESV source links', /https:\/\/www\.bible\.com\/bible\/59\/MAT\.19\./],
    ['uses Bible.com RST source links', /https:\/\/www\.bible\.com\/bible\/167\/MAT\.19\./],
    ['labels the full sermon context Matthew 19:13–26 in English and Russian', /Matthew 19:13–26[\s\S]*Матфея 19:13–26|Матфея 19:13–26[\s\S]*Matthew 19:13–26/],
    ['labels English Scripture ESV', /translation:\s*'ESV'/],
    ['labels Russian Scripture RST', /translation:\s*'RST'/],
    ['contains the 12-tile English memory challenge', /const\s+memoryEn[\s\S]*love-a[\s\S]*lack-b/],
    ['contains the 12-tile Russian memory challenge', /const\s+memoryRu[\s\S]*love-a[\s\S]*lack-b/],
    ['guards against teaching that possessions are automatically evil', /Possessions are not automatically evil/],
    ['guards against teaching that surrender purchases salvation', /Good deeds do not purchase eternal life/],
    ['anchors salvation in God’s power', /With man this is impossible, but with God all things are possible/],
    ['preserves the sourced Eleven22 children-and-ruler contrast', /Cross-reference: The Church of Eleven22 · Matthew S5E9/],
    ['teaches in English that the kingdom is received as Jesus’ gift', /God’s kingdom is received: as Jesus’ gift, not a prize we earn/],
    ['teaches the same gift-not-prize truth in Russian', /Божье Царство: как подарок Иисуса, а не как награду, которую мы заработали/],
  ],
  'whose-mark': [
    ['defines English Scripture before rendering', /const\s+scriptureEn\s*=/],
    ['defines Russian Scripture before rendering', /const\s+scriptureRu\s*=/],
    ['uses exact-source Matthew 22:21 ESV and RST links', /MAT\.22\.21\.ESV[\s\S]*MAT\.22\.21\.RST/],
    ['uses exact-source Genesis 1:27 ESV and RST links', /GEN\.1\.27\.ESV[\s\S]*GEN\.1\.27\.RST/],
    ['preserves exact Matthew 22:21 ESV wording', /Therefore render to Caesar the things that are Caesar’s, and to God the things that are God’s/],
    ['preserves exact Matthew 22:21 RST wording', /итак отдавайте кесарево кесарю, а Божие Богу/],
    ['contains the bilingual child application challenge', /const\s+scenariosEn[\s\S]*const\s+scenariosRu/],
    ['contains the bilingual truth check', /const\s+truthsEn[\s\S]*const\s+truthsRu/],
    ['guards against a sacred-secular split', /Your whole life is already lived before God/],
    ['guards worship from human claims', /Worship God alone/],
    ['defines the obey-God-first boundary', /“Obey God first” applies when a command truly requires sin, not merely when a rule feels inconvenient/],
    ['keeps blocked-storage progress playable', /in-memory copy still keeps this visit playable/],
  ],
}

for (const slug of caseLessonSlugs) {
  const pagePath = path.join(lessonDir, slug, 'page.tsx')
  const text = fs.readFileSync(pagePath, 'utf8')

  if (/\bWEB\b|World English Bible/.test(text)) {
    failures.push(`${slug}: contains WEB wording or label in published page`)
  }

  if (/scriptureEn/.test(text) && !/\bESV\b/.test(text)) {
    failures.push(`${slug}: defines English Scripture but is missing an ESV label in published page`)
  }

  if (!/\buseLanguage\b/.test(text) || !/language === 'ru'|language === "ru"/.test(text)) {
    failures.push(`${slug}: missing Russian language branch in published page`)
  }

  if (!new RegExp(`href:\\s*\"/lessons/${slug}\"`).test(ruData)) {
    failures.push(`${slug}: missing Russian lessons card`)
  }
}

for (const [slug, requirements] of Object.entries(verifiedLessonRequirements)) {
  const pagePath = path.join(lessonDir, slug, 'page.tsx')
  if (!fs.existsSync(pagePath)) {
    failures.push(`${slug}: missing published page`)
    continue
  }
  const text = fs.readFileSync(pagePath, 'utf8')
  if (/\bWEB\b|World English Bible/.test(text)) {
    failures.push(`${slug}: contains WEB wording or label in published page`)
  }
  if (!/\buseLanguage\b/.test(text) || !/language === 'ru'|language === "ru"/.test(text)) {
    failures.push(`${slug}: missing Russian language branch in published page`)
  }
  if (!new RegExp(`href:\\s*\"/lessons/${slug}\"`).test(ruData)) {
    failures.push(`${slug}: missing Russian lessons card`)
  }
  for (const [label, pattern] of requirements) {
    if (!pattern.test(text)) failures.push(`${slug}: ${label}`)
  }
}

if (failures.length) {
  console.error('Lesson Scripture/localization check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Lesson Scripture/localization checks passed for ${caseLessonSlugs.length} Case for Christ lessons and ${Object.keys(verifiedLessonRequirements).length} fully guarded sermon lessons.`)
