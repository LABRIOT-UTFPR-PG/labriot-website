"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
  }, [])

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (loading) return <div>Carregando...</div>

  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ongoing">Projetos em Andamento</TabsTrigger>
        <TabsTrigger value="completed">Projetos Concluídos</TabsTrigger>
      </TabsList>

      <TabsContent value="ongoing" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {ongoingProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Iniciado: {project.startDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/projects/${project.id}`}>Ver Detalhes do Projeto</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {completedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Concluído: {project.endDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/projects/${project.id}`}>Ver Detalhes do Projeto</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}