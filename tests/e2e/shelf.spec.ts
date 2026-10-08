import { expect, test } from '@playwright/test'
import { spine, openShelves } from './helpers'

test.beforeEach(async ({ page }) => {
  await openShelves(page)
})

test('shows two shelves of books', async ({ page }) => {
  await expect(page.locator('.bks-bookcase__row')).toHaveCount(2)
  await expect(page.locator('.bks-spine')).toHaveCount(60)
  await expect(page.getByRole('list', { name: 'Classic Fiction' })).toBeVisible()
})

test('labels each spine with title, author and price', async ({ page }) => {
  await expect(spine(page, 'Middlemarch')).toHaveAccessibleName('Middlemarch by George Eliot, $24.99')
})

test('raises a price slip when a spine is hovered or focused', async ({ page }) => {
  const slip = spine(page, 'Les Misérables').locator('.bks-spine__price')
  await expect(slip).toHaveCSS('opacity', '0')
  await spine(page, 'Les Misérables').hover()
  await expect(slip).toHaveCSS('opacity', '1')
  await expect(slip).toHaveText('$27.99')

  await page.mouse.move(0, 0)
  await spine(page, 'Pride and Prejudice').focus()
  await page.keyboard.press('Tab')
  await expect(spine(page, 'Jane Eyre')).toBeFocused()
  await expect(spine(page, 'Jane Eyre').locator('.bks-spine__price')).toHaveCSS('opacity', '1')
})

test('turns a hovered book to face the visitor and moves its neighbours aside', async ({ page }) => {
  const book = spine(page, 'Middlemarch')
  const next = spine(page, 'Great Expectations')
  const before = { book: (await book.boundingBox())!, next: (await next.boundingBox())! }

  await book.hover()
  // The slot widens from the spine to the cover (68% of the height).
  await expect.poll(async () => (await book.boundingBox())!.width).toBeCloseTo(before.book.height * 0.68, 0)
  await expect(book.locator('.bks-book3d')).toHaveCSS('transform', /^matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,/)
  const after = (await next.boundingBox())!
  // The neighbour clears the turned book, with 2px extra on top of the usual gap.
  const turned = (await book.boundingBox())!
  const gap = before.next.x - (before.book.x + before.book.width)
  expect(after.x - (turned.x + turned.width)).toBeCloseTo(gap + 2, 0)
  expect(after.x).not.toBe(before.next.x)

  await page.mouse.move(0, 0)
  await expect.poll(async () => (await book.boundingBox())!.width).toBeCloseTo(before.book.width, 0)
  await expect.poll(async () => (await next.boundingBox())!.x).toBeCloseTo(before.next.x, 0)
})

test('centres the books on wide screens', async ({ page }) => {
  // Wider than a demo shelf of 30 books at double size, leaning books included.
  await page.setViewportSize({ width: 3200, height: 1000 })
  const gaps = await page.$$eval('.bks-bookcase__row', (rows) =>
    rows.map((row) => {
      const box = row.getBoundingClientRect()
      const start = row.querySelector('.bks-bookcase__bookend--start')!.getBoundingClientRect()
      const end = row.querySelector('.bks-bookcase__bookend--end')!.getBoundingClientRect()
      return { left: start.left - box.left, right: box.right - end.right }
    }),
  )
  for (const { left, right } of gaps) {
    expect(left).toBeGreaterThan(100)
    expect(Math.abs(left - right)).toBeLessThanOrEqual(2)
  }
})

test('scrolls each shelf sideways on phones without widening the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const rows = await page.$$eval('.bks-bookcase__row', (els) => els.map((e) => ({ scroll: e.scrollWidth, client: e.clientWidth, left: e.scrollLeft })))
  for (const row of rows) {
    expect(row.scroll).toBeGreaterThan(row.client)
    // Starts at the first book rather than the middle.
    expect(row.left).toBe(0)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('leans some books and stands them up straight when hovered', async ({ page }) => {
  const slots = page.locator('.bks-bookcase__slot')
  const tilts = await slots.evaluateAll((els) => els.map((el) => getComputedStyle(el).rotate))
  const leaning = tilts.filter((t) => t !== 'none' && parseFloat(t) !== 0)
  expect(leaning.length).toBeGreaterThan(0)
  expect(leaning.length).toBeLessThan(tilts.length / 2)
  for (const t of leaning) expect(Math.abs(parseFloat(t))).toBeLessThanOrEqual(3)

  const emma = page.locator('.bks-bookcase__slot', { has: spine(page, 'Emma') })
  expect(parseFloat(await emma.evaluate((el) => getComputedStyle(el).rotate))).not.toBe(0)
  await spine(page, 'Emma').hover()
  await expect.poll(() => emma.evaluate((el) => parseFloat(getComputedStyle(el).rotate) || 0)).toBe(0)
})

test('draws books and shelves at half size on phones', async ({ page }) => {
  const desktop = (await spine(page, 'Middlemarch').boundingBox())!
  const desktopRow = (await page.locator('.bks-bookcase__row').first().boundingBox())!
  await page.setViewportSize({ width: 390, height: 844 })
  // The spine's width is animated (it widens as the book turns), so it takes a moment to settle.
  await expect.poll(async () => (await spine(page, 'Middlemarch').boundingBox())!.width).toBeCloseTo(desktop.width / 2, 0)
  const phone = (await spine(page, 'Middlemarch').boundingBox())!
  const phoneRow = (await page.locator('.bks-bookcase__row').first().boundingBox())!
  expect(phone.height).toBeCloseTo(desktop.height / 2, 0)
  expect(phoneRow.height).toBeCloseTo(desktopRow.height / 2, 0)
})
