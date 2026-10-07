import { describe, expect, it } from 'vitest'
import { defaultFormatPrice, spineLook } from './appearance'
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

describe('defaultFormatPrice', () => {
  it('formats US dollars', () => {
    expect(defaultFormatPrice(12.5)).toBe('$12.50')
    expect(defaultFormatPrice(1234)).toBe('$1,234.00')
  })
})
