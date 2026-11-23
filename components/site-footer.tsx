"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="text-center md:text-left">
          <p className="font-semibold text-foreground">
            LABRIOT — Laboratório de Pesquisa em Robótica e IA
          </p>
          <p className="text-xs mt-1">
            UTFPR Campus Ponta Grossa • R. Doutor Washington Subtil Chueire, 330 — Ponta Grossa, PR
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link href="/projects" className="hover:text-foreground transition-colors">
            Projetos
          </Link>
          <Link href="/team" className="hover:text-foreground transition-colors">
            Equipe
          </Link>
          <Link href="/events" className="hover:text-foreground transition-colors">
            Eventos
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  );
}
