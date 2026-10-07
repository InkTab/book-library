import type { Book } from './types'

const PALETTE = [
  '#7a2e3a', '#2f3e5c', '#3d4a3a', '#b08a3e', '#5b3a6b', '#1f4d5a', '#9c3d2b', '#c7a27a',
  '#4f6b52', '#6e8296', '#2b2b2b', '#c9b458', '#6b1d24', '#41505e', '#3c6e6a', '#a6553a',
  '#365b8c', '#5f7f3f', '#c08a2e', '#3b2f5e', '#b5654a', '#d08aa0', '#2d6a8a', '#a8432f',
]

const LIGHT_INK = '#f3e9d2'
const DARK_INK = '#2a2118'

export interface SpineLook {
  color: string
  /** Text colour that stays legible on `color`. */
  ink: string
  height: number
  thickness: number
}

/** FNV-1a: a small, stable string hash. */
function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** The book's shelf appearance: its own `spine` values, with gaps filled in from its id. */
export function spineLook(book: Book): SpineLook {
  const h = hash(book.id)
  const color = book.spine?.color ?? PALETTE[h % PALETTE.length]
  return {
    color,
    ink: inkFor(color),
    height: book.spine?.height ?? 190 + ((h >>> 8) % 50),
    thickness: book.spine?.thickness ?? 28 + ((h >>> 16) % 32),
  }
}

function luminance(hex: string): number | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex)
  if (!m) return null
  const full = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
  const n = parseInt(full, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Picks whichever ink has the higher contrast ratio against the binding colour. */
function inkFor(color: string): string {
  const l = luminance(color)
  // Non-hex colours (rgb(), names): assume a dark binding.
  if (l === null) return LIGHT_INK
  const onLight = (luminance(LIGHT_INK)! + 0.05) / (l + 0.05)
  const onDark = (l + 0.05) / (luminance(DARK_INK)! + 0.05)
  return onLight >= onDark ? LIGHT_INK : DARK_INK
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const defaultFormatPrice = (price: number) => usd.format(price)
