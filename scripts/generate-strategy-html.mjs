import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import mammoth from 'mammoth'

const root = process.cwd()
const sourceDirectory = resolve(root, 'public/strategy-documents')
const outputDirectory = resolve(sourceDirectory, 'rendered')
const manifestFile = resolve(root, 'src/generated/strategyManifest.ts')

const files = (await readdir(sourceDirectory))
  .filter((file) => file.toLowerCase().endsWith('.docx'))
  .sort()

await mkdir(outputDirectory, { recursive: true })
await mkdir(resolve(root, 'src/generated'), { recursive: true })

for (const file of files) {
  const buffer = await readFile(resolve(sourceDirectory, file))
  const result = await mammoth.convertToHtml({ buffer })
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #14233f; background: #ffffff; }
*, *::before, *::after { box-sizing: border-box; }
html, body { max-width: 100%; overflow-x: hidden; }
body { margin: 0; padding: 3rem clamp(1.25rem, 5vw, 5rem) 5rem; background: #ffffff; font-size: 1rem; line-height: 1.7; }
article { max-width: 60rem; margin: 0 auto; }
h1, h2, h3 { color: #0b1d3a; line-height: 1.2; margin: 2.2rem 0 .85rem; }
h1 { font-size: clamp(1.55rem, 3vw, 2.25rem); } h2 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); } h3 { font-size: 1.2rem; }
p { margin: 0 0 1rem; color: #506684; } strong { color: #14233f; }
table { width: 100%; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 1.5rem 0; font-size: .95rem; overflow-wrap: anywhere; }
th, td { max-width: 0; border: 1px solid #cfe1d8; padding: .75rem; text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: break-word; } th { background: #edf8f1; color: #14233f; }
ul, ol { color: #506684; padding-left: 1.4rem; } li { margin: .35rem 0; }
a { color: #147a49; }
pre, code { max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; }
img { max-width: 100%; height: auto; }
</style></head><body><article>${result.value}</article></body></html>`
  await writeFile(resolve(outputDirectory, file.replace(/\.docx$/i, '.html')), html)
}

await writeFile(
  manifestFile,
  `// Generated from the read-only source files in public/strategy-documents.\nexport const STRATEGY_RENDERED_FILES = new Set<string>(${JSON.stringify(files.map((file) => file.replace(/\.docx$/i, '.html')))})\n`,
)

console.log(`Generated HTML for ${files.length} strategy documents.`)
