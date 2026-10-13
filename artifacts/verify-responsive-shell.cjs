const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const viewports = [
  { name: 'small mobile', width: 320, height: 640 },
  { name: 'large mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1366, height: 768 },
]

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport })
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))

      await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(1200)
      assert.equal(errors.length, 0, `${viewport.name}: homepage page errors: ${errors.join('; ')}`)
      assert.equal(await page.locator('#home-title').count(), 1, `${viewport.name}: homepage title missing`)
      assert.equal(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth), true, `${viewport.name}: horizontal overflow`)
      const contactAction = viewport.width < 1100
        ? page.locator('.tabbar__tab--primary')
        : page.locator('.home__cta')
      assert.equal(await contactAction.count(), 1, `${viewport.name}: responsive contact action missing`)

      await page.goto('http://127.0.0.1:5173/work-in-action', { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(800)
      assert.equal(errors.length, 0, `${viewport.name}: workflow page errors: ${errors.join('; ')}`)
      assert.equal(await page.getByRole('heading', { name: /see the systems/i }).count(), 1, `${viewport.name}: workflow heading missing`)
      assert.equal(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth), true, `${viewport.name}: workflow horizontal overflow`)
      await page.close()
    }
    console.log('Responsive shell verified: homepage and workflow page at small mobile, large mobile and desktop widths.')
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
