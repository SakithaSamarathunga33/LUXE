import { Marquee } from "@/components/magicui/marquee"

const ITEMS = [
  "Free Shipping Over $100",
  "New Drop Every Friday",
  "Free Returns",
  "Sustainable Packaging",
  "Members Get Early Access",
  "Carbon-Neutral Delivery",
]

export function MarqueeBanner() {
  return (
    <div className="bg-luxe-ink text-luxe-gold py-5 overflow-hidden">
      <Marquee pauseOnHover className="[--gap:0rem]">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="inline-flex items-center px-7 font-mono text-[11.5px] tracking-[.22em] uppercase"
          >
            {item}
            <span className="ml-7 opacity-50">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
