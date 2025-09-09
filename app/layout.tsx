import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Labriot - Laboratório de Pesquisa em Robótica e IA",
  description:
    "Laboratório de pesquisa de ponta dedicado a avançar as fronteiras da robótica e inteligência artificial através de pesquisa e desenvolvimento inovadores.",
    generator: 'v0.dev'
}

// Modificar a função RootLayout para verificar se estamos na rota de administrador

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

