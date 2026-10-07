import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
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
  spine: { color: '#7a2e3a', height: 212, thickness: 39 },
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

  it('uses the supplied spine size', async () => {
    await render(<Bookshelf shelves={[shelf('a', [full])]} />)
    const box = spine('Pride and Prejudice').element().getBoundingClientRect()
    expect([box.width, box.height]).toEqual([39, 212])
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
