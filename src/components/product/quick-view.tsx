"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Photo } from "@/components/shared/photo"
import { Stars } from "@/components/shared/stars"
import { COLORS, SIZES, money, type Product } from "@/data/products"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"

interface QuickViewProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function QuickView({ product: p, open, onClose }: QuickViewProps) {
  const [color, setColor] = useState<string>("")
  const [size, setSize] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (p) { setColor(p.colors[0]); setSize(null) }
  }, [p])

  const sale = p?.salePrice != null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[840px] p-0 bg-luxe-bg border-luxe-line overflow-hidden">
        {p && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[400px] md:min-h-[500px] bg-[#ece6dc]">
              <Photo src={p.img} alt={p.name} eager className="absolute inset-0 w-full h-full" />
            </div>
            <div className="p-9 relative">
              <div className="eyebrow mb-2.5">{p.brand}</div>
              <h3 className="font-serif text-[28px] leading-tight">{p.name}</h3>
              <div className="flex items-center gap-4 my-3.5">
                {sale
                  ? <><span className="font-mono text-[20px] text-[#B2904E]">{money(p.salePrice!)}</span><span className="font-mono text-[15px] text-luxe-muted line-through">{money(p.price)}</span></>
                  : <span className="font-mono text-[20px]">{money(p.price)}</span>}
                <Stars value={p.rating} size={13} />
              </div>
              <p className="text-luxe-muted text-sm leading-relaxed">
                A considered piece in premium fabrication — relaxed, versatile, made to last.
              </p>

              <div className="mt-5">
                <div className="eyebrow mb-2.5">Color — <span className="text-luxe-ink">{color}</span></div>
                <div className="flex gap-2.5">
                  {p.colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} title={c}
                      className={cn("w-7 h-7 rounded-full ring-offset-2 transition-all", color === c ? "ring-2 ring-luxe-ink" : "ring-1 ring-luxe-line")}
                      style={{ background: COLORS[c] }} />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="eyebrow mb-2.5">Size{size ? ` — ${size}` : ""}</div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)}
                      className={cn("min-w-[46px] h-[42px] px-3 border font-mono text-[12px] transition-colors",
                        size === s ? "bg-luxe-ink text-white border-luxe-ink" : "border-luxe-line hover:border-luxe-ink")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <ShimmerButton
                background="#C9A96E"
                shimmerColor="rgba(255,255,255,0.5)"
                className="w-full h-12 mt-6 font-mono text-xs tracking-widest text-luxe-ink"
                onClick={() => {
                  if (!size) { toast.error("Please select a size"); return }
                  addToCart(p, size, color, 1)
                  toast.success(`${p.name} added to bag`, { description: `${color} · ${size}` })
                  onClose()
                }}
              >
                ADD TO CART
              </ShimmerButton>
              <Link href={`/product/${p.id}`} onClick={onClose}
                className="block text-center w-full mt-4 text-sm text-luxe-muted hover:text-luxe-ink transition-colors">
                View full details
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
