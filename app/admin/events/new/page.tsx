"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Evento criado",
          description: "O evento foi adicionado à agenda com sucesso.",
        });
        router.push('/admin/events');
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o evento.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Novo Evento</h1>
        </div>
        <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Detalhes do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Título do Evento */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Workshop de Robótica Avançada"
                required
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" /> Data
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
                        <Clock className="h-4 w-4" /> Horário
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

            {/* Localização */}
            <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Localização
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Auditório A ou Online"
                />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Evento</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Sobre o que vai ser o evento..."
                className="min-h-[150px]"
              />
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}