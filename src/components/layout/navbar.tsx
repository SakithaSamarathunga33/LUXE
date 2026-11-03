"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "New in",      href: "/shop?filter=new" },
  { label: "Women",       href: "/shop?category=Women" },
  { label: "Men",         href: "/shop?category=Men" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "Sale",        href: "/shop?filter=sale", accent: true },
]

interface NavbarProps {
  onCartOpen: () => void
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    // Over the homepage #hero the pill stays light-glass; it firms up once the
    // hero has scrolled past. Other pages fall back to a simple offset.
    const heroEl = document.getElementById("hero")

    if (!heroEl) {
      const f = () => setScrolled(window.scrollY > 40)
      f()
      window.addEventListener("scroll", f, { passive: true })
      return () => window.removeEventListener("scroll", f)
    }

    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: `-${navH}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 md:px-6 pt-3" style={{ height: "var(--nav-h)" }}>
        <div
          className={cn(
            "relative mx-auto max-w-[1240px] h-14 rounded-full flex items-center gap-2 pl-3 pr-2 md:pl-6",
            "border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500",
            scrolled
              ? "bg-card/80 border-border shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)]"
              : "bg-white/[0.06] border-white/10",
          )}
        >
          <button className="icon-btn md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="font-display text-[22px] font-bold tracking-[-0.04em] md:mr-6 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          >
            luxe<span className="text-silk">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={cn("link-u text-[14px]", l.accent ? "text-sale" : "text-foreground/80 hover:text-foreground")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center ml-auto md:ml-0">
            <button className="icon-btn" aria-label="Search" onClick={() => router.push("/shop")}>
              <Search size={19} />
            </button>
            <button className="icon-btn hidden sm:inline-flex" aria-label="Wishlist" onClick={() => router.push("/shop")}>
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-foreground text-background text-[10px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                  <NumberTicker value={wishlistCount} />
                </span>
              )}
            </button>
            <button
              className={cn(
                "ml-1 h-10 rounded-full bg-primary text-primary-foreground flex items-center gap-2 text-sm font-medium transition-transform active:scale-95",
                cartCount > 0 ? "pl-3.5 pr-4" : "w-10 justify-center",
              )}
              aria-label={`Open bag, ${cartCount} items`}
              onClick={onCartOpen}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="tabular-nums">
                  <NumberTicker value={cartCount} />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[108] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <div
        className={cn(
          "fixed top-3 left-3 bottom-3 w-[min(320px,85vw)] bg-card border border-border rounded-3xl z-[109] flex flex-col",
          "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex justify-between items-center p-5">
          <span className="font-display text-2xl font-bold tracking-[-0.04em]">luxe<span className="text-silk">.</span></span>
          <button onClick={() => setMobileOpen(false)} className="icon-btn" aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto px-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-4 py-3.5 rounded-2xl font-display text-3xl font-semibold tracking-[-0.03em] hover:bg-secondary transition-colors",
                l.accent && "text-sale",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
