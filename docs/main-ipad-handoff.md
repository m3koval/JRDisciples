# Main-branch iPad handoff

## Build on the Mac

Use the merged `main` from `https://github.com/m3koval/JRDisciples`.
Preserve any local work before pulling; do not force-reset or alter signing credentials.

```bash
git switch main
git pull --ff-only origin main
npm ci
node scripts/check-trail-of-truth.mjs
npm run app:sync
npm run app:open
```

Open the existing `ios/App/App.xcodeproj` in Xcode (the Capacitor command opens it).
Use the owner's existing Apple team/signing and connected iPad target. Build/run
on the intended iPads; this Linux handoff does not sign, archive, upload, or install.

The checked-in `public/games/trail-of-truth-block-adventure/build/` is rebuilt
from the current Godot source. A fresh Godot installation is NOT needed merely
to build this iOS app. Do not rebuild the game from an older exported package.
`app:sync` builds all static routes, copies the bundled engine and content into
the iOS project, and checks exact engine hashes against the source export.

`build:capacitor` remains an alias for the complete `build:app` lane. Both
`CAPACITOR_BUILD=1` and `BUILD_TARGET=capacitor` enable static export configuration.
Build commands explicitly use webpack: the installed Next 16.3.5 Turbopack path
failed resolving its internal Google-font module; the webpack production build
and complete app sync passed. No dependency-version change was made to hide it.

## Included

- Existing app shell / sequential Disciple Journey and game entry point.
- Lost Lamb, village interiors, flock and cave continuation already on the feature branch.
- Garden irrigation construction, solver-driven flow, manual lift gate, dressed
  stone/timber, terrain, foliage, and walkable footbridge crossing.
- Current character scale/grounding corrections and unchanged accepted character masters.
- Main's bilingual static route enumeration, invalid-ID redirects and four-lesson
  hydration corrections, reconciled with Journey completion links.
- Release fingerprints include the new `.gdshader` sources.

## Explicit acceptance limits

**Garden visual direction was accepted. Opening creek/broken-bridge art was rejected
as still below the desired quality.** The earlier opening pilot is included as-is;
this merge does NOT claim the subsequently proposed terrain/tree/composition
redesign has been implemented. Keep that follow-up separate from build readiness.

No physical iPad runtime, Xcode compilation, signing, TestFlight, or App Store
verification was possible on this Linux host. Test engine startup, touch/look/jump,
portrait/landscape safe areas, route to garden, saved progress after force-quit,
and frame rate/memory on the real devices.

## Regression notes

- Native regressions now use a fresh XDG save directory for each test and fixed
  60 Hz. The historical escort failure did not reproduce with isolated saves;
  gameplay assertions remain unchanged.
- The scale test's old eastward sweep intentionally intersects the new solid
  footbridge ramp. It now verifies that exact collider and an unobstructed exit
  below the ramp toe. The physical crossing test separately walks the ramp and
  deck in both directions without jumping.
- Optional historical before-images are not prerequisites to rerun the opening
  verifier on another checkout. Current after-captures remain mandatory.
- Linux native visual runners use Xvfb. `GODOT_BIN` overrides their engine path.

## Verified packaging before handoff

- Normal webpack production build: passed.
- `npm run app:sync`: passed, 99 offline index routes and exact game-file hashes.
- Bilingual, Scripture, Russian-copy, games, quest links and image-asset guards: passed.
- Full ESLint at the existing CI ceiling (`--max-warnings=32`): passed.
- App browser smoke: 10 routes, including all four hydration-fix lessons; no
  page/console errors or broken loaded images.

See adjacent `main-merge-verification.json` for final native/browser results.
