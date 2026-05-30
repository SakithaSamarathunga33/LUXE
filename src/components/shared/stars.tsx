import { cn } from "@/lib/utils"

interface StarsProps {
  value?: number
  size?: number
  showVal?: boolean
  count?: number
  className?: string
}

export function Stars({ value = 0, size = 14, showVal = false, count, className }: StarsProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex gap-px">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i)) * 100
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox="0 0 24 24" fill="#d9d1c4" stroke="none" className="absolute inset-0">
                <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8L12 3Z" />
              </svg>
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <svg width={size} height={size} viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
                  <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8L12 3Z" />
                </svg>
              </span>
            </span>
          )
        })}
      </span>
      {showVal && (
        <span className="font-mono text-[11px] text-luxe-muted">
          {value.toFixed(1)}{count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  )
}
