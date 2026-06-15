"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/form-errors';

function normalizeDateInput(value: unknown) {
  if (typeof value !== "string") return "";

  const date = value.trim();
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
    return date;
  }

  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
    return `${date}-01`;
  }

  return "";
}

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const [projectData, setProjectData] = useState({
    title: '',
    status: '',
    startDate: '',
    endDate: '',
    description: '',
    fullDescription: '',
    image: '',
    url: '',
  });
  const router = useRouter();
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (id) {
      // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
      fetch(`/api/projects/${id}`)
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Falha ao carregar projeto");
          return data;
        })
        .then(data => {
          setProjectData({
            title: data.title || '',
            status: data.status || '',
            startDate: normalizeDateInput(data.startDate),
            endDate: normalizeDateInput(data.endDate),
            description: data.description || '',
            fullDescription: data.fullDescription || data.fulldescription || '',
            image: data.image || '',
            url: data.url || '',
          });
        })
        .catch(() => {
          router.push('/admin/projects');
        });
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      alert(getApiErrorMessage(payload, "Nao foi possivel salvar as alteracoes."));
      return;
    }

    router.push('/admin/projects');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Projeto</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto</Label>
              <Input id="title" name="title" value={projectData.title} onChange={handleChange} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={projectData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="planned">Planejado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={handleChange}
                />
              </div>

              {projectData.status === "completed" && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Conclusão</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={projectData.endDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição Curta</Label>
              <Textarea id="description" name="description" value={projectData.description} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="fullDescription">Descrição Completa</Label>
              <Textarea id="fullDescription" name="fullDescription" value={projectData.fullDescription} onChange={handleChange} className="min-h-[200px]" />
            </div>

            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input id="image" name="image" value={projectData.image} onChange={handleChange} placeholder="https://example.com/image.png" />
            </div>

            <div>
              <Label htmlFor="url">Link / Página Customizada (Opcional)</Label>
              <Input id="url" name="url" value={projectData.url} onChange={handleChange} placeholder="Ex: /projects/roboflow" />
              <p className="text-xs text-muted-foreground">
                Se você criou uma página específica para este projeto (ex: <code>/projects/roboflow</code>), insira o caminho aqui. Ao clicar no projeto na página inicial, o usuário será direcionado diretamente para ela.
              </p>
            </div>
            
            <div className="flex gap-2">
                <Button type="submit">Salvar Alterações</Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/projects">Cancelar</Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
