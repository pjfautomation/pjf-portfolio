const assert = require('node:assert/strict')
const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const cases = [
      ['relay-studio', 'Give every inquiry a clear next step.'],
      ['next-chapter', 'Make your next career move with a plan.'],
      ['sunday-home', 'Come home to a clean space.'],
      ['fieldwork', 'One bag for the day ahead.'],
    ]
    for (const [slug, headline] of cases) {
      await page.goto(`http://127.0.0.1:5173/samples/${slug}.html`)
      assert.equal(await page.locator('h1').innerText(), headline)
      assert.notEqual(await page.locator('[role="status"]').evaluate(el => getComputedStyle(el).display), 'none', 'Empty live region stays exposed')
      if (slug === 'relay-studio') assert.equal(await page.locator('main #contact').count(), 1)
      if (slug === 'fieldwork') {
        await page.setViewportSize({ width: 390, height: 844 })
        const shortcut = page.getByRole('link', { name: 'Choose options', exact: true })
        assert((await shortcut.boundingBox()).y < 844, 'Mobile purchase shortcut is in initial viewport')
        await page.setViewportSize({ width: 1440, height: 960 })
      }
      await page.waitForFunction(() => [...document.images].filter(img => img.loading !== 'lazy').every(img => img.complete && img.naturalWidth > 0))
      if (slug !== 'fieldwork') {
        await page.locator('a[href="#contact"]').first().click()
        const form = page.locator('form')
        await form.getByRole('button', { name: /review|request|quote/i }).click()
        assert.equal(await form.locator('[aria-invalid="true"]').count() >= 3, true, 'Empty requests show field errors')
        await form.locator('[name="name"]').fill('Alex Rivera')
        await form.locator('[name="email"]').fill('alex')
        await form.getByRole('button', { name: /review|request|quote/i }).click()
        assert.match(await page.locator('#email-error').innerText(), /valid email/)
        await form.locator('[name="email"]').fill('alex@example.com')
        if (slug === 'sunday-home') {
          await form.locator('[name="area"]').fill('Quezon City')
        } else {
          await form.locator('textarea').fill('I need a clear plan for my next step.')
        }
        await form.getByRole('button', { name: /review|request|quote/i }).click()
        assert.match(await page.locator('[role="status"]').innerText(), /Alex Rivera/)
        assert.match(await page.locator('[role="status"]').innerText(), /No request was sent/)
        await page.reload()
        assert.equal(await page.locator('[name="email"]').inputValue(), '')
        await page.setViewportSize({ width: 320, height: 844 })
        await form.locator('[name="name"]').fill('Alex Rivera')
        await form.locator('[name="email"]').fill('alexander.rivera@longbusinessdomain.com')
        if (slug === 'sunday-home') await form.locator('[name="area"]').fill('Quezon City')
        else await form.locator('textarea').fill('Please help with my next step.')
        await form.getByRole('button', { name: /review|request|quote/i }).click()
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Long submitted email fits mobile')
        await page.setViewportSize({ width: 1440, height: 960 })
      } else {
        await page.getByRole('button', { name: 'Inside the bag', exact: true }).click()
        assert.match(await page.locator('#product-image').getAttribute('alt'), /interior/)
        await page.getByRole('button', { name: 'Sand', exact: true }).click()
        await page.locator('#quantity').selectOption('2')
        await page.getByRole('button', { name: 'Add to bag', exact: true }).click()
        assert.match(await page.locator('[role="status"]').innerText(), /2 × Fieldwork Daypack · Sand · \$178/)
        await page.getByRole('button', { name: 'Preview checkout' }).click()
        assert.match(await page.locator('[role="status"]').innerText(), /No payment was taken/)
        await page.getByRole('button', { name: 'Graphite', exact: true }).click()
        assert.equal(await page.locator('[role="status"]').innerText(), '')
        await page.getByLabel('Quantity').selectOption('5')
        await page.getByRole('button', { name: 'Add to bag', exact: true }).click()
        assert.match(await page.locator('[role="status"]').innerText(), /5 × Fieldwork Daypack · Graphite · \$445/)
      }
      await page.getByRole('button', { name: 'Switch to dark theme' }).click()
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
      await page.screenshot({ path: `artifacts/${slug}-dark.png`, fullPage: true })
      await page.getByRole('button', { name: 'Switch to light theme' }).click()
      await page.screenshot({ path: `artifacts/${slug}-desktop.png`, fullPage: true })
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 })
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} fits ${width}`)
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await page.screenshot({ path: `artifacts/${slug}-mobile.png`, fullPage: true })
      await page.setViewportSize({ width: 1440, height: 960 })
    }
    await page.goto('http://127.0.0.1:5173/projects')
    await page.getByRole('button', { name: 'View Conversion-ready websites', exact: true }).click()
    const samples = page.locator('.funnels__barrel-a11y button')
    await samples.first().waitFor({ state: 'attached' })
    assert.deepEqual(await samples.allTextContents(), [
      'Open Relay Studio · Agency (Website)',
      'Open Next Chapter · Coaching (Website)',
      'Open Sunday Home · Cleaning (Website)',
      'Open Fieldwork · Ecommerce (Website)',
    ])
    await samples.first().focus()
    await page.keyboard.press('Enter')
    await page.frameLocator('.funnels__modal-iframe').locator('h1').waitFor()
    assert.equal(await page.frameLocator('.funnels__modal-iframe').locator('h1').innerText(), 'Give every inquiry a clear next step.')
    assert.deepEqual(errors, [])
    console.log('Landing pages passed: copy, local forms, cart fixtures, themes and responsive layouts.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
