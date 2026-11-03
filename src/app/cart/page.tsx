"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, X, Tag } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Photo } from "@/components/shared/photo"
import { QtyStepper } from "@/components/shared/qty-stepper"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/hooks/use-cart"
import { money } from "@/data/products"

const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"]

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()
  const [promo, setPromo] = useState("")
  const shipping = cartTotal >= 100 ? 0 : 12
  const estimated = cartTotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-6">
        <ShoppingBag size={56} strokeWidth={1.25} className="text-muted-foreground/40" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="text-muted-foreground text-base max-w-xs">Discover the new season and find your edit.</p>
        <Link href="/shop" className="btn-chalk mt-2">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 pb-20">
        <BlurFade delay={0}>
          <h1 className="h-section mb-10">
            Your bag{" "}
            <span className="font-sans text-lg text-muted-foreground font-normal tracking-normal tabular-nums">({cartCount})</span>
          </h1>
        </BlurFade>

        <div className="grid md:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Cart items */}
          <div>
            {cartItems.map((item, i) => (
              <BlurFade key={item.key} delay={i * 0.06} inView>
                <div className="flex gap-5 py-7 border-b border-border last:border-0">
                  <Link href={`/product/${item.id}`} className="w-[90px] h-[112px] shrink-0 rounded-2xl overflow-hidden bg-card block">
                    <Photo src={item.img} alt={item.name} eager className="w-full h-full" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-0.5">{item.category}</div>
                        <Link href={`/product/${item.id}`} className="font-display text-base font-medium leading-snug hover:text-orchid transition-colors">
                          {item.name}
                        </Link>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} aria-label={`Remove ${item.name}`}
                        className="icon-btn size-8 -mr-1.5 -mt-1 shrink-0 text-muted-foreground hover:text-foreground">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-1.5">
                      <span>{item.color}</span>
                      <span>Size {item.size}</span>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <QtyStepper
                        value={item.qty}
                        onChange={(v) => updateQuantity(item.key, v)}
                        className="h-10"
                      />
                      <div className="text-right">
                        <div className={`tabular-nums font-medium text-sm ${item.salePrice != null ? "text-sale" : ""}`}>
                          {money((item.salePrice ?? item.price) * item.qty)}
                        </div>
                        {item.qty > 1 && (
                          <div className="tabular-nums text-xs text-muted-foreground">
                            {money(item.salePrice ?? item.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Order summary */}
          <BlurFade delay={0.15} inView>
            <div className="bg-card border border-border rounded-3xl p-7 sticky top-[calc(var(--nav-h)+24px)]">
              <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">Order summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                  <span className="tabular-nums font-medium">{money(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="tabular-nums font-medium">{shipping === 0 ? "Free" : money(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Add <span className="text-foreground tabular-nums">{money(100 - cartTotal)}</span> more for free shipping
                  </div>
                )}
              </div>

              <hr className="border-border mb-4" />
              <div className="flex justify-between items-baseline font-medium mb-7">
                <span>Estimated total</span>
                <span className="tabular-nums text-lg">{money(estimated)}</span>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    aria-label="Promo code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="field pl-10 text-sm"
                  />
                </div>
                <button type="button" className="btn-glass px-5">
                  Apply
                </button>
              </div>

              <button type="button" className="btn-silk btn-block">
                Checkout
                <span className="tabular-nums">{money(estimated)}</span>
              </button>
              <Link href="/shop" className="btn-glass btn-block mt-3">
                Continue shopping
              </Link>

              {/* Payment methods */}
              <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
                {PAYMENT_METHODS.map((t) => (
                  <span key={t} className="chip text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
      <Footer />
    </div>
  )
}
