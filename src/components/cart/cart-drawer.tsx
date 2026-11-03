"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Photo } from "@/components/shared/photo"
import { QtyStepper } from "@/components/shared/qty-stepper"
import { useCart } from "@/hooks/use-cart"
import { money } from "@/data/products"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()
  const freeAt = 100
  const remaining = Math.max(0, freeAt - cartTotal)
  const pct = Math.min(100, (cartTotal / freeAt) * 100)

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" showCloseButton={false} className="w-full sm:w-[420px] flex flex-col p-0 bg-card border-l border-border">
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex justify-between items-center">
            <SheetTitle className="font-display text-[22px] font-semibold tracking-tight">
              Your bag{" "}
              <span className="font-sans text-sm text-muted-foreground font-normal tabular-nums">({cartCount})</span>
            </SheetTitle>
            <button onClick={onClose} aria-label="Close cart" className="icon-btn -mr-2">
              <X size={20} />
            </button>
          </div>
        </SheetHeader>

        {/* Free shipping progress */}
        {cartItems.length > 0 && (
          <div className="px-6 pt-4 pb-4">
            <p className="text-sm text-muted-foreground mb-2.5">
              {remaining > 0
                ? <><b className="text-foreground font-medium tabular-nums">{money(remaining)}</b> away from free shipping</>
                : <span className="text-orchid">You&apos;ve unlocked free shipping</span>}
            </p>
            <div className="h-1 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-orchid transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <hr className="border-border" />

        {/* Empty state */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-muted-foreground/40"><svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
            <div className="font-display text-2xl font-semibold tracking-tight">Your bag is empty</div>
            <p className="text-muted-foreground text-sm">Discover the new season and find your edit.</p>
            <Link href="/shop" onClick={onClose} className="btn-chalk mt-2">
              Shop new arrivals
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-4 py-5 border-b border-border last:border-0">
                  <div className="w-[84px] h-[106px] shrink-0 rounded-2xl overflow-hidden bg-secondary">
                    <Photo src={item.img} alt={item.name} eager className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <div className="font-display text-[15px] font-medium leading-snug">{item.name}</div>
                      <button onClick={() => removeFromCart(item.key)} aria-label={`Remove ${item.name}`}
                        className="icon-btn size-8 -mr-1.5 -mt-1 shrink-0 text-muted-foreground hover:text-foreground">
                        <X size={15} />
                      </button>
                    </div>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                      <span>{item.color}</span>
                      <span>Size {item.size}</span>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-3">
                      <QtyStepper
                        value={item.qty}
                        onChange={(v) => updateQuantity(item.key, v)}
                        className="h-10 text-sm"
                      />
                      <span className={`tabular-nums font-medium text-sm ${item.salePrice != null ? "text-sale" : ""}`}>
                        {money((item.salePrice ?? item.price) * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout panel */}
            <div className="px-6 py-5 border-t border-border">
              <div className="flex justify-between mb-1.5">
                <span className="text-muted-foreground text-sm">Subtotal</span>
                <span className="tabular-nums font-medium text-base">{money(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-5">
                <span>Shipping</span>
                <span>{remaining > 0 ? "Calculated at checkout" : "Free"}</span>
              </div>
              <button type="button" className="btn-silk btn-block">
                Checkout
                <span className="tabular-nums">{money(cartTotal)}</span>
              </button>
              <button onClick={onClose} className="btn-glass btn-block mt-3">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
