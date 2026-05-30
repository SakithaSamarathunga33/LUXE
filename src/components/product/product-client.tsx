"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Ruler, Truck, RefreshCw, Heart } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Photo } from "@/components/shared/photo"
import { Stars } from "@/components/shared/stars"
import { QtyStepper } from "@/components/shared/qty-stepper"
import { ProductCard } from "@/components/shared/product-card"
import { SizeGuide } from "@/components/product/size-guide"
import { QuickView } from "@/components/product/quick-view"
import { Footer } from "@/components/layout/footer"
import { PRODUCTS, COLORS, SIZES, REVIEWS, money, type Product } from "@/data/products"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const DISABLED_SIZES = ["XS", "XXL"]

function Gallery({ product }: { product: Product }) {
  const imgs = [product.img, product.img2, U("1469334031218-e382a71b716b"), U("1487412720507-e7ab37603c6f")]
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
      <div className="flex flex-col gap-3">
        {imgs.map((src, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={cn("h-[100px] overflow-hidden border transition-all",
              active === i ? "border-luxe-ink opacity-100" : "border-luxe-line opacity-60 hover:opacity-90")}>
            <Photo src={src} alt="" className="w-full h-full" eager={i === 0} />
          </button>
        ))}
      </div>
      <div className="relative overflow-hidden bg-[#ece6dc] cursor-zoom-in"
        style={{ height: 640 }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Photo src={imgs[active]} alt={product.name} eager className="absolute inset-0 w-full h-full" key={active} />
        {zoom && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `url(${imgs[active]})`, backgroundSize: "200%", backgroundPosition: `${zoom.x}% ${zoom.y}%`, opacity: 0.999 }} />
        )}
        {product.salePrice != null && (
          <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[.18em] bg-luxe-gold text-luxe-ink px-2.5 py-1.5">SALE</span>
        )}
      </div>
    </div>
  )
}

export function ProductClient({ id }: { id: number }) {
  const router = useRouter()
  const product = PRODUCTS.find((p) => p.id === id)
  const [color, setColor] = useState<string>("")
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [showSticky, setShowSticky] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const buyRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    if (product) { setColor(product.colors[0]); setSize(null); setQty(1) }
  }, [product?.id])

  useEffect(() => {
    const el = buyRef.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    io.observe(el); return () => io.disconnect()
  }, [id])

  if (!product) return <div className="min-h-screen flex items-center justify-center"><p>Product not found</p></div>

  const sale = product.salePrice != null
  const wished = isWishlisted(product.id)

  const addItem = () => {
    if (!size) { toast.error("Please select a size"); return }
    addToCart(product, size, color, qty)
    toast.success(`${product.name} added to bag`, { description: `${color} · ${size}` })
  }

  const related = [
    ...PRODUCTS.filter((x) => x.id !== id && x.category === product.category),
    ...PRODUCTS.filter((x) => x.id !== id && x.category !== product.category),
  ].slice(0, 4)

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8">
        <nav className="flex items-center gap-2 font-mono text-[11px] text-luxe-muted tracking-[.05em] mb-7">
          <Link href="/" className="hover:text-luxe-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-luxe-ink transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-luxe-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-[1.15fr_1fr] gap-16 items-start pb-16">
          <Gallery product={product} />
          <div ref={buyRef} className="md:sticky md:top-[calc(var(--nav-h)+24px)]">
            <div className="eyebrow mb-3">{product.brand}</div>
            <h1 className="font-serif text-[clamp(28px,3.4vw,46px)] leading-[1.08]">{product.name}</h1>
            <div className="flex items-center gap-4 mt-4">
              {sale
                ? <><span className="font-mono text-2xl text-[#B2904E]">{money(product.salePrice!)}</span><span className="font-mono text-lg text-luxe-muted line-through">{money(product.price)}</span><span className="font-mono text-[11px] bg-luxe-gold text-luxe-ink px-2 py-1">-{Math.round((1 - product.salePrice! / product.price) * 100)}%</span></>
                : <span className="font-mono text-2xl">{money(product.price)}</span>}
            </div>
            <div className="flex items-center gap-2.5 mt-3.5">
              <Stars value={product.rating} size={15} />
              <span className="text-sm text-luxe-muted">{product.rating} · {product.reviewCount} reviews</span>
            </div>
            <hr className="border-luxe-line my-6" />
            <div className="flex justify-between items-center">
              <span className="eyebrow">Color — <span className="text-luxe-ink normal-case tracking-normal">{color}</span></span>
            </div>
            <div className="flex gap-3.5 mt-3.5">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} title={c}
                  className={cn("w-8 h-8 rounded-full ring-offset-2 transition-all",
                    color === c ? "ring-2 ring-luxe-ink" : "ring-1 ring-luxe-line")}
                  style={{ background: COLORS[c] }} />
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="eyebrow">Size{size ? ` — ${size}` : ""}</span>
              <button onClick={() => setSizeOpen(true)} className="flex items-center gap-1.5 text-luxe-muted text-sm hover:text-luxe-ink transition-colors">
                <Ruler size={15} /> Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-3.5">
              {SIZES.map((s) => {
                const disabled = DISABLED_SIZES.includes(s)
                return (
                  <button key={s} disabled={disabled} onClick={() => setSize(s)}
                    className={cn("min-w-[52px] h-11 px-3 border font-mono text-[12px] transition-colors",
                      disabled ? "opacity-30 line-through cursor-not-allowed" : size === s ? "bg-luxe-ink text-white border-luxe-ink" : "border-luxe-line hover:border-luxe-ink")}>
                    {s}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3.5 mt-8 items-stretch">
              <QtyStepper value={qty} onChange={setQty} className="h-12" />
              <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.5)" onClick={addItem}
                className="flex-1 h-12 font-mono text-xs tracking-widest text-luxe-ink">
                ADD TO CART — {money((sale ? product.salePrice! : product.price) * qty)}
              </ShimmerButton>
            </div>
            <button onClick={() => toggleWishlist(product.id)}
              className="w-full h-12 mt-3 border border-luxe-line flex items-center justify-center gap-2.5 font-mono text-xs tracking-widest hover:bg-luxe-paper transition-colors">
              <Heart size={17} className={wished ? "fill-luxe-ink" : ""} />
              {wished ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
            </button>
            <div className="flex gap-5 mt-5 py-4 border-t border-b border-luxe-line flex-wrap">
              <span className="flex items-center gap-2 text-[12.5px] text-luxe-muted"><Truck size={17} /> Free shipping over $100</span>
              <span className="flex items-center gap-2 text-[12.5px] text-luxe-muted"><RefreshCw size={16} /> 30-day returns</span>
            </div>
            <Accordion multiple defaultValue={["details"]} className="mt-1">
              <AccordionItem value="details" className="border-b border-luxe-line">
                <AccordionTrigger className="text-sm font-normal py-4">Description & Details</AccordionTrigger>
                <AccordionContent className="text-luxe-muted text-sm leading-relaxed">
                  <p>{product.name} in premium {color.toLowerCase()}. Cut from responsibly-sourced fabric.</p>
                  <ul className="mt-3 space-y-1 list-disc pl-4">
                    <li>Mid-weight, breathable fabrication</li>
                    <li>Model is 178cm / 5&apos;10&quot; wearing size S</li>
                    <li>Dry clean or cold gentle wash</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-b border-luxe-line">
                <AccordionTrigger className="text-sm font-normal py-4">Delivery & Shipping</AccordionTrigger>
                <AccordionContent className="text-luxe-muted text-sm leading-relaxed">
                  Standard delivery 3–5 business days. Free over $100. Express available at checkout.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns" className="border-b border-luxe-line">
                <AccordionTrigger className="text-sm font-normal py-4">Returns & Exchanges</AccordionTrigger>
                <AccordionContent className="text-luxe-muted text-sm leading-relaxed">
                  Free 30-day returns on unworn items with tags. Exchanges within 2 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Reviews */}
        <section className="py-16 border-t border-luxe-line">
          <div className="grid md:grid-cols-[300px_1fr] gap-14 items-start">
            <div>
              <div className="eyebrow mb-4">Reviews</div>
              <div className="font-serif text-[64px] leading-none">{product.rating}</div>
              <div className="my-2.5"><Stars value={product.rating} size={18} /></div>
              <div className="text-luxe-muted text-sm">Based on {product.reviewCount} reviews</div>
              <button className="mt-5 h-11 px-6 border border-luxe-line font-mono text-[11px] tracking-widest hover:bg-luxe-paper transition-colors">WRITE A REVIEW</button>
            </div>
            <div>
              {REVIEWS.map((r, i) => (
                <BlurFade key={i} delay={i * 0.08} inView>
                  <div className="py-6 border-b border-luxe-line last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <Stars value={r.rating} size={14} />
                      <span className="font-mono text-[11px] text-luxe-muted">{r.date}</span>
                    </div>
                    <div className="font-medium text-[15px] mb-2">{r.title}</div>
                    <p className="text-luxe-muted text-sm">{r.body}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="w-7 h-7 rounded-full bg-luxe-paper flex items-center justify-center font-mono text-[11px]">{r.name[0]}</span>
                      {r.name} {r.verified && <span className="font-mono text-[11px] text-[#B2904E]">✓ Verified</span>}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="pb-16">
          <h2 className="font-serif text-[clamp(26px,3vw,40px)] mb-9">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((rp, i) => (
              <ProductCard key={rp.id} product={rp} index={i}
                wished={isWishlisted(rp.id)}
                onWish={() => toggleWishlist(rp.id)}
                onOpen={(p) => router.push(`/product/${p.id}`)}
                onQuick={setQuickProduct}
                onAdd={(p, opts) => {
                  addToCart(p, opts?.size ?? "M", opts?.color ?? p.colors[0], opts?.qty ?? 1)
                  toast.success(`${p.name} added to bag`)
                }} />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky bar */}
      <div className={cn("fixed bottom-0 left-0 right-0 z-40 bg-luxe-bg/90 backdrop-blur-md border-t border-luxe-line transition-all duration-400",
        showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0")}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center gap-5 py-3">
          <div className="hidden md:block w-12 h-[52px] shrink-0">
            <Photo src={product.img} alt={product.name} eager className="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{product.name}</div>
            <div className="font-mono text-[12px] text-luxe-muted hidden md:block">{color}{size ? ` · ${size}` : ""}</div>
          </div>
          <span className="font-mono text-[17px]">{money(sale ? product.salePrice! : product.price)}</span>
          <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.5)" onClick={addItem}
            className="h-11 px-6 font-mono text-xs tracking-widest text-luxe-ink shrink-0">
            ADD TO CART
          </ShimmerButton>
        </div>
      </div>

      <SizeGuide open={sizeOpen} onClose={() => setSizeOpen(false)} />
      <QuickView product={quickProduct} open={!!quickProduct} onClose={() => setQuickProduct(null)} />
      <Footer />
    </div>
  )
}
