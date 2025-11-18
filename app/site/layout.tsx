import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle" // 1. Importe o componente

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/labriot-logo.png"
                alt="Labriot Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">Labriot</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Início
            </Link>
            {/*
            <Link
              href="/research"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pesquisa
            </Link>
            */}
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Projetos
            </Link>
            <Link
              href="/team"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Equipe
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* 2. Adicione o botão aqui */}
            <ThemeToggle />
            <Button asChild className="hidden md:flex">
              <Link href="/contact">
                Colabore conosco <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/admin">Administração</Link>
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <span className="sr-only">Alternar menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:py-12 lg:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/labriot-logo.png"
                  alt="Labriot Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold">Labriot</span>
              </div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                Pioneiros no futuro da robótica e inteligência artificial através de pesquisa e desenvolvimento
                inovadores.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Explorar</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/research" className="text-muted-foreground transition-colors hover:text-foreground">
                      Pesquisa
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="text-muted-foreground transition-colors hover:text-foreground">
                      Projetos
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="text-muted-foreground transition-colors hover:text-foreground">
                      Equipe
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/publications"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Publicações
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Conectar</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  
                    {/*<Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                      Eventos
                    </Link>*/}
                  
                  <li>
                    <Link href="/newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
                      Newsletter
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                      Política de Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                      Termos de Serviço
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                      Administração
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Laboratório de Pesquisa Labriot. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.08.66-.22.66-.48v-1.7c-2.67.6-3.23-1.13-3.23-1.13-.44-1.1-1.08-1.4-1.08-1.4-.88-.6.07-.6.07-.6.97.07 1.48 1 1.48 1 .87 1.52 2.27 1.07 2.83.82.08-.65.35-1.09.63-1.34-2.13-.25-4.37-1.07-4.37-4.76 0-1.05.37-1.93 1-2.6-.1-.25-.43-1.23.09-2.56 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.52 1.33.19 2.31.09 2.56.62.68 1 1.55 1 2.6 0 3.7-2.25 4.5-4.39 4.75.36.31.67.91.67 1.85v2.74c0 .26.16.57.67.48A10 10 0 0 0 12 2z" />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}