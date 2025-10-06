"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  image?: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Post not found');
        })
        .then(data => {
          setPost(data);
        })
        .catch(error => {
          console.error("Failed to fetch post:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Carregando post...</p>
        </div>
    );
  }

  if (!post) {
     return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold">Post não encontrado</h1>
            <p className="text-muted-foreground mt-2">O post que você está procurando não existe ou foi movido.</p>
            <Button asChild className="mt-6">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Blog
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
                <Button variant="outline" asChild className="mb-8">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Blog
                    </Link>
                </Button>
              <article>
                <header className="mb-8 border-b pb-4">
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
                  <p className="mt-3 text-lg text-muted-foreground">
                    Por {post.author} em {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </header>
                {post.image && (
                  <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-lg">
                    <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" />
                  </div>
                )}
                {/* Usamos 'whitespace-pre-wrap' para renderizar as quebras de linha do banco de dados */}
                <div className="prose prose-lg max-w-none text-lg leading-relaxed">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}