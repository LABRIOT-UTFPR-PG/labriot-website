"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function EditPublication({ params }: { params: { id: string } }) {
  const [publication, setPublication] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    doi: '',
    description: '',
  });
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/publications/${id}`)
        .then(res => res.json())
        .then(data => {
          setPublication(data);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPublication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/publications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publication),
    });
    router.push('/admin/publications');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/publications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Publicação</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Publicação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={publication.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="authors">Autores</Label>
              <Input id="authors" name="authors" value={publication.authors} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="journal">Revista/Conferência</Label>
              <Input id="journal" name="journal" value={publication.journal} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="year">Ano</Label>
              <Input id="year" name="year" type="number" value={publication.year} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="doi">DOI</Label>
              <Input id="doi" name="doi" value={publication.doi} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={publication.description} onChange={handleChange} />
            </div>
            <Button type="submit">Salvar Alterações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}