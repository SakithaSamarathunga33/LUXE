import { PRODUCTS } from "@/data/products"
import { ProductClient } from "@/components/product/product-client"

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductClient id={Number(id)} />
}
