import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

// Render only the four portfolio concepts; never rewrite unrelated screenshots.
const slugs = ['relay-studio', 'next-chapter', 'sunday-home', 'fieldwork']
mkdirSync('public/samples/thumbs', { recursive: true })
mkdirSync('public/home', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, colorScheme: 'light' })
    await page.goto(`http://127.0.0.1:5173/samples/${slug}.html`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.images].filter(img => img.loading !== 'lazy').every(img => img.complete && img.naturalWidth > 0))
    await page.screenshot({ path: `public/samples/thumbs/${slug}.jpeg`, type: 'jpeg', quality: 82 })
    await page.setViewportSize({ width: 1080, height: 720 })
    await page.screenshot({ path: `public/home/samples-${slug}.jpeg`, type: 'jpeg', quality: 78 })
    await page.close()
  }
  console.log('Rendered four landing page thumbnails and homepage previews.')
} finally { await browser.close() }
