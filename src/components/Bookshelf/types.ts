/**
 * A book as the bookshelf needs it. Map your database rows or API response to this shape;
 * only `id`, `title`, `author` and `price` are required.
 */
export interface Book {
  /** Stable, unique ID from your catalogue (SKU, ISBN, database key). Passed back to `onAddToCart`. */
  id: string
  title: string
  author: string
  /** Price in major currency units (e.g. 12.99). Displayed with the `formatPrice` prop. */
  price: number
  /** Edition shown in the details, e.g. "Hardcover" or "Paperback". Hidden when omitted. */
  format?: string
  description?: string
  /** How the book looks on the shelf. Anything omitted is derived from `id`, so a book always looks the same. */
  spine?: SpineStyle
}

export interface SpineStyle {
  /** Binding colour as a hex value, e.g. "#7a2e3a". */
  color?: string
  /** Spine height in px (about 185–245 fits the shelf). The shelf draws books at twice this size. */
  height?: number
  /** Spine thickness in px (about 24–75), also drawn at twice this size. */
  thickness?: number
}

export interface Shelf {
  /** Stable, unique ID for the shelf, e.g. a category key. */
  id: string
  label: string
  books: Book[]
}

/** Result of `onAddToCart`. Return a promise to show an "Adding…" state until your cart API answers. */
export type AddToCartResult = void | Promise<unknown>
