"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground">
        <div className="container flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Erro global</p>
            <h1 className="text-3xl font-bold tracking-tight">Nao foi possivel carregar a aplicacao</h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Ocorreu um erro critico durante a montagem da interface. Tente recarregar ou voltar para a pagina inicial.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              Recarregar
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Ir para o inicio</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
