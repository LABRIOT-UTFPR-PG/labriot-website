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

export default function EditProject({ params }: { params: { id: string } }) {
  const [projectData, setProjectData] = useState({
    title: '',
    status: '',
    startDate: '',
    endDate: '',
    description: '',
    fullDescription: '',
    image: '',
  });
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          setProjectData({
            title: data.title || '',
            status: data.status || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            description: data.description || '',
            fullDescription: data.fullDescription || '',
            image: data.image || '',
          });
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
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
                  type="month"
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
                    type="month"
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