import { chromium } from '@playwright/test'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', ignoreDefaultArgs: ['--hide-scrollbars'] })
for (const [w, h, name] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.goto('http://localhost:5182/'); await p.evaluate(() => document.fonts.ready)
  for (const title of ['Les Misérables', 'Middlemarch']) {
    const sp = p.getByRole('button', { name: new RegExp(`^${title} by `) })
    await sp.scrollIntoViewIfNeeded()
    await sp.hover(); await p.waitForTimeout(900)
    const pages = await sp.locator('.bks-book3d__pages--top').boundingBox()
    const row = await p.locator('.bks-bookcase__row', { has: sp }).boundingBox()
    const rowEl = await p.locator('.bks-bookcase__row', { has: sp }).evaluate((el) => ({ client: el.clientHeight, offset: el.offsetHeight }))
    console.log(name, title, 'pagesTop', Math.round(pages.y), 'rowTop', Math.round(row.y), 'spare', Math.round(pages.y - row.y), 'scrollbar', rowEl.offset - rowEl.client)
    if (title === 'Middlemarch') { const box = await sp.boundingBox(); await p.screenshot({ path: `/tmp/claude-0/-home-user-book-library/db486ae1-73ab-5fa6-81b5-6412d1746eef/scratchpad/${name}-v6.png`, clip: { x: Math.max(0, box.x - 200), y: Math.max(0, box.y - 60), width: Math.min(w, 520), height: box.height + 90 } }) }
  }
  await p.close()
}
await b.close()
