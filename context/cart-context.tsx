"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variants?: Record<string, string>
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize cart from localStorage on client side
  useEffect(() => {
    setMounted(true)
    const storedCart = localStorage.getItem("kureno-cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("kureno-cart")
      }
    }
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("kureno-cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Create a unique key that includes variants for comparison
      const itemKey = item.variants 
        ? `${item.id}-${JSON.stringify(item.variants)}`
        : item.id
      
      const existingItem = prevItems.find((i) => {
        const existingKey = i.variants 
          ? `${i.id}-${JSON.stringify(i.variants)}`
          : i.id
        return existingKey === itemKey
      })
      
      if (existingItem) {
        return prevItems.map((i) => {
          const existingKey = i.variants 
            ? `${i.id}-${JSON.stringify(i.variants)}`
            : i.id
          return existingKey === itemKey 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        })
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
