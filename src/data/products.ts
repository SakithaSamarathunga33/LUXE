export interface Product {
  id: number
  name: string
  brand: string
  category: 'Women' | 'Men' | 'Accessories'
  type: 'Tops' | 'Bottoms' | 'Outerwear' | 'Bags'
  price: number
  salePrice?: number
  colors: string[]
  sizes: string[]
  img: string
  img2: string
  isNew: boolean
  isBestseller: boolean
  rating: number
  reviewCount: number
}

export interface CartItem {
  key: string
  id: number
  name: string
  price: number
  salePrice?: number
  img: string
  category: string
  color: string
  size: string
  qty: number
}

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const COLORS: Record<string, string> = {
  Black: '#1a1a1a', Ivory: '#efe9df', Camel: '#c19a6b', Sand: '#d7c7ad',
  Olive: '#6b6b48', Charcoal: '#3a3a3c', Rust: '#9e5a3a', Stone: '#a7a195',
  Navy: '#2b3349', Bone: '#e6e0d4', Slate: '#5d6470', Cream: '#f0ebe0',
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const PRODUCTS: Product[] = [
  {
    id: 1, brand: 'LUXE Atelier', name: 'Wool-Blend Tailored Coat',
    price: 340, category: 'Women', type: 'Outerwear',
    colors: ['Camel', 'Black', 'Stone'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8, reviewCount: 126, isNew: true, isBestseller: true,
    img: U('1539109136881-3be0616acf4b'), img2: U('1483985988355-763728e1935b'),
  },
  {
    id: 2, brand: 'LUXE Studio', name: 'Silk Slip Midi Dress',
    price: 210, category: 'Women', type: 'Tops',
    colors: ['Bone', 'Black', 'Rust'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7, reviewCount: 88, isNew: true, isBestseller: true,
    img: U('1595777457583-95e059d581b8'), img2: U('1490481651871-ab68de25d43d'),
  },
  {
    id: 3, brand: 'LUXE Atelier', name: 'Relaxed Linen Trouser',
    price: 150, salePrice: 118, category: 'Women', type: 'Bottoms',
    colors: ['Sand', 'Olive', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6, reviewCount: 64, isNew: false, isBestseller: true,
    img: U('1473966968600-fa801b869a1a'), img2: U('1551232864-3f0890e580d9'),
  },
  {
    id: 4, brand: 'LUXE Studio', name: 'Oversized Cashmere Knit',
    price: 240, category: 'Women', type: 'Tops',
    colors: ['Cream', 'Camel', 'Slate'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9, reviewCount: 204, isNew: true, isBestseller: true,
    img: U('1576566588028-4147f3842f27'), img2: U('1515886657613-9f3515b0c78f'),
  },
  {
    id: 5, brand: 'LUXE Atelier', name: 'Structured Blazer',
    price: 280, category: 'Men', type: 'Outerwear',
    colors: ['Charcoal', 'Navy', 'Camel'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7, reviewCount: 97, isNew: false, isBestseller: true,
    img: U('1507003211169-0a1dd7228f2d'), img2: U('1488161628813-04466f872be2'),
  },
  {
    id: 6, brand: 'LUXE Studio', name: 'Pleated Wide-Leg Pant',
    price: 165, category: 'Men', type: 'Bottoms',
    colors: ['Stone', 'Black', 'Olive'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5, reviewCount: 51, isNew: true, isBestseller: false,
    img: U('1473966968600-fa801b869a1a', 901), img2: U('1542272604-787c3835535d'),
  },
  {
    id: 7, brand: 'LUXE Studio', name: 'Heavyweight Cotton Tee',
    price: 60, category: 'Men', type: 'Tops',
    colors: ['Ivory', 'Black', 'Olive', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6, reviewCount: 312, isNew: false, isBestseller: true,
    img: U('1521572163474-6864f9cf17ab'), img2: U('1503341504253-dff4815485f1'),
  },
  {
    id: 8, brand: 'LUXE Atelier', name: 'Belted Trench Coat',
    price: 395, salePrice: 316, category: 'Women', type: 'Outerwear',
    colors: ['Sand', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9, reviewCount: 148, isNew: false, isBestseller: true,
    img: U('1591047139829-d91aecb6caea'), img2: U('1539533018447-63fcce2678e3'),
  },
  {
    id: 9, brand: 'LUXE Studio', name: 'Ribbed Turtleneck',
    price: 95, category: 'Men', type: 'Tops',
    colors: ['Charcoal', 'Bone', 'Rust'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.4, reviewCount: 73, isNew: true, isBestseller: false,
    img: U('1620799140408-edc6dcb6d633'), img2: U('1517445312882-b7c7a86a92dc'),
  },
  {
    id: 10, brand: 'LUXE Atelier', name: 'Pleated Satin Skirt',
    price: 175, category: 'Women', type: 'Bottoms',
    colors: ['Bone', 'Black', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7, reviewCount: 59, isNew: true, isBestseller: false,
    img: U('1583496661160-fb5886a0aaaa'), img2: U('1556905055-8f358a7a47b2'),
  },
  {
    id: 11, brand: 'LUXE Accessories', name: 'Leather Tote Bag',
    price: 230, category: 'Accessories', type: 'Bags',
    colors: ['Camel', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8, reviewCount: 181, isNew: false, isBestseller: true,
    img: U('1584917865442-de89df76afd3'), img2: U('1548036328-c9fa89d128fa'),
  },
  {
    id: 12, brand: 'LUXE Accessories', name: 'Silk Twill Scarf',
    price: 85, category: 'Accessories', type: 'Bags',
    colors: ['Rust', 'Bone', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5, reviewCount: 42, isNew: true, isBestseller: false,
    img: U('1601924994987-69e26d50dc26'), img2: U('1576053139778-7e32f2ae3cfd'),
  },
  {
    id: 13, brand: 'LUXE Studio', name: 'Slim Tapered Chino',
    price: 135, category: 'Men', type: 'Bottoms',
    colors: ['Stone', 'Navy', 'Olive'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.5, reviewCount: 89, isNew: true, isBestseller: false,
    img: U('1594938298603-c8aa52f8dc05'), img2: U('1473966968600-fa801b869a1a', 902),
  },
  {
    id: 14, brand: 'LUXE Atelier', name: 'Double-Breasted Wrap Blazer',
    price: 310, category: 'Women', type: 'Outerwear',
    colors: ['Charcoal', 'Camel', 'Ivory'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.8, reviewCount: 113, isNew: true, isBestseller: true,
    img: U('1483985988355-763728e1935b', 901), img2: U('1539109136881-3be0616acf4b', 901),
  },
  {
    id: 15, brand: 'LUXE Accessories', name: 'Braided Leather Belt',
    price: 75, category: 'Accessories', type: 'Bags',
    colors: ['Camel', 'Black', 'Rust'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.6, reviewCount: 57, isNew: false, isBestseller: false,
    img: U('1548036328-c9fa89d128fa', 901), img2: U('1584917865442-de89df76afd3', 901),
  },
  {
    id: 16, brand: 'LUXE Atelier', name: 'Ribbed Midi Skirt',
    price: 145, salePrice: 116, category: 'Women', type: 'Bottoms',
    colors: ['Black', 'Stone', 'Cream'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7, reviewCount: 78, isNew: false, isBestseller: true,
    img: U('1583496661160-fb5886a0aaaa', 901), img2: U('1556905055-8f358a7a47b2', 901),
  },
]

export const CATEGORIES = [
  { key: 'Women', title: 'Women', count: 48, img: U('1483985988355-763728e1935b', 1100) },
  { key: 'Men',   title: 'Men',   count: 36, img: U('1488161628813-04466f872be2', 1100) },
  { key: 'Accessories', title: 'Accessories', count: 24, img: U('1584917865442-de89df76afd3', 1100) },
]

export const REVIEWS = [
  {
    name: 'Amara K.', rating: 5, date: '2 weeks ago',
    title: 'Beautifully made',
    body: 'The fabric drapes exactly as pictured and the fit is impeccable. Worth every penny.',
    verified: true,
  },
  {
    name: 'Julian R.', rating: 5, date: '1 month ago',
    title: 'My new staple',
    body: 'Sizing runs true. The tailoring detail is genuinely premium — feels far above the price.',
    verified: true,
  },
  {
    name: 'Priya N.', rating: 4, date: '1 month ago',
    title: 'Lovely, slightly long',
    body: "Gorgeous colour and weight. I'm petite so I had the hem taken up, but otherwise perfect.",
    verified: true,
  },
]

export const SIZE_DATA = {
  Women: [
    { size: 'XS',  bust: [80, 31.5], waist: [62, 24.5], hip: [88, 34.5] },
    { size: 'S',   bust: [84, 33],   waist: [66, 26],   hip: [92, 36.25] },
    { size: 'M',   bust: [88, 34.5], waist: [70, 27.5], hip: [96, 37.75] },
    { size: 'L',   bust: [94, 37],   waist: [76, 30],   hip: [102, 40.25] },
    { size: 'XL',  bust: [100, 39.5],waist: [82, 32.25],hip: [108, 42.5] },
    { size: 'XXL', bust: [106, 41.75],waist: [88, 34.5],hip: [114, 44.75] },
  ],
  Men: [
    { size: 'XS',  chest: [88, 34.5],  waist: [74, 29],   hip: [90, 35.5] },
    { size: 'S',   chest: [94, 37],    waist: [80, 31.5], hip: [96, 37.75] },
    { size: 'M',   chest: [100, 39.5], waist: [86, 33.75],hip: [102, 40.25] },
    { size: 'L',   chest: [106, 41.75],waist: [92, 36.25],hip: [108, 42.5] },
    { size: 'XL',  chest: [112, 44],   waist: [98, 38.5], hip: [114, 44.75] },
    { size: 'XXL', chest: [118, 46.5], waist: [104, 41],  hip: [120, 47.25] },
  ],
}

export const money = (n: number) => `$${n.toFixed(0)}`
