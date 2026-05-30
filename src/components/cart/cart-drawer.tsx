"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
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
      <SheetContent side="right" showCloseButton={false} className="w-full sm:w-[420px] flex flex-col p-0 bg-luxe-bg border-l border-luxe-line">
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex justify-between items-center">
            <SheetTitle className="font-serif text-[22px] font-normal">
              Your Bag{" "}
              <span className="font-mono text-sm text-luxe-muted font-normal">({cartCount})</span>
            </SheetTitle>
            <button onClick={onClose} className="p-1 hover:text-luxe-gold transition-colors">
              <X size={20} />
            </button>
          </div>
        </SheetHeader>

        {/* Free shipping progress */}
        {cartItems.length > 0 && (
          <div className="px-6 pt-4 pb-3">
            <p className="text-[12.5px] text-luxe-muted mb-2">
              {remaining > 0
                ? <><b className="text-luxe-ink">{money(remaining)}</b> away from free shipping</>
                : <span className="text-[#B2904E]">You&apos;ve unlocked free shipping ✓</span>}
            </p>
            <div className="h-[3px] bg-luxe-line overflow-hidden">
              <div className="h-full bg-luxe-gold transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <hr className="border-luxe-line" />

        {/* Empty state */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-luxe-line"><svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
            <div className="font-serif text-2xl">Your bag is empty</div>
            <p className="text-luxe-muted text-sm">Discover the new season and find your edit.</p>
            <Link href="/shop" onClick={onClose}
              className="mt-2 px-6 py-3 bg-luxe-ink text-white font-mono text-xs tracking-widest hover:bg-luxe-gold hover:text-luxe-ink transition-colors">
              SHOP NEW ARRIVALS
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-3.5 py-5 border-b border-luxe-line last:border-0">
                  <div className="w-[84px] h-[106px] shrink-0 bg-[#ece6dc]">
                    <Photo src={item.img} alt={item.name} eager className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <div className="text-sm font-medium leading-snug">{item.name}</div>
                      <button onClick={() => removeFromCart(item.key)}
                        className="p-1 text-luxe-muted hover:text-luxe-ink transition-colors shrink-0">
                        <X size={15} />
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-luxe-muted mt-1 tracking-[.03em]">
                      {item.color} · {item.size}
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-3">
                      <QtyStepper
                        value={item.qty}
                        onChange={(v) => updateQuantity(item.key, v)}
                        className="h-10 text-sm"
                      />
                      <span className={`font-mono text-sm ${item.salePrice != null ? "text-[#B2904E]" : ""}`}>
                        {money((item.salePrice ?? item.price) * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout panel */}
            <div className="px-6 py-5 border-t border-luxe-line">
              <div className="flex justify-between mb-1.5">
                <span className="text-luxe-muted text-sm">Subtotal</span>
                <span className="font-mono text-base">{money(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[12.5px] text-luxe-muted mb-5">
                <span>Shipping</span>
                <span>{remaining > 0 ? "Calculated at checkout" : "Free"}</span>
              </div>
              <ShimmerButton
                background="#C9A96E"
                shimmerColor="rgba(255,255,255,0.95)"
                shimmerSize="2px"
                className="w-full h-12 font-mono text-xs tracking-widest text-luxe-ink"
              >
                CHECKOUT · {money(cartTotal)}
              </ShimmerButton>
              <button onClick={onClose}
                className="w-full mt-3.5 text-center text-sm text-luxe-muted hover:text-luxe-ink transition-colors">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
