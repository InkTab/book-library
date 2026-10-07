import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { dialog, openShelves, spine } from './helpers'

// Automated WCAG 2.2 AA checks with axe. They catch missing names, roles and contrast problems,
// not everything: keyboard behaviour is covered in open-book.spec.ts.
test.use({ reducedMotion: 'reduce' })

const axe = (page: import('@playwright/test').Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])

const summary = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
  violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)

test('the shelves have no detectable accessibility problems', async ({ page }) => {
  await openShelves(page)
  const { violations } = await axe(page).include('.bks-bookshelf').analyze()
  expect(summary(violations)).toEqual([])
})

test('the open book has no detectable accessibility problems', async ({ page }) => {
  await openShelves(page)
  await spine(page, 'Middlemarch').click()
  await expect(dialog(page).locator('.bks-stage__details')).toHaveCSS('opacity', '1')
  const { violations } = await axe(page).include('.bks-stage').analyze()
  expect(summary(violations)).toEqual([])
})

test('a hovered spine with its price slip has no detectable problems', async ({ page }) => {
  await openShelves(page)
  await spine(page, 'Jane Eyre').hover()
  const shelf = await axe(page).include('.bks-bookshelf').analyze()
  expect(summary(shelf.violations)).toEqual([])
})
