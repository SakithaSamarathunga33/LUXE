"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (/.+@.+\..+/.test(email)) setDone(true)
  }

  return (
    <section className="px-3 md:px-6 py-12">
      <motion.div
        className="aurora max-w-[1240px] mx-auto rounded-[36px] border border-border bg-card px-6 py-20 md:py-28 text-center"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="h-section max-w-[14ch] mx-auto">Be first to the drop</h2>
        <p className="text-foreground/70 mt-5 mb-10 max-w-[46ch] mx-auto">
          Early access to new arrivals, private sales and styling notes, straight to your inbox.
        </p>

        <div className="max-w-[500px] mx-auto">
          {done ? (
            <div role="status" className="inline-flex items-center gap-3 h-12 px-5 rounded-full bg-white/10 border border-white/15">
              <span className="size-6 rounded-full bg-foreground text-background flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </span>
              You are on the list. Welcome to LUXE.
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field flex-1 bg-background/60"
                suppressHydrationWarning
              />
              <button type="submit" className="btn-chalk shrink-0">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
