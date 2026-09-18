import { describe, it, expect } from 'vitest'
import {
  parseNumericPrice,
  parsePriceParts,
  formatPrice,
  getItemMinPrice,
  getSizeSubLabel,
  cleanPhone,
} from './priceUtils'

describe('priceUtils', () => {
  describe('parseNumericPrice', () => {
    it('returns number directly if passed a number', () => {
      expect(parseNumericPrice(199)).toBe(199)
      expect(parseNumericPrice(0)).toBe(0)
    })

    it('extracts number from string values', () => {
      expect(parseNumericPrice('199')).toBe(199)
      expect(parseNumericPrice('₹199')).toBe(199)
      expect(parseNumericPrice('199 (Small)')).toBe(199)
      expect(parseNumericPrice('Rs. 249/-')).toBe(249)
    })

    it('returns 0 for empty or invalid input', () => {
      expect(parseNumericPrice('')).toBe(0)
      expect(parseNumericPrice(null)).toBe(0)
      expect(parseNumericPrice(undefined)).toBe(0)
    })
  })

  describe('parsePriceParts', () => {
    it('splits packaging notes from price', () => {
      expect(parsePriceParts('149 (Packaging Fee 10 Rs)')).toEqual({
        price: '₹149',
        note: 'Packaging Fee 10 Rs',
      })
    })

    it('handles simple numeric strings', () => {
      expect(parsePriceParts('199')).toEqual({
        price: '₹199',
        note: '',
      })
    })

    it('handles empty inputs gracefully', () => {
      expect(parsePriceParts('')).toEqual({ price: '', note: '' })
      expect(parsePriceParts(null)).toEqual({ price: '', note: '' })
    })
  })

  describe('formatPrice', () => {
    it('formats price with rupee symbol', () => {
      expect(formatPrice(199)).toBe('₹199')
      expect(formatPrice('249')).toBe('₹249')
    })

    it('preserves note when present', () => {
      expect(formatPrice('149 (10 Rs Pack)')).toBe('₹149 (10 Rs Pack)')
    })
  })

  describe('getItemMinPrice', () => {
    it('finds minimum price from prices array', () => {
      const item = {
        name: 'Veggie Delight',
        prices: ['249', '149', '349'],
      }
      expect(getItemMinPrice(item)).toBe(149)
    })

    it('handles object prices array with value properties', () => {
      const item = {
        name: 'Farmhouse',
        prices: [{ value: '299' }, { value: '199' }],
      }
      expect(getItemMinPrice(item)).toBe(199)
    })

    it('returns 0 for items without prices', () => {
      expect(getItemMinPrice(null)).toBe(0)
      expect(getItemMinPrice({})).toBe(0)
      expect(getItemMinPrice({ prices: [] })).toBe(0)
    })
  })

  describe('getSizeSubLabel', () => {
    it('returns pizza inch sizing when isPizza is true', () => {
      expect(getSizeSubLabel('S', true)).toBe('7" Regular')
      expect(getSizeSubLabel('M', true)).toBe('10" Medium')
      expect(getSizeSubLabel('L', true)).toBe('12" Large')
    })

    it('returns descriptive word sizing when isPizza is false', () => {
      expect(getSizeSubLabel('S', false)).toBe('Small')
      expect(getSizeSubLabel('M', false)).toBe('Medium')
      expect(getSizeSubLabel('L', false)).toBe('Large')
    })

    it('defaults to Standard or input label for unknown codes', () => {
      expect(getSizeSubLabel('', false)).toBe('Standard')
      expect(getSizeSubLabel('XL', false)).toBe('XL')
    })
  })

  describe('cleanPhone', () => {
    it('strips non-digits and leading country code from phone strings', () => {
      expect(cleanPhone('+91 98765-43210')).toBe('9876543210')
      expect(cleanPhone('98765 43210')).toBe('9876543210')
      expect(cleanPhone('')).toBe('')
      expect(cleanPhone(null)).toBe('')
    })
  })
})
