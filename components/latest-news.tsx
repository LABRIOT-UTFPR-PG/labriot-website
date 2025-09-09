import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function LatestNews() {
  const news = [
    {
      id: 1,
      title: "Labriot Recebe Subsídio de R$ 12,5 Milhões para Pesquisa em Navegação Autônoma",
      date: "15 de Março de 2023",
      excerpt:
        "Nosso laboratório recebeu um subsídio significativo para avançar a pesquisa em sistemas de navegação autônoma para ambientes complexos.",
      slug: "grant-autonomous-navigation",
    },
    {
      id: 2,
      title: "Novo Artigo Publicado na Nature Robotics",
      date: "28 de Fevereiro de 2023",
      excerpt:
        "A pesquisa inovadora da nossa equipe sobre sensoriamento tátil em manipulação robótica foi publicada na Nature Robotics.",
      slug: "nature-robotics-publication",
    },
    {
      id: 3,
      title: "Labriot Sediará Workshop Internacional de Robótica",
      date: "10 de Janeiro de 2023",
      excerpt: "Junte-se a nós para um workshop de três dias com pesquisadores líderes no campo da robótica e IA.",
      slug: "international-robotics-workshop",
    },
  ]

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/blog/${item.slug}`} className="text-sm font-medium flex items-center">
              Leia Mais <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

