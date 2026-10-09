import { expect, test } from '@playwright/test'
import { spine, openShelves } from './helpers'

test.beforeEach(async ({ page }) => {
  await openShelves(page)
})

test('shows two shelves of books', async ({ page }) => {
  await expect(page.locator('.bks-bookcase__row')).toHaveCount(2)
  await expect(page.locator('.bks-spine')).toHaveCount(60)
  await expect(page.getByRole('list', { name: 'Classic Fiction' })).toBeVisible()
  // A bookend at the end of each row only.
  await expect(page.locator('.bks-bookcase__bookend')).toHaveCount(2)
  for (const last of await page.locator('.bks-bookcase__row > :last-child').all()) {
    await expect(last).toHaveClass(/bks-bookcase__bookend--end/)
  }
})

test('labels each spine with title, author and price', async ({ page }) => {
  await expect(spine(page, 'Middlemarch')).toHaveAccessibleName('Middlemarch by George Eliot, $24.99')
})

test('shows the price slip over the bottom of the spine', async ({ page }) => {
  const book = spine(page, 'Middlemarch')
  await book.hover()
  const slip = book.locator('.bks-spine__price')
  await expect(slip).toHaveCSS('opacity', '1')
  await page.waitForTimeout(400)
  const box = (await book.boundingBox())!
  const slipBox = (await slip.boundingBox())!
  // Centred on the spine, in its bottom fifth, in front of the book.
  expect(Math.abs(slipBox.x + slipBox.width / 2 - (box.x + box.width / 2))).toBeLessThanOrEqual(2)
  expect(slipBox.y).toBeGreaterThan(box.y + box.height * 0.8)
  expect(slipBox.y + slipBox.height).toBeLessThanOrEqual(box.y + box.height + 2)
  // The slip ignores the pointer; let it take part in hit-testing to see that it's drawn on top.
  await slip.evaluate((el) => ((el as HTMLElement).style.pointerEvents = 'auto'))
  const topmost = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.className, { x: slipBox.x + slipBox.width / 2, y: slipBox.y + slipBox.height / 2 })
  expect(topmost).toContain('bks-spine__price')
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

test('lifts a hovered book and tilts its top toward the visitor, leaving its neighbours in place', async ({ page }) => {
  const book = spine(page, 'Middlemarch')
  const next = spine(page, 'Great Expectations')
  const before = { book: (await book.boundingBox())!, next: (await next.boundingBox())! }

  await book.hover()
  await expect(book.locator('.bks-book3d')).toHaveCSS('rotate', /^(x -14deg|1 0 0 -14deg)$/)
  const after = (await book.boundingBox())!
  // Same slot width, 6px up; the neighbour doesn't move.
  expect(after.width).toBeCloseTo(before.book.width, 0)
  expect(after.y).toBeCloseTo(before.book.y - 6, 0)
  expect((await next.boundingBox())!.x).toBeCloseTo(before.next.x, 0)
  // The top comes toward the visitor, so in perspective the spine is wider at the top than the bottom.
  const spineFace = book.locator('.bks-book3d__spine')
  const box = (await spineFace.boundingBox())!
  expect(box.width).toBeGreaterThan(before.book.width + 2)

  await page.mouse.move(0, 0)
  await expect.poll(() => book.locator('.bks-book3d').evaluate((el) => getComputedStyle(el).rotate)).toBe('none')
})

test('centres the books on wide screens', async ({ page }) => {
  // Wider than a demo shelf of 30 books at double size, leaning books included.
  await page.setViewportSize({ width: 3200, height: 1000 })
  const gaps = await page.$$eval('.bks-bookcase__row', (rows) =>
    rows.map((row) => {
      const box = row.getBoundingClientRect()
      // Layout position of the first book, not its (possibly leaning) drawn box.
      const first = row.querySelector<HTMLElement>('.bks-bookcase__slot')!
      const firstLeft = first.offsetLeft - parseFloat(getComputedStyle(first).marginLeft) - (row as HTMLElement).offsetLeft
      const end = row.querySelector('.bks-bookcase__bookend--end')!.getBoundingClientRect()
      return { left: firstLeft, right: box.right - end.right }
    }),
  )
  for (const { left, right } of gaps) {
    expect(left).toBeGreaterThan(100)
    // The first book also sits one 2px flex gap after the empty item that centres the row.
    expect(Math.abs(left - right)).toBeLessThanOrEqual(4)
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

test('leans two or three books per row, spaced 2–5 books apart, and stands them up when hovered', async ({ page }) => {
  for (const row of await page.locator('.bks-bookcase__row').all()) {
    const tilts = await row.locator('.bks-bookcase__slot').evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).rotate) || 0))
    const at = tilts.flatMap((t, i) => (t === 0 ? [] : [i]))
    expect(at.length).toBeGreaterThanOrEqual(2)
    expect(at.length).toBeLessThanOrEqual(3)
    for (let i = 1; i < at.length; i++) {
      expect(at[i] - at[i - 1] - 1).toBeGreaterThanOrEqual(2)
      expect(at[i] - at[i - 1] - 1).toBeLessThanOrEqual(5)
    }
  }

  const slot = page.locator('.bks-bookcase__slot[data-lean]').first()
  expect(parseFloat(await slot.evaluate((el) => getComputedStyle(el).rotate))).not.toBe(0)
  await slot.locator('.bks-spine').hover()
  await expect.poll(() => slot.evaluate((el) => parseFloat(getComputedStyle(el).rotate) || 0)).toBe(0)
})

test('hides the bookcase and shelf labels from the settings menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Display settings' }).click()
  const toggle = page.getByRole('switch', { name: 'Shelves' })
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('.bks-bookcase')).toHaveCSS('background-image', 'none')
  await expect(page.locator('.bks-bookcase__shelf').first()).toHaveCSS('background-image', 'none')
  await expect(page.locator('.bks-bookcase__label')).toHaveCount(2)
  for (const label of await page.locator('.bks-bookcase__label').all()) await expect(label).toBeHidden()
  await expect(page.locator('.bks-spine')).toHaveCount(60)
  await page.keyboard.press('Escape')
  await expect(toggle).toBeHidden()
  // Books still open from the shelf with the bookcase hidden.
  await spine(page, 'Middlemarch').click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('draws books and shelves at half size on phones, with room for the price slip', async ({ page }) => {
  const measure = async () => ({
    book: (await spine(page, 'Middlemarch').boundingBox())!,
    bookend: (await page.locator('.bks-bookcase__bookend').first().boundingBox())!,
    lip: await page.locator('.bks-bookcase__shelf').first().evaluate((el) => parseFloat(getComputedStyle(el).borderBottomWidth)),
  })
  const desktop = await measure()
  await page.setViewportSize({ width: 390, height: 844 })
  const phone = await measure()
  expect(phone.book.width).toBeCloseTo(desktop.book.width / 2, 0)
  expect(phone.book.height).toBeCloseTo(desktop.book.height / 2, 0)
  expect(phone.bookend.height).toBeCloseTo(desktop.bookend.height / 2, 0)
  expect(phone.lip).toBeCloseTo(desktop.lip / 2, 0)
})

for (const [device, viewport] of [
  ['wide screens', { width: 1440, height: 900 }],
  ['phones', { width: 390, height: 844 }],
] as const) {
  test(`keeps the tallest book's tilted top inside its shelf on ${device}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    // Les Misérables (242px) is the tallest demo book.
    const book = spine(page, 'Les Misérables')
    await book.scrollIntoViewIfNeeded()
    await book.hover()
    await expect(book.locator('.bks-book3d')).toHaveCSS('rotate', /^(x -14deg|1 0 0 -14deg)$/)
    await page.waitForTimeout(800)
    const row = (await page.locator('.bks-bookcase__row', { has: book }).boundingBox())!
    // The tops of the pages show above the spine, and stay below the top of the shelf.
    const pages = (await book.locator('.bks-book3d__pages--top').boundingBox())!
    const top = (await book.locator('.bks-book3d__spine').boundingBox())!.y
    expect(pages.y).toBeLessThan(top - 5)
    expect(pages.y).toBeGreaterThanOrEqual(row.y)
  })

}
