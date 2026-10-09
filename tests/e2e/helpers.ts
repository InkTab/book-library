import type { Locator, Page } from '@playwright/test'

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

/**
 * Where the cream page edges of a hovered, tilted book start, found in a screenshot: the topmost row
 * of page-coloured pixels straight above the middle of its spine, between `from` (a y in the viewport)
 * and just below the top of the book's slot. Null if there are none.
 * This checks what is drawn: browsers differ in how they report the boxes of elements seen in
 * perspective (WebKit leaves the perspective out).
 */
export async function pageEdgesTop(page: Page, book: Locator, from: number): Promise<number | null> {
  const slot = (await book.boundingBox())!
  const x = Math.round(slot.x + slot.width / 2)
  const y = Math.floor(from)
  const height = Math.round(slot.y + slot.height * 0.05) - y
  const png = await page.screenshot({ clip: { x, y, width: 1, height }, scale: 'css' })
  const column = await page.evaluate(async (base64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${base64}`
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')!
    context.drawImage(img, 0, 0)
    return Array.from(context.getImageData(0, 0, img.width, img.height).data)
  }, png.toString('base64'))
  for (let row = 0; row < column.length / 4; row++) {
    const [r, g, b] = column.slice(row * 4, row * 4 + 3)
    // The pages are cream (#efe6d0 with darker ruling); no binding colour is that light.
    if (r > 200 && g > 190 && b > 150) return y + row
  }
  return null
}
