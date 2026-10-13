# PJ website icon

Edited with the built-in imagegen tool on 14 October 2026.

Edit prompt: remove only the pure black outer canvas outside the rounded emerald square and replace it with genuine alpha transparency. Preserve the glossy green tile, its dark green interior, silver P, green J, bevels, highlights, and proportions. Keep clean edges without a black halo; output a square transparent PNG.

The selected master is `public/pj-logo-transparent.png`. Browser PNG icons are `favicon-pj-32.png` and `favicon-pj-64.png`; `favicon.ico` contains 16px, 32px, and 48px variants. The mobile touch icon is `apple-touch-icon-pj.png` at 180px.

Regenerate derived icons with `node scripts/make-site-icons.cjs <transparent-source.png>` using Sharp from the bundled runtime through `NODE_PATH`. All PNGs were checked for an alpha channel and non-opaque pixels. The old SVG remains on disk but is no longer linked by the main website.
