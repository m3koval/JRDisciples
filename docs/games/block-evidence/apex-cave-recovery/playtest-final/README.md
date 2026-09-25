# Cave child-playtest candidate: final verification

- 13 native regression suites passed; `results.json` records actual commands and return codes.
- Six-view capture job passed separately under `../playtest-views/`, for 14 total native jobs. Both evidence sets share the frozen source fingerprint.
- Native input playthrough exercises the existing physical route. Choice-state tests cover all six search permutations, both combat orders, JSON roundtrips, legacy prefixes, malformed checkpoints, no premature escort, early-lamb concealment after reload, attacker return after departure, and idempotent completion. Choice tests are controlled fixtures, not six physical playthroughs.
- Matched ordinary-camera entrance/threshold/interior landscape and portrait captures inspected. Clue board placement refined after a cropped portrait pilot; background terrain intersection and skyline gaps corrected. Seeded screenshots are not motion/performance proof.
- Real Godot Web export rebuilt after final gameplay correction. Release manifest binds current source to exported files.
- `npm run app:sync` passed: 99 offline routes and exact engine hashes copied into the iOS bundle. See `app-sync.log`.
- Static-app iframe smoke passed: trusted touch start/map, keyboard movement, zero page/console errors. See `../browser-smoke/results.json`. Not a full browser cave route.
- ESLint passed at the established 32-warning ceiling (zero errors). Quest links, bilingual parity, Scripture localization, Russian lesson copy, image assets and games guards passed.
- Remaining gate: Claude builds/signs/installs on Mike's Mac; verify both iPads, saved progress and actual child play. No device-performance or premium-art approval claimed.

Mac instructions: `docs/cave-playtest-ipad-handoff.md`.
