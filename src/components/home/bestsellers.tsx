"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ProductCard } from "@/components/shared/product-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { PRODUCTS, type Product } from "@/data/products"
import { toast } from "sonner"

interface BestsellersProps {
  onOpen: (p: Product) => void
  onQuick: (p: Product) => void
}

const TABS = ["All", "Tops", "Bottoms", "Outerwear"] as const

export function Bestsellers({ onOpen, onQuick }: BestsellersProps) {
  const [tab, setTab] = useState<string>("All")
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const items = PRODUCTS.filter(
    (p) => p.isBestseller && (tab === "All" || p.type === tab),
  ).slice(0, 8)

  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6 md:px-10">
      <div className="text-center mb-4">
        <BlurFade delay={0}><div className="eyebrow mb-3.5">Most Wanted</div></BlurFade>
        <BlurFade delay={0.1}><h2 className="font-serif text-[clamp(32px,4vw,52px)]">Bestsellers</h2></BlurFade>
      </div>

      <BlurFade delay={0.15} inView>
        <div className="flex justify-center my-8">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-transparent border-b border-luxe-line rounded-none h-auto p-0 gap-8">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-none font-mono text-[11px] tracking-[.14em] uppercase pb-3 px-0 border-b-2 border-transparent data-[state=active]:border-luxe-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none text-luxe-muted data-[state=active]:text-luxe-ink transition-all"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </BlurFade>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {items.map((p, i) => (
          <ProductCard
            key={p.id}
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
        ))}
      </div>
    </section>
  )
}
