# Timmy web lesson: editorial, theology, art, and migration review

## Scope and source boundary
Authorized replacement of the main web experience at the existing QR route `/lessons/clean-inside-outside`. Baseline: `3308951`. The booklet, Scripture fixture, original puzzle manifest, old three images, and all eight PDFs retain the original `docs/shiny-cup/preservation.json` hashes. No print regeneration, changed QR, renamed download, or reprint is involved.

`journey.json` is the new EN/RU web narrative, not a revised print source. The lemonade story and its puzzles are clearly subordinate in a closed, labeled original printed-companion section. Download copy explicitly says the PDFs contain lemonade, not Timmy. Historical teacher-PDF publication notes remain unchanged; the website explains them.

Primary Scripture: existing source-verified ESV https://www.bible.com/bible/59/MAT.23.ESV and Russian Synodal RST 167 https://www.bible.com/bible/167/MAT.23.RST. Exact fixture bytes are immutable. ESV has 23 main-text verses in the requested range, RST has 24. The adult edition note preserves the ESV textual footnote distinction for verse 14. No synthetic English verse 14 is added.

## Coverage and claim map
| Passage | Main child discovery | Boundary |
| --- | --- | --- |
| 13–15, RST 14 | Blocking entry, corrupting converts; widow exploitation behind prayer | Doorway is a limited modern analogy, not the full accusation. Woes explicitly mean God's judgment. |
| 16–22 | Evasive oaths, God behind temple/altar/heaven | Honest promise application is distinguished from the actual ancient oath argument. |
| 23–24 | Weightier justice, mercy, faithfulness; retain smaller duties | Radical same-person gnat/camel art; sorting has no 'small obedience is irrelevant' category. |
| 25–26 | Greed/self-indulgence beneath polished religious appearance | Cup reveal exposes meaning, not a salvation-through-wiping game. |
| 27–28 | Hidden hypocrisy/lawlessness, tomb's concealed death | Honest struggle and confession explicitly distinguished from defending the disguise. |
| 29–34 | Honoring dead prophets while rejecting/persecuting God's messengers | No forced reenactment by Timmy. Entire unit including v33 accessible in child discovery's read-together disclosure. |
| 35–36 | Righteous blood and real announced judgment on that generation | Not generic manners. No speculation about Zechariah's identity beyond the exact verse. |

The seven discoveries contain full exact selected verses and per-unit full reading disclosures; a separate adult disclosure includes the entire passage in order. No quoted Scripture is rewritten. Narrative descriptions of Jesus' cup warning are paraphrases with references, not invented dialogue attributed to Jesus.

Gospel synthesis is explicitly sourced outside Matthew 23: 1 Corinthians 15:3–4 (Jesus' death for sins and resurrection); Ephesians 2:8–10 (grace through faith, not earned by works; good works follow). Love for God AND neighbor remains explicit (compare Matthew 22:37–40). Neither welcoming the girl nor activity completion buys forgiveness. Justice corrects the actual unfair rule; mercy includes apology and practical patient help; faithfulness includes fulfilling the entrusted welcome and continuing to learn/serve afterward. RST «веру» is immutable; explanatory prose connects faith in God with faithful obedience, not a replacement of faith by reliability.

## Narrative/editorial pass
Read both complete narratives in scene order, then all discoveries and activity feedback against the fixture. Religious duty causes the conflict: verses become a status test and the welcome job becomes an excuse to refuse the welcome. Clothing is mentioned as scene detail, explicitly not grounds for exclusion. Grandma does not knowingly feed rotten fruit; she and Timmy discover it after his bite and set it aside. The apple is not attributed to Jesus. Timmy admits motive rather than becoming a child preacher; Grandma speaks briefly, with gospel synthesis in narration. Repair follows trust/repentance and continues beyond one apology. Added a causal explanation for the abandoned drawing (upset child hurries to family). Removed an unsupported helper-badge reference from the intro. This is read-together material, not a child-tested easy reader.

## Asset/caption review
All 11 actual source files downloaded/copied, decoded, measured, SHA-256 recorded in `assets.json`. Contact sheet and native S06/cup/tomb inspected. Native small scenes are 507×379, never presented as full-page print masters; S06 is 1024×768. Main desktop story-image bound is 507px; phone images contained without cropping. No new generation charges.

- S01–S04: stars → welcome assignment → invented barrier → missed practical help; consistent boy/girl/setting. No child is a 'wrong object' in any activity.
- S05–S07: boast → accidental apple discovery with Grandma → admission. S06 visibly shows the bitten edge and small damaged/worm area, not Grandma offering known spoiled food.
- S08: drawing returned and doorway open. Learning together is subsequent narration, not claimed as the image's visible action.
- Camel: native 1024 square, same man strains cup while enormous camel enters exaggerated mouth. Intentional impossible physics, not a real historical incident. Rear animal detail is compressed by composition; no claim of anatomical realism.
- Cup: approved green vapor revision, polished outside and filthy/greedy interior; coins signify greed, not evil inherent in money.
- Tomb: approved green vapor revision, white outside and dry bones within. Non-graphic but serious. Explicitly not resurrection imagery. Green smell is labeled artistic, not biblical.

Bilingual alt/caption copy lives with the lesson. Existing small story scenes used as supporting analogies in discovery, not as purported ancient events. Main hero is approved radical camel, not the rejected tame 16-panel pack.

## Interaction/privacy and migration
Five main stages, eight connected story scenes, seven Bible discoveries, four concrete religious-practice scenarios, six two-bucket priority cards, explicitly checked event ordering, hidden-answer recall, and private response with NO text input or response-completion record. Optional companion preserves actual 12-word searches and four picture objects, including touch/keyboard operation. Progress is scoped to new `jd-timmy-web-v1`, isolated per language; old storage is untouched and cannot falsely complete new activities. New state normalizes invalid IDs, deduplicates lists, rejects bad indexes, and retains in-memory state when writes fail. Free confession/prayer is neither collected nor sent. Counts derive from content-array lengths.

A wrong first answer retains retry feedback and blocks that discovery/scenario's continuation. A correct sequence is not graded until explicit Check. Navigation remains available for a parent revisiting material; progress is an activity aid, not certification of faith. Screenshots use browser emulation, not physical-device testing. Dense full Scripture is optional read-together material, never shrunk to fit. The narrative and individual Bible panels still require some vertical reading on phones; this is not a fixed-height arcade game.

## Verification entrypoints
- `node scripts/check-shiny-cup.mjs` now also imports `check-timmy.mjs`; old byte-preservation assertions remain intact.
- `node scripts/test-timmy-browser.mjs`: EN/RU portrait phone, landscape phone, iPad, desktop; every scene/panel, wrong/right gates, sort, sequence, recall, reload/reset, storage faults, privacy, exact live PDFs/assets, canonical/sitemap/catalogs.
- `node scripts/test-timmy-companion.mjs`: both languages, phone/iPad landscape, all words and objects, real touch drag→keyboard→touch, full exact passage, reload, selected-hover contrast.
- `node scripts/test-layout-latest-browser.mjs`: actual homepage/latest clicks and shared tile regressions; only the approved new title expectation changed, all older destination/ordering assertions retained.
- Old `test-shiny-cup-browser.mjs` and `test-shiny-cup-inputs.mjs` are compatibility entrypoints for the current main and companion suites, not obsolete tests expecting lemonade as the main lesson.

All browser suites accept `BASE_URL` and `QA_DIR`, so production uses the same tests. Full hosted quality workflow commands, lint/build and production npm audit are required before push. Initial failed evidence retained separately: a 2px download-link margin overflow (fixed at source), then a catalog assertion racing language hydration (test now awaits intended localized state). No assertion was weakened to hide a product defect.

Independent final live review belongs to the parent agent; this document records the implementing agent's editorial and visual inspection, not an independent human/child study.
