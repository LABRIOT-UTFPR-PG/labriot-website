import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Calendar, MapPin } from "lucide-react"

export default function EventsAdmin() {
  // Dados simulados de eventos
  const events = [
    {
      id: 1,
      title: "Workshop Internacional de Robótica",
      date: "15-17 de Junho, 2023",
      location: "São Paulo, Brasil",
      type: "Workshop",
      status: "Próximo",
      description:
        "Um workshop de três dias com pesquisadores líderes no campo da robótica e IA, apresentando as últimas inovações e tendências.",
    },
    {
      id: 2,
      title: "Conferência sobre Aprendizado de Máquina em Robótica",
      date: "5 de Agosto, 2023",
      location: "Online",
      type: "Conferência",
      status: "Próximo",
      description: "Uma conferência virtual focada nas aplicações de aprendizado de máquina em sistemas robóticos.",
    },
    {
      id: 3,
      title: "Dia de Portas Abertas do Laboratório Labriot",
      date: "20 de Setembro, 2023",
      location: "Laboratório Labriot, São Paulo",
      type: "Evento Público",
      status: "Próximo",
      description:
        "Uma oportunidade para o público visitar nosso laboratório e conhecer nossos projetos de pesquisa em andamento.",
    },
    {
      id: 4,
      title: "Simpósio sobre Ética em IA",
      date: "10 de Março, 2023",
      location: "Universidade de São Paulo",
      type: "Simpósio",
      status: "Passado",
      description: "Um simpósio que discutiu os desafios éticos no desenvolvimento e implementação de sistemas de IA.",
    },
    {
      id: 5,
      title: "Hackathon de Robótica",
      date: "25-26 de Janeiro, 2023",
      location: "Centro de Inovação, São Paulo",
      type: "Hackathon",
      status: "Passado",
      description: "Um evento de 48 horas onde equipes desenvolveram soluções robóticas para desafios do mundo real.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Eventos</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar eventos..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{event.date}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </CardDescription>
                </div>
                <Badge variant={event.status === "Próximo" ? "default" : "secondary"}>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">{event.type}</Badge>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/events/edit/${event.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
              {event.status === "Próximo" && (
                <Button variant="default" size="sm">
                  Gerenciar Inscrições
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

