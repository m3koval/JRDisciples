# Run 5 — full exported-browser acceptance recovered

## Scope and result

The full, unmodified browser interaction harness completed in one invocation against the current `out` app served at `http://127.0.0.1:8133/games/trail-of-truth/`. Exit 0; 63 unique checks true; no recorded runtime errors. The log prints repeated walking targets, so line count is not the unique-check count.

This closes the run-3/run-4 incomplete-browser gate. It does not retroactively turn either previous attempt into a pass.

Verified route: normal touch start, map movement suspension, invalid action, clue discovery, both material pickups and bridge placements, physical crossing, lamb discovery/call/escort/reunion, EN/RU completion, replay, durable reward after reload, portrait movement/jump/look, concurrent two-thumb control and release, landscape pause/replay reachability/resume, final tablet view. This invocation used the contextual pickup button, **not** the optional world-tap pickup branch. The full browser test covers the opening rescue, not the entire flock/cave/garden campaign.

## Reproduce the evidence check

```sh
python -m unittest discover -s tools/trail_of_truth -p test_browser_snapshot.py
python tools/trail_of_truth/check_run4_evidence.py --native-run 4 --browser-run 5
```

The historical checker filename remains usable. Its new arguments avoid copying nearly identical scripts each hour. It checks a single completed browser run, not concatenated partial evidence. It also verifies expected capture dimensions.

Native evidence is explicitly reused from run 4: seven successful jobs against 140 runtime/test/asset files whose hashes still match. Native jobs were **not rerun in run 5**. The run-4 genuine Godot Web export and synced app were also reused unchanged; fresh checks compare source, export, hosted engine files and browser-harness hashes. No export was stamped or rebuilt in run 5.

After the browser process exited, strengthened the wrapper's minimum required-check list to require intermediate repairs, discovery, modal suspension and touch-release checks, not merely completion flags. The new regression test first failed on 14 omitted route checks; all seven unit tests now pass. The preserved browser result also passes the stronger retrospective validator. The interaction harness and game assertions were unchanged.

## Inspected visuals and limits

Inspected `browser-frozen/desktop-bridge.png`, `portrait-game.png` and `tablet-landscape.png` directly. Real repaired crossing and visible resting joystick/jump are readable. Portrait replay remains unclipped in these captures; the resumed landscape view preserves controls and the player. These are different routed states, **not a matched-state art comparison**. Existing matched-state native art fixtures remain in run 4 and are hash-verified.

Still below the owner reference floor: giant pale rounded perimeter masses, broad flat banks, close-up coarse foliage, and overly dominant HUD. The final landscape view near a tree particularly exposes the crude perimeter. No owner visual approval, physical iPad performance or child-enjoyment claim.

## Release boundary

No new art, level, gameplay mechanic, Scripture or app-shell change this run. This is completion of the existing verification dependency plus fail-closed QA tooling. Run 6 remains the last authorized run and must provide the final freeze/rebuild/export/native/browser handoff without extending the schedule. Larger art and connected-level improvements remain unfinished.

Spend: USD 0 settled, 0 pending, 10 unused across the sprint.
