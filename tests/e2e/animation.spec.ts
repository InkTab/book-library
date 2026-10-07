import { expect, test } from '@playwright/test'
import { dialog, spine, openShelves } from './helpers'

// Full motion. Timing assertions use generous windows so slow CI machines don't fail them.

test.beforeEach(async ({ page }, testInfo) => {
  if (!testInfo.title.startsWith('ignores clicks')) await openShelves(page)
})

test('picks the book up exactly where its spine sits on the shelf', async ({ page }) => {
  await spine(page, 'Middlemarch').scrollIntoViewIfNeeded()
  const { shelf, picked } = await page.evaluate(
    () =>
      new Promise<{ shelf: DOMRect; picked: DOMRect }>((resolve) => {
        const button = document.querySelector<HTMLElement>('[aria-label^="Middlemarch by"]')!
        const shelf = button.getBoundingClientRect().toJSON()
        button.click()
        // First frame where the 3D book is drawn in its on-the-shelf pose.
        const poll = () => {
          const book = document.querySelector<HTMLElement>('.bks-stage__book')
          if (book?.style.transform.includes('rotateY(90deg)')) {
            resolve({ shelf, picked: document.querySelector('.bks-book3d__spine')!.getBoundingClientRect().toJSON() })
          } else requestAnimationFrame(poll)
        }
        requestAnimationFrame(poll)
      }),
  )
  // The pull-out may already have started (it grows 8% and lifts 6px over 0.3 s).
  expect(Math.abs(picked.x + picked.width / 2 - (shelf.x + shelf.width / 2))).toBeLessThanOrEqual(2)
  expect(Math.abs(picked.y + picked.height / 2 - (shelf.y + shelf.height / 2))).toBeLessThanOrEqual(8)
  expect(picked.height / shelf.height).toBeGreaterThanOrEqual(0.99)
  expect(picked.height / shelf.height).toBeLessThanOrEqual(1.09)
})

test('shows the details about 1.5 s after the click, and not before', async ({ page }) => {
  const shownAfter = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const start = performance.now()
        document.querySelector<HTMLElement>('[aria-label^="Middlemarch by"]')!.click()
        const poll = () => {
          const details = document.querySelector<HTMLElement>('.bks-stage__details')
          if (details && !details.inert) resolve(performance.now() - start)
          else requestAnimationFrame(poll)
        }
        requestAnimationFrame(poll)
      }),
  )
  expect(shownAfter).toBeGreaterThanOrEqual(1450)
  expect(shownAfter).toBeLessThan(2500)
  await expect(dialog(page).locator('.bks-stage__details')).toHaveCSS('opacity', '1')
  await expect(dialog(page).locator('.bks-price-tag')).toBeVisible()
})

test('ignores clicks on the cart button before it is visible', async ({ page }) => {
  // Stop the page's clock so the click is guaranteed to land inside the 1.5 s window, however slow the machine.
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  await openShelves(page)
  await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'))
  await spine(page, 'Middlemarch').click()
  const details = dialog(page).locator('.bks-stage__details')
  const button = dialog(page).locator('.bks-stage__add')
  const box = (await button.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  expect(await details.evaluate((el) => (el as HTMLElement).inert)).toBe(true)
  await expect(button).toHaveText('Add to cart · $24.99')
  await expect(page.getByText('Cart: 0 items')).toBeVisible()
})

test('returns the book to its own gap', async ({ page }) => {
  const before = (await spine(page, 'Middlemarch').boundingBox())!
  await spine(page, 'Middlemarch').click()
  await expect(dialog(page).locator('.bks-stage__details')).toHaveCSS('opacity', '1')
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  await expect(spine(page, 'Middlemarch')).toHaveCSS('visibility', 'visible')
  // Move off the spine so its hover lift doesn't count.
  await page.mouse.move(0, 0)
  await expect.poll(() => spine(page, 'Middlemarch').boundingBox()).toEqual(before)
})
