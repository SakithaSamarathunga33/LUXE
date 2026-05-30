"use client"

import { createContext, useContext } from "react"

export interface WishlistContextValue {
  wishlistIds: number[]
  toggleWishlist: (id: number) => void
  isWishlisted: (id: number) => boolean
  wishlistCount: number
}

export const WishlistContext = createContext<WishlistContextValue>({
  wishlistIds: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  wishlistCount: 0,
})

export const useWishlist = () => useContext(WishlistContext)
