"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ProductCard } from "@/components/shared/product-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { PRODUCTS, type Product } from "@/data/products"
import { toast } from "sonner"

interface NewArrivalsProps {
  onOpen: (p: Product) => void
  onQuick: (p: Product) => void
}

export function NewArrivals({ onOpen, onQuick }: NewArrivalsProps) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const railRef = useRef<HTMLDivElement>(null)
  const items = PRODUCTS.filter((p) => p.isNew).slice(0, 8)

  const scroll = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 336, behavior: "smooth" })
  }

  return (
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-10 gap-5">
          <BlurFade delay={0}>
            <h2 className="h-section">New arrivals</h2>
            <p className="text-muted-foreground mt-3">Landed this week, in limited runs.</p>
          </BlurFade>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="icon-btn size-11 border border-border" aria-label="Scroll back">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} className="icon-btn size-11 border border-border" aria-label="Scroll forward">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={railRef}
        className="flex gap-5 overflow-x-auto no-scrollbar px-5 md:px-10 pb-2 scroll-px-5 md:scroll-px-10"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((p, i) => (
          <div key={p.id} className="flex-none w-[280px] md:w-[320px]" style={{ scrollSnapAlign: "start" }}>
            <ProductCard
              product={p}
              index={i}
              wished={isWishlisted(p.id)}
              onWish={() => toggleWishlist(p.id)}
              onOpen={onOpen}
              onQuick={onQuick}
              onAdd={(prod, opts) => {
                addToCart(prod, opts?.size ?? "M", opts?.color ?? prod.colors[0], opts?.qty ?? 1)
                toast.success(`${prod.name} added to bag`, { description: `Size ${opts?.size ?? "M"}` })
              }}
            />
          </div>
        ))}
        <div className="flex-none w-5" />
      </div>
      <div className="text-center mt-10">
        <Link href="/shop?filter=new" className="btn-glass">
          See all new arrivals
        </Link>
      </div>
    </section>
  )
}
