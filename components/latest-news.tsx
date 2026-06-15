import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { getPublicPosts } from "@/lib/public-data"
import type { PostRecord } from "@/lib/repositories/posts"

type LatestNewsProps = {
  news?: PostRecord[];
}

export default async function LatestNews({ news: initialNews }: LatestNewsProps) {
  const news = initialNews ?? await getPublicPosts(2)

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.date ? new Date(item.date).toLocaleDateString() : "Sem data"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.summary}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/blog/${item.id}`} className="text-sm font-medium flex items-center">
              Leia Mais <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
