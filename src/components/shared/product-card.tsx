"use client"

import { useState } from "react"
import { Heart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Photo } from "./photo"
import { ColorDots } from "./color-dots"
import { Stars } from "./stars"
import { BlurFade } from "@/components/magicui/blur-fade"
import { money, type Product } from "@/data/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  variant?: "minimal" | "editorial" | "bordered"
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
      aria-label="wishlist"
      className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md transition-transform active:scale-90"
    >
      <Heart size={17} className={active ? "fill-[#B2904E] text-[#B2904E]" : "text-luxe-ink"} />
    </button>
  )
}

function ProductImage({ product, wished, onWish, onAdd, onQuick, onOpen, h }: {
  product: Product; wished: boolean; onWish: () => void
  onAdd: () => void; onQuick: () => void; onOpen: () => void; h: number
}) {
  const [hover, setHover] = useState(false)
  const mono = product.category === "Women" ? "W" : product.category === "Men" ? "M" : "A"
  const sale = product.salePrice != null
  return (
    <div
      className="relative overflow-hidden cursor-pointer bg-[#ece6dc]"
      style={{ height: h }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
    >
      {/* tags */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        {product.isNew && <Badge className="font-mono text-[9.5px] tracking-[.18em] bg-luxe-ink text-white hover:bg-luxe-ink rounded-none px-2 py-1">NEW</Badge>}
        {sale && <Badge className="font-mono text-[9.5px] tracking-[.18em] bg-luxe-gold text-luxe-ink hover:bg-luxe-gold rounded-none px-2 py-1">SALE</Badge>}
      </div>
      {/* wishlist */}
      <div className="absolute top-3.5 right-3.5 z-10">
        <WishHeart active={wished} onClick={onWish} />
      </div>
      {/* main image */}
      <Photo
        src={product.img}
        alt={product.name}
        className={cn("absolute inset-0 pcard-img transition-transform duration-500", hover && "scale-105")}
        eager={false}
      />
      {/* hover image */}
      <Photo
        src={product.img2}
        alt={product.name}
        className={cn("absolute inset-0 transition-opacity duration-400", hover ? "opacity-100" : "opacity-0")}
        eager={false}
      />
      {/* hover actions */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-3.5 flex gap-2 z-10 transition-all duration-400",
          hover ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        <button
          className="flex-1 h-11 bg-luxe-ink text-white text-xs font-mono tracking-widest hover:bg-luxe-gold hover:text-luxe-ink transition-colors"
          onClick={(e) => { e.stopPropagation(); onAdd() }}
        >
          QUICK ADD
        </button>
        <button
          className="w-11 h-11 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onQuick() }}
          aria-label="quick view"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  )
}

export function ProductCard({
  product, variant = "minimal", index = 0,
  wished = false, onWish, onQuick, onOpen, onAdd,
}: ProductCardProps) {
  const sale = product.salePrice != null
  const handleWish = () => onWish?.(product.id)
  const handleOpen = () => onOpen?.(product)
  const handleQuick = () => onQuick?.(product)
  const handleAdd = () => onAdd?.(product, { color: product.colors[0], size: "M", qty: 1 })

  const imgProps = { product, wished, onWish: handleWish, onAdd: handleAdd, onQuick: handleQuick, onOpen: handleOpen }

  if (variant === "editorial") {
    return (
      <BlurFade delay={index * 0.06} inView>
        <article className="flex flex-col">
          <ProductImage {...imgProps} h={460} />
          <div className="pt-4 flex justify-between gap-3 items-start">
            <div>
              <div className="font-serif text-[18px] leading-tight cursor-pointer hover:text-luxe-gold transition-colors" onClick={handleOpen}>{product.name}</div>
              <div className="mt-1.5"><ColorDots colors={product.colors} /></div>
            </div>
            <div className="text-right shrink-0">
              {sale
                ? <><div className="font-mono text-sm text-[#B2904E]">{money(product.salePrice!)}</div><div className="font-mono text-[11px] text-luxe-muted line-through">{money(product.price)}</div></>
                : <div className="font-mono text-sm">{money(product.price)}</div>}
            </div>
          </div>
        </article>
      </BlurFade>
    )
  }

  if (variant === "bordered") {
    return (
      <BlurFade delay={index * 0.06} inView>
        <article className="border border-luxe-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <ProductImage {...imgProps} h={340} />
          <div className="p-4 pb-[18px]">
            <div className="eyebrow text-[9.5px]">{product.brand}</div>
            <div className="flex justify-between gap-2 mt-1.5 items-baseline">
              <div className="text-sm font-medium cursor-pointer hover:text-luxe-gold transition-colors" onClick={handleOpen}>{product.name}</div>
              <div className={cn("font-mono text-[13px] shrink-0", sale && "text-[#B2904E]")}>{money(sale ? product.salePrice! : product.price)}</div>
            </div>
            <div className="flex justify-between items-center mt-2.5">
              <ColorDots colors={product.colors} />
              <Stars value={product.rating} size={12} />
            </div>
          </div>
        </article>
      </BlurFade>
    )
  }

  // minimal (default)
  return (
    <BlurFade delay={index * 0.06} inView>
      <article className="flex flex-col">
        <ProductImage {...imgProps} h={380} />
        <div className="pt-3.5">
          <div className="flex justify-between items-baseline gap-2">
            <span className="eyebrow text-[9.5px]">{product.brand}</span>
            <ColorDots colors={product.colors} />
          </div>
          <div className="flex justify-between gap-2 mt-2 items-baseline">
            <span className="text-[14.5px] font-medium cursor-pointer hover:text-luxe-gold transition-colors" onClick={handleOpen}>{product.name}</span>
            <span className="shrink-0">
              {sale
                ? <><span className="font-mono text-[13.5px] text-[#B2904E] mr-1.5">{money(product.salePrice!)}</span><span className="font-mono text-[11.5px] text-luxe-muted line-through">{money(product.price)}</span></>
                : <span className="font-mono text-[13.5px]">{money(product.price)}</span>}
            </span>
          </div>
        </div>
      </article>
    </BlurFade>
  )
}
