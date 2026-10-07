const LIGHT_INK = '#f3e9d2'
const DARK_INK = '#2a2118'

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Picks whichever ink has the higher contrast ratio against the binding colour. */
export function inkFor(hex: string): string {
  const l = luminance(hex)
  const onLight = (luminance(LIGHT_INK) + 0.05) / (l + 0.05)
  const onDark = (l + 0.05) / (luminance(DARK_INK) + 0.05)
  return onLight >= onDark ? LIGHT_INK : DARK_INK
}
