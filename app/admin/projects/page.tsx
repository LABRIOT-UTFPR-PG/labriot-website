import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function ProjectsAdmin() {
  // Dados simulados de projetos
  const ongoingProjects = [
    {
      id: 1,
      title: "ATLAS: Sistema de Aprendizado e Adaptação de Terreno Autônomo",
      startDate: "Janeiro 2023",
      status: "Em andamento",
      description:
        "Desenvolvendo um sistema robótico capaz de navegar e se adaptar autonomamente a terrenos desconhecidos e desafiadores usando técnicas de aprendizado por reforço.",
    },
    {
      id: 2,
      title: "NEXUS: Sistema de Compreensão Cruzada Aprimorado por Redes Neurais",
      startDate: "Março 2023",
      status: "Em andamento",
      description:
        "Criando um sistema de IA multimodal que pode entender e traduzir entre diferentes formas de dados, incluindo texto, imagens e leituras de sensores.",
    },
    {
      id: 3,
      title: "SENTINEL: Monitoramento Ambiental Inteligente com Inteligência de Enxame",
      startDate: "Abril 2023",
      status: "Em andamento",
      description:
        "Desenvolvendo um enxame de pequenos robôs autônomos que trabalham juntos para monitorar condições ambientais e coletar dados em locais de difícil acesso ou perigosos.",
    },
  ]

  const completedProjects = [
    {
      id: 4,
      title: "HERMES: Manipulação Robótica que Emula Humanos com Sensibilidade Aprimorada",
      endDate: "Novembro 2022",
      status: "Concluído",
      description:
        "Desenvolveu uma mão robótica com sensores táteis capaz de manipular objetos delicados com destreza e sensibilidade semelhantes às humanas.",
    },
    {
      id: 5,
      title: "IRIS: Sistema Inteligente de Reconhecimento e Interpretação",
      endDate: "Agosto 2022",
      status: "Concluído",
      description:
        "Criou um sistema avançado de visão computacional capaz de reconhecer e interpretar cenas complexas e atividades humanas em tempo real.",
    },
  ]

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
        <Button variant="outline">Exportar</Button>
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
                  <Button variant="outline" size="sm" className="text-destructive">
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
                  <Button variant="outline" size="sm" className="text-destructive">
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

