import type { Book } from './types'

// Fired Clay, Dune, Portobello, Lagoon and Wild Thyme, each with a darker and a lighter shade.
const PALETTE = [
  '#c1572f', '#974425', '#cf7f5e',
  '#d18730', '#a36925', '#dba25f',
  '#57311a', '#442614', '#83644f',
  '#1e3147', '#172637', '#5a646f',
  '#5f5f40', '#4a4a32', '#89856a',
]

const LIGHT_INK = '#f3e9d2'
const DARK_INK = '#2a2118'

export interface SpineLook {
  color: string
  /** Text colour that stays legible on `color`. */
  ink: string
  height: number
  thickness: number
  /** Lean on the shelf in degrees: negative leans left, positive right, 0 stands straight. */
  tilt: number
}

/** A small, stable string hash: FNV-1a, then the MurmurHash3 finaliser so every bit depends on every input bit. */
function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  // Without this, similar ids (sku-1, sku-2, …) share their high bits and get near-identical spines.
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
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
    tilt: book.spine?.tilt ?? deriveTilt(h >>> 24),
  }
}

/** About one book in four leans 1.5–3° to one side; the rest stand straight. */
function deriveTilt(bits: number): number {
  if (bits % 4 !== 0) return 0
  const angle = 1.5 + ((bits >>> 2) % 4) * 0.5
  return bits & 0x80 ? angle : -angle
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
