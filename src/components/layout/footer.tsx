"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const COLS = [
  { h: "Shop",  links: [{ l: "New arrivals", href: "/shop?filter=new" }, { l: "Women", href: "/shop?category=Women" }, { l: "Men", href: "/shop?category=Men" }, { l: "Accessories", href: "/shop?category=Accessories" }, { l: "Sale", href: "/shop?filter=sale" }] },
  { h: "Help",  links: [{ l: "Shipping", href: "#" }, { l: "Returns", href: "#" }, { l: "Size guide", href: "#" }, { l: "Contact us", href: "#" }, { l: "FAQ", href: "#" }] },
  { h: "About", links: [{ l: "Our story", href: "#" }, { l: "Sustainability", href: "#" }, { l: "Stores", href: "#" }, { l: "Careers", href: "#" }, { l: "Press", href: "#" }] },
]

const SOCIALS = [
  { label: "Instagram", icon: <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/></svg> },
  { label: "X", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5H21l-5.9 6.7L22 19h-5.5l-3.7-4.8L8.3 19H5.5l6.3-7.2L5 5h5.6l3.3 4.3L18.3 5Zm-1 12.3h1.5L7.4 6.5H5.8l11.5 10.8Z"/></svg> },
  { label: "TikTok", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c.4 2 1.7 3.5 3.8 3.8v2.6a6.4 6.4 0 0 1-3.8-1.3v5.6A5.2 5.2 0 1 1 11 9.5v2.8a2.5 2.5 0 1 0 2.4 2.5V4H16Z"/></svg> },
]

const WORDMARK_STYLE = { fontSize: "clamp(120px,30vw,440px)", fontVariationSettings: "\"wdth\" 75" }

export function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-20">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_repeat(3,1fr)] gap-10 pb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="text-foreground/80 max-w-[300px] leading-relaxed">
              Considered clothing for the modern wardrobe. Designed in studio, made to last.
            </p>
            <div className="flex gap-2 mt-6">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="icon-btn border border-border">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <nav key={c.h} aria-label={c.h}>
              <h3 className="font-sans text-sm text-muted-foreground mb-4">{c.h}</h3>
              <ul className="flex flex-col gap-3">
                {c.links.map((item) => (
                  <li key={item.l}>
                    <Link href={item.href} className="link-u text-[15px] text-foreground/85 hover:text-foreground">
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-5 py-6 border-t border-border">
          <span className="text-sm text-muted-foreground">© 2026 LUXE. All rights reserved.</span>
          <div className="flex flex-wrap gap-2 items-center">
            {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map((t) => (
              <span key={t} className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark that rises into view, cropped at the page edge */}
      <motion.div
        aria-hidden
        className="font-display font-bold text-center leading-[0.72] tracking-[-0.06em] select-none text-transparent bg-clip-text bg-gradient-to-b from-foreground/[0.14] to-transparent"
        style={WORDMARK_STYLE}
        initial={{ y: "30%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        luxe
      </motion.div>
    </footer>
  )
}
