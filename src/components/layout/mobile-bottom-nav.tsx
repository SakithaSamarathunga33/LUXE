"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, ShoppingBag, Menu } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  onCartOpen: () => void
}

export function MobileBottomNav({ onCartOpen }: MobileBottomNavProps) {
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  const items = [
    { key: "home",    icon: Home,        label: "Home",     href: "/" },
    { key: "search",  icon: Search,      label: "Search",   href: "/shop" },
    { key: "wish",    icon: Heart,       label: "Wishlist", href: "/shop", count: wishlistCount },
    { key: "cart",    icon: ShoppingBag, label: "Cart",     count: cartCount, cart: true },
    { key: "menu",    icon: Menu,        label: "Menu",     href: "/shop" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[88] bg-luxe-bg/90 backdrop-blur-md border-t border-luxe-line flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active = item.href === pathname
        const Icon = item.icon
        const inner = (
          <span className="relative flex flex-col items-center gap-[3px]">
            <span className="relative">
              <Icon size={21} />
              {(item.count ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-luxe-gold text-luxe-ink font-mono text-[8px] rounded-full flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </span>
            <span className="font-mono text-[8.5px] tracking-[.1em] uppercase">{item.label}</span>
          </span>
        )
        if (item.cart) {
          return (
            <button key={item.key} onClick={onCartOpen}
              className={cn("flex flex-col items-center", active ? "text-luxe-ink" : "text-luxe-muted")}>
              {inner}
            </button>
          )
        }
        return (
          <Link key={item.key} href={item.href!}
            className={cn("flex flex-col items-center", active ? "text-luxe-ink" : "text-luxe-muted")}>
            {inner}
          </Link>
        )
      })}
    </nav>
  )
}
