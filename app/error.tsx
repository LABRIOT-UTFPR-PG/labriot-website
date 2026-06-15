"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
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
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Falha de carregamento</p>
        <h1 className="text-3xl font-bold tracking-tight">Algo deu errado nesta pagina</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Ocorreu um erro inesperado ao renderizar este conteudo. Voce pode tentar novamente ou voltar para o inicio.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset}>
          Tentar novamente
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Voltar ao inicio</Link>
        </Button>
      </div>
    </div>
  )
}
