"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [image, setImage] = useState('');
  const [linkedin, setLinkedin] = useState(''); // Novo estado
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetch(`/api/team/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Falha ao buscar");
            return res.json();
        })
        .then(data => {
          setName(data.name || '');
          setSpecialization(data.specialization || '');
          setImage(data.image || '');
          setLinkedin(data.linkedin || ''); // Carrega linkedin
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialization, image, linkedin }), // Salva linkedin
    });
    router.push('/admin/team');
  };

  if (!id || loading) return <div className="p-8 text-center">Carregando dados do membro...</div>;

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
                        <Label htmlFor="specialization">Especialização</Label>
                        <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="linkedin">LinkedIn (URL)</Label>
                        <Input 
                          id="linkedin" 
                          value={linkedin} 
                          onChange={(e) => setLinkedin(e.target.value)} 
                          placeholder="https://www.linkedin.com/in/seu-perfil" 
                        />
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