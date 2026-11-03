import { Bricolage_Grotesque, Geist } from "next/font/google"
import { Providers } from "@/components/providers"
import { LayoutShell } from "@/components/layout/layout-shell"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${bricolage.variable} ${geist.variable}`}>
      <body
        className="min-h-screen flex flex-col bg-background text-foreground antialiased pb-16 md:pb-0"
        suppressHydrationWarning
      >
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}
