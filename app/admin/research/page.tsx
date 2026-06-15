"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/form-errors"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ResearchArea {
  id: string
  title: string
  description: string | null
}

export default function ResearchAdmin() {
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => {
        setResearchAreas(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta area de pesquisa?")) {
      return
    }

    const response = await fetch(`/api/research/${id}`, { method: "DELETE" })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      alert(getApiErrorMessage(payload, "Nao foi possivel excluir a area de pesquisa."))
      return
    }

    setResearchAreas(researchAreas.filter((area) => area.id !== id))
  }

  if (loading) return <div>Carregando areas de pesquisa...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Pesquisa</h1>
        <Button asChild>
          <Link href="/admin/research/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Area
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar areas..." className="w-full bg-background pl-8" />
        </div>
      </div>

      <div className="space-y-4">
        {researchAreas.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Nenhuma area de pesquisa cadastrada.</p>
        ) : (
          researchAreas.map((area) => (
            <Card key={area.id}>
              <CardHeader>
                <CardTitle>{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{area.description || "Sem descricao."}</p>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/research/edit/${area.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(area.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
