/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { parseNumericPrice, getSizeSubLabel } from '../utils/priceUtils'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('crust-cart', [])

  const addToCart = useCallback(
    (item, sizeIndex = 0, quantity = 1) => {
      if (!item) return

      const isPizza =
        item.sectionTitle?.toLowerCase().includes('pizza') || item.name?.toLowerCase().includes('pizza')
      const priceObj = item.prices?.[sizeIndex] || item.prices?.[0] || { value: 0, label: 'Standard' }
      const sizeLabel = getSizeSubLabel(
        priceObj.label || (sizeIndex === 0 ? 'S' : sizeIndex === 1 ? 'M' : 'L'),
        isPizza,
      )
      const unitPrice = parseNumericPrice(priceObj.value)
      const cartItemId = `${item.id}-${priceObj.label || sizeIndex || 'standard'}`

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((ci) => ci.cartItemId === cartItemId)
        if (existingIndex > -1) {
          const nextCart = [...prevCart]
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: nextCart[existingIndex].quantity + quantity,
          }
          return nextCart
        }

        return [
          ...prevCart,
          {
            cartItemId,
            id: item.id,
            name: item.name,
            size: sizeLabel,
            sizeRaw: priceObj.label || '',
            price: unitPrice,
            quantity,
            image: item.image || item.sectionImage || '',
            veg: item.veg ?? true,
            sectionTitle: item.sectionTitle || '',
          },
        ]
      })
    },
    [setCart],
  )

  const updateQuantity = useCallback(
    (cartItemId, delta) => {
      setCart((prevCart) => {
        return prevCart
          .map((ci) => {
            if (ci.cartItemId === cartItemId) {
              const newQty = ci.quantity + delta
              return newQty > 0 ? { ...ci, quantity: newQty } : null
            }
            return ci
          })
          .filter(Boolean)
      })
    },
    [setCart],
  )

  const removeFromCart = useCallback(
    (cartItemId) => {
      setCart((prevCart) => prevCart.filter((ci) => ci.cartItemId !== cartItemId))
    },
    [setCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [setCart])

  const getItemQuantity = useCallback(
    (cartItemId) => {
      const found = cart.find((ci) => ci.cartItemId === cartItemId)
      return found ? found.quantity : 0
    },
    [cart],
  )

  const cartCount = useMemo(() => {
    return cart.reduce((acc, ci) => acc + (ci.quantity || 1), 0)
  }, [cart])

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, ci) => acc + (ci.price || 0) * (ci.quantity || 1), 0)
  }, [cart])

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
      cartCount,
      cartTotal,
    }),
    [cart, addToCart, updateQuantity, removeFromCart, clearCart, getItemQuantity, cartCount, cartTotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
