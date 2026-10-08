import { expect, test } from '@playwright/test'
import { dialog, rect, spine, openShelves } from './helpers'

// Behaviour of the open book. Reduced motion makes the sequence instant; animation.spec.ts covers timing.
test.use({ reducedMotion: 'reduce' })

test.beforeEach(async ({ page }) => {
  await openShelves(page)
})

test('opens a dialog with the book details in order', async ({ page }) => {
  await spine(page, 'Middlemarch').click()
  await expect(dialog(page)).toHaveAccessibleName('Middlemarch')
  const details = dialog(page).locator('.bks-stage__details > *:not(.bks-visually-hidden)')
  await expect(details).toHaveText([
    'Classic Fiction',
    'Middlemarch',
    'by George Eliot',
    /^Dorothea Brooke/,
    'Hardcover',
    'Add to cart · $24.99',
  ])
  await expect(dialog(page).locator('.bks-price-tag')).toHaveText('$24.99')
})

test('adds the book to the cart through the async cart call', async ({ page }) => {
  await spine(page, 'Middlemarch').click()
  const button = dialog(page).getByRole('button', { name: /Add to cart/ })
  // Record every label the button shows; "Adding…" lasts only as long as the demo's 0.4 s cart call.
  await button.evaluate((el) => {
    const labels: string[] = []
    ;(window as unknown as { cartLabels: string[] }).cartLabels = labels
    new MutationObserver(() => labels.push(el.textContent ?? '')).observe(el, { childList: true, characterData: true, subtree: true })
  })
  await button.click()
  await expect(dialog(page).getByRole('button', { name: 'Added to cart' })).toBeVisible()
  expect(await page.evaluate(() => (window as unknown as { cartLabels: string[] }).cartLabels)).toEqual(['Adding…', 'Added to cart'])
  await expect(dialog(page).getByRole('status')).toHaveText('Middlemarch added to cart')
  await expect(page.getByText('Cart: 1 item')).toBeVisible()
  // The confirmation reverts so the book can be added again.
  await expect(dialog(page).getByRole('button', { name: 'Add to cart · $24.99' })).toBeVisible({ timeout: 4000 })
})

for (const [how, close] of [
  ['the close button', (page) => page.getByRole('button', { name: 'Put the book back on the shelf' }).click()],
  ['Escape', (page) => page.keyboard.press('Escape')],
  ['a backdrop click', (page) => page.mouse.click(20, 860)],
] as const satisfies readonly [string, (page: import('@playwright/test').Page) => Promise<void>][]) {
  test(`puts the book back with ${how}`, async ({ page }) => {
    await spine(page, 'Middlemarch').click()
    await expect(dialog(page)).toBeVisible()
    await close(page)
    await expect(dialog(page)).toHaveCount(0)
    await expect(spine(page, 'Middlemarch')).toBeFocused()
    await expect(spine(page, 'Middlemarch')).not.toHaveAttribute('data-out')
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('')
  })
}

test('keeps keyboard focus inside the open book', async ({ page }) => {
  await spine(page, 'Middlemarch').click()
  const close = page.getByRole('button', { name: 'Put the book back on the shelf' })
  const add = page.getByRole('button', { name: /Add to cart/ })
  await expect(close).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(add).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(add).toBeFocused()
})

test('leaves a gap on the shelf while the book is out', async ({ page }) => {
  await spine(page, 'Middlemarch').click()
  await expect(dialog(page)).toBeVisible()
  // Hidden spines drop out of the accessibility tree, so find it by its label attribute.
  await expect(page.locator('[aria-label^="Middlemarch by"]')).toHaveCSS('visibility', 'hidden')
})

test('stacks the book above its details on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await spine(page, 'Middlemarch').click()
  await expect(dialog(page).getByRole('heading')).toBeVisible()
  const book = await rect(page, '.bks-stage__anchor')
  const details = await rect(page, '.bks-stage__details')
  expect(details.top).toBeGreaterThanOrEqual(book.bottom)
  // Book plus price tag fit the screen.
  const tag = await rect(page, '.bks-price-tag')
  expect(book.left).toBeGreaterThanOrEqual(0)
  expect(tag.right).toBeLessThanOrEqual(390)
  // 24px of padding on each side of the details.
  expect(details.left).toBeGreaterThanOrEqual(24)
  expect(details.right).toBeLessThanOrEqual(390 - 24)
  expect(await dialog(page).locator('.bks-stage__content').evaluate((el) => getComputedStyle(el).paddingInline)).toBe('24px')
})
