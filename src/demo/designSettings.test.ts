import { describe, expect, it } from 'vitest'
import { cleanValues, DEFAULTS, designCss, SETTINGS } from './designSettings'

describe('designCss', () => {
  it('adds nothing while every setting is at its default', () => {
    expect(designCss({})).toBe('')
    expect(designCss(DEFAULTS)).toBe('')
  })

  it('every setting produces CSS once it moves off its default', () => {
    for (const s of SETTINGS) {
      const value = s.type === 'range' ? (s.default === s.max ? s.min : s.max) : '#123456'
      expect(designCss({ [s.key]: value }), s.key).not.toBe('')
    }
  })

  it('scales the shelf for wide screens and phones separately', () => {
    const css = designCss({ bookSize: 150 })
    expect(css).toMatch(/@media \(min-width: 760px\) \{[^@]*--bks-shelf-scale: 3;/)
    expect(css).toMatch(/@media \(max-width: 759px\) \{[^@]*--bks-shelf-scale: 1\.5;/)
  })

  it('keeps hovered leaning books upright when the lean is scaled', () => {
    const css = designCss({ lean: 200 })
    expect(css).toContain('rotate: calc(var(--bks-tilt, 0deg) * 2)')
    expect(css).toMatch(/:root \.bks-bookcase__slot:hover \{\s*rotate: 0deg;/)
  })

  it('sets the hover tilt angle as a negative tip', () => {
    expect(designCss({ tip: 20 })).toContain('--bks-tip: -20deg')
  })
})

describe('cleanValues', () => {
  it('keeps known, valid values and drops the rest', () => {
    expect(cleanValues({ bookSize: 120, lift: 999, wood: '#ABCDEF', page: 'red', bogus: 1 })).toEqual({
      bookSize: 120,
      wood: '#abcdef',
    })
    expect(cleanValues(null)).toEqual({})
    expect(cleanValues('nope')).toEqual({})
  })
})
