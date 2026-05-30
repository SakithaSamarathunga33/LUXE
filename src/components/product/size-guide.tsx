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
      <DialogContent className="max-w-[680px] bg-luxe-bg border-luxe-line p-0">
        <DialogHeader className="px-8 pt-8 pb-0">
          <div className="eyebrow mb-2">Fit & Sizing</div>
          <DialogTitle className="font-serif text-3xl font-normal">Size Guide</DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8 pt-5">
          <div className="flex justify-between items-center border-b border-luxe-line pb-0 flex-wrap gap-3">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "Women" | "Men")}>
              <TabsList className="bg-transparent rounded-none h-auto p-0 gap-7">
                {["Women", "Men"].map((t) => (
                  <TabsTrigger key={t} value={t}
                    className="rounded-none font-mono text-[11px] tracking-widest uppercase pb-3.5 px-0 border-b-2 border-transparent data-[state=active]:border-luxe-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none text-luxe-muted data-[state=active]:text-luxe-ink">
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="inline-flex border border-luxe-line mb-3">
              {(["cm", "in"] as const).map((u) => (
                <button key={u} onClick={() => setUnit(u)}
                  className={cn("px-4 py-2 font-mono text-[12px] tracking-[.05em] transition-colors",
                    unit === u ? "bg-luxe-ink text-white" : "text-luxe-muted hover:bg-luxe-paper")}>
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3.5 font-mono text-[11px] tracking-[.12px] uppercase text-luxe-muted font-medium">Size</th>
                  {cols.map((c) => (
                    <th key={c} className="text-left py-3 px-3.5 font-mono text-[11px] tracking-[.12px] uppercase text-luxe-muted font-medium">
                      {labels[c]} ({unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.size} className={cn("border-t border-luxe-line", i % 2 === 0 && "bg-luxe-paper/50")}>
                    <td className="py-3 px-3.5 font-semibold">{r.size}</td>
                    {cols.map((c) => (
                      <td key={c} className="py-3 px-3.5 font-mono">
                        {val((r as unknown as Record<string, number[]>)[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-7 grid grid-cols-[160px_1fr] gap-6 items-center bg-luxe-paper/60 border border-luxe-line p-5">
            <svg viewBox="0 0 120 180" className="w-full max-w-[130px]">
              <g fill="none" stroke="#0D0D0D" strokeWidth="1.4">
                <circle cx="60" cy="22" r="13"/>
                <path d="M60 35 L60 110"/>
                <path d="M60 44 L30 78 M60 44 L90 78"/>
                <path d="M60 110 L42 168 M60 110 L78 168"/>
              </g>
              <g stroke="#C9A96E" strokeWidth="1.2" strokeDasharray="3 3" fill="none">
                <ellipse cx="60" cy="55" rx="26" ry="7"/>
                <ellipse cx="60" cy="80" rx="22" ry="6"/>
                <ellipse cx="60" cy="100" rx="27" ry="7"/>
              </g>
              <text x="90" y="56" fontFamily="monospace" fontSize="8" fill="#C9A96E">1</text>
              <text x="86" y="82" fontFamily="monospace" fontSize="8" fill="#C9A96E">2</text>
              <text x="91" y="102" fontFamily="monospace" fontSize="8" fill="#C9A96E">3</text>
            </svg>
            <div>
              <div className="eyebrow mb-3">How to Measure</div>
              <ol className="flex flex-col gap-3 list-none">
                {[
                  ["1", "Bust / Chest", "Measure around the fullest part, keeping the tape level."],
                  ["2", "Waist", "Measure around the narrowest part of your natural waistline."],
                  ["3", "Hip", "Measure around the fullest part of your hips."],
                ].map(([n, title, desc]) => (
                  <li key={n} className="flex gap-3">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-luxe-gold text-luxe-ink font-mono text-[11px] flex items-center justify-center">{n}</span>
                    <span className="text-[13.5px]"><b>{title}.</b> <span className="text-luxe-muted">{desc}</span></span>
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
