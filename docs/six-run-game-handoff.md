# Junior Disciples — six-run sprint handoff

## Review lane, not main

Review PR: https://github.com/m3koval/JRDisciples/pull/7

Branch: `apex/jd-six-run-improvements` in `m3koval/JRDisciples`.
This is NOT Venture Valley. This sprint does not authorize a main merge, deployment,
Apple signing change, or a seventh development run. The existing main handoff
remains historical main-branch guidance; the sprint changes are on the review branch.

## What the sprint actually delivered

- Continuous opening-bank terrain and connected worn paths; removed overlapping
  rectangular path patches and corrected the shoreline daylight seam.
- Visible broken bridge boards above the bank, seated cross-bearers, and matching
  beveled replacement boards. Existing panel colliders and repair stages retained.
- Opening-only tapered branching trunks and opaque leaf sprays replacing sphere
  crowns. Existing tree collision and cottage clearance retained.
- Frozen-source, full-browser evidence tooling; corrected browser reload readiness
  without removing gameplay assertions. Later runs recovered and verified this
  milestone rather than adding levels.

Accepted garden layout/art, characters/scales, walking/jumping/camera, touch
controls, EN/RU, saves and solver/construction remain unchanged. The gate is still
a manual grooved wood lift board, not a wheel or winch. No Scripture was authored.

## Final verification

Final run evidence: `docs/games/block-evidence/hourly-run-6/`.
- Genuine Godot 4.7.2 Web export succeeded, without engine/script errors. The
  deterministic output matches the prior export byte-for-byte. Fresh release
  stamp/guard and webpack `npm run app:sync` passed: 99 offline routes and exact
  engine copies. Source versus export is current.
- Seven fresh opening/native jobs passed with isolated XDG directories, Xvfb,
  fixed 60 Hz, original assertions and frozen hashes. Current landscape/portrait
  bridge and grove views were captured; bridge both orientations and landscape
  grove were visually inspected.
- Extended irrigation runner passed construction, host and geometry tests, then
  hit its 240-second site-test timeout. That failed attempt is retained. A separate
  isolated 360-second follow-up passed the original site route, garden test and
  garden captures (exit 0, markers present, no engine errors). Thus six irrigation
  checks have current passing coverage across two invocations, not one suite pass.
  Manual-gate landscape and Russian downstream portrait were visually inspected.
- The fresh browser attempt FAILED with `OSError: [Errno 28] No space left on
  device`; its result/verification JSON files were truncated. They are NOT passes.
  Root disk exhaustion was observed directly; inode capacity was available.
  Only this worktree's reproducible `.next/cache` was removed to recover space;
  source, export, app copies, evidence and the protected worktree were retained.
- Last complete browser evidence is explicitly REUSED FROM RUN 5: 63 checks,
  exit 0, complete touch opening/rescue/replay/save/EN-RU/orientation route.
  `check_run4_evidence.py --native-run 6 --browser-run 5` passes against current
  disk: source, export, app copy and interaction harness exactly match that run.
  This is not a successful fresh run-6 browser execution.
- Bilingual/Scripture/Russian-copy, games, quest links, assets and lint passed
  (0 lint errors, 32 existing warnings). Seven browser-evidence unit tests passed.
- Physical iPad/Xcode, child enjoyment, whole-campaign visual acceptance and a
  clean final-run browser rerun remain unverified. No main merge or live deployment.

Final package SHA-256 (`index.pck`):
`9947abb4197804a0a77bc66bed8ea2883b88ec7a0fd736739af821bd3ab52684`.

This is a frozen development handoff with an infrastructure-blocked fresh browser
rerun, not a release-ready or reference-quality approval.

## Visual review and unfinished work

The new terrain, readable damaged decking and branching trees are improvements,
not owner-approved reference quality. Current native landscape/portrait bridge
captures show the missing span clearly and retain visible joystick/Jump. However:

- huge rounded perimeter forms and the spherical outcrop remain conspicuous;
- broad flat grass, abrupt bank walls and coarse foliage still fall below the
  supplied reference's connected planting/material/composition standard;
- large HUD surfaces dominate the scene, particularly at narrow sizes;
- meaningful new levels, connected progression additions, hands-on challenges
  and broader exploration improvements were NOT delivered by this sprint;
- whole-campaign visual coverage, owner approval, child enjoyment and physical
  iPad performance remain open.

Do not convert successful functional tests into a visual or device approval.
Opening composition is the next dependency, followed by canonical chapter
transition/progression work. Preserve the full remaining backlog in
`hourly-game-improvement-log.md`; it is not an automatically scheduled next sprint.

## Mac/Xcode review build (Claude / owner)

Preserve local work first. Fetch and review the dedicated branch rather than
assuming these changes are on main. Do not force-reset another working copy.

```bash
git fetch origin apex/jd-six-run-improvements
git switch apex/jd-six-run-improvements
git pull --ff-only origin apex/jd-six-run-improvements
npm ci
node scripts/check-trail-of-truth.mjs
npm run app:sync
npm run app:open
```

The tracked Web export is rebuilt in the final pass; it does not require a local
Godot install merely to assemble the Capacitor app. `app:sync` uses webpack,
copies the game, and verifies exact bundled-engine hashes. Use existing Apple
team/signing; no credentials or signing settings are supplied or changed here.

On real iPads verify startup, two-thumb movement/look/jump, portrait/landscape
safe areas, map/pause cancellation, bridge repair/rescue/replay, saved rewards
after force-quit, garden interaction, and frame rate/memory. Linux native tests
and software WebGL browser automation are not substitutes for this device pass.

## Spending and authorization boundary

Aggregate cap: $10 USD. No purchases, generation requests, pending charges or
subscriptions were made during the sprint. Settled $0, pending $0, unused $10.
Authority: `hourly-model-budget.json`. Six runs exhaust the development window;
unused funds are not permission for another run or speculative generation.
