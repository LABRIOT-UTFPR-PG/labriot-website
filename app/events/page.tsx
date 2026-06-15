import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { getPublicEvents, getPublicSiteSettings } from "@/lib/public-data"
import { notFound } from "next/navigation"
import type { EventRecord } from "@/lib/repositories/events"

export default async function EventsPage() {
  const settings = await getPublicSiteSettings()

  if (!settings.enableEvents) {
    notFound()
  }

  const events = await getPublicEvents() as EventRecord[]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Próximos Eventos</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Participe de nossos workshops, seminários e conferências sobre Robótica e IA.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground">Nenhum evento agendado no momento.</p>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden">
                    <div className="bg-muted w-full md:w-48 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r text-center">
                      <span className="text-3xl font-bold text-primary">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-sm font-medium uppercase text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(event.date).getFullYear()}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <Badge>Próximo</Badge>
                        </div>
                        <CardDescription className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {event.location}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </CardContent>
                      {/*<CardFooter className="mt-auto pt-0">
                        <Button asChild>
                          <Link href="/contact">Inscrever-se</Link>
                        </Button>
                      </CardFooter>*/}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
