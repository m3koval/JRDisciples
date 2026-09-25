# Run 4 — recovery review and acceptance scope

## Why this card came first
The prior run had staged foliage/runtime/export work but did not commit or push it.
PR7 still pointed at the run-2 bridge commit. The current release guard rejected
source/export drift caused by post-export whitespace cleanup. Rather than stack a
new scenery or level change over an unresolved handoff, this run finishes that card.

## Integrated runtime change being recovered
Opening trees use the project-authored branching trunks and opaque folded-leaf
sprays from run 3. Their old trunk collision remains authoritative. Garden meshes,
rigs/scales, movement, saves, bilingual story and irrigation state are unchanged.
This is not a new level or a newly implemented construction mechanic.

## New engineering work
- `verify_browser_snapshot.py` binds the complete exported browser route to source,
  artifacts, browser-harness hash and exact app-copy hashes before/after execution.
- Requires real zero exit, every campaign/reload/portrait/two-thumb completion gate,
  all checks true and no browser runtime errors. Partial pickup-only mode is removed
  from the runner environment. Existing gameplay assertions stay intact.
- Six small unit tests reject missing gates, drift, failed exit, errors, false checks
  and string truth values. Synthetic unit fixtures are validator tests, not gameplay
  evidence. `check_run4_evidence.py` also rejects absent final browser verification.
- Native runner accepts a separate evidence folder so recovered verification does
  not overwrite the original run-3 failure history.

## Native visual inspection
Fresh fixed-60Hz isolated native captures reproduce the preserved scene. Landscape
and portrait bridge views show readable missing decking, continuous approaches,
visible resting joystick, Jump and Map. Grove view shows branching trees instead
of orb crowns. However the pale rounded perimeter and spherical outcrop still
look like placeholders; broad flat banks, blunt channel profile and sparse framing
remain below the owner's reference floor. This run does not claim a new art fix.

Seeded bridge/grove views are composition fixtures, separate from the original
physical rescue playthrough. Current native results and source hashes live in
`after/`. Browser results live in `browser-frozen/`; the early `browser/` attempt
was intentionally stopped on discovering export drift and is not acceptance proof.
The retained failed run-3 route remains historical evidence, not a current pass.

## Executed outcome
Seven native jobs pass; genuine Web rebuild, stamp/guard and app sync pass.
The DPR-1 browser attempt recorded 60 successful unique checks through rescue,
EN/RU completion, replay/reload, portrait inputs, simultaneous two-thumb use and
landscape pause. Its 30-minute wrapper timeout fired before landscape resume and
the final error check. **Overall browser gate failed.** No runtime errors were
recorded up to that point. The lower-DPR alternative was stopped after still
reporting 1 FPS; it is not acceptance evidence. Fresh DPR-1 physical bridge and
portrait replay captures were inspected independently of the incomplete run.
`verification-summary.json` reports counts and unresolved gates without promoting
partial evidence to a pass. Next wrapper invocation has a 40-minute ceiling.

## Open gates
Whole-opening art approval, later-level improvements, hands-on depth, child enjoyment,
and physical iPad performance remain open. Linux Web/app packaging is not Xcode or
device verification. No main merge, signing or live deployment is authorized here.
