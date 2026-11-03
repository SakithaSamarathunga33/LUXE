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

  // h-14 + bottom-2 = 64px, matching the body's pb-16.
  return (
    <nav className="md:hidden fixed inset-x-3 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-[88] h-14 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-lg shadow-black/40 flex justify-around items-center px-2">
      {items.map((item) => {
        const active = item.href === pathname
        const Icon = item.icon
        const itemClass = cn(
          "flex-1 h-full flex flex-col items-center justify-center rounded-full transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )
        const inner = (
          <span className="relative flex flex-col items-center gap-0.5">
            <span className="relative">
              <Icon size={20} />
              {(item.count ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-sale text-background text-[9px] font-semibold tabular-nums flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </span>
        )
        if (item.cart) {
          return (
            <button key={item.key} onClick={onCartOpen} className={itemClass}>
              {inner}
            </button>
          )
        }
        return (
          <Link key={item.key} href={item.href!} className={itemClass}>
            {inner}
          </Link>
        )
      })}
    </nav>
  )
}
