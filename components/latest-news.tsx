"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

interface Post {
  id: number;
  title: string;
  date: string;
  summary: string;
}

export default function LatestNews() {
  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setNews(data.slice(0, 2)); // Pega os 2 posts mais recentes
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando notícias...</div>

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
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