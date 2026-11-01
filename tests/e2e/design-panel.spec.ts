import { expect, test } from '@playwright/test'
import { openShelves, spine } from './helpers'

// The demo page's design controls (src/demo/DesignPanel.tsx), not part of the component.
test.use({ reducedMotion: 'reduce' })

test('sliders restyle the shelves live, persist across reloads and reset', async ({ page }) => {
  await openShelves(page)
  const book = spine(page, 'Bleak House')
  const before = (await book.boundingBox())!

  await page.getByRole('button', { name: 'Customize design' }).click()
  const panel = page.getByRole('complementary', { name: 'Design controls' })
  await expect(panel).toBeVisible()
  await panel.getByLabel('Book size', { exact: true }).fill('50')
  await expect.poll(async () => (await book.boundingBox())!.height).toBeCloseTo(before.height / 2, 0)

  await page.reload()
  await expect(page.getByRole('button', { name: 'Customize design (1)' })).toBeVisible()
  expect((await book.boundingBox())!.height).toBeCloseTo(before.height / 2, 0)

  await page.getByRole('button', { name: 'Customize design (1)' }).click()
  await panel.getByRole('button', { name: 'Reset all' }).click()
  await expect.poll(async () => (await book.boundingBox())!.height).toBeCloseTo(before.height, 0)
  await expect(page.locator('style[data-design-overrides]')).toHaveCount(0)
})

test('closes on Escape and returns focus to its button', async ({ page }) => {
  await openShelves(page)
  const toggle = page.getByRole('button', { name: 'Customize design' })
  await toggle.click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('complementary', { name: 'Design controls' })).toBeHidden()
  await expect(toggle).toBeFocused()
})
