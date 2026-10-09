import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Bookshelf, type Book, type Shelf } from '.'

// Runs in a real browser with reduced motion (see vitest.config.ts), so opening and closing are instant.

/** Rows as a database might return them: only the required fields. */
const minimal: Book[] = Array.from({ length: 4 }, (_, i) => ({
  id: `sku-${100 + i}`,
  title: `Title ${i}`,
  author: `Author ${i}`,
  price: 10 + i,
}))

const full: Book = {
  id: 'isbn-9780141439518',
  title: 'Pride and Prejudice',
  author: 'Jane Austen',
  price: 16.99,
  format: 'Hardcover',
  description: 'Elizabeth Bennet trades barbs with the proud Mr Darcy.',
  spine: { color: '#c1572f', height: 212, thickness: 39, tilt: 0 },
}

const shelf = (id: string, books: Book[]): Shelf => ({ id, label: `Shelf ${id}`, books })

const spine = (title: string) => page.getByRole('button', { name: new RegExp(`^${title} by `) })
const dialog = () => page.getByRole('dialog')

async function openBook(title: string) {
  await spine(title).click()
  await expect.element(dialog().getByRole('heading')).toBeVisible()
}

describe('data from a catalogue', () => {
  it('renders books that have only the required fields', async () => {
    await render(<Bookshelf shelves={[shelf('a', minimal)]} />)
    await expect.element(spine('Title 0')).toHaveAccessibleName('Title 0 by Author 0, $10.00')
    expect(document.querySelectorAll('.bks-spine')).toHaveLength(4)

    await openBook('Title 0')
    await expect.element(dialog().getByRole('heading')).toHaveTextContent('Title 0')
    expect(dialog().element().querySelector('.bks-stage__format')).toBeNull()
    expect(dialog().element().querySelector('.bks-stage__description')).toBeNull()
  })

  it('shows format and description when supplied', async () => {
    await render(<Bookshelf shelves={[shelf('a', [full])]} />)
    await openBook('Pride and Prejudice')
    await expect.element(dialog().getByText('Hardcover')).toBeVisible()
    await expect.element(dialog().getByText(/Elizabeth Bennet/)).toBeVisible()
  })

  it('draws the supplied spine size at twice the size, and at its own size on phones', async () => {
    await page.viewport(1280, 800)
    await render(<Bookshelf shelves={[shelf('a', [full])]} />)
    // Keep the pointer off the book, which would lift it.
    await userEvent.hover(page.getByRole('heading', { name: 'Browse the shelves' }))
    const box = () => spine('Pride and Prejudice').element().getBoundingClientRect()
    expect([box().width, box().height]).toEqual([78, 424])
    await page.viewport(414, 896)
    await userEvent.hover(page.getByRole('heading', { name: 'Browse the shelves' }))
    await expect.poll(() => [box().width, box().height]).toEqual([39, 212])
  })

  it('hides and shows the bookcase from the settings menu', async () => {
    await render(<Bookshelf shelves={[shelf('a', minimal)]} />)
    const settings = page.getByRole('button', { name: 'Display settings' })
    const toggle = page.getByRole('switch', { name: 'Shelves' })
    const bookcase = () => document.querySelector<HTMLElement>('.bks-bookcase')!
    const label = () => document.querySelector<HTMLElement>('.bks-bookcase__label')!
    await expect.element(settings).toHaveAttribute('aria-expanded', 'false')
    await expect.element(toggle).not.toBeInTheDocument()

    await settings.click()
    await expect.element(settings).toHaveAttribute('aria-expanded', 'true')
    await expect.element(toggle).toHaveAttribute('aria-checked', 'true')
    await toggle.click()
    await expect.element(toggle).toHaveAttribute('aria-checked', 'false')
    expect(bookcase().dataset.shelves).toBe('hidden')
    expect(getComputedStyle(bookcase()).backgroundImage).toBe('none')
    expect(getComputedStyle(label()).display).toBe('none')
    // The books stay, and the row keeps its name for screen readers.
    expect(document.querySelectorAll('.bks-spine')).toHaveLength(4)
    await expect.element(page.getByRole('list', { name: 'Shelf a' })).toBeInTheDocument()

    await toggle.click()
    expect(bookcase().dataset.shelves).toBeUndefined()
    expect(getComputedStyle(label()).display).not.toBe('none')
  })

  it('closes the settings menu on Escape, an outside click, or focus moving away', async () => {
    await render(<Bookshelf shelves={[shelf('a', minimal)]} />)
    const settings = page.getByRole('button', { name: 'Display settings' })
    const toggle = page.getByRole('switch', { name: 'Shelves' })

    await settings.click()
    await toggle.click()
    // Pressing a setting keeps the menu open.
    await expect.element(toggle).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect.element(toggle).not.toBeInTheDocument()
    await expect.element(settings).toHaveFocus()

    await settings.click()
    await page.getByRole('heading', { name: 'Browse the shelves' }).click()
    await expect.element(settings).toHaveAttribute('aria-expanded', 'false')

    await settings.click()
    spine('Title 0').element().focus()
    await expect.element(settings).toHaveAttribute('aria-expanded', 'false')
  })

  it('leaves the settings button out when showSettings is false', async () => {
    await render(<Bookshelf shelves={[shelf('a', minimal)]} showSettings={false} />)
    expect(document.querySelector('.bks-settings')).toBeNull()
  })

  it('leans a book by its supplied tilt', async () => {
    await render(<Bookshelf shelves={[shelf('a', [{ ...full, spine: { ...full.spine, tilt: -2.5 } }])]} />)
    const slot = spine('Pride and Prejudice').element().parentElement!
    expect(getComputedStyle(slot).rotate).toBe('-2.5deg')
    expect(slot.dataset.lean).toBe('left')
  })

  it('formats prices with formatPrice', async () => {
    const euros = (price: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)
    await render(<Bookshelf shelves={[shelf('a', minimal)]} formatPrice={euros} />)
    expect(euros(11)).toMatch(/^11,00\s€$/)
    await expect.element(spine('Title 1')).toHaveAccessibleName(`Title 1 by Author 1, ${euros(11)}`)
    await openBook('Title 1')
    await expect.element(dialog().getByRole('button', { name: `Add to cart · ${euros(11)}` })).toBeVisible()
  })

  it('renders an empty catalogue without errors', async () => {
    await render(<Bookshelf shelves={[]} />)
    await expect.element(page.getByRole('heading', { name: 'Browse the shelves' })).toBeVisible()
    expect(document.querySelectorAll('.bks-spine')).toHaveLength(0)
  })

  it('handles the same book on two shelves', async () => {
    await render(<Bookshelf shelves={[shelf('a', minimal.slice(0, 2)), shelf('b', minimal.slice(0, 3))]} />)
    const copies = document.querySelectorAll<HTMLButtonElement>('[aria-label^="Title 0 by"]')
    expect(copies).toHaveLength(2)

    copies[1].click()
    await expect.element(dialog()).toBeVisible()
    // Only the copy that was picked leaves a gap, and the dialog names the shelf it came from.
    expect(document.querySelectorAll('[data-out]')).toHaveLength(1)
    expect(copies[1].hasAttribute('data-out')).toBe(true)
    await expect.element(dialog().getByText('Shelf b')).toBeVisible()
  })

  it('gives each bookshelf on a page its own heading', async () => {
    await render(
      <>
        <Bookshelf shelves={[shelf('a', minimal)]} title="New in" />
        <Bookshelf shelves={[shelf('b', minimal)]} title="Staff picks" />
      </>,
    )
    await expect.element(page.getByRole('region', { name: 'New in' })).toBeVisible()
    await expect.element(page.getByRole('region', { name: 'Staff picks' })).toBeVisible()
  })
})

describe('onAddToCart', () => {
  it('receives the book with its catalogue id', async () => {
    const onAddToCart = vi.fn()
    await render(<Bookshelf shelves={[shelf('a', [full])]} onAddToCart={onAddToCart} />)
    await openBook('Pride and Prejudice')
    await dialog().getByRole('button', { name: /Add to cart/ }).click()
    expect(onAddToCart).toHaveBeenCalledExactlyOnceWith(full)
    await expect.element(dialog().getByRole('button', { name: 'Added to cart' })).toBeVisible()
  })

  it('shows "Adding…" until the cart call resolves', async () => {
    let finish!: () => void
    const onAddToCart = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    await render(<Bookshelf shelves={[shelf('a', [full])]} onAddToCart={onAddToCart} />)
    await openBook('Pride and Prejudice')
    await dialog().getByRole('button', { name: /Add to cart/ }).click()

    const adding = dialog().getByRole('button', { name: 'Adding…' })
    await expect.element(adding).toBeVisible()
    await expect.element(adding).toHaveAttribute('aria-disabled', 'true')
    // Clicking again while the call is in flight doesn't add twice.
    await adding.click({ force: true })
    expect(onAddToCart).toHaveBeenCalledOnce()

    finish()
    await expect.element(dialog().getByRole('button', { name: 'Added to cart' })).toBeVisible()
    await expect.element(dialog().getByRole('status')).toHaveTextContent('Pride and Prejudice added to cart')
  })

  it('shows an error when the cart call fails, and lets the visitor retry', async () => {
    const onAddToCart = vi.fn().mockRejectedValueOnce(new Error('cart down')).mockResolvedValueOnce(undefined)
    await render(<Bookshelf shelves={[shelf('a', [full])]} onAddToCart={onAddToCart} />)
    await openBook('Pride and Prejudice')
    await dialog().getByRole('button', { name: /Add to cart/ }).click()

    const retry = dialog().getByRole('button', { name: 'Couldn’t add. Try again' })
    await expect.element(retry).toBeVisible()
    await expect.element(dialog().getByRole('status')).toHaveTextContent('Couldn’t add Pride and Prejudice to the cart')

    await retry.click()
    await expect.element(dialog().getByRole('button', { name: 'Added to cart' })).toBeVisible()
    expect(onAddToCart).toHaveBeenCalledTimes(2)
  })
})
