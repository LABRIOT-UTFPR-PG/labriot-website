"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import { useEffect, useState } from "react"

// Definição da interface baseada na tabela criada
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status?: string;
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados da API
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar eventos:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      // Nota: Você precisará criar a rota DELETE em /api/events/[id]/route.ts se quiser que funcione
      // await fetch(`/api/events/${id}`, { method: 'DELETE' });
      // setEvents(events.filter(e => e.id !== id));
      alert("Funcionalidade de deletar precisa da rota API implementada.");
    }
  };

  if (loading) return <div>Carregando eventos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Eventos</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar eventos..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">Nenhum evento agendado.</p>
        ) : (
            events.map((event) => (
            <Card key={event.id}>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
                    </CardDescription>
                    </div>
                    <Badge variant="default">Próximo</Badge>
                </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                      {/* Link corrigido para a página de edição */}
                      <Link href={`/admin/events/edit/${event.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                      </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                  </Button>
              </div>
                </CardFooter>
            </Card>
            ))
        )}
      </div>
    </div>
  )
}