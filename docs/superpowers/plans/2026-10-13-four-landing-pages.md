# Four landing pages implementation plan

Goal: replace the six visible website placeholders with the four approved branded, interactive samples.

Spec: ../specs/2026-10-13-four-landing-pages-design.md and ../specs/2026-10-13-landing-page-visual-direction.md.

Architecture: standalone pages in public/samples share base CSS and a small script for theme and local forms. Each owns its composition and content. Keep the existing iframe modal and screenshot-backed barrel contract.

Tech: semantic HTML, CSS, vanilla JavaScript, local raster assets, React registry, Playwright Edge.

- [x] Add focused browser proof for local forms, ecommerce selection/cart, four samples and responsive/theme behavior; confirm missing pages fail.
- [x] Create separate photo assets for the four brands and a consistent Sand product variant.
- [x] Build Relay, Next Chapter, Sunday Home and Fieldwork with the approved exact offer and CTA contracts.
- [x] Replace websiteFunnel with four named sample entries; generate real rendered screenshots for barrel and homepage.
- [x] Run focused proof then full test suite under test environment; inspect desktop/mobile renders and fix observed issues.

Verification: `node artifacts/verify-landing-pages.cjs` passed; `node scripts/run-full-test-suite.mjs` passed. Review fixes covered long submitted-email overflow, live-region visibility, Sunday Home focus contrast, mobile purchase access and Relay's main landmark. Forms/cart are local demonstrations; no backend or separate unit-test framework is present.

Constraints: no external requests during form submission; no payment or real appointment; no fabricated testimonials, client logos or performance claims; no changes to the six funnel placeholders. Copy and images remain editable within each sample. Keep existing user changes.

Review focus: iframe theme inheritance; keyboard/form recovery; quantity boundaries and stale cart; mobile overflow; thumbnail URLs after registry replacement.
