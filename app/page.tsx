/* app/page.tsx */
import Link from "next/link"
import { ArrowRight, Bot, Brain, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UpcomingEvents from "@/components/upcoming-events"
import TeamMembers from "@/components/team-members"
import Projects from "@/components/projects"
import { HeroCarousel } from "@/components/hero-carousel"
import { getPublicSiteSettings } from "@/lib/public-data"

export default async function Home() {
  const settings = await getPublicSiteSettings()
  const missionCards = [
    {
      title: "Robótica",
      description:
        "Desenvolvimento de sistemas robóticos inteligentes e soluções de IoT para resolver problemas complexos com alta precisão.",
      icon: Bot,
    },
    {
      title: "Inteligência Artificial",
      description:
        "Implementação de algoritmos de inteligência artificial e modelos de aprendizado de máquina para otimizar a tomada de decisão com assertividade estratégica.",
      icon: Brain,
    },
    {
      title: "Agentes Inteligentes",
      description:
        "Criação de agentes inteligentes e desenvolvimento de LLMs para automatizar tarefas com alta adaptabilidade.",
      icon: Cpu,
    },
  ]

  return (
    <div className="landing-flow bg-background">
      {/* Seção 1: Hero / Preto */}
      <section className="landing-section w-full py-8 md:py-14 lg:py-20">
        <div className="container relative px-4 md:px-6" data-scroll-reveal>
          <HeroCarousel />
        </div>
      </section>
      
      {/* Seção 2: Missão / Cinza */}
      <section className="landing-section w-full py-[var(--section-y-sm)]">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 text-center" data-scroll-reveal>
            <div className="section-kicker">
              Nossa Missão
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Avançando a Tecnologia para um Amanhã Melhor
            </h2>
            <p className="text-base leading-8 text-muted-foreground md:text-xl">
              No Labriot, estamos comprometidos em desenvolver sistemas robóticos inteligentes e algoritmos de IA que
              resolvam problemas do mundo real e melhorem a vida humana. Nossa abordagem interdisciplinar combina
              pesquisa de ponta com aplicações práticas.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 pt-12 lg:grid-cols-3">
            {missionCards.map(({ title, description, icon: Icon }, index) => (
              <Card key={title} className="premium-card group flex min-h-[280px] flex-col justify-between !border-0 !bg-transparent !shadow-none md:min-h-[325px]" data-scroll-reveal>
                <CardHeader className="gap-10 p-8 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="forrm-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/50 bg-background/45 text-muted-foreground shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-105 group-hover:text-foreground">
                    <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="font-display text-2xl tracking-[-0.055em] md:text-3xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="max-w-[18rem] text-base leading-7 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 3: Projetos em Destaque - ID ADICIONADO */}
      <section className="landing-section w-full py-[var(--section-y)]">
        <div className="container px-4 md:px-6">
          <div id="projects" className="mx-auto flex max-w-3xl scroll-mt-24 flex-col items-center justify-center gap-4 text-center" data-scroll-reveal>
            <div className="section-kicker">Projetos</div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-5xl">Projetos em Destaque</h2>
            <p className="text-base leading-8 text-muted-foreground md:text-xl">
              Explore nossas iniciativas de pesquisa e inovações tecnológicas.
            </p>
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl" data-scroll-reveal>
            <Projects />
          </div>
        </div>
      </section>

      {/* Seção 4: Conheça Nossa Equipe - ID ADICIONADO */}
      <section className="landing-section w-full py-[var(--section-y)]">
        <div className="container px-4 md:px-6">
          <div id="team" className="mx-auto flex max-w-3xl scroll-mt-24 flex-col items-center justify-center gap-4 text-center" data-scroll-reveal>
            <div className="section-kicker">Equipe</div>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-5xl">Conheça Nossa Equipe</h2>
            <p className="text-base leading-8 text-muted-foreground md:text-xl">
              Nossa equipe de desenvolvedores reúne expertise de várias disciplinas.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 py-12" data-scroll-reveal>
            <TeamMembers />
          </div>
        </div>
      </section>

      {/* Seção 5: Eventos - ID ADICIONADO */}
      {settings.enableEvents ? (
        <section className="landing-section w-full py-[var(--section-y-sm)]">
          <div className="container px-4 md:px-6">
            <div id="events" className="mx-auto mb-9 flex max-w-3xl scroll-mt-24 flex-col items-center justify-center gap-4 text-center" data-scroll-reveal>
               <div className="section-kicker">Agenda</div>
               <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Agenda do Labriot</h2>
               <p className="text-base leading-8 text-muted-foreground md:text-xl">
                 Acompanhe a agenda do Labriot, incluindo próximos encontros e registros recentes das nossas atividades.
               </p>
            </div>
            
            <div data-scroll-reveal>
              <UpcomingEvents />
            </div>

            <div className="mt-7 flex justify-center" data-scroll-reveal>
              <Button asChild>
                <Link href="/events">
                  Ver Todos os Eventos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Seção 6: Colabore (Contato) - ID ADICIONADO */}
      <section id="contact" className="landing-section w-full scroll-mt-20 pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container px-4 text-center md:px-6">
          <div className="mx-auto max-w-4xl px-6 py-10 md:px-12 md:py-12" data-scroll-reveal>
            <div className="space-y-4">
              <div className="section-kicker mx-auto">Contato</div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Colabore com o Labriot</h2>
              <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground md:text-xl">
                Interessado em fazer parceria conosco em projetos de pesquisa ou explorar potenciais colaborações?
              </p>
            </div>
            <div className="mx-auto mt-8 w-full max-w-sm">
              <Button asChild size="lg" className="h-12 w-full rounded-[var(--radius-button)] shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/contact">
                  Contate Nossa Equipe <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
