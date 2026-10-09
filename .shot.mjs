import { chromium } from '@playwright/test'
const [out, tag] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', ignoreDefaultArgs: ['--hide-scrollbars'] })
for (const [w, h, name] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.goto('http://localhost:5182/'); await p.evaluate(() => document.fonts.ready)
  for (const title of ['Middlemarch', 'Les Misérables']) {
    const sp = p.getByRole('button', { name: new RegExp(`^${title} by `) })
    await sp.scrollIntoViewIfNeeded()
    const box = await sp.boundingBox()
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await p.waitForTimeout(900)
    const slip = await sp.locator('.bks-spine__price').boundingBox()
    const spine = await sp.locator('.bks-book3d__spine').boundingBox()
    const row = await p.locator('.bks-bookcase__row', { has: sp }).boundingBox()
    console.log(name, title, 'slip top', Math.round(slip.y), 'slip bottom', Math.round(slip.y + slip.height), 'spine top', Math.round(spine.y), 'row top', Math.round(row.y))
    if (title === 'Middlemarch') await p.screenshot({ path: `${out}/${name}-${tag}.png`, clip: { x: Math.max(0, box.x - 200), y: box.y - 70, width: Math.min(w, 500), height: 260 } })
  }
  await p.close()
}
await b.close()
