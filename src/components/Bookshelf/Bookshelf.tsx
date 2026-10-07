import { useCallback, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Book, Shelf } from '../../data/books'
import { SpineFace } from './BookFaces'
import { BookStage } from './BookStage'
import './Bookshelf.css'

interface Selection {
  book: Book
  shelf: Shelf
}

export function Bookshelf({ shelves, title = 'Browse the shelves' }: { shelves: Shelf[]; title?: string }) {
  const [selected, setSelected] = useState<Selection | null>(null)
  const spines = useRef(new Map<string, HTMLButtonElement>())

  const selectedId = selected?.book.id
  const getOrigin = useCallback(() => (selectedId ? (spines.current.get(selectedId) ?? null) : null), [selectedId])

  const handleClosed = useCallback(() => {
    // Commit first: the spine is hidden while its book is out and can't take focus until then.
    flushSync(() => setSelected(null))
    if (selectedId) spines.current.get(selectedId)?.focus({ preventScroll: true })
  }, [selectedId])

  return (
    <section className="bookshelf" aria-labelledby="bookshelf-heading">
      <h2 id="bookshelf-heading" className="bookshelf__heading">
        {title}
      </h2>
      <p className="bookshelf__hint">Pick a book off the shelf to take a closer look.</p>

      <div className="bookcase">
        {shelves.map((shelf) => (
          <div key={shelf.id} className="bookcase__shelf">
            <ul className="bookcase__row" aria-label={shelf.label}>
              {shelf.books.map((book) => (
                <li key={book.id} className="bookcase__slot">
                  <button
                    ref={(el) => {
                      if (el) spines.current.set(book.id, el)
                      else spines.current.delete(book.id)
                    }}
                    type="button"
                    className="spine"
                    style={{ width: book.thickness, height: book.height }}
                    // Keep the gap in the shelf while the book is out.
                    data-out={book.id === selectedId || undefined}
                    aria-label={`${book.title} by ${book.author}`}
                    aria-haspopup="dialog"
                    onClick={() => setSelected({ book, shelf })}
                  >
                    <SpineFace book={book} height={book.height} />
                  </button>
                </li>
              ))}
            </ul>
            <span className="bookcase__label">{shelf.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <BookStage
          key={selected.book.id}
          book={selected.book}
          shelfLabel={selected.shelf.label}
          getOrigin={getOrigin}
          onClosed={handleClosed}
        />
      )}
    </section>
  )
}
