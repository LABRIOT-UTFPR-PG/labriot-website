/* components/site-header.tsx */
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ArrowLeft, Menu } from "lucide-react"
import { ShinyText } from "@/components/ui/shiny-text"
import type { SiteSettings } from "@/lib/site-settings"

type SiteHeaderProps = {
  settings: SiteSettings
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeSection, setActiveSection] = React.useState("")
  const [isScrolled, setIsScrolled] = React.useState(false)
  const navItems = React.useMemo(
    () => [
      { href: "/#projects", label: "Projetos", id: "projects" },
      { href: "/#team", label: "Equipe", id: "team" },
      ...(settings.enableEvents ? [{ href: "/#events", label: "Agenda", id: "events" }] : []),
      { href: "/#contact", label: "Contato", id: "contact" },
    ],
    [settings.enableEvents]
  )

  // Função auxiliar para rolar suavemente se estivermos na home
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        setActiveSection(id)
        const getTarget = () => element.getBoundingClientRect().top + window.scrollY - 96
        const lenis = (window as typeof window & {
          labriotLenis?: { scrollTo: (target: number, options?: { immediate?: boolean; onComplete?: () => void }) => void }
        }).labriotLenis
        if (lenis) {
          lenis.scrollTo(getTarget(), {
            // Animações de revelação podem alterar o layout durante a rolagem,
            // então corrigimos a posição final após a animação terminar.
            onComplete: () => {
              const corrected = getTarget()
              if (Math.abs(corrected - window.scrollY) > 2) {
                lenis.scrollTo(corrected, { immediate: true })
              }
            },
          })
        } else {
          window.scrollTo({ top: getTarget(), behavior: "smooth" })
        }
      }
    }
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])


  React.useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("")
      return
    }

    let frame = 0

    const updateActiveSection = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => Boolean(section))

      if (!sections.length) {
        return
      }

      const activationLine = Math.min(window.innerHeight * 0.36, 320)
      const currentSection =
        sections.find((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= activationLine && rect.bottom > activationLine
        }) ??
        [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= activationLine) ??
        sections[0]

      setActiveSection(currentSection.id)
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", scheduleUpdate)
    }
  }, [pathname, navItems])

  if (pathname?.startsWith("/admin")) {
    return null
  }

  // Se o caminho for uma subpágina de projetos ou blog, ela já possui seu próprio botão de voltar no corpo.
  const hasCustomBackButton = pathname?.startsWith("/projects/") || pathname?.startsWith("/blog/")

  // Função para voltar de forma inteligente com fallback para a home
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full translate-z-0 transform-gpu border-b backdrop-blur-xl transition-all duration-300 will-change-transform supports-[backdrop-filter]:bg-background/70 ${isScrolled ? "border-border/70 bg-background/80 shadow-[var(--shadow-soft)]" : "border-transparent bg-background/45"}`}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {pathname !== "/" && !hasCustomBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-2 flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          )}
          {/* Logo ou Nome do Site */}
          <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
              <Image
                src="/images/labriot-logo.png"
                alt={`Logo ${settings.siteName}`}
                fill
                sizes="40px"
                className="object-contain p-1.5"
                priority
              />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {settings.siteName.toUpperCase()}
            </span>
          </Link>
        </div>

        {/* Menu Horizontal */}
        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-background/45 p-1 text-sm font-semibold shadow-sm backdrop-blur md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`rounded-full px-4 py-2 transition-all duration-300 hover:bg-accent hover:text-foreground ${activeSection === item.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="hidden h-10 rounded-full px-4 md:inline-flex">
          <Link href="/contact">
            <ShinyText text="Converse conosco!" color="#000000" shineColor="#a3a3a3" speed={3} spread={60} />
          </Link>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[86vw] max-w-sm">
            <SheetHeader>
              <SheetTitle>{settings.siteName}</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 grid gap-3">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="rounded-lg border border-border/70 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button asChild className="mt-3 w-full">
                  <Link href="/contact">Converse conosco!</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        {/* <div className="flex items-center gap-2">
           <Button asChild size="sm">
             <Link href="/admin/login">Área Admin</Link>
           </Button>
        </div> */}

      </div>
    </header>
  )
}
