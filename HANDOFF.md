# Philip Jeid Fabito portfolio — project handoff

Updated: 12 October 2026 (Asia/Manila).

## Start here

This is Philip's personalised portfolio, built from an existing portfolio template. Continue the existing implementation; do not rebuild it from scratch. The user has approved and implemented the current designs. There is no pending implementation request at handoff.

- Repository: https://github.com/pjfautomation/pjf-portfolio.git
- Local workspace: `C:/Users/phili/Documents/Projects/GHL-website-portfolio`
- Stack: React 19, TypeScript, Vite 6, React Router, plain CSS, GSAP, Three.js, Lenis.
- Install: `npm ci`
- Run: `npm run dev -- --host 127.0.0.1` (normally http://127.0.0.1:5173/).
- Build: `npm run build` (TypeScript check and Vite build).
- `predev` and `prebuild` generate strategy HTML and its manifest from the seven DOCX files in `public/strategy-documents/`; preserve the source documents.
- Git publishing is a source backup. Deployment to hosting has not been performed by this handoff.

## User preferences and content

- Botanical background visible in light and dark modes. Green panel gradients and green accents match the site theme.
- Services: GoHighLevel CRM, pipelines, landing pages, forms, campaigns and internal automation; n8n, Make.com and Zapier automation; Shopify/Amazon operations support; social media management.
- Location: “Based in the Philippines” / “GMT+8 · US hours”.
- LinkedIn destination requested: https://linkedin.com/in/philipjeidf. About link copy: “Let’s connect” / “Find me on LinkedIn”, with a green icon.
- Profile uses the transparent black-jacket portrait. Homepage About uses a transparent waving illustration.
- Certifications have readable labels and an in-site modal with navigation, rather than opening new tabs.
- Showcase navigation was removed. Testimonials became Work in Action.
- Do not generate new workflow mockup images unless requested. Implement the actual interactive UI.
- Keep client-facing copy clear. Do not invent client results or present simulated activity as real integrations.

## Main source map

- `src/main.tsx`: routes, lazy-loaded pages and CSS imports.
- `src/App.tsx`, `src/components/Rail.tsx`: desktop navigation/layout.
- `src/components/HomeBento.tsx`, `HomeMobile.tsx`: homepage surfaces.
- `src/components/AboutGrid.tsx`: About content, illustrations and certification gallery/modal.
- `src/components/ServicesGrid.tsx`: service copy and layout.
- `src/components/ProjectsGrid.tsx`, `StrategyLibrary.tsx`: projects and strategy documents.
- `src/data/profile.ts`, `ai-stack.ts`, `faqs.ts`: editable portfolio content.
- `src/styles/tokens.css`, `palette.css`, `global.css` and imported page styles: themes/layout.
- `src/hooks/useLenis.ts`: workflow routes use native scrolling.
- `public/certifications/`: HighLevel CRM, n8n, Make, Zapier and Prompt Engineering certificates.
- `public/backgrounds/`, `public/illustrations/`, `public/philip-*.png`: shipped visual assets.

## Work in Action architecture

Routes:

- `/work-in-action`: searchable workflow library.
- `/work-in-action/lead-journey`: Lead Journey System.
- `/work-in-action/appointment-care`: Appointment Care System.
- `/work-in-action/client-welcome`: Client Welcome System.

Files:

- `src/data/workflows.ts`: workflow types, registry, Lead Journey nodes and tool icons.
- `src/data/appointment-care.ts`: appointment scenarios, plans, fixture and graph.
- `src/data/client-welcome.ts`: welcome scenarios, plans, fixture and graph.
- `src/components/WorkflowLibrary.tsx`: registry-driven cards/search.
- `src/components/WorkflowDetail.tsx`: shared canvas, replay engine, node inspector, output picker, logs and breakdown. Keyed route replay resets state when switching workflows.
- `src/components/AppointmentOutputs.tsx`, `WelcomeOutputs.tsx`: scenario-specific previews. Lead Journey previews are inside WorkflowDetail.
- `src/styles/workflows.css`, `highlevel-workflow.css`, `appointment-care.css`: layout, HighLevel-inspired builder and output presentation.

All three are GoHighLevel-focused portfolio demos. Native-looking builder controls are illustrative; speed controls and replay animations are portfolio features. No HighLevel account, API, email or SMS service is connected.

Replay behavior:

- Active node outline runs first, then its connector animates, then the next node starts.
- Pause/resume and 1×/2×/4× work with remaining duration; reset/run again clear previous results.
- Outputs appear only after their producing step completes. Users can review completed outputs via tabs.
- Selected-node explanation stays alongside the canvas on desktop; mobile stacks the viewer below it.
- Output viewer has fixed height and fits its sample content without internal vertical scrolling.
- Pan, zoom, fit view, draggable nodes, keyboard controls, minimap, auto-follow, execution log and reduced-motion behavior are implemented.
- Wide desktop uses canvas left and inspector/output dock right. Tablet/mobile stack. Fit overview intentionally makes nodes smaller; default replay uses a readable zoom and follows active nodes.
- Desktop main scroll container is `#main-content`; mobile uses document scrolling.

### Lead Journey

Scenarios: Qualified lead, Needs more context, Email only.

HighLevel form → opportunity → Google Sheets webhook handoff → explicit readiness fields → If/Else discovery/nurture → Telegram webhook handoff → WhatsApp consent/number check → WhatsApp if available → HighLevel email.

Google Sheets and Telegram are external handoffs. Gmail represents a recipient inbox, not the workflow engine. Qualification is based on explicit fields, not an AI claim.

### Appointment Care

Scenarios: Upcoming appointment, Cancelled appointment, Last-minute booking.

Booking → confirmation → appointment-based 24-hour wait → active-status check → email reminder → 1-hour wait → status check → SMS reminder.

Cancellation interrupts the wait and exits through native HighLevel cancellation behavior. The cancellation card is a demo event marker, not a builder action. Late booking bypasses the past 24-hour reminder. Regular bookings only; rescheduling/recurring bookings are not modelled.

### Client Welcome

Scenarios: Intake submitted, Intake overdue, Clarification needed.

Won opportunity → welcome email → condition wait with two-day timeout → intake received check. Overdue ends after one reminder. Submitted intake → wait for human review → approval check → clarification email OR Ready for setup → assigned-user internal notification.

Intake receipt is supplied by a companion Form Submitted workflow updating contact fields. The intake card visualises that event, not an action that submits a form. The demo supplies the human review outcome; a real deployment needs an owner to set review fields. No automatic setup before approval. Only the approved branch changes the opportunity to Ready for setup; clarification is described as a pending review outcome.

## Verification and practical limitations

Latest implementation passed `npm run build`, scoped ESLint for the workflow code, Client Welcome scenario/output-fit checks, and the shared Lead Journey replay regression.

Reusable checks (require the dev server and installed Microsoft Edge):

```sh
node artifacts/verify-replay-workspace.cjs
node artifacts/verify-appointment-care.cjs
node artifacts/verify-client-welcome.cjs
```

Appointment Care's library-count assertion was updated to three workflows for this handoff. Earlier scenario verification covered cancellation, late booking, fixed previews and responsive behavior.

Checks use Playwright with `channel: 'msedge'`. Initial intro can take about 6.5 seconds in a fresh browser. Local screenshots/one-off editing scripts are ignored by Git; reusable checks are included.

Do not claim a full-repository lint pass, real screen-reader audit, measured Core Web Vitals or production integration validation. Unused legacy Showcase/Testimonial components still exist; routes use the newer library. Existing template README screenshots and text describe the original template, not every personalised change.

## Prompt to paste into a new chat

> Continue the Philip Jeid Fabito portfolio in this project. Read HANDOFF.md first, inspect git status and the relevant source files, and preserve the existing green botanical light/dark design. The project has three simulated GoHighLevel interactive workflows in Work in Action. Use frontend-design and React best practices when changing UI. Do not rebuild the site or generate images unless I ask. My next task is: [describe the next change].

Open the new chat in this same local project, or clone the repository and open that folder. The file transfers project context; the new chat does not need this entire conversation.
