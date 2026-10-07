import { expect, test } from '@playwright/test'
import { dialog, spine, openShelves } from './helpers'

// Opening a book locks page scroll. Hiding the scrollbar must not shift the page, whatever the host site's CSS.
test.use({ reducedMotion: 'reduce' })

const sites = {
  'a plain page': '',
  'a body with its own padding': 'body { padding: 0 40px }',
  'scrollbar-gutter: stable': 'html { scrollbar-gutter: stable }',
  'a centred max-width body': 'body { max-width: 1000px; margin: 0 auto }',
}

for (const [site, css] of Object.entries(sites)) {
  test(`does not shift ${site}`, async ({ page }) => {
    await openShelves(page)
    if (css) await page.addStyleTag({ content: css })
    const measure = () =>
      page.evaluate(() => ({
        spineX: document.querySelector('[aria-label^="Middlemarch by"]')!.getBoundingClientRect().x,
        headingX: document.querySelector('.bks-bookshelf__heading')!.getBoundingClientRect().x,
        padding: getComputedStyle(document.body).paddingRight,
      }))
    const before = await measure()

    await spine(page, 'Middlemarch').click()
    await expect(dialog(page)).toBeVisible()
    const open = await measure()
    expect(open.spineX).toBeCloseTo(before.spineX, 0)
    expect(open.headingX).toBeCloseTo(before.headingX, 0)
    expect(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight && window.scrollY)).toBe(0)

    await page.keyboard.press('Escape')
    await expect(dialog(page)).toHaveCount(0)
    expect((await measure()).padding).toBe(before.padding)
  })
}
