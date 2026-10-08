import type { CSSProperties, ReactNode } from 'react'
import type { SpineLook } from './appearance'
import type { Book } from './types'

const colorVars = (look: SpineLook) => ({ '--bks-book': look.color, '--bks-ink': look.ink }) as CSSProperties

/** The spine artwork: the left face of the 3D book. Sizes follow the inherited `--bks-h`. */
function SpineFace({ book, look, className = '' }: { book: Book; look: SpineLook; className?: string }) {
  return (
    <span className={`bks-spine-face ${className}`} style={colorVars(look)} aria-hidden="true">
      <span className="bks-spine-face__title">{book.title}</span>
      <span className="bks-spine-face__author">{book.author.split(' ').at(-1)}</span>
    </span>
  )
}

interface Book3DProps {
  book: Book
  look: SpineLook
  /** Content placed between the pages (z = 0), e.g. the price tag. */
  children?: ReactNode
}

/**
 * A CSS 3D book. Its height comes from `--bks-h`; width and thickness follow from it.
 * Built from spans so it can sit inside the spine button on the shelf.
 */
export function Book3D({ book, look, children }: Book3DProps) {
  const style = { ...colorVars(look), '--bks-spine-ratio': look.thickness / look.height } as CSSProperties

  return (
    <span className="bks-book3d" style={style}>
      <span className="bks-book3d__face bks-book3d__front">
        <span className="bks-cover__title">{book.title}</span>
        <span className="bks-cover__author">{book.author}</span>
      </span>
      <span className="bks-book3d__face bks-book3d__back" />
      <SpineFace book={book} look={look} className="bks-book3d__face bks-book3d__spine" />
      <span className="bks-book3d__face bks-book3d__pages bks-book3d__pages--side" />
      <span className="bks-book3d__face bks-book3d__pages bks-book3d__pages--top" />
      <span className="bks-book3d__face bks-book3d__pages bks-book3d__pages--bottom" />
      {children}
    </span>
  )
}
