"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BorderBeam } from "@/components/magicui/border-beam"

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (/.+@.+\..+/.test(email)) setDone(true)
  }

  return (
    <section className="py-20 bg-luxe-ink text-white overflow-hidden">
      {/* Entire content block slides up as one unit */}
      <motion.div
        className="max-w-[760px] mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div variants={childVariants} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-[10.5px] tracking-[.2em] uppercase text-luxe-gold mb-5">
          Join the List
        </motion.div>

        <motion.h2 variants={childVariants} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-serif text-[clamp(30px,4vw,50px)] text-white">
          Be first to the drop
        </motion.h2>

        <motion.p variants={childVariants} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-white/70 mt-5 mb-9 text-base">
          Early access to new arrivals, private sales and styling notes — straight to your inbox.
        </motion.p>

        <motion.div variants={childVariants} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative inline-block w-full max-w-[520px]">
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
                  suppressHydrationWarning
                />
                <ShimmerButton
                  type="submit"
                  background="#C9A96E"
                  shimmerColor="rgba(255,255,255,0.95)"
                  shimmerSize="2px"
                  className="px-6 font-mono text-xs tracking-widest text-luxe-ink shrink-0"
                >
                  SUBSCRIBE
                </ShimmerButton>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
