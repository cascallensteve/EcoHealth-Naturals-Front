import React, { createContext, useCallback, useMemo, useState } from 'react'

export type CartItem = {
  id: number
  title: string
  price: number
  img?: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id)
      if (idx !== -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity }
        return copy
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => ({ items, addItem, removeItem, updateQuantity, clear }), [items, addItem, removeItem, updateQuantity, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
