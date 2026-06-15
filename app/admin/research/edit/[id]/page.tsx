"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/lib/form-errors';

export default function EditResearch({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (id) {
      // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
      fetch(`/api/research/${id}`)
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Falha ao carregar pesquisa");
          return data;
        })
        .then(data => {
          setTitle(data.title);
          setDescription(data.description);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
    const response = await fetch(`/api/research/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast({
        title: "Nao foi possivel salvar",
        description: getApiErrorMessage(payload, "Verifique os campos e tente novamente."),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Área de pesquisa atualizada",
      description: "A área de pesquisa foi atualizada com sucesso.",
    });
    router.push('/admin/research');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/research">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Editar Área de Pesquisa</h1>
        </div>
        <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Informações da Área de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
