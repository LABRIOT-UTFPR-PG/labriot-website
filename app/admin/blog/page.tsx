import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function BlogAdmin() {
  // Dados simulados de posts do blog
  const blogPosts = [
    {
      id: 1,
      title: "Avanço na Manipulação Robótica: Nova Tecnologia de Sensoriamento Tátil",
      author: "Dra. Aisha Patel",
      date: "15 de Março de 2023",
      status: "Publicado",
      excerpt:
        "Nossa equipe desenvolveu uma nova tecnologia de sensoriamento tátil que permite aos robôs manipular objetos delicados com precisão e sensibilidade sem precedentes.",
    },
    {
      id: 2,
      title: "Labriot Recebe Subsídio de R$ 12,5 Milhões para Pesquisa em Navegação Autônoma",
      author: "Dra. Sarah Chen",
      date: "10 de Março de 2023",
      status: "Publicado",
      excerpt:
        "Nosso laboratório recebeu um subsídio significativo para avançar a pesquisa em sistemas de navegação autônoma para ambientes complexos.",
    },
    {
      id: 3,
      title: "Novo Artigo Publicado na Nature Robotics",
      author: "Dr. Marcus Johnson",
      date: "28 de Fevereiro de 2023",
      status: "Publicado",
      excerpt:
        "A pesquisa inovadora da nossa equipe sobre sensoriamento tátil em manipulação robótica foi publicada na Nature Robotics.",
    },
    {
      id: 4,
      title: "Inteligência Artificial e Ética: Desafios e Soluções",
      author: "Dr. Thomas Lee",
      date: "",
      status: "Rascunho",
      excerpt:
        "Uma análise dos desafios éticos enfrentados no desenvolvimento de sistemas de IA e possíveis soluções para garantir um desenvolvimento responsável.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Blog</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar posts..." className="w-full bg-background pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Filtros</Button>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.author} • {post.status === "Publicado" ? post.date : "Rascunho"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/blog/edit/${post.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
              {post.status === "Publicado" ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blog/${post.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Link>
                </Button>
              ) : (
                <Button variant="default" size="sm">
                  Publicar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

