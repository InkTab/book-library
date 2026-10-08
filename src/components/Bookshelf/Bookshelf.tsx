import { useCallback, useId, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { defaultFormatPrice, spineLook } from './appearance'
import { Book3D } from './BookFaces'
import { BookStage } from './BookStage'
import type { AddToCartResult, Book, Shelf } from './types'
import './Bookshelf.css'

export interface BookshelfProps {
  shelves: Shelf[]
  /** Section heading. */
  title?: string
  /**
   * Called when the visitor presses Add to cart. Return a promise (e.g. your cart API call) to show
   * "Adding…" until it settles; a rejected promise shows an error and lets the visitor retry.
   */
  onAddToCart?: (book: Book) => AddToCartResult
  /** Formats prices for the tags and the cart button. Defaults to US dollars. */
  formatPrice?: (price: number) => string
}

interface Selection {
  book: Book
  shelf: Shelf
  /** Identifies the spine; the same book may sit on more than one shelf. */
  slot: string
}

/** Books are drawn at this multiple of their `spine` size in px. */
const SHELF_SCALE = 2

const slotKey = (shelf: Shelf, book: Book) => `${shelf.id}/${book.id}`

export function Bookshelf({
  shelves,
  title = 'Browse the shelves',
  onAddToCart,
  formatPrice = defaultFormatPrice,
}: BookshelfProps) {
  const headingId = useId()
  const [selected, setSelected] = useState<Selection | null>(null)
  const spines = useRef(new Map<string, HTMLButtonElement>())

  const selectedSlot = selected?.slot
  const getOrigin = useCallback(() => (selectedSlot ? (spines.current.get(selectedSlot) ?? null) : null), [selectedSlot])

  const handleClosed = useCallback(() => {
    // Commit first: the spine is hidden while its book is out and can't take focus until then.
    flushSync(() => setSelected(null))
    if (selectedSlot) spines.current.get(selectedSlot)?.focus({ preventScroll: true })
  }, [selectedSlot])

  return (
    <section className="bks-bookshelf" aria-labelledby={headingId}>
      <div className="bks-bookshelf__intro">
        <h2 id={headingId} className="bks-bookshelf__heading">
          {title}
        </h2>
        <p className="bks-bookshelf__hint">Pick a book off the shelf to take a closer look.</p>
      </div>

      <div className="bks-bookcase">
        {shelves.map((shelf) => (
          <div key={shelf.id} className="bks-bookcase__shelf">
            <ul className="bks-bookcase__row" aria-label={shelf.label}>
              <li className="bks-bookcase__bookend bks-bookcase__bookend--start" aria-hidden="true" />
              {shelf.books.map((book) => {
                const slot = slotKey(shelf, book)
                const look = spineLook(book)
                const spineSize = {
                  '--bks-h': `${look.height * SHELF_SCALE}px`,
                  '--bks-spine-w': `${look.thickness * SHELF_SCALE}px`,
                } as CSSProperties
                const price = formatPrice(book.price)
                return (
                  <li key={book.id} className="bks-bookcase__slot">
                    <button
                      ref={(el) => {
                        if (el) spines.current.set(slot, el)
                        else spines.current.delete(slot)
                      }}
                      type="button"
                      className="bks-spine"
                      style={spineSize}
                      // Keep the gap in the shelf while the book is out.
                      data-out={slot === selectedSlot || undefined}
                      aria-label={`${book.title} by ${book.author}, ${price}`}
                      aria-haspopup="dialog"
                      onClick={() => setSelected({ book, shelf, slot })}
                    >
                      {/* Spine out at rest; turns to show its cover on hover or keyboard focus. */}
                      <Book3D book={book} look={look} />
                      <span className="bks-spine__price" aria-hidden="true">
                        {price}
                      </span>
                    </button>
                  </li>
                )
              })}
              <li className="bks-bookcase__bookend bks-bookcase__bookend--end" aria-hidden="true" />
            </ul>
            <span className="bks-bookcase__label">{shelf.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <BookStage
          key={selected.slot}
          book={selected.book}
          shelfLabel={selected.shelf.label}
          getOrigin={getOrigin}
          onClosed={handleClosed}
          onAddToCart={onAddToCart}
          formatPrice={formatPrice}
        />
      )}
    </section>
  )
}
