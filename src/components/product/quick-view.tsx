"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
      <DialogContent className="max-w-[840px] p-0 bg-card border-border rounded-3xl overflow-hidden">
        {p && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[400px] md:min-h-[500px] bg-secondary">
              <Photo src={p.img} alt={p.name} eager className="absolute inset-0 w-full h-full" />
            </div>
            <div className="p-9 relative">
              <div className="text-sm text-muted-foreground mb-2">{p.brand}</div>
              <h3 className="font-display text-[28px] font-semibold leading-tight tracking-tight">{p.name}</h3>
              <div className="flex items-center gap-4 my-3.5">
                {sale
                  ? <><span className="text-[20px] tabular-nums font-medium text-sale">{money(p.salePrice!)}</span><span className="text-[15px] tabular-nums text-muted-foreground line-through">{money(p.price)}</span></>
                  : <span className="text-[20px] tabular-nums font-medium">{money(p.price)}</span>}
                <Stars value={p.rating} size={13} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A considered piece in premium fabrication — relaxed, versatile, made to last.
              </p>

              <div className="mt-5">
                <div className="text-sm text-muted-foreground mb-2.5">Color: <span className="text-foreground">{color}</span></div>
                <div className="flex gap-2.5">
                  {p.colors.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)} title={c} aria-label={c} aria-pressed={color === c}
                      className={cn("w-7 h-7 rounded-full ring-offset-2 ring-offset-card transition-all", color === c ? "ring-2 ring-orchid" : "ring-1 ring-border")}
                      style={{ background: COLORS[c] }} />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm text-muted-foreground mb-2.5">Size{size ? `: ${size}` : ""}</div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
                      className={cn("min-w-[46px] h-[42px] px-3 rounded-full border text-sm transition-colors",
                        size === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground/40")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn-silk btn-block mt-6"
                onClick={() => {
                  if (!size) { toast.error("Please select a size"); return }
                  addToCart(p, size, color, 1)
                  toast.success(`${p.name} added to bag`, { description: `${color}, size ${size}` })
                  onClose()
                }}
              >
                Add to bag
              </button>
              <Link href={`/product/${p.id}`} onClick={onClose}
                className="link-u block w-fit mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground">
                View full details
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
