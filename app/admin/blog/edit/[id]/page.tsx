"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function EditPost({ params }: { params: { id: string } }) {
  const [postData, setPostData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    date: '',
    image: '',
  });
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setPostData({
            title: data.title || '',
            summary: data.summary || '',
            content: data.content || '',
            author: data.author || '',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            image: data.image || '',
          });
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    toast({
      title: "Post atualizado",
      description: "O post foi atualizado com sucesso.",
    });
    router.push('/admin/blog');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Post</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Post</Label>
              <Input id="title" name="title" value={postData.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="summary">Resumo</Label>
              <Textarea id="summary" name="summary" value={postData.summary} onChange={handleChange} className="min-h-[100px]" />
            </div>
            <div>
              <Label htmlFor="author">Autor</Label>
              <Input id="author" name="author" value={postData.author} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input id="date" name="date" type="date" value={postData.date} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea id="content" name="content" value={postData.content} onChange={handleChange} className="min-h-[200px]" required />
            </div>
            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input id="image" name="image" value={postData.image} onChange={handleChange} placeholder="https://example.com/image.png" />
            </div>
            <div className="flex gap-2">
                <Button type="submit">Salvar Alterações</Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/blog">Cancelar</Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}