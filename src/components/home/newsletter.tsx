"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BorderBeam } from "@/components/magicui/border-beam"
import { BlurFade } from "@/components/magicui/blur-fade"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (/.+@.+\..+/.test(email)) setDone(true)
  }

  return (
    <section className="py-20 bg-luxe-ink text-white">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        <BlurFade delay={0} inView>
          <div className="font-mono text-[10.5px] tracking-[.2em] uppercase text-luxe-gold mb-5">
            Join the List
          </div>
        </BlurFade>
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-[clamp(30px,4vw,50px)] text-white">Be first to the drop</h2>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <p className="text-white/70 mt-5 mb-9 text-base">
            Early access to new arrivals, private sales and styling notes — straight to your inbox.
          </p>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="relative inline-block w-full max-w-[520px]">
            <BorderBeam colorFrom="#C9A96E" colorTo="#B2904E" duration={12} />
            <div className="relative bg-luxe-ink p-6">
              {done ? (
                <div className="flex items-center justify-center gap-3 text-luxe-gold text-base">
                  <Check size={18} /> You&apos;re on the list. Welcome to LUXE.
                </div>
              ) : (
                <form onSubmit={submit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-luxe-gold focus-visible:border-luxe-gold"
                  />
                  <ShimmerButton
                    type="submit"
                    background="#C9A96E"
                    shimmerColor="rgba(255,255,255,0.5)"
                    className="px-6 font-mono text-xs tracking-widest text-luxe-ink shrink-0"
                  >
                    SUBSCRIBE
                  </ShimmerButton>
                </form>
              )}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
