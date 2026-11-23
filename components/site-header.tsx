"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Menu } from "lucide-react";

const NAV_ITEMS = [
  { href: "/#projects", sectionId: "projects", label: "Projetos" },
  { href: "/#team", sectionId: "team", label: "Equipe" },
  { href: "/#events", sectionId: "events", label: "Agenda de Eventos" },
  { href: "/blog", sectionId: null, label: "Blog" },
  { href: "/projects/roboflow", sectionId: null, label: "Demo IA" },
  { href: "/#contact", sectionId: "contact", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string | null
  ) => {
    setMobileMenuOpen(false);
    if (sectionId && pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const hasCustomBackButton =
    pathname?.startsWith("/projects/") || pathname?.startsWith("/blog/");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span>LABRIOT</span>
          </Link>
        </div>

        {/* Menu Horizontal Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.sectionId)}
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Menu Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-left">LABRIOT</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.sectionId)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
