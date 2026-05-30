"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "New",        href: "/shop?filter=new" },
  { label: "Women",      href: "/shop?category=Women" },
  { label: "Men",        href: "/shop?category=Men" },
  { label: "Accessories",href: "/shop?category=Accessories" },
  { label: "Sale",       href: "/shop?filter=sale", accent: true },
]

interface NavbarProps {
  onCartOpen: () => void
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f()
    window.addEventListener("scroll", f, { passive: true })
    return () => window.removeEventListener("scroll", f)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
          scrolled
            ? "bg-luxe-bg/85 backdrop-blur-md border-b border-luxe-line"
            : "bg-transparent border-b border-transparent",
        )}
        style={{ height: "var(--nav-h)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center h-full gap-4">
          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="open menu"
          >
            <Menu size={22} />
          </button>

          {/* Nav links — left */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={cn(
                  "font-mono text-[11.5px] tracking-[.16em] uppercase hover:text-luxe-gold transition-colors",
                  l.accent && "text-[#B2904E]",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Logo — center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="font-serif text-[26px] font-bold tracking-[.24em] pl-[.24em]">
              LUXE
            </Link>
          </div>

          {/* Icons — right */}
          <div className="flex items-center gap-1 ml-auto">
            <button className="p-2 hover:text-luxe-gold transition-colors" aria-label="search"
              onClick={() => router.push("/shop")}>
              <Search size={20} />
            </button>
            <button className="p-2 hover:text-luxe-gold transition-colors relative" aria-label="wishlist"
              onClick={() => router.push("/shop")}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-luxe-ink text-white font-mono text-[9px] rounded-full flex items-center justify-center">
                  <NumberTicker value={wishlistCount} />
                </span>
              )}
            </button>
            <button className="p-2 hover:text-luxe-gold transition-colors relative" aria-label="cart"
              onClick={onCartOpen}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-luxe-gold text-luxe-ink font-mono text-[9px] rounded-full flex items-center justify-center">
                  <NumberTicker value={cartCount} />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[108]" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 bg-luxe-bg z-[109] flex flex-col transition-transform duration-400",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-between items-center p-6">
          <span className="font-serif text-2xl tracking-[.24em] pl-[.24em]">LUXE</span>
          <button onClick={() => setMobileOpen(false)} className="p-1"><X size={22} /></button>
        </div>
        <hr className="border-luxe-line" />
        <nav className="flex flex-col flex-1 overflow-y-auto">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex justify-between items-center px-6 py-5 font-serif text-2xl border-b border-luxe-line hover:bg-luxe-paper transition-colors",
                l.accent && "text-[#B2904E]",
              )}
            >
              {l.label} <ArrowRight size={18} />
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
