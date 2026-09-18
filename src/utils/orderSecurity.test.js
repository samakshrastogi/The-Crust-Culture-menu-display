import { describe, it, expect } from 'vitest'
import { generateOrderSecurity, verifyOrderToken } from './orderSecurity'

describe('orderSecurity', () => {
  const mockCart = [
    { name: 'Margherita Pizza', size: '7" Regular', quantity: 2, price: 149 },
    { name: 'Cold Coffee', size: 'Standard', quantity: 1, price: 99 },
  ]
  const mockTotal = 149 * 2 + 99 // 397

  it('generates cryptographic token and verification details', () => {
    const security = generateOrderSecurity({
      cart: mockCart,
      total: mockTotal,
      customerName: 'Samaksh',
      customerPhone: '9876543210',
      orderType: 'dine-in',
      cookingInstructions: 'Extra crispy crust',
    })

    expect(security.orderId).toMatch(/^TCC-\d{4}$/)
    expect(security.securityCode).toMatch(/^#CC-397-[0-9A-F]{4}$/)
    expect(security.token).toBeDefined()
    expect(security.token.length).toBeGreaterThan(20)
  })

  it('verifies a valid generated order token successfully', () => {
    const security = generateOrderSecurity({
      cart: mockCart,
      total: mockTotal,
      customerName: 'Aarav',
      customerPhone: '9876543210',
      orderType: 'takeaway',
      cookingInstructions: 'Less spicy',
    })

    const result = verifyOrderToken(security.token)
    expect(result.valid).toBe(true)
    expect(result.order).not.toBeNull()
    expect(result.order.customerName).toBe('Aarav')
    expect(result.order.orderType).toBe('takeaway')
    expect(result.order.total).toBe(mockTotal)
    expect(result.error).toBeNull()
  })

  it('detects tampering when total price does not match itemized sum', () => {
    const security = generateOrderSecurity({
      cart: mockCart,
      total: 100, // intentional mismatch: stated 100, item sum 397
      customerName: 'Hacker',
      customerPhone: '9876543210',
      orderType: 'dine-in',
      cookingInstructions: '',
    })

    const result = verifyOrderToken(security.token)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Price discrepancy detected')
  })

  it('rejects empty or corrupt tokens', () => {
    expect(verifyOrderToken('').valid).toBe(false)
    expect(verifyOrderToken('invalid-token-xyz').valid).toBe(false)
  })
})
