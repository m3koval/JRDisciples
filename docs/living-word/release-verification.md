# Living Word release verification

User authorized publication in Slack: “This should be published...”

Final presentation revision (duplicate overlay titles removed, iPad portrait stacked layout) verified before publication:
- `node scripts/check-living-word.cjs`: PASS, including 14 exact ESV/RST quotations and complete bilingual copy shape.
- `npm run check:bilingual` and `npm run check:scripture`: PASS.
- `npm run lint`: PASS with existing site warnings.
- `npm run build`: PASS.
- Production-server browser run: 217/217 checks, zero runtime errors, EN/RU, phone, iPad portrait/landscape, desktop.
- Additional resilience run: 4/4 checks, touch flow under stale readable storage with quota failure, visible storage warning, 44px button targets, keyboard and already-loaded offline activity.
- Final Russian iPad portrait screenshot inspected: no clipped/duplicated heading; readable single-column layout.

Independent theological review and resolution notes remain alongside this record. Artwork is reused existing Junior Disciples artwork, not a new generated pack. Local runtime testing does not certify a physical iPad or offline cold start.

Production status is to be verified separately against the canonical URL after the release pipeline completes.
