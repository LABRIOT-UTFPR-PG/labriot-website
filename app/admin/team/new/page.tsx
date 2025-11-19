"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewTeamMember() {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [image, setImage] = useState('');
  const [linkedin, setLinkedin] = useState(''); // Novo estado
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialization, image, linkedin }), // Enviando linkedin
    });
    router.push('/admin/team');
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Novo Membro da Equipe</CardTitle>
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
                    <Button type="submit">Adicionar Membro</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}