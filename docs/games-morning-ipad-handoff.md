# Overnight games update — Mac / iPad handoff

This document describes the games update prepared on October 5, 2026. Installation is a separate step: a web deployment or Linux Capacitor sync does not update an iPad already in use.

## Pull and build without discarding local work

Use the existing clone of `https://github.com/m3koval/JRDisciples`.

1. Run `git status`. If local edits or unpushed commits exist, preserve/reconcile them first; do not reset them.
2. In a clean checkout:

```sh
git switch main
git pull --ff-only origin main
npm ci
npm run check:games
node scripts/check-trail-of-truth.mjs
npm run app:sync
npm run check:app
npm run app:open
```

The Trail checker uses Python 3. A Godot editor installation is not required to package the checked-in, fingerprinted game export. `app:sync` builds the offline pages, runs Capacitor iOS sync, and validates local resources and exact engine copies.

Open the existing `ios/App/App.xcodeproj` through Capacitor/Xcode, select the intended connected iPad, and build/run using the owner's existing Apple team and signing. Do not replace signing settings or deployment targets. If a fast-forward pull cannot proceed, reconcile the local branch rather than force-resetting it.

## What changed across the games

- **David Sling Challenge:** per-course stones and retries, useful Trust Shield, exclusive held-touch ownership, proper interrupted-shot pause, readable numeric stone/wisdom counts, exact bilingual Scripture.
- **Daniel Escape Room:** four-room puzzle progression, reversible clue inspection, truthful partial-selection feedback, retry-safe answers and narrow-screen controls.
- **Faith Over Giants:** ten sequential courses, real resource/checkpoint consequences, required Scripture questions, progress-linked Michael/path/camp presentation and source-checked quotations.
- **Faithful Archer:** four finite courses, consistent preview/live physics, touch and non-drag aiming, pause, distinct target motion and measured shot-path feedback.
- **Manna Trail:** nine-verse journey, reliable reachable spawning and retained words after failure, exact quotes, meaningful collision guidance and next-cell warning. Full-height landscape board, separate compass D-pad, compact portrait HUD and keyboard-contained pause/recovery/reward dialogs.
- **Shepherd Light Adventure:** coherent square world geometry, owned rendered character/lamb sprites, meaningful escort radius/resources, safer checkpoints and real-hazard-aware optional guidance.
- **Shield of Faith:** held guarding and energy pickups, reliable wave progression, visible arrival warnings, real practical-response gates and owned court/shield artwork.
- **Spot the Difference:** eight stories with real changed objects, pixel-derived hit masks, matching zoomed inspection, patterns visible without hue differences and recovery/hints.
- **Trail of Truth:** earned-bank fall recovery and separated-lamb guidance, plus explicit engine boot progress and load-error/wait/retry recovery. Existing chapter/game remains intact.
- **Truth Runner:** four authored courses, held steering/direct drag, finite progression, checkpoint retries, pause and exact bilingual quotes.

## Required physical-device checks

These are still acceptance tasks, not claimed results:

- Start each game in English and Russian. Check iPad portrait and landscape, safe areas, readable controls and the next action.
- Use real held touch and two-thumb input; test cancellation, app background/foreground, rotation, pause/resume, failure/retry and replay.
- Run without a network connection after installation. Confirm resources and game exports load locally; force-quit and reopen to check supported saved progress.
- Play Trail of Truth through the actual hosted/WKWebView mission, including bridge repair, a real fall, finding/calling the lamb, escort and reunion. The overnight software-renderer browser evidence does **not** establish complete hosted-mission acceptance.
- Observe loading time, frame rate, memory, child comprehension and enjoyment. Desktop browser emulation, native input tests and passing build checks do not establish these.

## Quality limits

The smaller games retain lightweight 2D/vector/rendered-sprite presentation; they are not all premium real-time 3D. No child-playtest or physical iPad/Xcode result is claimed. Trail's previously unresolved opening-scene visual direction is not made approved by this update. Keep functional improvements, visual acceptance, hosted mission completion and device performance as separate judgments.

The director's persistent handoff records the exact released main SHA, production deployment evidence, test outputs and outstanding work. A Git push alone must not be treated as proof that production updated.
