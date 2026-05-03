"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EditEventProps {
  params: Promise<{ id: string }>;
}

export default function EditEvent({ params }: EditEventProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string>('');
  const router = useRouter();

  // Resolver o params (Promise no Next.js 15+)
  useEffect(() => {
    params.then(resolvedParams => {
      setEventId(resolvedParams.id);
    });
  }, [params]);

  // Carregar dados do evento
  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then(res => {
          if (!res.ok) throw new Error("Erro ao carregar");
          return res.json();
        })
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(err => {
          toast({ 
            title: "Erro", 
            description: "Evento não encontrado.", 
            variant: "destructive" 
          });
          router.push('/admin/events');
        });
    }
  }, [eventId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId) {
      toast({ 
        title: "Erro", 
        description: "ID do evento não encontrado.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar');
      }

      toast({ 
        title: "Evento atualizado", 
        description: "As alterações foram salvas com sucesso." 
      });
      router.push('/admin/events');
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: "Falha ao atualizar o evento.", 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Editar Evento</h1>
        </div>
        <Button onClick={handleSubmit} disabled={!eventId}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4"/> Data
                </Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4"/> Horário
                </Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4"/> Localização
              </Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="min-h-[150px]" 
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}