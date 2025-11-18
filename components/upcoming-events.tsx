"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status?: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        // Filtra apenas eventos futuros ou do dia atual
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureEvents = data.filter((event: Event) => {
            // Ajuste para garantir que a data seja interpretada corretamente (fuso horário local)
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate >= today;
        });

        // Pega apenas os 3 primeiros
        setEvents(futureEvents.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar eventos:", err);
        setLoading(false)
      });
  }, []);

  if (loading) return <div className="text-center">Carregando eventos...</div>;

  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Nenhum evento próximo agendado no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
              <Badge variant="secondary" className="shrink-0">
                {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </Badge>
            </div>
            <CardDescription className="flex flex-col gap-1.5 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" /> 
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" /> 
                <span className="truncate">{event.location}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
          </CardContent>
          <CardFooter>
             <Button variant="ghost" size="sm" className="w-full justify-start p-0 hover:bg-transparent hover:underline text-primary" asChild>
                <Link href="/events">
                  Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}