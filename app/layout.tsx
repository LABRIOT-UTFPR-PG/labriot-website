import type React from "react"
import type { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollExperience } from "@/components/scroll-experience"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { getPublicSiteSettings } from "@/lib/public-data"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
})

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Labriot - Laboratório de Pesquisa em Robótica e IA",
  description:
    "Laboratório de pesquisa de ponta dedicado a avançar as fronteiras da robótica e inteligência artificial através de pesquisa e desenvolvimento inovadores.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getPublicSiteSettings()

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SiteHeader settings={settings} />
          <ScrollExperience />
          <main className="min-h-screen flex-1 bg-background">
            {children}
          </main>
          <SiteFooter settings={settings} />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
