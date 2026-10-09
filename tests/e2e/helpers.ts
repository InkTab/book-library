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
 * and just below the top of the book's slot. `top` is null if there are none; `column` describes the
 * colours found (for failure messages).
 * This checks what is drawn: browsers differ in how they report the boxes of elements seen in
 * perspective (WebKit leaves the perspective out).
 */
export async function pageEdgesTop(page: Page, book: Locator, from: number) {
  const slot = (await book.boundingBox())!
  const x = Math.round(slot.x + slot.width / 2)
  const y = Math.floor(from)
  // Look for page edges only down to just inside the slot (below that, the spine's own lettering can be
  // as light), but capture down to the slot's bottom so a failure message shows the whole book.
  const searchEnd = Math.round(slot.y + slot.height * 0.05) - y
  const height = Math.round(slot.y + slot.height) - y
  const png = await page.screenshot({ clip: { x, y, width: 1, height }, scale: 'css' })
  const pixels = await page.evaluate(async (base64) => {
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
  const colours: string[] = []
  let top: number | null = null
  for (let row = 0; row < pixels.length / 4; row++) {
    const [r, g, b] = pixels.slice(row * 4, row * 4 + 3)
    // Rounded to steps of 32 so a gradient reads as a few runs, not one per pixel.
    colours.push(`#${[r, g, b].map((c) => (Math.round(c / 32) * 32).toString(16).padStart(2, '0').slice(-2)).join('')}`)
    // The pages are cream (#efe6d0 with darker ruling); no binding colour is that light.
    if (top === null && row < searchEnd && r > 200 && g > 190 && b > 150) top = y + row
  }
  // Run-length summary from the top down, e.g. "y=192 #2e190d×20 #efe6d0×18 …".
  const runs = colours.reduce<[string, number][]>((acc, colour) => {
    const last = acc.at(-1)
    if (last?.[0] === colour) last[1]++
    else acc.push([colour, 1])
    return acc
  }, [])
  const shown = runs.slice(0, 40).map(([c, n]) => `${c}×${n}`).join(' ')
  const column = `y=${y} x=${x}, searched ${searchEnd} px (${png.length} byte png, ${pixels.length / 4} px): ${shown}${runs.length > 40 ? ' …' : ''}`
  return { top, column }
}
