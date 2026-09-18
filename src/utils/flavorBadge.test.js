import { describe, it, expect } from 'vitest'
import { getFlavorBadge } from './flavorBadge'

describe('getFlavorBadge', () => {
  it('returns null for empty or undefined item', () => {
    expect(getFlavorBadge(null)).toBeNull()
    expect(getFlavorBadge(undefined)).toBeNull()
  })

  it('detects Spicy flavor profile', () => {
    const item = { name: 'Peri Peri Fries', toppings: 'Spicy peri peri mix' }
    const badge = getFlavorBadge(item)
    expect(badge).toEqual(
      expect.objectContaining({
        emoji: '🌶️',
        label: 'Spicy',
      }),
    )
  })

  it('detects Cheesy flavor profile', () => {
    const item = { name: 'Double Cheese Margherita', toppings: 'Extra mozzarella' }
    const badge = getFlavorBadge(item)
    expect(badge).toEqual(
      expect.objectContaining({
        emoji: '🧀',
        label: 'Cheesy',
      }),
    )
  })

  it('detects Tandoori flavor profile', () => {
    const item = { name: 'Paneer Tikka Stuffed', toppings: 'Marinated paneer' }
    const badge = getFlavorBadge(item)
    expect(badge).toEqual(
      expect.objectContaining({
        emoji: '🔥',
        label: 'Tandoori',
      }),
    )
  })

  it('detects Chilled drink profile', () => {
    const item = { name: 'Cold Coffee with Ice Cream' }
    const badge = getFlavorBadge(item, 'Drinks Corner')
    expect(badge).toEqual(
      expect.objectContaining({
        emoji: '❄️',
        label: 'Chilled',
      }),
    )
  })
})
