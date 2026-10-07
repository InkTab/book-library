import type { CSSProperties, ReactNode } from 'react'
import type { SpineLook } from './appearance'
import type { Book } from './types'

const colorVars = (look: SpineLook) => ({ '--bks-book': look.color, '--bks-ink': look.ink }) as CSSProperties

/**
 * The spine artwork. Rendered flat on the shelf and as the left face of the 3D book,
 * so both look identical at the moment the book is picked up.
 * Sizes follow `--bks-h`; pass `height` to set it, or leave it out to inherit it.
 */
export function SpineFace({ book, look, height, className = '' }: { book: Book; look: SpineLook; height?: number; className?: string }) {
  const style = { ...colorVars(look), ...(height !== undefined && { '--bks-h': `${height}px` }) } as CSSProperties
  return (
    <span className={`bks-spine-face ${className}`} style={style} aria-hidden="true">
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

/** A CSS 3D book. Its height comes from `--bks-h` (set in CSS); width and thickness follow from it. */
export function Book3D({ book, look, children }: Book3DProps) {
  const style = { ...colorVars(look), '--bks-spine-ratio': look.thickness / look.height } as CSSProperties

  return (
    <div className="bks-book3d" style={style}>
      <div className="bks-book3d__face bks-book3d__front">
        <span className="bks-cover__title">{book.title}</span>
        <span className="bks-cover__author">{book.author}</span>
      </div>
      <div className="bks-book3d__face bks-book3d__back" />
      <SpineFace book={book} look={look} className="bks-book3d__face bks-book3d__spine" />
      <div className="bks-book3d__face bks-book3d__pages bks-book3d__pages--side" />
      <div className="bks-book3d__face bks-book3d__pages bks-book3d__pages--top" />
      <div className="bks-book3d__face bks-book3d__pages bks-book3d__pages--bottom" />
      {children}
    </div>
  )
}
