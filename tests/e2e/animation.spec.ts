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
            resolve({ shelf, picked: document.querySelector('.bks-stage .bks-book3d__spine')!.getBoundingClientRect().toJSON() })
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

test('picks a leaning book up at the angle it leans on the shelf', async ({ page }) => {
  await page.locator('.bks-bookcase__slot[data-lean] .bks-spine').first().scrollIntoViewIfNeeded()
  const { shelf, picked, tilt } = await page.evaluate(
    () =>
      new Promise<{ shelf: DOMRect; picked: DOMRect; tilt: string }>((resolve) => {
        const button = document.querySelector<HTMLElement>('.bks-bookcase__slot[data-lean] .bks-spine')!
        const shelf = button.getBoundingClientRect().toJSON()
        button.click()
        const poll = () => {
          const book = document.querySelector<HTMLElement>('.bks-stage__book')
          if (book?.style.transform.includes('rotateY(90deg)')) {
            const tilt = /rotateZ\(([^)]+)\)/.exec(book.style.transform)![1]
            resolve({ shelf, tilt, picked: document.querySelector('.bks-stage .bks-book3d__spine')!.getBoundingClientRect().toJSON() })
          } else requestAnimationFrame(poll)
        }
        requestAnimationFrame(poll)
      }),
  )
  expect(Math.abs(parseFloat(tilt))).toBeGreaterThan(1)
  // Both boxes are the bounds of the same leaning book, so they line up as for an upright one.
  expect(Math.abs(picked.x + picked.width / 2 - (shelf.x + shelf.width / 2))).toBeLessThanOrEqual(2)
  expect(Math.abs(picked.y + picked.height / 2 - (shelf.y + shelf.height / 2))).toBeLessThanOrEqual(8)
  expect(picked.width / shelf.width).toBeGreaterThanOrEqual(0.97)
  expect(picked.width / shelf.width).toBeLessThanOrEqual(1.09)
})

test('picks a hovered book up at the angle it tilts toward the visitor', async ({ page }) => {
  const button = spine(page, 'Middlemarch')
  await button.hover()
  // Wait for the tilt to settle.
  await expect(button.locator('.bks-book3d')).toHaveCSS('rotate', /^(x -14deg|1 0 0 -14deg)$/)
  await page.waitForTimeout(800)
  const { shelf, picked, transform } = await page.evaluate(
    () =>
      new Promise<{ shelf: DOMRect; picked: DOMRect; transform: string }>((resolve) => {
        const button = document.querySelector<HTMLElement>('[aria-label^="Middlemarch by"]')!
        const shelf = button.querySelector('.bks-book3d__spine')!.getBoundingClientRect().toJSON()
        button.click()
        const poll = () => {
          const book = document.querySelector<HTMLElement>('.bks-stage__book')
          if (book?.style.transform.includes('rotateY(90deg)')) {
            const picked = document.querySelector('.bks-stage .bks-book3d__spine')!.getBoundingClientRect().toJSON()
            resolve({ shelf, picked, transform: book.style.transform })
          } else requestAnimationFrame(poll)
        }
        requestAnimationFrame(poll)
      }),
  )
  expect(transform).toContain('rotateX(-14deg)')
  expect(Math.abs(picked.x + picked.width / 2 - (shelf.x + shelf.width / 2))).toBeLessThanOrEqual(2)
  expect(Math.abs(picked.y + picked.height / 2 - (shelf.y + shelf.height / 2))).toBeLessThanOrEqual(8)
  expect(picked.height / shelf.height).toBeGreaterThanOrEqual(0.97)
  expect(picked.height / shelf.height).toBeLessThanOrEqual(1.09)
})

test('shows the details about 1.5 s after the click, and not before', async ({ page }) => {
  // Compare against a reference 1.5 s timer started at the click: on a busy machine (e.g. CI without a GPU)
  // both are delayed alike, so this checks the component's delay rather than the machine's speed.
  const { shown, reference } = await page.evaluate(
    () =>
      new Promise<{ shown: number; reference: number }>((resolve) => {
        const result = { shown: NaN, reference: NaN }
        const finish = () => !Number.isNaN(result.shown) && !Number.isNaN(result.reference) && resolve(result)
        const start = performance.now()
        new MutationObserver((_, observer) => {
          const details = document.querySelector<HTMLElement>('.bks-stage__details')
          if (details && !details.inert) {
            result.shown = performance.now() - start
            observer.disconnect()
            finish()
          }
        }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['inert'], childList: true })
        document.querySelector<HTMLElement>('[aria-label^="Middlemarch by"]')!.click()
        setTimeout(() => {
          result.reference = performance.now() - start
          finish()
        }, 1500)
      }),
  )
  const timings = `details shown at ${Math.round(shown)} ms, reference timer at ${Math.round(reference)} ms`
  expect(shown, timings).toBeGreaterThanOrEqual(1450)
  expect(shown - reference, timings).toBeGreaterThanOrEqual(-50)
  expect(shown - reference, timings).toBeLessThan(750)
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
  // Move off the spine and blur it so its hover lift and tilt don't count.
  await page.mouse.move(0, 0)
  await spine(page, 'Middlemarch').blur()
  await expect.poll(() => spine(page, 'Middlemarch').boundingBox()).toEqual(before)
})
