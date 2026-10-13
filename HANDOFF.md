# Philip Jeid Fabito portfolio — project handoff

Updated: 13 October 2026 (Asia/Manila).

## Start here

This is Philip's personalised portfolio, built from an existing portfolio template. Continue the existing implementation; do not rebuild it from scratch. The user has approved and implemented the current designs. There is no pending implementation request at handoff.

- Repository: https://github.com/pjfautomation/pjf-portfolio.git
- Local workspace: `C:/Users/phili/Documents/Projects/GHL-website-portfolio`
- Stack: React 19, TypeScript, Vite 6, React Router, plain CSS, GSAP, Three.js, Lenis.
- Install: `npm ci`
- Run: `npm run dev -- --host 127.0.0.1` (normally http://127.0.0.1:5173/).
- Build: `npm run build` (TypeScript check and Vite build).
- `predev` and `prebuild` generate strategy HTML and its manifest from the seven DOCX files in `public/strategy-documents/`; preserve the source documents.
- GitHub remote is `pjfautomation/pjf-portfolio`. Vercel project `pjf-portfolio` uses `npm run build`, output `dist`, and filesystem-first SPA routing from `vercel.json`. Production publishing is available with `vercel --prod` from this linked checkout. Vercel's GitHub integration could not connect during setup; Git pushes and CLI publishing work independently.

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

## Portfolio landing pages

The Projects website barrel now contains four fictional landing-page brands instead of six website placeholders: Relay Studio (agency), Next Chapter (career coach), Sunday Home (home cleaning), and Fieldwork (backpack ecommerce). They are standalone pages in `public/samples/`, listed by `websiteFunnel` in `src/data/funnels.ts`; the existing iframe modal opens them. They use `landing.css`, `landing.js`, local Manrope fonts and generated image assets under `public/samples/assets/`.

The three service forms validate fields and display a local request summary. Fieldwork supports Graphite/Sand, front/interior views, quantity 1–5 and a local cart/checkout preview. These do not send requests, book appointments or process payments. Sample pages inherit the parent theme on open and have their own theme toggle.

Run `node scripts/make-landing-thumbs.mjs` with Vite running to regenerate only the four barrel thumbnails and homepage previews. Run `node artifacts/verify-landing-pages.cjs` for the focused browser regression; it is included in the full suite. Existing unrelated funnel placeholders and unused website files remain on disk.

Requirements and visual direction are in `docs/superpowers/specs/2026-10-13-four-landing-pages-design.md` and `docs/superpowers/specs/2026-10-13-landing-page-visual-direction.md`.

## Projects automation gallery

The Projects “Workflow systems” dialog preserves the scrolling showcase with 11 real projects (six n8n, two Make.com, three Zapier), replacing the placeholder images. `src/data/automation-gallery.ts` lists the projects. `WorkflowSamples.tsx` renders floating screenshot windows with SVG platform badges and a continuous desktop strip. Hover and focus do not pause it; clicking a screenshot pauses while the native image dialog is open, and closing resumes. Mobile and reduced motion use manual horizontal scrolling. The image viewer links RAG, HR and appointment projects to their existing simulated demos. Platform filtering was intentionally replaced by the scrolling behavior at the user's request.

Optimized assets live in `public/automation-gallery/`. Regenerate with `node scripts/make-automation-gallery.cjs <source-directory>` using Sharp from the bundled dependency runtime through `NODE_PATH`; original source images remain untouched. The extensionless Gmail attachment image is supported. Run `node artifacts/verify-automation-gallery.cjs`; this check is included in the full test runner.

## Work in Action architecture

Routes:

- `/work-in-action`: searchable workflow library.
- `/work-in-action/lead-journey`: Lead Journey System.
- `/work-in-action/appointment-care`: Appointment Care System.
- `/work-in-action/client-welcome`: Client Welcome System.
- `/work-in-action/ai-receptionist`: AI Receptionist voice appointment setter (simulated n8n workflow).
- `/work-in-action/basic-rag`: Basic RAG System, document-grounded chat and knowledge sync (simulated n8n workflow).
- `/work-in-action/hr-assistant`: HR Evaluation & Job Posting Assistant with AI, the third simulated n8n demo.

Files:

- `src/data/workflows.ts`: workflow types, registry, Lead Journey nodes and tool icons.
- `src/data/appointment-care.ts`: appointment scenarios, plans, fixture and graph.
- `src/data/client-welcome.ts`: welcome scenarios, plans, fixture and graph.
- `src/data/n8n-receptionist.ts`: n8n AI Receptionist scenarios, deterministic fixture and graph.
- `src/data/basic-rag.ts`, `src/components/RagOutputs.tsx`, `src/styles/rag-workflow.css`: Basic RAG graph, fixed scenarios, chat/source/Drive/chunk/Supabase previews.
- `src/data/hr-assistant.ts`, `src/components/HrOutputs.tsx`, `src/styles/hr-workflow.css`: HR scenarios, evidence packets, applicant records, emails, Calendar and job posting previews.
- `src/components/WorkflowLibrary.tsx`: registry-driven cards/search.
- `src/styles/workflow-library.css`: compact light/dark gallery, opaque card surfaces, mint/emerald actions, coral n8n badges, workflow-specific thumbnail diagrams. All six workflows now use image thumbnails from `public/workflow-thumbnails/`. Filters are platform-based (All workflows, GHL, n8n) and combine with search; mobile uses one column.
- `src/components/WorkflowDetail.tsx`: shared canvas, replay engine, node inspector, output picker, logs and breakdown. Keyed route replay resets state when switching workflows.
- `src/components/AppointmentOutputs.tsx`, `WelcomeOutputs.tsx`: scenario-specific previews. Lead Journey previews are inside WorkflowDetail.
- `src/styles/workflows.css`, `highlevel-workflow.css`, `n8n-workflow.css`, `appointment-care.css`: layout, platform-specific builders and output presentation.

The three original demos are GoHighLevel-focused; AI Receptionist, Basic RAG System and HR Assistant are n8n-inspired simulated workflows. Native-looking builder controls, speed controls and replay animations are portfolio features. No HighLevel, n8n, Vapi, Calendar, Airtable, OpenRouter, Google Drive or Supabase service is connected.

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

### AI Receptionist

Live outputs occupy one fixed-height viewer beside Selected Step below the n8n builder, matching the GHL arrangement. Only completed tools get tabs (Call conversation, Calendar, Airtable); one preview is visible at a time. Raw data stays in the selected-step disclosure. Mobile stacks the viewer below Selected Step. Reset and scenario changes clear all previews. Tests verify completion gating, tab switching, stable viewer height and responsive placement.

Scenarios: Check availability, Book appointment, Reschedule appointment, Cancel appointment, Save call result.

Availability remains an inquiry: 10:30 AM is busy, offered slots are 11:00 AM and 2:30 PM, and no booking is created. It logs an Airtable inquiry and sends a simulated Gmail options email with an example booking link. Booking logs a confirmed appointment; rescheduling/cancellation update the same record (`rec_demo_104`) and send the matching Gmail confirmation. Call-results logging sends no appointment email. `RECEPTION_RESULTS` supplies shared, scenario-specific voice, email and record text. Every preview is gated on its producing step completing.

The n8n builder occupies the full width and uses square SVG-icon nodes with side ports, labels underneath and curved connections. `src/components/ReceptionIcon.tsx` supplies local SVG icons. `ReceptionOutputs.tsx` contains the tabbed conversation, Calendar agenda and Airtable previews in the dock beside Selected Step. The execution log follows the dock. The focused n8n test covers all five scenarios, reset, completion gating, tabs, node geometry and responsive ordering.

n8n webhook → JavaScript argument normalization → explicit tool router → Google Calendar availability/mutation or Airtable call log → Respond to Webhook. The n8n canvas uses a dark dotted grid, typed node styling, a green rotating outline on the running node, and a green transfer path on the selected edge.

Vapi, Google Calendar and Airtable are illustrative tool contracts backed by deterministic fictional data. Production work still needs credentials, timezone validation, idempotency, retries, consent and failure handling.

### Basic RAG System

Scenarios: Ask a supported question, No matching source, Add a document, Update a document, Archive a document. Chat path: trigger → agent retrieval request → active document search → evidence check → OpenRouter generation and cited response, or no-source fallback. Document path: Drive event → read → split → embed → replace/index chunks → sync result; archive removes the file’s chunks. Each scenario resets its fictional database fixture. First indexing creates 3 v1 chunks, an edit replaces 3 v1 chunks with 4 v2 chunks, and archiving removes 3 v1 chunks. There are no real model, Drive or Supabase calls.

Selected Step sits beside one fixed-height Live Outputs viewer below the full-width n8n builder. Tabs appear only after the producing step completes. Chat shows the source citation; Sources shows the passage. Drive, Document chunks and Supabase show maintenance results. Raw sample input/output stays in the selected-step disclosure. Tests cover all five scenarios, no invented citation, completion gating, reset and mobile stacking. The library now contains six workflows.

### HR Evaluation & Job Posting Assistant

Scenarios: Prepare applicant review, Ask a follow-up question, Approved interview, Draft a job posting, Approved job posting. The applicant path extracts job-related CV evidence, prepares a human review packet, and branches using a recruiter-supplied action. Pending review sends no invitation; missing details get a clarification; approved interviews use a confirmed sample slot before Calendar and Gmail. All applicant paths update the same application ID. Hiring decisions are not automated or scored. The separate job-brief path drafts a posting; unapproved drafts remain internal, while the approved fixture shows a simulated careers-page publication.

Uses the same n8n canvas and fixed Live Outputs viewer beside Selected Step. Preview tabs are completion-gated. Data, approvals, interview links and publication are fictional; no live applicant, email or job board integration exists. There are now six workflows: three GHL and three n8n demos.

## Verification and practical limitations

Latest implementation passed `npm run build`, scoped ESLint for the workflow code, Client Welcome scenario/output-fit checks, and the shared Lead Journey replay regression.

Reusable checks (require the dev server and installed Microsoft Edge):

```sh
node artifacts/verify-replay-workspace.cjs
node artifacts/verify-appointment-care.cjs
node artifacts/verify-client-welcome.cjs
node artifacts/verify-n8n-receptionist.cjs
node artifacts/verify-basic-rag.cjs
node artifacts/verify-hr-assistant.cjs
node artifacts/verify-workflow-library.cjs
node artifacts/verify-responsive-shell.cjs
```

The full isolated suite is also available as `node scripts/run-full-test-suite.mjs`; it runs lint, build/typecheck, all workflow regressions, the n8n receptionist regression and the responsive shell check under `APP_ENV=test`. This project has no backend/database integration in the simulated workflow surface; no production database or API key is used.

Appointment Care's library-count assertion is six workflows. Earlier scenario verification covered cancellation, late booking, fixed previews and responsive behavior. The n8n regressions cover selected branches, green node/edge execution, completion-gated tool previews, mobile overflow and reduced motion.

Checks use Playwright with `channel: 'msedge'`. Initial intro can take about 6.5 seconds in a fresh browser. Local screenshots/one-off editing scripts are ignored by Git; reusable checks are included.

Do not claim a full-repository lint pass, real screen-reader audit, measured Core Web Vitals or production integration validation. Unused legacy Showcase/Testimonial components still exist; routes use the newer library. Existing template README screenshots and text describe the original template, not every personalised change.

## Prompt to paste into a new chat

> Continue the Philip Jeid Fabito portfolio in this project. Read HANDOFF.md first, inspect git status and the relevant source files, and preserve the existing green botanical light/dark design. Work in Action has three simulated GoHighLevel workflows and three n8n demos: AI Receptionist, Basic RAG System and HR Assistant. Use frontend-design and React best practices when changing UI. Do not rebuild the site or generate images unless I ask. My next task is: [describe the next change].

Open the new chat in this same local project, or clone the repository and open that folder. The file transfers project context; the new chat does not need this entire conversation.
