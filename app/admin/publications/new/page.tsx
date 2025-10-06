"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function NewPublication() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [doi, setDoi] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, authors, journal, year, doi, description }),
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
        <h1 className="text-3xl font-bold tracking-tight">Nova Publicação</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Publicação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="authors">Autores</Label>
              <Input id="authors" value={authors} onChange={(e) => setAuthors(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="journal">Revista/Conferência</Label>
              <Input id="journal" value={journal} onChange={(e) => setJournal(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="year">Ano</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || '')} required />
            </div>
            <div>
              <Label htmlFor="doi">DOI</Label>
              <Input id="doi" value={doi} onChange={(e) => setDoi(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit">Salvar Publicação</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}