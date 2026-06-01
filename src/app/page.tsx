"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { NewArrivals } from "@/components/home/new-arrivals"
import { MarqueeBanner } from "@/components/home/marquee-banner"
import { Bestsellers } from "@/components/home/bestsellers"
import { Newsletter } from "@/components/home/newsletter"
import { Footer } from "@/components/layout/footer"
import { QuickView } from "@/components/product/quick-view"
import { SizeGuide } from "@/components/product/size-guide"
import { type Product } from "@/data/products"

export default function HomePage() {
  const router = useRouter()
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const [sizeOpen, setSizeOpen] = useState(false)

  const handleOpen = (p: Product) => router.push(`/product/${p.id}`)

  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivals onOpen={handleOpen} onQuick={setQuickProduct} />
      <MarqueeBanner />
      <Bestsellers onOpen={handleOpen} onQuick={setQuickProduct} />
      <Newsletter />
      <Footer />
      <QuickView product={quickProduct} open={!!quickProduct} onClose={() => setQuickProduct(null)} />
      <SizeGuide open={sizeOpen} onClose={() => setSizeOpen(false)} />
    </>
  )
}
