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
    <section className="py-20 bg-luxe-paper">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10 gap-5">
          <div>
            <BlurFade delay={0}><div className="eyebrow mb-3.5">Just Landed</div></BlurFade>
            <BlurFade delay={0.1}><h2 className="font-serif text-[clamp(32px,4vw,52px)]">New Arrivals</h2></BlurFade>
          </div>
          <div className="hidden md:flex gap-2.5">
            <button onClick={() => scroll(-1)} className="w-10 h-10 border border-luxe-line flex items-center justify-center hover:bg-luxe-ink hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} className="w-10 h-10 border border-luxe-line flex items-center justify-center hover:bg-luxe-ink hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={railRef}
        className="flex gap-5 overflow-x-auto no-scrollbar px-6 md:px-10 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((p, i) => (
          <div key={p.id} className="flex-none w-[300px] md:w-[320px]" style={{ scrollSnapAlign: "start" }}>
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
        <div className="flex-none w-10" />
      </div>
      <div className="text-center mt-8">
        <BlurFade delay={0.2} inView>
          <Link href="/shop?filter=new" className="font-mono text-[11px] tracking-[.16em] uppercase border-b border-luxe-ink pb-px hover:text-luxe-gold hover:border-luxe-gold transition-colors">
            View All New Arrivals
          </Link>
        </BlurFade>
      </div>
    </section>
  )
}
