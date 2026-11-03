"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Photo } from "@/components/shared/photo"
import { CATEGORIES } from "@/data/products"
import { cn } from "@/lib/utils"

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function CategoryGrid() {
  return (
    <section className="py-24 max-w-[1280px] mx-auto px-5 md:px-10">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-5">
        <BlurFade delay={0}>
          <h2 className="h-section">Find your edit</h2>
          <p className="text-muted-foreground mt-3 max-w-[42ch]">
            Three wardrobes, one point of view. Start where you like.
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <Link href="/shop" className="btn-glass btn-sm">View all</Link>
        </BlurFade>
      </div>

      {/* Bento: the first category runs the full height, the others stack beside it */}
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] md:grid-rows-2 gap-4 md:h-[640px]">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.key}
            className={cn(i === 0 && "md:row-span-2")}
            variants={cardVariants}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Link
              href={`/shop?category=${cat.key}`}
              className="relative block h-[380px] md:h-full overflow-hidden rounded-[28px] group"
            >
              <Photo
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                eager={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(20_16_24/0.75)] via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5 flex items-end justify-between gap-4">
                <div>
                  <div className="font-display font-semibold text-white text-[clamp(30px,3.4vw,46px)] leading-none tracking-[-0.03em]">
                    {cat.title}
                  </div>
                  <div className="text-sm text-white/70 mt-2">{cat.count} styles</div>
                </div>
                <span className="size-12 shrink-0 rounded-full bg-white text-background flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
