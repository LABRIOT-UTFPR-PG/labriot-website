"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditTeamMember({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/team/${id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name);
          setRole(data.role);
          setSpecialization(data.specialization);
          setCategory(data.category);
          setImage(data.image);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, specialization, category, image }),
    });
    router.push('/admin/team');
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Editar Membro da Equipe</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="role">Cargo</Label>
                        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="specialization">Especialização</Label>
                        <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="leadership">Liderança</SelectItem>
                            <SelectItem value="students">Estudantes</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="image">URL da Imagem</Label>
                        <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
                    </div>
                    <Button type="submit">Salvar Alterações</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}