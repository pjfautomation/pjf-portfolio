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

      if (viewport.width < 1100) {
        for (const cardName of ['projects', 'quotes']) {
          const card = page.locator(`.bento__card--${cardName}`)
          await card.scrollIntoViewIfNeeded()
          const image = card.locator('.bento__shot img').first()
          await image.evaluate(async image => { await image.decode() })
          const geometry = await card.evaluate(card => {
            const media = card.querySelector('.bento__reel')
            const image = card.querySelector('.bento__shot img')
            return { media: media.clientWidth, image: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height, loaded: image.naturalWidth > 0 }
          })
          assert.equal(geometry.loaded, true)
          assert.ok(Math.abs(geometry.media - geometry.image) <= 1, `${cardName}: preview must fit the card width`)
          assert.ok(geometry.height > 100 && geometry.height < 300, `${cardName}: preview must be readable, not oversized`)
          await card.locator('.bento__reel').evaluate(e => { e.scrollLeft = e.clientWidth + 12 })
          await card.locator('.bento__shot img').nth(1).evaluate(async image => { await image.decode() })
          await card.screenshot({ path: `artifacts/home-${cardName}-${viewport.width}.png` })
        }
        const ai = page.locator('.bento__card--ai')
        await ai.scrollIntoViewIfNeeded()
        assert.equal(await ai.locator('.bento__chip:visible').count(), 4)
        assert.ok(await ai.locator('.bento__chip:visible').evaluateAll(chips => chips.every(chip => chip.scrollWidth <= chip.clientWidth + 1)))
        await ai.screenshot({ path: `artifacts/home-ai-${viewport.width}.png` })
      }

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
