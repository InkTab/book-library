import type { Page } from '@playwright/test'

/** The spine button for a book on the demo shelves. */
export const spine = (page: Page, title: string) => page.getByRole('button', { name: new RegExp(`^${title} by `) })

export const dialog = (page: Page) => page.getByRole('dialog')

/** Bounding box of an element in viewport coordinates, measured in the page. */
export const rect = (page: Page, selector: string) =>
  page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().toJSON() as DOMRect, selector)

/** Loads the demo page and waits for web fonts, which change text heights (and so positions) when they arrive. */
export async function openShelves(page: Page) {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
}
