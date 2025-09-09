import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function ResearchAdmin() {
  // Dados simulados de áreas de pesquisa
  const researchAreas = [
    {
      id: 1,
      title: "Visão Computacional",
      description: "Capacitando máquinas para interpretar e compreender informações visuais do mundo.",
      topics: ["Detecção e Reconhecimento de Objetos", "Compreensão e Segmentação de Cenas", "SLAM Visual e Navegação"],
    },
    {
      id: 2,
      title: "Processamento de Linguagem Natural",
      description: "Desenvolvendo sistemas que podem entender, interpretar e gerar linguagem humana.",
      topics: [
        "Compreensão de Linguagem para Robótica",
        "Sistemas de IA Conversacional",
        "Fundamentação de Linguagem Multimodal",
      ],
    },
    {
      id: 3,
      title: "Aprendizado por Reforço",
      description: "Treinando agentes para tomar sequências de decisões através de interações de tentativa e erro.",
      topics: ["Aprendizado Profundo por Reforço", "Aprendizado Multi-Agente", "Aprendizado por Imitação"],
    },
    {
      id: 4,
      title: "Manipulação Robótica",
      description: "Criando sistemas capazes de interagir com objetos no mundo físico com precisão.",
      topics: ["Manipulação Destreza", "Percepção Tátil", "Planejamento de Movimento"],
    },
    {
      id: 5,
      title: "Inteligência de Enxame",
      description: "Estudando comportamento coletivo e auto-organização em sistemas multi-robôs.",
      topics: ["Coordenação Distribuída", "Tomada de Decisão Coletiva", "Robótica de Enxame"],
    },
    {
      id: 6,
      title: "IA Ética",
      description:
        "Garantindo que sistemas de IA sejam projetados e implementados de maneiras alinhadas com valores e ética humanos.",
      topics: ["Transparência e Explicabilidade", "Viés e Justiça", "Governança de IA"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Áreas de Pesquisa</h1>
        <Button asChild>
          <Link href="/admin/research/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Área de Pesquisa
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar áreas de pesquisa..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {researchAreas.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.title}</CardTitle>
              <CardDescription>Área de Pesquisa</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{area.description}</p>
              <div>
                <h4 className="text-sm font-medium mb-2">Tópicos Principais:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {area.topics.map((topic, index) => (
                    <li key={index}>• {topic}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/research/edit/${area.id}`}>
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
                <Link href={`/research/${area.id}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

