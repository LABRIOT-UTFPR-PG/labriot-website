import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicAgendaPreview } from "@/lib/public-data"
import type { EventRecord } from "@/lib/repositories/events"

type UpcomingEventsProps = {
  events?: EventRecord[];
}

export default async function UpcomingEvents({ events: initialEvents }: UpcomingEventsProps) {
  const agendaPreview = initialEvents
    ? { events: initialEvents, mode: "upcoming" as const }
    : await getPublicAgendaPreview(3);
  const { events, mode } = agendaPreview;
  const isRecentFallback = mode === "recent";

  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Nenhum evento cadastrado no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {isRecentFallback ? (
        <div className="mx-auto w-fit rounded-full border border-border/60 bg-background/40 px-4 py-2 text-center text-sm text-muted-foreground">
          Sem próximos eventos. Mostrando registros recentes.
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-6">
        {events.map((event, index) => (
          <Card key={event.id} className="premium-card flex min-h-[360px] w-full max-w-[360px] flex-col !border-0 !bg-transparent !shadow-none">
            <CardHeader className="p-6 pb-4">
              <span className="forrm-number mb-5">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="font-display text-xl leading-tight tracking-[-0.035em]">{event.title}</CardTitle>
                <Badge variant={isRecentFallback ? "outline" : "secondary"} className="shrink-0 rounded-full border border-border/50 bg-background/60 px-3 py-1">
                  {isRecentFallback ? "Recente" : new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </Badge>
              </div>
              <CardDescription className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.025] px-3 py-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
                {event.time ? (
                  <div className="flex items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.025] px-3 py-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" /> 
                    <span>{event.time}</span>
                  </div>
                ) : null}
                {event.location ? (
                  <div className="flex items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.025] px-3 py-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" /> 
                    <span className="truncate">{event.location}</span>
                  </div>
                ) : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-6">
              <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
            <CardFooter className="mt-auto p-6 pt-4">
               <Button variant="ghost" size="sm" className="w-full justify-start p-0 text-primary hover:bg-transparent hover:underline" asChild>
                  <Link href="/events">
                    Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
