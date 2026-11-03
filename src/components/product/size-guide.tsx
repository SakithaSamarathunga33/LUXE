"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SIZE_DATA } from "@/data/products"
import { cn } from "@/lib/utils"

interface SizeGuideProps {
  open: boolean
  onClose: () => void
}

export function SizeGuide({ open, onClose }: SizeGuideProps) {
  const [tab, setTab] = useState<"Women" | "Men">("Women")
  const [unit, setUnit] = useState<"cm" | "in">("cm")
  const rows = SIZE_DATA[tab]
  const cols = tab === "Women" ? ["bust", "waist", "hip"] : ["chest", "waist", "hip"]
  const labels: Record<string, string> = { bust: "Bust", chest: "Chest", waist: "Waist", hip: "Hip" }
  const val = (arr: number[]) => arr[unit === "cm" ? 0 : 1]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[680px] bg-card border-border rounded-3xl p-0">
        <DialogHeader className="px-8 pt-8 pb-0">
          <DialogTitle className="font-display text-3xl font-semibold tracking-tight">Size guide</DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8 pt-5">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "Women" | "Men")}>
              <TabsList className="bg-secondary rounded-full p-1">
                {["Women", "Men"].map((t) => (
                  <TabsTrigger key={t} value={t} className="rounded-full px-4">
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="inline-flex rounded-full bg-secondary p-1">
              {(["cm", "in"] as const).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u}
                  className={cn("px-4 h-7 rounded-full text-sm transition-colors",
                    unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3.5 text-xs text-muted-foreground font-medium">Size</th>
                  {cols.map((c) => (
                    <th key={c} className="text-left py-3 px-3.5 text-xs text-muted-foreground font-medium">
                      {labels[c]} ({unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.size} className={cn("border-t border-border", i % 2 === 0 && "bg-secondary/40")}>
                    <td className="py-3 px-3.5 font-semibold">{r.size}</td>
                    {cols.map((c) => (
                      <td key={c} className="py-3 px-3.5 tabular-nums">
                        {val((r as unknown as Record<string, number[]>)[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-7 grid grid-cols-[160px_1fr] gap-6 items-center bg-secondary/40 border border-border rounded-3xl p-5">
            <svg viewBox="0 0 120 180" className="w-full max-w-[130px] text-foreground" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="60" cy="22" r="13"/>
                <path d="M60 35 L60 110"/>
                <path d="M60 44 L30 78 M60 44 L90 78"/>
                <path d="M60 110 L42 168 M60 110 L78 168"/>
              </g>
              <g className="stroke-orchid" strokeWidth="1.2" strokeDasharray="3 3" fill="none">
                <ellipse cx="60" cy="55" rx="26" ry="7"/>
                <ellipse cx="60" cy="80" rx="22" ry="6"/>
                <ellipse cx="60" cy="100" rx="27" ry="7"/>
              </g>
              <text x="90" y="56" fontSize="8" className="fill-orchid">1</text>
              <text x="86" y="82" fontSize="8" className="fill-orchid">2</text>
              <text x="91" y="102" fontSize="8" className="fill-orchid">3</text>
            </svg>
            <div>
              <h3 className="font-display text-lg font-semibold mb-3">How to measure</h3>
              <ol className="flex flex-col gap-3 list-none">
                {[
                  ["1", "Bust / Chest", "Measure around the fullest part, keeping the tape level."],
                  ["2", "Waist", "Measure around the narrowest part of your natural waistline."],
                  ["3", "Hip", "Measure around the fullest part of your hips."],
                ].map(([n, title, desc]) => (
                  <li key={n} className="flex gap-3">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-orchid text-primary-foreground text-[11px] font-medium flex items-center justify-center">{n}</span>
                    <span className="text-[13.5px]"><b>{title}.</b> <span className="text-muted-foreground">{desc}</span></span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
