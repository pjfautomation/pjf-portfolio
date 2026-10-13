# n8n AI Receptionist interactive workflow

## Goal

Add one simulated n8n AI Receptionist workflow to Work in Action. It should show a believable voice-appointment automation and make the execution reasoning visible without implying live integrations.

## Design thesis

An operational n8n canvas: dark dotted grid, compact square node cards, distinct trigger/action/condition/webhook styling, and a calm green execution signal that travels from the active node around its border and along the selected edge to the next node.

## Scope

- Preserve all existing GoHighLevel workflow behavior and visual treatment.
- Generalize the workflow platform field to support GoHighLevel and n8n.
- Add the AI Receptionist workflow with these scenarios: check availability, book appointment, reschedule appointment, cancel appointment, and save call result.
- Reuse the existing replay engine, inspector, output picker, execution log, zoom/pan, keyboard controls, and responsive layout.
- Add n8n-specific labels, node metadata, colors, and sample outputs.
- Add focused Playwright coverage for the n8n library card, execution path, branch state, green execution classes, and responsive canvas.

## Explicit non-goals

- No real n8n, Vapi, Google Calendar, Airtable, voice, or API connection.
- No complete n8n node catalog.
- No replacement of the GHL canvas.
- No fabricated measured business results; business impact remains illustrative.

## Tasks

1. Add platform-aware types and the AI Receptionist fixture with deterministic sample data.
2. Add platform-aware canvas chrome and n8n node rendering while keeping the replay engine shared.
3. Add n8n styles and the rotating node/active-edge execution treatment with reduced-motion fallback.
4. Add browser regression coverage and update the repeatable full-suite runner and handoff.

## Verification

- Each task has a focused Playwright or existing regression check run before completion.
- `npm run lint` and `npm run build` pass.
- `node scripts/run-full-test-suite.mjs` passes in `APP_ENV=test` with the local simulated app only.
- Verify at 320px, 390px, 1366px, dark mode, keyboard canvas controls, pause/resume, and reduced motion.
