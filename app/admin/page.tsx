import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Folder, Users, BookOpen, Calendar, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  // Dados simulados para o dashboard
  const stats = [
    { title: "Pesquisas", value: "8", icon: FileText, link: "/admin/research" },
    { title: "Projetos", value: "12", icon: Folder, link: "/admin/projects" },
    { title: "Membros da Equipe", value: "15", icon: Users, link: "/admin/team" },
    { title: "Publicações", value: "24", icon: BookOpen, link: "/admin/publications" },
    { title: "Posts do Blog", value: "32", icon: FileText, link: "/admin/blog" },
    { title: "Eventos", value: "5", icon: Calendar, link: "/admin/events" },
  ]

  const recentActivity = [
    {
      action: "Projeto atualizado",
      item: "ATLAS: Sistema de Aprendizado e Adaptação de Terreno Autônomo",
      time: "Há 2 horas",
    },
    { action: "Novo membro adicionado", item: "Dr. Ricardo Santos", time: "Há 1 dia" },
    {
      action: "Post do blog publicado",
      item: "Avanços em Robótica de Enxame para Monitoramento Ambiental",
      time: "Há 3 dias",
    },
    { action: "Publicação adicionada", item: "Aprendizado Adaptativo em Sistemas Robóticos", time: "Há 5 dias" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Exportar Dados</Button>
          <Button>Novo Conteúdo</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <Button variant="ghost" size="sm" className="mt-2 px-0" asChild>
                  <Link href={stat.link}>
                    Gerenciar
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações no site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Atalhos para tarefas comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/blog/new">
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Post do Blog
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/projects/new">
                  <Folder className="mr-2 h-4 w-4" />
                  Adicionar Projeto
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/team/new">
                  <Users className="mr-2 h-4 w-4" />
                  Adicionar Membro da Equipe
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/events/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Evento
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

