import { Marquee } from "@/components/magicui/marquee"

const ITEMS = [
  "Free shipping over $100",
  "New drop every Friday",
  "Free returns",
  "Sustainable packaging",
  "Members get early access",
  "Carbon-neutral delivery",
]

export function MarqueeBanner() {
  return (
    <div className="py-6 overflow-hidden border-y border-border">
      <Marquee pauseOnHover className="[--gap:0rem] [--duration:50s]">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-10 px-5 font-display font-semibold text-[clamp(22px,2.6vw,34px)] tracking-[-0.03em] text-foreground/85"
          >
            {item}
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: "var(--silk)" }} />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
