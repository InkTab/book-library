// Design controls for the demo page. Each setting has a default matching Bookshelf.css, and
// `designCss` turns the current values into override rules. Only changed settings produce CSS, so
// with every setting at its default the page is exactly the component's own design.

interface BaseSetting {
  key: string
  label: string
  group: string
}

export interface RangeSetting extends BaseSetting {
  type: 'range'
  min: number
  max: number
  step: number
  default: number
  unit: string
}

export interface ColorSetting extends BaseSetting {
  type: 'color'
  default: string
}

export type Setting = RangeSetting | ColorSetting

export const SETTINGS: Setting[] = [
  { type: 'range', group: 'Books', key: 'bookSize', label: 'Book size', min: 50, max: 150, step: 5, default: 100, unit: '%' },
  { type: 'range', group: 'Books', key: 'bookGap', label: 'Space between books', min: 0, max: 24, step: 1, default: 2, unit: 'px' },
  { type: 'range', group: 'Books', key: 'lean', label: 'Lean of leaning books', min: 0, max: 300, step: 10, default: 100, unit: '%' },
  { type: 'range', group: 'Books', key: 'lift', label: 'Hover lift', min: 0, max: 30, step: 1, default: 6, unit: 'px' },
  { type: 'range', group: 'Books', key: 'tip', label: 'Hover tilt', min: 0, max: 35, step: 1, default: 14, unit: '°' },
  { type: 'range', group: 'Books', key: 'spineText', label: 'Spine lettering', min: 60, max: 150, step: 5, default: 100, unit: '%' },

  { type: 'range', group: 'Shelves', key: 'lip', label: 'Shelf thickness', min: 0, max: 20, step: 1, default: 7, unit: 'px' },
  { type: 'range', group: 'Shelves', key: 'shelfGap', label: 'Space between shelves', min: 0, max: 40, step: 1, default: 6, unit: 'px' },
  { type: 'range', group: 'Shelves', key: 'shelfShadow', label: 'Shadow under shelves', min: 0, max: 1000, step: 25, default: 100, unit: '%' },
  { type: 'color', group: 'Shelves', key: 'wood', label: 'Wood', default: '#57311a' },
  { type: 'color', group: 'Shelves', key: 'woodLight', label: 'Wood highlight', default: '#6e4126' },
  { type: 'color', group: 'Shelves', key: 'backPanel', label: 'Back panel', default: '#2e190d' },

  { type: 'range', group: 'Open book', key: 'openSize', label: 'Open book height', min: 260, max: 560, step: 10, default: 440, unit: 'px' },
  { type: 'range', group: 'Open book', key: 'backdrop', label: 'Backdrop darkness', min: 0, max: 100, step: 5, default: 100, unit: '%' },
  { type: 'range', group: 'Open book', key: 'blur', label: 'Backdrop blur', min: 0, max: 16, step: 1, default: 3, unit: 'px' },

  { type: 'range', group: 'Page', key: 'headingSize', label: 'Heading size', min: 60, max: 160, step: 5, default: 100, unit: '%' },
  { type: 'color', group: 'Page', key: 'page', label: 'Page background', default: '#f4e7d7' },
  { type: 'color', group: 'Page', key: 'text', label: 'Heading colour', default: '#57311a' },
]

export type DesignValues = Record<string, number | string>

export const DEFAULTS: DesignValues = Object.fromEntries(SETTINGS.map((s) => [s.key, s.default]))

/** Rounds to 4 decimal places so the CSS stays readable. */
const n = (value: number) => Math.round(value * 10000) / 10000

/** Turns hex `#rrggbb` into `r, g, b`. */
function rgb(hex: string): string {
  const v = parseInt(hex.slice(1), 16)
  return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`
}

/**
 * Override rules for every setting that differs from its default. Selectors start with `:root` so they
 * outrank the component's own rules (including its hover rules) wherever the stylesheet is loaded.
 */
export function designCss(values: DesignValues): string {
  const v = { ...DEFAULTS, ...values }
  const num = (key: string) => Number(v[key])
  const str = (key: string) => String(v[key])
  const changed = (...keys: string[]) => keys.some((key) => v[key] !== DEFAULTS[key])
  const desktop: string[] = []
  const phone: string[] = []
  const all: string[] = []

  const size = num('bookSize') / 100
  const lift = num('lift')
  const tip = num('tip')

  if (changed('bookSize', 'tip', 'lift')) {
    // Room above the tallest book for the hovered book's lift and tilted top, which grows with all three.
    const reach = Math.max(tip, 14) / 14
    desktop.push(`:root .bks-bookcase {\n  --bks-shelf-scale: ${n(2 * size)};\n  --bks-headroom: ${Math.round(44 * size * reach + lift)}px;\n}`)
    phone.push(`:root .bks-bookcase {\n  --bks-shelf-scale: ${n(size)};\n  --bks-headroom: ${Math.round(33 * size * reach + lift / 2)}px;\n}`)
  }

  if (changed('bookGap')) all.push(`:root .bks-bookcase__row {\n  gap: ${num('bookGap')}px;\n}`)

  if (changed('lean')) {
    const f = n(num('lean') / 100)
    all.push(
      `:root .bks-bookcase__slot {\n  rotate: calc(var(--bks-tilt, 0deg) * ${f});\n}`,
      `:root .bks-bookcase__slot:hover {\n  rotate: 0deg;\n}`,
      `:root .bks-bookcase__slot[data-lean='left'] {\n  margin-left: calc(var(--bks-h) * sin(var(--bks-tilt) * ${-f}));\n}`,
      `:root .bks-bookcase__slot[data-lean='right'] {\n  margin-right: calc(var(--bks-h) * sin(var(--bks-tilt) * ${f}));\n}`,
    )
  }

  if (changed('lift')) {
    desktop.push(`:root .bks-spine:hover {\n  translate: 0 ${-lift}px;\n}`)
    phone.push(`:root .bks-spine:hover {\n  translate: 0 ${-lift / 2}px;\n}`)
  }

  if (changed('tip')) {
    all.push(`:root .bks-spine:hover .bks-book3d,\n:root .bks-spine:focus-visible .bks-book3d {\n  --bks-tip: ${-tip}deg;\n}`)
  }

  if (changed('spineText')) {
    const f = num('spineText') / 100
    all.push(
      `:root .bks-spine-face__title {\n  font-size: calc(var(--bks-h) * ${n(0.052 * f)});\n}`,
      `:root .bks-spine-face__author {\n  font-size: calc(var(--bks-h) * ${n(0.04 * f)});\n}`,
    )
  }

  if (changed('lip', 'shelfGap', 'shelfShadow', 'backPanel')) {
    const rules: string[] = []
    if (changed('lip')) rules.push(`  --bks-lip: calc(${num('lip')}px * var(--bks-shelf-scale));`)
    if (changed('shelfGap')) rules.push(`  margin-bottom: calc(${num('shelfGap')}px * var(--bks-shelf-scale));`)
    if (changed('shelfShadow', 'backPanel')) {
      const s = num('shelfShadow') / 100
      const panel = str('backPanel')
      rules.push(
        `  background:\n    linear-gradient(180deg, rgba(0, 0, 0, ${n(Math.min(0.0225 * s, 1))}), transparent 22%),\n    repeating-linear-gradient(90deg, ${panel} 0 3px, color-mix(in srgb, ${panel}, #fff 3%) 3px 7px);`,
        `  box-shadow: 0 6px 8px -4px rgba(0, 0, 0, ${n(Math.min(0.025 * s, 1))});`,
      )
    }
    all.push(`:root .bks-bookcase__shelf {\n${rules.join('\n')}\n}`)
  }

  if (changed('wood', 'woodLight')) {
    all.push(`:root .bks-bookshelf,\n:root .bks-stage {\n  --bks-wood: ${str('wood')};\n  --bks-wood-light: ${str('woodLight')};\n}`)
  }

  if (changed('text')) all.push(`:root .bks-bookshelf {\n  --bks-text: ${str('text')};\n}`)

  if (changed('openSize')) desktop.push(`:root .bks-stage {\n  --bks-h: min(${num('openSize')}px, 64vh);\n}`)

  if (changed('backdrop', 'blur')) {
    const d = num('backdrop') / 100
    all.push(
      `:root .bks-stage__backdrop {\n  background: radial-gradient(ellipse at 35% 50%, rgba(${rgb('#422514')}, ${n(0.92 * d)}), rgba(${rgb('#160c06')}, ${n(0.97 * d)}));\n  backdrop-filter: blur(${num('blur')}px);\n}`,
    )
  }

  if (changed('headingSize')) {
    all.push(`:root .bks-bookshelf__heading {\n  font-size: calc(clamp(2rem, 5vw, 2.75rem) * ${n(num('headingSize') / 100)});\n}`)
  }

  // The demo page's own background (index.css), not part of the component.
  if (changed('page')) all.push(`:root {\n  --page: ${str('page')};\n}`)

  const indent = (rules: string[]) => rules.map((rule) => rule.replace(/^/gm, '  ')).join('\n\n')
  return [
    ...all,
    desktop.length ? `@media (min-width: 760px) {\n${indent(desktop)}\n}` : '',
    phone.length ? `@media (max-width: 759px) {\n${indent(phone)}\n}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

/** Keeps only known keys with values of the right type and in range, e.g. from localStorage. */
export function cleanValues(input: unknown): DesignValues {
  const out: DesignValues = {}
  if (!input || typeof input !== 'object') return out
  const raw = input as Record<string, unknown>
  for (const s of SETTINGS) {
    const value = raw[s.key]
    if (s.type === 'range' && typeof value === 'number' && value >= s.min && value <= s.max) out[s.key] = value
    if (s.type === 'color' && typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) out[s.key] = value.toLowerCase()
  }
  return out
}
