import { describe, expect, it } from 'vitest'
import { defaultFormatPrice, shelfTilts, spineLook } from './appearance'
import type { Book } from './types'

const book = (id: string, spine?: Book['spine']): Book => ({ id, title: 'T', author: 'A', price: 1, spine })

const LIGHT_INK = '#f3e9d2'
const DARK_INK = '#2a2118'

describe('spineLook', () => {
  it('gives the same book the same look every time', () => {
    expect(spineLook(book('sku-1'))).toEqual(spineLook(book('sku-1')))
  })

  it('varies the look between books', () => {
    const looks = Array.from({ length: 50 }, (_, i) => spineLook(book(`sku-${i}`)))
    expect(new Set(looks.map((l) => l.color)).size).toBeGreaterThan(10)
    expect(new Set(looks.map((l) => l.height)).size).toBeGreaterThan(10)
    expect(new Set(looks.map((l) => l.thickness)).size).toBeGreaterThan(10)
  })

  it('keeps derived sizes within what fits the shelf', () => {
    for (let i = 0; i < 500; i++) {
      const { height, thickness } = spineLook(book(`isbn-978${i}`))
      expect(height).toBeGreaterThanOrEqual(190)
      expect(height).toBeLessThan(240)
      expect(thickness).toBeGreaterThanOrEqual(28)
      expect(thickness).toBeLessThan(60)
    }
  })

  it('uses the values a shop supplies and derives only the rest', () => {
    const derived = spineLook(book('sku-7'))
    const look = spineLook(book('sku-7', { color: '#123456', thickness: 70 }))
    expect(look.color).toBe('#123456')
    expect(look.thickness).toBe(70)
    expect(look.height).toBe(derived.height)
  })

  it.each([
    ['#ffffff', DARK_INK],
    ['#fff', DARK_INK],
    ['#e3dccb', DARK_INK],
    ['#000000', LIGHT_INK],
    ['#2f3e5c', LIGHT_INK],
    ['#7A2E3A', LIGHT_INK],
  ])('picks readable text on %s', (color, ink) => {
    expect(spineLook(book('x', { color })).ink).toBe(ink)
  })

  it('falls back to light text for colours it cannot read', () => {
    expect(spineLook(book('x', { color: 'rgb(10, 20, 30)' })).ink).toBe(LIGHT_INK)
    expect(spineLook(book('x', { color: 'navy' })).ink).toBe(LIGHT_INK)
  })
})

describe('shelfTilts', () => {
  const books = (count: number, spine?: (i: number) => Book['spine']) =>
    Array.from({ length: count }, (_, i) => book(`sku-${i}`, spine?.(i)))
  const leaning = (tilts: number[]) => tilts.flatMap((t, i) => (t === 0 ? [] : [i]))

  it('leans two or three books per row, with 2–5 upright books between them', () => {
    for (let shelf = 0; shelf < 200; shelf++) {
      const tilts = shelfTilts(`shelf-${shelf}`, books(30))
      const at = leaning(tilts)
      expect(at.length).toBeGreaterThanOrEqual(2)
      expect(at.length).toBeLessThanOrEqual(3)
      for (let i = 1; i < at.length; i++) {
        expect(at[i] - at[i - 1] - 1).toBeGreaterThanOrEqual(2)
        expect(at[i] - at[i - 1] - 1).toBeLessThanOrEqual(5)
      }
      for (const i of at) expect(Math.abs(tilts[i])).toBeGreaterThanOrEqual(1.5)
      for (const i of at) expect(Math.abs(tilts[i])).toBeLessThanOrEqual(3)
    }
  })

  it('places them differently on different shelves, and the same on every load', () => {
    expect(shelfTilts('classics', books(30))).toEqual(shelfTilts('classics', books(30)))
    const placements = new Set(Array.from({ length: 50 }, (_, i) => leaning(shelfTilts(`shelf-${i}`, books(30))).join()))
    expect(placements.size).toBeGreaterThan(20)
  })

  it('leans both ways', () => {
    const all = Array.from({ length: 50 }, (_, i) => shelfTilts(`shelf-${i}`, books(30))).flat()
    expect(all.some((t) => t < 0) && all.some((t) => t > 0)).toBe(true)
  })

  it('leans fewer books on short rows, never two close together', () => {
    expect(shelfTilts('a', [])).toEqual([])
    for (let count = 1; count <= 8; count++) {
      for (let shelf = 0; shelf < 50; shelf++) {
        const at = leaning(shelfTilts(`shelf-${shelf}`, books(count)))
        expect(at.length).toBeGreaterThanOrEqual(1)
        expect(at.length).toBeLessThanOrEqual(count < 4 ? 1 : 3)
        for (let i = 1; i < at.length; i++) expect(at[i] - at[i - 1] - 1).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('uses a tilt a book supplies, including 0 to stand it up straight', () => {
    const derived = shelfTilts('classics', books(30))
    const first = derived.findIndex((t) => t !== 0)
    const tilts = shelfTilts('classics', books(30, (i) => (i === first ? { tilt: 0 } : i === 0 ? { tilt: -2 } : undefined)))
    expect(tilts[first]).toBe(0)
    expect(tilts[0]).toBe(-2)
  })
})

describe('defaultFormatPrice', () => {
  it('formats US dollars', () => {
    expect(defaultFormatPrice(12.5)).toBe('$12.50')
    expect(defaultFormatPrice(1234)).toBe('$1,234.00')
  })
})
