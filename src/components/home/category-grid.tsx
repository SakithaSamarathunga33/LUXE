"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Photo } from "@/components/shared/photo"
import { CATEGORIES } from "@/data/products"

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export function CategoryGrid() {
  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6 md:px-10">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-5">
        <div>
          <BlurFade delay={0}><div className="eyebrow mb-3.5">Shop by Category</div></BlurFade>
          <BlurFade delay={0.1}><h2 className="font-serif text-[clamp(32px,4vw,52px)]">Find your edit</h2></BlurFade>
        </div>
        <BlurFade delay={0.15}>
          <Link href="/shop" className="font-mono text-[11px] tracking-[.1em] uppercase border-b border-luxe-ink pb-px hover:text-luxe-gold hover:border-luxe-gold transition-colors">
            View All
          </Link>
        </BlurFade>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.key}
            variants={cardVariants}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Link
              href={`/shop?category=${cat.key}`}
              className="relative block h-[420px] md:h-[480px] overflow-hidden group"
            >
              <Photo
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.06]"
                eager={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-[rgba(13,13,13,.55)]" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <div className="font-serif text-3xl">{cat.title}</div>
                <div className="flex items-center gap-2 mt-2 font-mono text-[11px] tracking-[.1em]">
                  {cat.count} styles <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
