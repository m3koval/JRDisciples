# Child-playtest stabilization

Base: app branch `f441a42`.

## Acceptance scope

- Simultaneous two-thumb walking and looking, release/reacquisition, pause ownership.
- No tree trunk or canopy intrusion into either cottage's rendered bounds.
- Readable EN/RU HUD and panels in portrait and landscape without shrinking body text to fit.
- Nearby object taps share existing interaction gates; camera drags and joystick input never pick up objects.
- Inspect rendered carrying clothing, not only hand target coordinates.
- Export and integrate into existing offline iOS app; no claim of physical iPad validation on Linux.

## World evidence

`tests/scenery_clearance.gd` initially failed for four tree/cottage canopy intersections, including both trunks reported inside buildings. Cottage metadata now identifies actual rendered meshes; tree candidates are rejected when their full canopy envelope overlaps those meshes with clearance. The regression now passes with both cottages and ten remaining trees. Native `tests/scenery_visual.gd` renders both cottages and an overview into `docs/games/block-evidence/stabilization/`.

## Carrying decision

The recovered runtime weight-repair experiment failed visual review: a numerically bounded mesh still showed split sleeve/hand surfaces and a stretched side panel. It was removed, not shipped. The original model/skin remains unchanged. Carrying now holds the left arm in its authored local rest pose instead of applying extreme raised-arm IK. The log remains shoulder-mounted; this is a conservative deformation mitigation, **not a finished hand-on-log gripping animation**. Front/side/rear idle/run/jump posed native renders are captured by `tests/player_carry_fixture.gd`.

## Test discipline

The browser harness now includes concurrent joystick and camera fingers, look-finger release and reacquisition, heading-step limits, and movement release checks. This is stronger than testing joystick and camera separately, but not a substitute for physical iPad frame pacing and comfort testing.

## Verified release evidence

- Twelve native regression suites passed, including keyboard-driven rescue/rewards, scenery clearance, pointer/camera behavior, tap safety, readable bilingual UI, saves, and edge cases.
- Integrated touch browser mission: 69 checks passed, no recorded runtime errors. Includes actual world-log tap pickup, full rescue, rewards/save/replay, EN/RU, simultaneous two-thumb movement/look, release, portrait, short-landscape, and tablet views.
- High-density (DPR2) portrait browser checks passed for joystick movement, camera isolation, and map open/close. Fresh screenshot evidence confirms CSS-sized text and joystick. The harness now waits for iframe navigation before reading its frame.
- App production build, TypeScript, static export and Capacitor sync passed; all 99 offline routes and exact copied engine artifacts validated.
- Content parity and Scripture checks passed. ESLint: zero errors, 36 existing image-component warnings.
- The initial foreground browser run exceeded the tool time window; the subsequent complete background touch run exited 0. An optional additional browser-keyboard run was stopped to avoid competing software-renderer load; keyboard mission coverage is native, not a claimed completed second browser mission.
- Linux uses software rendering here. Physical iPad/WKWebView frame pacing, control comfort, and final visual acceptance remain unverified. Nearby foliage can still obstruct the view; this pass removes building/tree intersections, not every possible scenery occlusion.
