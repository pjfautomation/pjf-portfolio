const assert = require('node:assert/strict')
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://127.0.0.1:5173/work-in-action')
    await page.getByRole('link', { name: /AI Receptionist/i }).click()
    const command = page.locator('.journey-command')
    await command.getByRole('button', { name: 'Execute workflow', exact: true }).waitFor()
    const stage = await page.locator('.journey-canvas__stage').boundingBox()
    const previews = await page.locator('.reception-output-panel').boundingBox()
    const inspector = await page.locator('.journey-step').boundingBox()
    assert(previews.y >= stage.y + stage.height, 'App previews are below the canvas')
    assert(Math.abs(inspector.y - previews.y) < 2 && previews.x >= inspector.x + inspector.width, 'Live outputs sit beside Selected Step')
    assert.equal(await page.locator('.reception-gallery .reception-app').count(), 0, 'No app data before its step executes')
    assert.equal(await page.locator('.reception-output-slot').count(), 4, 'Four reserved tool previews')
    assert.equal(await page.locator('.reception-new-record').count(), 0)
    const node = await page.locator('[data-node="voice-webhook"]').boundingBox()
    assert.equal(Math.round(node.width), Math.round(node.height), 'n8n nodes are square')
    await command.getByRole('button', { name: 'Execute workflow', exact: true }).click()
    await page.locator('[data-node="voice-webhook"][data-status="Running"]').waitFor()
    assert.equal(await page.locator('.reception-gallery .reception-app').count(), 0, 'Running first step does not reveal output early')
    assert.equal(await page.locator('.hl-execution-ring').count(), 1)
    assert.equal(await page.locator('.reception-voice__reply').count(), 0, 'Response is not shown before completion')
    await page.locator('[data-transferring="true"]').waitFor({ state: 'attached' })
    await command.getByRole('button', { name: 'Pause' }).click()
    assert.equal(await page.locator('.reception-call').count(), 1, 'Completed webhook reveals call preview')
    assert.equal(await page.locator('.reception-calendar').count(), 0, 'Calendar remains hidden before its step completes')
    assert.equal(await page.locator('.reception-record').count(), 0, 'Airtable remains hidden before its step completes')
    assert.equal(await page.locator('.reception-email').count(), 0, 'Gmail remains hidden before its step completes')
    assert.equal(await page.locator('.hl-transfer').count(), 1)
    await command.getByRole('button', { name: '4× replay speed', exact: true }).click()
    await command.getByRole('button', { name: 'Resume' }).click()
    await command.getByRole('button', { name: 'Run again' }).waitFor({ timeout: 15000 })
    assert.match(await page.locator('.reception-calendar').innerText(), /Available appointment/)
    assert.equal(await page.locator('[data-node="book-calendar"]').getAttribute('data-status'), 'Skipped')
    assert.match(await page.locator('.reception-new-record').innerText(), /Availability inquiry/)
    assert.match(await page.locator('.reception-new-record').innerText(), /Not booked/)
    assert.equal(await page.locator('.reception-event').count(), 0, 'Availability never creates a booking')
    assert.match(await page.locator('.reception-voice__reply').innerText(), /No appointment is booked yet/)
    assert.match(await page.locator('.reception-call').innerText(), /I’ll review the options and use the booking link later/)
    assert.match(await page.locator('.reception-email').innerText(), /Your available consultation times/)
    assert.equal(await page.locator('.reception-email a').getAttribute('href'), 'https://example.com/book/consultation')
    const cases = [
      ['Book appointment', 'You’re booked for Thursday, October 15 at 11:00 AM', 'Confirmed · Google Meet', 'Booking confirmed'],
      ['Reschedule appointment', 'Your appointment has been moved', 'Rescheduled · Online consultation', 'Rescheduled'],
      ['Cancel appointment', 'Your appointment has been cancelled', 'Cancelled · calendar event removed', 'Cancelled'],
      ['Save call result', 'Your call notes have been saved', null, 'Call completed'],
    ]
    for (const [label, reply, calendar, record] of cases) {
      await command.getByRole('button', { name: label, exact: true }).click()
      assert.equal(await page.locator('.reception-gallery .reception-app').count(), 0, 'Scenario reset clears every preview')
      assert.equal(await page.locator('.reception-new-record').count(), 0, 'Scenario reset clears prior record')
      assert.equal(await page.locator('.reception-voice__reply').count(), 0)
      await command.getByRole('button', { name: 'Execute workflow', exact: true }).click()
      await command.getByRole('button', { name: 'Run again' }).waitFor({ timeout: 15000 })
      assert((await page.locator('.reception-voice__reply').innerText()).includes(reply))
      if (calendar) assert((await page.locator('.reception-calendar').innerText()).includes(calendar))
      if (record) assert((await page.locator('.reception-new-record').innerText()).includes(record))
      else assert.equal(await page.locator('.reception-new-record').count(), 0)
      if (label !== 'Save call result') {
        const subjects = { 'Book appointment': 'Your consultation is confirmed', 'Reschedule appointment': 'Your consultation has been rescheduled', 'Cancel appointment': 'Your consultation has been cancelled' }
        assert.match(await page.locator('.reception-email').innerText(), new RegExp(subjects[label]))
        assert.match(await page.locator('.reception-new-record').innerText(), /rec_demo_104/)
        assert.equal(await page.locator('[data-node="send-email"]').getAttribute('data-status'), 'Completed')
        const expectedLink = label === 'Cancel appointment' ? 'https://example.com/book/consultation' : 'https://example.com/meet/demo-104'
        assert.equal(await page.locator('.reception-email a').getAttribute('href'), expectedLink)
        if (label === 'Reschedule appointment') assert.match(await page.locator('.reception-new-record').innerText(), /15 Oct · 2:30 PM/)
      } else {
        assert.equal(await page.locator('.reception-email').count(), 0, 'Call logging does not send an appointment email')
        assert.equal(await page.locator('[data-node="send-email"]').getAttribute('data-status'), 'Skipped')
      }
      if (label === 'Book appointment') {
        const height = (await page.locator('.reception-output-panel').boundingBox()).height
        for (const tab of ['Calendar', 'Airtable', 'Gmail', 'Call conversation']) {
          await page.locator('.reception-output-panel').getByRole('button', { name: tab, exact: false }).click()
          assert.equal(await page.locator('.reception-app:visible').count(), 1, 'One tool preview visible at a time')
          assert.equal((await page.locator('.reception-output-panel').boundingBox()).height, height, 'Output space keeps its height')
        }
        await page.getByRole('button', { name: 'Fit view', exact: true }).click()
        await page.locator('#main-content').evaluate(el => { el.scrollTop = 0 })
        await page.waitForTimeout(300)
        await page.screenshot({ path: 'artifacts/reception-gallery-desktop.png', fullPage: true })
      }
    }
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 })
      await page.waitForTimeout(200)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No page overflow')
      const call = await page.locator('.journey-step').boundingBox()
      const calendar = await page.locator('.reception-output-panel').boundingBox()
      assert(calendar.y + 1 >= call.y + call.height, 'Live outputs stack beneath Selected Step on mobile')
    }
    await page.screenshot({ path: 'artifacts/reception-gallery-mobile.png', fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await command.getByRole('button', { name: 'Run again' }).click()
    await page.locator('[data-node="voice-webhook"][data-status="Running"]').waitFor()
    assert.equal(await page.locator('.hl-execution-ring rect').evaluate(el => getComputedStyle(el).animationName), 'none')
    assert.deepEqual(errors, [])
    console.log('n8n gallery passed: five scenarios, progressive outputs, reset, square nodes, execution animations, desktop/mobile layout and reduced motion.')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
