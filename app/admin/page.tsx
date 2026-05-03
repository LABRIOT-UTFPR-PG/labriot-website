import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Folder, Users, BookOpen, Calendar, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { openDb } from "@/lib/db"

async function getStats() {
  try {
    const db = await openDb()
    const [projects, team, publications, posts, events] = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM projects'),
      db.get('SELECT COUNT(*) as count FROM team'),
      db.get('SELECT COUNT(*) as count FROM publications'),
      db.get('SELECT COUNT(*) as count FROM posts'),
      db.get('SELECT COUNT(*) as count FROM events'),
    ])
    return {
      projects: Number(projects?.count ?? 0),
      team: Number(team?.count ?? 0),
      publications: Number(publications?.count ?? 0),
      posts: Number(posts?.count ?? 0),
      events: Number(events?.count ?? 0),
    }
  } catch {
    return { projects: 0, team: 0, publications: 0, posts: 0, events: 0 }
  }
}

export default async function AdminDashboard() {
  const counts = await getStats()

  const stats = [
    { title: "Projetos", value: counts.projects, icon: Folder, link: "/admin/projects" },
    { title: "Membros da Equipe", value: counts.team, icon: Users, link: "/admin/team" },
    { title: "Publicações", value: counts.publications, icon: BookOpen, link: "/admin/publications" },
    { title: "Posts do Blog", value: counts.posts, icon: FileText, link: "/admin/blog" },
    { title: "Eventos", value: counts.events, icon: Calendar, link: "/admin/events" },
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
