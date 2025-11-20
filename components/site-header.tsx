/* components/site-header.tsx */
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Função auxiliar para rolar suavemente se estivermos na home
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Logo ou Nome do Site */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            {/* Se você tiver o logo, descomente a linha abaixo */}
            {/* <Image src="/images/labriot-logo.png" width={32} height={32} alt="Labriot" /> */}
            <span>Labriot</span>
          </Link>
        </div>

        {/* Menu Horizontal */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/#projects" 
            onClick={(e) => scrollToSection(e, "projects")}
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Projetos
          </Link>
          <Link 
            href="/#team" 
            onClick={(e) => scrollToSection(e, "team")}
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Equipe
          </Link>
          <Link 
            href="/#events" 
            onClick={(e) => scrollToSection(e, "events")}
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Agenda de Eventos
          </Link>
          <Link 
            href="/#contact" 
            onClick={(e) => scrollToSection(e, "contact")}
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Contato
          </Link>
        </nav>

        {/* <div className="flex items-center gap-2">
           <Button asChild size="sm">
             <Link href="/admin/login">Área Admin</Link>
           </Button>
        </div> */}
        
      </div>
    </header>
  )
}