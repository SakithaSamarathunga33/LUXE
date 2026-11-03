"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/shared/product-card"
import { QuickView } from "@/components/product/quick-view"
import { SizeGuide } from "@/components/product/size-guide"
import { Footer } from "@/components/layout/footer"
import { BlurFade } from "@/components/magicui/blur-fade"
import { PRODUCTS, COLORS, SIZES, type Product } from "@/data/products"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))]
const ALL_COLORS = [...new Set(PRODUCTS.flatMap((p) => p.colors))]
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Bestselling"]
const CATEGORIES = ["Women", "Men", "Accessories"] as const

function FilterGroup({ title, open: initOpen = true, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(initOpen)
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full justify-between items-center py-5 text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown size={16} className={cn("text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}

function ShopContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const [category, setCategory] = useState<string>(params.get("category") ?? "all")
  const [onlyNew, setOnlyNew] = useState(params.get("filter") === "new")
  const [onlySale, setOnlySale] = useState(params.get("filter") === "sale")
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(400)
  const [sort, setSort] = useState("Newest")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)

  useEffect(() => {
    setCategory(params.get("category") ?? "all")
    setOnlyNew(params.get("filter") === "new")
    setOnlySale(params.get("filter") === "sale")
  }, [params])

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]

  const filtered = useMemo(() => {
    let items = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false
      if (onlyNew && !p.isNew) return false
      if (onlySale && p.salePrice == null) return false
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false
      if (colors.length && !p.colors.some((c) => colors.includes(c))) return false
      if (brands.length && !brands.includes(p.brand)) return false
      if ((p.salePrice ?? p.price) > maxPrice) return false
      return true
    })
    return items.sort((a, b) => {
      const pa = a.salePrice ?? a.price, pb = b.salePrice ?? b.price
      if (sort === "Price: Low to High") return pa - pb
      if (sort === "Price: High to Low") return pb - pa
      if (sort === "Bestselling") return b.reviewCount - a.reviewCount
      return ((b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)) || (b.id - a.id)
    })
  }, [category, onlyNew, onlySale, sizes, colors, brands, maxPrice, sort])

  const title = onlySale ? "Sale" : onlyNew ? "New Arrivals" : category === "all" ? "All Clothing" : category

  const clearAll = () => {
    setCategory("all"); setOnlyNew(false); setOnlySale(false)
    setSizes([]); setColors([]); setBrands([]); setMaxPrice(400)
  }

  const SidebarContent = (
    <div className="space-y-0">
      <FilterGroup title="Category">
        <div className="space-y-1">
          {["all", ...CATEGORIES].map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={cn("block w-full text-left py-1.5 px-3 rounded-full text-sm transition-colors hover:text-foreground",
                category === c ? "bg-secondary text-foreground font-medium" : "text-muted-foreground")}>
              {c === "all" ? "All" : c}
            </button>
          ))}
          <label className="flex items-center gap-2.5 py-2 px-3 text-sm cursor-pointer text-muted-foreground hover:text-foreground">
            <Checkbox checked={onlyNew} onCheckedChange={(v) => setOnlyNew(!!v)} />
            New arrivals only
          </label>
          <label className="flex items-center gap-2.5 py-1 px-3 text-sm cursor-pointer text-muted-foreground hover:text-foreground">
            <Checkbox checked={onlySale} onCheckedChange={(v) => setOnlySale(!!v)} />
            On sale
          </label>
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button key={s} type="button" onClick={() => setSizes(toggle(sizes, s))} aria-pressed={sizes.includes(s)}
              className={cn("min-w-[44px] h-10 px-3 rounded-full border text-sm transition-colors",
                sizes.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground/40")}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5 pt-1">
          {ALL_COLORS.map((c) => (
            <button key={c} type="button" title={c} aria-label={c} aria-pressed={colors.includes(c)} onClick={() => setColors(toggle(colors, c))}
              className={cn("w-7 h-7 rounded-full ring-offset-2 ring-offset-background transition-all",
                colors.includes(c) ? "ring-2 ring-orchid" : "ring-1 ring-border")}
              style={{ background: COLORS[c] }} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="pt-3">
          <Slider min={40} max={400} step={5} value={[maxPrice]}
            onValueChange={(v) => { const arr = Array.isArray(v) ? v : [v]; setMaxPrice(arr[0] as number) }} />
          <div className="flex justify-between mt-3 text-sm tabular-nums text-muted-foreground">
            <span>$40</span><span className="text-foreground font-medium">Up to ${maxPrice}</span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        {BRANDS.map((b) => (
          <label key={b} className="flex items-center gap-2.5 py-1.5 text-sm cursor-pointer text-muted-foreground hover:text-foreground">
            <Checkbox checked={brands.includes(b)} onCheckedChange={() => setBrands(toggle(brands, b))} />
            {b}
          </label>
        ))}
      </FilterGroup>

      <div className="pt-4">
        <button type="button" onClick={clearAll}
          className="link-u text-sm text-muted-foreground hover:text-foreground">
          Clear all filters
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-8 pb-2">
        <h1 className="h-section">{title}</h1>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
        <div className="grid md:grid-cols-[248px_1fr] gap-12 pt-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">{SidebarContent}</aside>

          {/* Main content */}
          <div>
            {/* Topbar */}
            <div className="flex justify-between items-center border-b border-border pb-4 mb-8 flex-wrap gap-3">
              <span className="text-sm tabular-nums text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="md:hidden btn-glass btn-sm"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
                <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                  <SelectTrigger className="w-[190px] h-10 rounded-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <BlurFade inView>
                <div className="py-20 text-center text-muted-foreground">
                  <div className="font-display text-2xl font-semibold text-foreground mb-2">Nothing matches yet</div>
                  <p>Try widening your filters.</p>
                </div>
              </BlurFade>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    wished={isWishlisted(p.id)}
                    onWish={() => toggleWishlist(p.id)}
                    onOpen={(prod) => router.push(`/product/${prod.id}`)}
                    onQuick={setQuickProduct}
                    onAdd={(prod, opts) => {
                      addToCart(prod, opts?.size ?? "M", opts?.color ?? prod.colors[0], opts?.qty ?? 1)
                      toast.success(`${prod.name} added to bag`, { description: `Size ${opts?.size ?? "M"}` })
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet open={filtersOpen} onOpenChange={(o) => !o && setFiltersOpen(false)}>
        <SheetContent side="left" className="w-[330px] bg-background border-r border-border flex flex-col p-0">
          <div className="flex justify-between items-center p-6">
            <span className="font-display text-2xl font-semibold">Filters</span>
            <button type="button" className="icon-btn" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={20} /></button>
          </div>
          <hr className="border-border" />
          <div className="flex-1 overflow-y-auto px-6 py-2">{SidebarContent}</div>
          <div className="p-5 border-t border-border">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn-chalk btn-block"
            >
              Show {filtered.length} items
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <QuickView product={quickProduct} open={!!quickProduct} onClose={() => setQuickProduct(null)} />
      <SizeGuide open={sizeOpen} onClose={() => setSizeOpen(false)} />
      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-sm text-muted-foreground">Loading...</span></div>}>
      <ShopContent />
    </Suspense>
  )
}
