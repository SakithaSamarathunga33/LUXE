"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ProductCard } from "@/components/shared/product-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { PRODUCTS, type Product } from "@/data/products"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface BestsellersProps {
  onOpen: (p: Product) => void
  onQuick: (p: Product) => void
}

const TABS = ["All", "Tops", "Bottoms", "Outerwear"] as const

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Bestsellers({ onOpen, onQuick }: BestsellersProps) {
  const [tab, setTab] = useState<string>("All")
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.08 })

  const items = PRODUCTS.filter(
    (p) => p.isBestseller && (tab === "All" || p.type === tab),
  ).slice(0, 8)

  return (
    <section ref={sectionRef} className="py-24 max-w-[1280px] mx-auto px-5 md:px-10">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <BlurFade delay={0}>
          <h2 className="h-section">Bestsellers</h2>
          <p className="text-muted-foreground mt-3">What everyone is wearing this month.</p>
        </BlurFade>

        {/* Segmented control — the thumb slides between options */}
        <BlurFade delay={0.1} inView>
          <div role="tablist" aria-label="Filter bestsellers" className="inline-flex p-1 rounded-full bg-card border border-border">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative h-9 px-4 md:px-5 rounded-full text-sm font-medium transition-colors",
                  tab === t ? "text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="bestseller-thumb"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </BlurFade>
      </div>

      {/* key={tab} forces a remount on every tab switch so cards stagger in fresh */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          {items.map((p, i) => (
            <motion.div key={p.id} variants={cardAnim} custom={i}>
              <ProductCard
                product={p}
                index={0}
                wished={isWishlisted(p.id)}
                onWish={() => toggleWishlist(p.id)}
                onOpen={onOpen}
                onQuick={onQuick}
                onAdd={(prod, opts) => {
                  addToCart(prod, opts?.size ?? "M", opts?.color ?? prod.colors[0], opts?.qty ?? 1)
                  toast.success(`${prod.name} added to bag`, { description: `Size ${opts?.size ?? "M"}` })
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
