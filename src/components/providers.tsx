"use client"

import { useMemo, useState, useEffect, ReactNode } from "react"
import { CartContext } from "@/hooks/use-cart"
import { WishlistContext } from "@/hooks/use-wishlist"
import { CartItem, Product } from "@/data/products"

function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxe-cart")
      if (stored) setCartItems(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem("luxe-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product, size: string, color: string, qty: number) => {
    const key = `${product.id}-${color}-${size}`
    setCartItems((prev) => {
      const existing = prev.find((x) => x.key === key)
      if (existing) {
        return prev.map((x) => x.key === key ? { ...x, qty: x.qty + qty } : x)
      }
      return [
        ...prev,
        {
          key, id: product.id, name: product.name,
          price: product.price, salePrice: product.salePrice,
          img: product.img, category: product.category,
          color, size, qty,
        },
      ]
    })
  }

  const removeFromCart = (key: string) =>
    setCartItems((prev) => prev.filter((x) => x.key !== key))

  const updateQuantity = (key: string, qty: number) =>
    setCartItems((prev) =>
      qty < 1
        ? prev.filter((x) => x.key !== key)
        : prev.map((x) => x.key === key ? { ...x, qty } : x),
    )

  const clearCart = () => setCartItems([])

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.qty, 0),
    [cartItems],
  )
  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.qty, 0),
    [cartItems],
  )

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxe-wishlist")
      if (stored) setWishlistIds(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem("luxe-wishlist", JSON.stringify(wishlistIds))
  }, [wishlistIds])

  const toggleWishlist = (id: number) =>
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const isWishlisted = (id: number) => wishlistIds.includes(id)
  const wishlistCount = wishlistIds.length

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  )
}
