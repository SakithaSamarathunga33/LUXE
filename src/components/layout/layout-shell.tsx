"use client"

import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/navbar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SmoothScroll } from "@/components/providers/smooth-scroll"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <SmoothScroll>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1" style={{ paddingTop: "var(--nav-h)" }}>
        {children}
      </main>
      <MobileBottomNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster position="top-right" richColors />
    </SmoothScroll>
  )
}
