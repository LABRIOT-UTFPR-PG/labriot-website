import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://labriot.com.br"),
  title: {
    default: "Labriot — Laboratório de Pesquisa em Robótica e IA",
    template: "%s | Labriot",
  },
  description:
    "Laboratório de pesquisa dedicado a avançar as fronteiras da robótica, IoT e inteligência artificial na UTFPR Ponta Grossa.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://labriot.com.br",
    siteName: "Labriot",
    title: "Labriot — Laboratório de Pesquisa em Robótica e IA",
    description:
      "Pesquisa aplicada em robótica, sistemas embarcados, IoT e inteligência artificial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
          <SonnerToaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
