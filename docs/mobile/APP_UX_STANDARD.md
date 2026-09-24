# Junior Disciples App UX Standard

This app inherits Mike's Faithful Study baseline and adapts it to Bible learning for children.

## North star

Apple-level visual discipline + Duolingo-style progression + Brilliant-style interaction + Khan Academy-style educational clarity + Linear-level product polish.

The goal is not to make a screen merely look impressive. A child should be able to use it independently without repeatedly wondering:

- What should I do?
- Where should I tap?
- How much is left?
- Was that correct?
- Why am I doing this?
- What happens next?

## Core learning loop

**See → Do → Feedback → Learn → Do → Progress**

Prefer short teaching plus meaningful interaction over long reading walls. Give a focused hint before revealing help. Make progress visible and celebrate real mastery rather than repeated clicking.

## Required product contracts

1. One obvious next action on every primary screen.
2. Low cognitive load and progressive disclosure.
3. Visible completion, stars, and continuation state.
4. Staged, child-friendly lesson content.
5. Touch targets of at least 44 points; primary controls should be larger.
6. Accessible contrast, zoom, focus, labels, and status feedback.
7. Full English/Russian parity with readable Cyrillic typography.
8. iPad landscape and portrait are primary; phone remains fully supported.
9. Landscape learning uses scene-left / interaction-right where appropriate.
10. Portrait learning uses scene-top / interaction-bottom.
11. Active games hide general navigation but retain visible Exit/Pause controls.
12. Offline and blocked-storage states degrade safely.
13. Parent-only actions and external links require a meaningful parent gate.
14. Real rendered QA is required; source inspection alone is insufficient.
15. Do not regress below the established 75/80 child-independent UX baseline.

## App shell behavior

- Portrait uses a five-item bottom navigation: Today, Journey, Practice, Progress, Explore.
- iPad/landscape converts that navigation into a compact left rail.
- Today prioritizes one required Next Step, the current unit truth, visible progress, and the next three ordered steps.
- Journey is the authoritative sequence; Practice only shows relevant unlocked reinforcement; Explore is the optional full library.
- The website retains its discovery-oriented header, hero, long homepage, and footer.
- The app does not use a forced hero video as a loading gate.
- A native splash must be instant and static; optional motion may be nonblocking and must respect Reduce Motion.

## Implementation order

1. Visual fidelity
2. Student flow
3. Reusable architecture
4. Interaction polish
5. Persistence
6. Parent reporting
7. Backend abstraction

Do not trade away the child-facing experience for backend convenience or generic dashboard patterns.
