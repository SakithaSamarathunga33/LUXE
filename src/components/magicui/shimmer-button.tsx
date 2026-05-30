import React, { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255,255,255,0.4)",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "0px",
      background = "#0D0D0D",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center gap-2",
          "overflow-hidden whitespace-nowrap px-6 py-3 font-medium text-white",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "border border-white/10 transition-all duration-300 active:scale-[0.98]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* shimmer sweep layer */}
        <div className="absolute inset-0 -z-30 overflow-hidden [container-type:size]">
          <div className="absolute inset-0 h-full w-full animate-shimmer-slide [aspect-ratio:1]">
            <div className="animate-spin-around absolute -inset-full [will-change:transform] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}
        {/* inset highlight */}
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_-6px_10px_rgba(255,255,255,0.1)] transition-shadow duration-300 group-hover:shadow-[inset_0_-8px_14px_rgba(255,255,255,0.2)]" />
      </button>
    )
  },
)
ShimmerButton.displayName = "ShimmerButton"
