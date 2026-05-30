"use client"

import { createContext, useContext } from "react"
import { CartItem, Product } from "@/data/products"

export interface CartContextValue {
  cartItems: CartItem[]
  addToCart: (product: Product, size: string, color: string, qty: number) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, qty: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

export const CartContext = createContext<CartContextValue>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
})

export const useCart = () => useContext(CartContext)
