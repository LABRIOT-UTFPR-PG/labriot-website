"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, FileText, Users, Folder, BookOpen, Calendar, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

useEffect(() => {
    const handleBeforeUnload = () => {
      // Envia um POST request para a rota de logout.
      // O corpo da requisição é necessário para o sendBeacon funcionar como POST.
      navigator.sendBeacon('/api/auth/logout', new Blob());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6 ${isLoginPage ? 'blur-sm' : ''}`}>
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Image
            src="/images/labriot-logo.png"
            alt="Labriot Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span>Labriot Admin</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              Ver Site
            </Button>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </Link>
          </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className={`w-64 border-r bg-muted/40 ${isLoginPage ? 'blur-sm' : ''}`}>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-4">
              <div className="px-2 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Painel</h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="px-2 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Conteúdo</h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/research">
                      <FileText className="mr-2 h-4 w-4" />
                      Pesquisas
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/projects">
                      <Folder className="mr-2 h-4 w-4" />
                      Projetos
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/team">
                      <Users className="mr-2 h-4 w-4" />
                      Equipe
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/publications">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Publicações
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/blog">
                      <FileText className="mr-2 h-4 w-4" />
                      Blog
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/events">
                      <Calendar className="mr-2 h-4 w-4" />
                      Eventos
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="px-2 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Sistema</h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}