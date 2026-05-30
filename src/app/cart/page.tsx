"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BorderBeam } from "@/components/magicui/border-beam"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Photo } from "@/components/shared/photo"
import { QtyStepper } from "@/components/shared/qty-stepper"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/hooks/use-cart"
import { money } from "@/data/products"

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()
  const [promo, setPromo] = useState("")
  const shipping = cartTotal >= 100 ? 0 : 12
  const estimated = cartTotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-6">
        <ShoppingBag size={56} className="text-luxe-line" />
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <p className="text-luxe-muted text-base max-w-xs">Discover the new season and find your edit.</p>
        <Link href="/shop"
          className="mt-2 px-8 py-3.5 bg-luxe-ink text-white font-mono text-xs tracking-widest hover:bg-luxe-gold hover:text-luxe-ink transition-colors">
          START SHOPPING
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 pb-20">
        <BlurFade delay={0}>
          <h1 className="font-serif text-[clamp(32px,4vw,56px)] mb-10">
            Your Bag{" "}
            <span className="font-mono text-lg text-luxe-muted font-normal">({cartCount})</span>
          </h1>
        </BlurFade>

        <div className="grid md:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Cart items */}
          <div>
            {cartItems.map((item, i) => (
              <BlurFade key={item.key} delay={i * 0.06} inView>
                <div className="flex gap-4 py-7 border-b border-luxe-line last:border-0">
                  <Link href={`/product/${item.id}`} className="w-[90px] h-[112px] shrink-0 bg-[#ece6dc] block">
                    <Photo src={item.img} alt={item.name} eager className="w-full h-full" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="eyebrow text-[9.5px] mb-1">{item.category}</div>
                        <Link href={`/product/${item.id}`} className="text-sm font-medium leading-snug hover:text-luxe-gold transition-colors">
                          {item.name}
                        </Link>
                      </div>
                      <button onClick={() => removeFromCart(item.key)}
                        className="p-1 text-luxe-muted hover:text-luxe-ink transition-colors shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-luxe-muted mt-1.5">
                      {item.color} · Size {item.size}
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <QtyStepper
                        value={item.qty}
                        onChange={(v) => updateQuantity(item.key, v)}
                        className="h-10"
                      />
                      <div className="text-right">
                        <div className={`font-mono text-sm ${item.salePrice != null ? "text-[#B2904E]" : ""}`}>
                          {money((item.salePrice ?? item.price) * item.qty)}
                        </div>
                        {item.qty > 1 && (
                          <div className="font-mono text-[11px] text-luxe-muted">
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
            <div className="relative bg-luxe-paper border border-luxe-line p-7 sticky top-[calc(var(--nav-h)+24px)]">
              <BorderBeam colorFrom="#C9A96E" colorTo="#B2904E" duration={20} borderWidth={1} />
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-luxe-muted">Subtotal ({cartCount} items)</span>
                  <span className="font-mono">{money(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxe-muted">Shipping</span>
                  <span className="font-mono">{shipping === 0 ? "Free" : money(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-[12px] text-luxe-muted">
                    Add {money(100 - cartTotal)} more for free shipping
                  </div>
                )}
              </div>

              <hr className="border-luxe-line mb-4" />
              <div className="flex justify-between font-medium mb-7">
                <span>Estimated Total</span>
                <span className="font-mono text-lg">{money(estimated)}</span>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-muted" />
                  <Input
                    placeholder="Promo code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="pl-9 border-luxe-line font-mono text-[12px] focus-visible:ring-luxe-gold"
                  />
                </div>
                <button className="px-4 border border-luxe-line font-mono text-[11px] tracking-widest hover:bg-luxe-ink hover:text-white hover:border-luxe-ink transition-colors">
                  APPLY
                </button>
              </div>

              <ShimmerButton
                background="#C9A96E"
                shimmerColor="rgba(255,255,255,0.5)"
                className="w-full h-13 py-4 font-mono text-xs tracking-widest text-luxe-ink"
              >
                CHECKOUT · {money(estimated)}
              </ShimmerButton>

              <div className="text-center mt-4">
                <Link href="/shop" className="text-sm text-luxe-muted hover:text-luxe-ink transition-colors">
                  Continue Shopping
                </Link>
              </div>

              {/* Payment icons */}
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                {["VISA", "MC", "AMEX", "PAYPAL", "APPLE"].map((t) => (
                  <span key={t} className="font-mono text-[9.5px] tracking-[.08em] border border-luxe-line px-2 py-1.5 text-luxe-muted">
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
