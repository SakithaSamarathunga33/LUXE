"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const COLS = [
  { h: "Shop",  links: [{ l: "New Arrivals", href: "/shop?filter=new" }, { l: "Women", href: "/shop?category=Women" }, { l: "Men", href: "/shop?category=Men" }, { l: "Accessories", href: "/shop?category=Accessories" }, { l: "Sale", href: "/shop?filter=sale" }] },
  { h: "Help",  links: [{ l: "Shipping", href: "#" }, { l: "Returns", href: "#" }, { l: "Size Guide", href: "#" }, { l: "Contact Us", href: "#" }, { l: "FAQ", href: "#" }] },
  { h: "About", links: [{ l: "Our Story", href: "#" }, { l: "Sustainability", href: "#" }, { l: "Stores", href: "#" }, { l: "Careers", href: "#" }, { l: "Press", href: "#" }] },
]

const col = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export function Footer() {
  return (
    <footer className="bg-luxe-paper border-t border-luxe-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-[72px]">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_repeat(3,1fr)] gap-10 pb-14">

          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            variants={col} custom={0} initial="hidden"
            whileInView="show" viewport={{ once: true, amount: 0.2 }}
          >
            <div className="font-serif text-[30px] tracking-[.22em] pl-[.22em]">LUXE</div>
            <p className="text-luxe-muted text-sm max-w-[280px] mt-4">
              Considered clothing for the modern wardrobe. Designed in studio, made to last.
            </p>
            <div className="flex gap-2 mt-5">
              <a href="#" className="w-9 h-9 border border-luxe-line flex items-center justify-center hover:border-luxe-ink hover:bg-luxe-ink hover:text-white transition-all">
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" className="w-9 h-9 border border-luxe-line flex items-center justify-center hover:border-luxe-ink hover:bg-luxe-ink hover:text-white transition-all">
                <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5H21l-5.9 6.7L22 19h-5.5l-3.7-4.8L8.3 19H5.5l6.3-7.2L5 5h5.6l3.3 4.3L18.3 5Zm-1 12.3h1.5L7.4 6.5H5.8l11.5 10.8Z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 border border-luxe-line flex items-center justify-center hover:border-luxe-ink hover:bg-luxe-ink hover:text-white transition-all">
                <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c.4 2 1.7 3.5 3.8 3.8v2.6a6.4 6.4 0 0 1-3.8-1.3v5.6A5.2 5.2 0 1 1 11 9.5v2.8a2.5 2.5 0 1 0 2.4 2.5V4H16Z"/></svg>
              </a>
            </div>
          </motion.div>

          {/* Link columns */}
          {COLS.map((c, i) => (
            <motion.div
              key={c.h}
              variants={col} custom={i + 1} initial="hidden"
              whileInView="show" viewport={{ once: true, amount: 0.2 }}
            >
              <div className="eyebrow mb-4">{c.h}</div>
              <ul className="flex flex-col gap-3">
                {c.links.map((item) => (
                  <li key={item.l}>
                    <Link href={item.href} className="text-sm text-luxe-muted hover:text-luxe-ink transition-colors">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap justify-between items-center gap-5 py-6 border-t border-luxe-line"
        >
          <span className="font-mono text-[11px] text-luxe-muted tracking-[.05em]">
            © 2026 LUXE — All rights reserved.
          </span>
          <div className="flex gap-2 items-center">
            {["VISA", "MC", "AMEX", "PAYPAL", "APPLE"].map((t) => (
              <span key={t} className="font-mono text-[9.5px] tracking-[.08em] border border-luxe-line px-2 py-1.5 text-luxe-muted bg-white">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
