"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Post {
  id: number;
  title: string;
  summary?: string;
  author: string;
  date: string;
  content: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const normalizedQuery = search.trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.author.toLowerCase().includes(normalizedQuery) ||
          (p.summary || "").toLowerCase().includes(normalizedQuery) ||
          p.content.toLowerCase().includes(normalizedQuery)
      )
    : posts;

  if (loading) return <div className="container py-24 text-center">Carregando...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Blog Labriot</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Mantenha-se atualizado com nossos mais recentes avanços de pesquisa, insights e eventos em robótica e IA.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex space-x-2"
                >
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar artigos..."
                    className="max-w-lg flex-1"
                  />
                  {search && (
                    <Button type="button" variant="outline" onClick={() => setSearch("")}>
                      Limpar
                    </Button>
                  )}
                </form>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <p className="text-center text-muted-foreground mt-12">
                {search
                  ? "Nenhum artigo encontrado para sua busca."
                  : "Nenhum artigo publicado no momento."}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {post.author} •{" "}
                        {new Date(
                          /^\d{4}-\d{2}-\d{2}$/.test(post.date) ? `${post.date}T00:00:00` : post.date
                        ).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.summary || post.content}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href={`/blog/${post.id}`}>
                          Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
