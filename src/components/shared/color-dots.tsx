import { COLORS } from "@/data/products"

interface ColorDotsProps {
  colors: string[]
  max?: number
}

export function ColorDots({ colors, max = 4 }: ColorDotsProps) {
  const shown = colors.slice(0, max)
  return (
    <span className="inline-flex items-center gap-1.5">
      {shown.map((c) => (
        <span
          key={c}
          title={c}
          className="w-[11px] h-[11px] rounded-full ring-1 ring-black/15 inline-block"
          style={{ background: COLORS[c] ?? c }}
        />
      ))}
      {colors.length > max && (
        <span className="font-mono text-[10px] text-luxe-muted">+{colors.length - max}</span>
      )}
    </span>
  )
}
