import type { CSSProperties, ReactNode } from 'react'
import type { Book } from '../../data/books'
import { inkFor } from './color'

/** Cover width as a fraction of book height. */
export const COVER_RATIO = 0.68

const bookVars = (book: Book, height: number) =>
  ({
    '--book': book.color,
    '--ink': inkFor(book.color),
    '--h': `${height}px`,
  }) as CSSProperties

/**
 * The spine artwork. Rendered flat on the shelf and as the left face of the 3D book,
 * so both look identical at the moment the book is picked up.
 */
export function SpineFace({ book, height, className = '' }: { book: Book; height: number; className?: string }) {
  return (
    <span className={`spine-face ${className}`} style={bookVars(book, height)} aria-hidden="true">
      <span className="spine-face__title">{book.title}</span>
      <span className="spine-face__author">{book.author.split(' ').at(-1)}</span>
    </span>
  )
}

interface Book3DProps {
  book: Book
  /** Rendered height of the book in px; width and thickness follow from it. */
  height: number
  /** Content placed between the pages (z = 0), e.g. the price tag. */
  children?: ReactNode
}

export function Book3D({ book, height, children }: Book3DProps) {
  const width = height * COVER_RATIO
  const thickness = book.thickness * (height / book.height)
  const style = {
    ...bookVars(book, height),
    '--w': `${width}px`,
    '--t': `${thickness}px`,
  } as CSSProperties

  return (
    <div className="book3d" style={style}>
      <div className="book3d__face book3d__front">
        <span className="cover__title">{book.title}</span>
        <span className="cover__ornament" />
        <span className="cover__author">{book.author}</span>
      </div>
      <div className="book3d__face book3d__back" />
      <SpineFace book={book} height={height} className="book3d__face book3d__spine" />
      <div className="book3d__face book3d__pages book3d__pages--side" />
      <div className="book3d__face book3d__pages book3d__pages--top" />
      <div className="book3d__face book3d__pages book3d__pages--bottom" />
      {children}
    </div>
  )
}
