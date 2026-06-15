"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
    fetch('/api/projects')
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Falha ao carregar projetos");
        return data;
      })
      .then(data => {
        setProjects(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        alert(payload?.message || "Nao foi possivel excluir o projeto.");
        return;
      }

      setProjects(projects.filter(project => project.id !== id));
    }
  }

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (loading) return <div>Carregando...</div>
  if (error) return <div className="text-sm text-destructive">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Projetos</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar projetos..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
        <Button variant="outline" asChild>
          <a href="/api/admin/export?scope=projects">Exportar</a>
        </Button>
      </div>

      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ongoing">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="mt-6 space-y-4">
          {ongoingProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  Iniciado: {project.startDate} • {project.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${project.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  Concluído: {project.endDate} • {project.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${project.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
