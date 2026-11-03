"use client"

import { useState } from "react"
import { Heart, Eye, Plus } from "lucide-react"
import { Photo } from "./photo"
import { ColorDots } from "./color-dots"
import { BlurFade } from "@/components/magicui/blur-fade"
import { money, type Product } from "@/data/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index?: number
  wished?: boolean
  onWish?: (id: number) => void
  onQuick?: (p: Product) => void
  onOpen?: (p: Product) => void
  onAdd?: (p: Product, opts?: { color: string; size: string; qty: number }) => void
}

function WishHeart({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className="heart-btn size-9 rounded-full flex items-center justify-center bg-[rgb(20_16_24/0.5)] backdrop-blur-md border border-white/15 text-white"
    >
      <Heart size={16} className={active ? "fill-sale text-sale" : ""} />
    </button>
  )
}

export function ProductCard({
  product, index = 0,
  wished = false, onWish, onQuick, onOpen, onAdd,
}: ProductCardProps) {
  const [hover, setHover] = useState(false)
  const sale = product.salePrice != null

  return (
    <BlurFade delay={index * 0.06} inView>
      <article className="flex flex-col">
        <div
          className="relative overflow-hidden cursor-pointer bg-card rounded-[22px] aspect-[3/4]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onOpen?.(product)}
        >
          <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
            {product.isNew && <span className="chip">New</span>}
            {sale && <span className="chip chip-sale">Sale</span>}
          </div>
          <div className="absolute top-3 right-3 z-10">
            <WishHeart active={wished} onClick={() => onWish?.(product.id)} />
          </div>

          <Photo
            src={product.img}
            alt={product.name}
            className={cn("absolute inset-0 pcard-img", hover && "scale-105")}
            eager={false}
          />
          <Photo
            src={product.img2}
            alt=""
            className={cn("absolute inset-0 transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")}
            eager={false}
          />

          {/* Hover actions (always visible on touch screens, where hover never fires) */}
          <div
            className={cn(
              "absolute inset-x-3 bottom-3 z-10 flex gap-2 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
              "[@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0",
              hover && "[@media(hover:hover)]:translate-y-0 [@media(hover:hover)]:opacity-100",
            )}
          >
            <button
              className="btn-chalk btn-sm flex-1 !px-3"
              onClick={(e) => { e.stopPropagation(); onAdd?.(product, { color: product.colors[0], size: "M", qty: 1 }) }}
            >
              <Plus size={16} /> Quick add
            </button>
            <button
              className="size-10 shrink-0 rounded-full bg-[rgb(20_16_24/0.55)] backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[rgb(20_16_24/0.8)] transition-colors"
              onClick={(e) => { e.stopPropagation(); onQuick?.(product) }}
              aria-label={`Quick view ${product.name}`}
            >
              <Eye size={17} />
            </button>
          </div>
        </div>

        <div className="pt-3.5 px-1">
          <div className="flex justify-between gap-3 items-start">
            <button
              type="button"
              className="text-left text-[15px] font-medium leading-snug hover:text-orchid transition-colors"
              onClick={() => onOpen?.(product)}
            >
              {product.name}
            </button>
            <span className="shrink-0 text-[15px] tabular-nums text-right">
              {sale ? (
                <>
                  <span className="text-sale font-medium">{money(product.salePrice!)}</span>
                  <span className="block text-xs text-muted-foreground line-through">{money(product.price)}</span>
                </>
              ) : (
                <span className="font-medium">{money(product.price)}</span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[13px] text-muted-foreground">{product.brand}</span>
            <ColorDots colors={product.colors} />
          </div>
        </div>
      </article>
    </BlurFade>
  )
}
