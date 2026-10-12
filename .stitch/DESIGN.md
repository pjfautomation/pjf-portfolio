---
name: Mint Glass Portfolio Reference
colors:
  surface: '#F4FBF7'
  surface-container: '#FFFFFF'
  on-surface: '#111C35'
  on-surface-variant: '#657489'
  primary: '#087D56'
  on-primary: '#FFFFFF'
  outline-variant: '#DCE9E3'
  secondary: '#FF8000'
  tertiary: '#7950FF'
  info: '#0799ED'
---

# Design System: Mint Glass Portfolio Reference

Source: user-attached screenshot `codex-clipboard-b03474c4-3f0b-4b8d-b761-995813f00355.png`.
This is a visual reconstruction, not an extraction from the reference's source code.
All reference colors, sizes, transparency, blur, and font assignments below are estimates or suggested implementation values. Background compositing prevents precise recovery of glass opacity and blur from a screenshot.
The repository now uses self-hosted Manrope, applied at the user's request after this extraction. This does not establish the screenshot's original font.

## 1. Visual Theme & Atmosphere

Light botanical mint background, translucent white panels, navy text, restrained emerald actions. Soft boundaries and gentle depth keep the dense portfolio readable. Outer sections are broad glass containers; nested cards have stronger surfaces and more distinct edges.

## 2. Color Palette & Roles

| Role | Suggested value | Purpose |
| --- | --- | --- |
| Mint canvas | #F4FBF7 | Base behind botanical imagery |
| Glass section | rgba(255,255,255,0.68) | Large section surfaces |
| Nested surface | rgba(255,255,255,0.88) | Project details and pills |
| Navy | #111C35 | Headings, primary text |
| Slate | #657489 | Supporting text |
| Emerald | #087D56 | Primary CTA and active navigation |
| Orange | #FF8000 | Projects, Services, About icon tiles |
| Purple | #7950FF | Work in Action and workflow accents |
| Blue | #0799ED | Secondary arrows and GHL service accents |
| Pale edge | #DCE9E3 | Nested borders and separators |

Accent colors indicate component purpose, not error or warning states. Error/disabled states are not visible in the reference and must be designed separately.

## 3. Typography Rules

Closest visual candidate: Manrope. Plus Jakarta Sans is another plausible match. Exact identification requires the original page or font files.

| Usage | Suggested size | Weight | Line height |
| --- | --- | --- | --- |
| Hero | 48–56px | 800 | 1.05–1.12 |
| Section headings | 19–21px | 700 | 1.25 |
| Nested card titles | 14–16px | 700 | 1.3 |
| Body | 14–15px | 400–500 | 1.5 |
| Secondary labels | 12–13px | 400–500 | 1.4 |
| Tool tags | 10–11px | 500 | 1.3 |
| Eyebrows | 10–11px | 700 | 1.3 |

Keep headings slightly tightly tracked; uppercase metadata uses modest positive tracking. Do not shrink supporting copy to force a viewport fit.

## 4. Component Stylings

### Large section panel

- Rounded rectangular glass surface, approximately 24–28px corner radius.
- Suggested 18–24px inner padding, 1px translucent white border.
- Suggested backdrop blur 16–20px; screenshot cannot confirm its amount.
- Suggested shadow: `0 12px 32px -20px rgba(15,56,38,0.20)` plus a subtle inset white highlight.
- Header: 40px colored icon tile; title and description stacked alongside it; optional right-aligned secondary action.

### Project preview card

- Approximately 18–20px radius, thin pale border and restrained shadow.
- Large image above a more opaque white detail area.
- Brand badge overlays the image's lower edge.
- Detail area: 14–16px inset, bold title, muted category and outlined circular blue arrow.
- Reuse image aspect ratios and object-fit rather than stretching source images.

### Service card

- Approximately 22–24px radius; pale mint, blue, or lavender tint by service.
- Top row: brand icon in a small white rounded tile; compact outlined service action.
- Middle: bold service title and a short readable description.
- Bottom: hairline separator, uppercase Tools Used label, wrapping outlined tool tags.
- Align the header and footer zones across cards; let descriptions wrap naturally.

### Media / Work in Action card

- Pale lavender-to-mint surface inside a purple-accent section.
- Rounded 18–20px boundary; walkthrough label at top left and navy circular play action at top right.
- Status text anchored near the bottom. Do not invent completed videos or durations.

### About card

- Portrait on one side, readable biography on the other, skill tags below.
- Photo approximately 16px corner radius. Experience overlay is translucent and must only contain verified information.

### Contact card

- Emerald section icon, short introduction, inset glass information panel.
- Small icon/text metadata and separated checklist rows.
- Solid emerald pill CTA with white type, approximately 42–46px high.

### Pills, controls and navigation

- Pills use near-white surfaces, pale hairline borders and small diffused shadows.
- Primary buttons and active navigation are solid emerald; secondary actions stay white and outlined.
- Search field is inset within a glass capsule; its icon and text are muted slate.
- Hover lift and focus outlines are suggested interaction behavior, not recoverable from a still image.

## 5. Layout Principles

Reference: left sidebar, broad content column, project and services sections in the upper row, About / Work in Action / Contact below. It uses both outer section panels and smaller content cards with distinct visual roles.

Suggested spacing system: 4px base, 8–12px inside small groups, 12–16px between nested cards, 18–24px inside large sections. Keep cards aligned by shared headers and footers rather than fixed text heights.

Responsive behavior is not shown in the screenshot. Suggested reconstruction: stack sections on smaller screens, retain readable minimum widths and allow natural scrolling. Preserve keyboard focus, reduced-motion preferences, and sufficient contrast over changing backgrounds.

## 6. Design System Notes for Stitch Generation

Use language such as: calm botanical glass, navy hierarchy, emerald primary actions, orange section markers, pale tinted service cards, purple media accents and delicate outlined pills.

Example prompts:
- Create a translucent mint portfolio section with an orange icon tile and image-led project cards, each with a brand badge and clear navy title.
- Create three aligned service cards in mint, blue and lavender, with tool tags separated from the description by a thin divider.

This document is a reference specification only. It does not change the current website or validate the screenshot's personal claims.
