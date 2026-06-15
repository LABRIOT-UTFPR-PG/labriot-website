import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSafeHref, getSafeImageSrc } from "@/lib/media"
import { getPublicProjects } from "@/lib/public-data"
import type { ProjectRecord } from "@/lib/repositories/projects"

type ProjectsProps = {
  projects?: ProjectRecord[];
}

export default async function Projects({ projects: initialProjects }: ProjectsProps) {
  const projects = initialProjects ?? await getPublicProjects();

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="mx-auto grid w-full max-w-xl grid-cols-2">
        <TabsTrigger value="ongoing">Projetos em Andamento</TabsTrigger>
        <TabsTrigger value="completed">Projetos Concluídos</TabsTrigger>
      </TabsList>

      <TabsContent value="ongoing" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ongoingProjects.map((project, index) => {
            const projectUrl = getSafeHref(project.url)

            return (
              <Card key={project.id} className="premium-card group flex h-full flex-col !border-0 !bg-transparent !shadow-none">
                <CardHeader className="gap-4 p-5 pb-3">
                  <span className="forrm-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="font-display text-xl leading-tight tracking-[-0.035em]">{project.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 rounded-full border border-border/50 bg-background/60 px-3 py-1">
                      Ativo
                    </Badge>
                  </div>
                  <CardDescription>Iniciado em {project.startDate}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-5">
                  <div className="mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-muted/40">
                    <Image
                      src={getSafeImageSrc(project.image)}
                      alt={project.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  {projectUrl ? (
                    <Button asChild className="w-full">
                      <Link 
                        href={projectUrl} 
                        target={projectUrl.startsWith("http") ? "_blank" : "_self"}
                        rel={projectUrl.startsWith("http") ? "noopener noreferrer" : ""}
                      >
                        Ver Detalhes do Projeto
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                      Sem Link de Detalhes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedProjects.map((project, index) => {
            const projectUrl = getSafeHref(project.url)

            return (
              <Card key={project.id} className="premium-card group flex h-full flex-col !border-0 !bg-transparent !shadow-none">
                <CardHeader className="gap-4 p-5 pb-3">
                  <span className="forrm-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="font-display text-xl leading-tight tracking-[-0.035em]">{project.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0 rounded-full border-border/60 bg-background/50 px-3 py-1">
                      Concluído
                    </Badge>
                  </div>
                  <CardDescription>Concluído em {project.endDate}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-5">
                  <div className="mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-muted/40">
                    <Image
                      src={getSafeImageSrc(project.image)}
                      alt={project.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  {projectUrl ? (
                    <Button asChild className="w-full">
                      <Link 
                        href={projectUrl} 
                        target={projectUrl.startsWith("http") ? "_blank" : "_self"}
                        rel={projectUrl.startsWith("http") ? "noopener noreferrer" : ""}
                      >
                        Ver Detalhes do Projeto
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                      Sem Link de Detalhes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}
