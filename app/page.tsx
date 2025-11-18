import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, ChevronRight, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LatestNews from "@/components/latest-news"
import ResearchHighlights from "@/components/research-highlights"
import TeamMembers from "@/components/team-members"

export default function Home() {
  return (
    <>
      {/* Seção 1: Preto */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Pioneiros no Futuro da Robótica e IA
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Labriot é um laboratório de pesquisa de ponta dedicado a avançar as fronteiras da robótica e
                  inteligência artificial através de pesquisa e desenvolvimento inovadores.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/research">
                    Explore Nossa Pesquisa <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contate-nos</Link>
                </Button>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Pesquisa avançada em robótica no Labriot"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      {/* Seção 2: Cinza */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black-1000">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Nossa Missão
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Avançando a Tecnologia para um Amanhã Melhor
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                No Labriot, estamos comprometidos em desenvolver sistemas robóticos inteligentes e algoritmos de IA que
                resolvam problemas do mundo real e melhorem a vida humana. Nossa abordagem interdisciplinar combina
                pesquisa de ponta com aplicações práticas.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="h-12 w-12 text-primary mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
                <CardTitle>Sistemas Autônomos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Desenvolvendo sistemas robóticos autônomos capazes de navegar em ambientes complexos e tomar decisões
                  sem intervenção humana.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Brain className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Aprendizado de Máquina</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Criando algoritmos avançados que permitem às máquinas aprender com dados, adaptar-se a novas entradas
                  e realizar tarefas semelhantes às humanas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Cpu className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Interação Humano-Robô</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pesquisando interfaces intuitivas e métodos de comunicação para aprimorar a colaboração entre humanos
                  e sistemas robóticos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/*<section className="w-full py-12 md:py-24 lg:py-32">
        ... (Esta seção estava comentada e não será modificada)
      </section>*/}
      {/* Seção 3: Preto (Projetos em Destaque) */}
<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Projetos em Destaque</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Explore nossas iniciativas de pesquisa inovadoras e inovações tecnológicas.
              </p>
            </div>
          </div>
          <div className="mt-8 w-full max-w-4xl mx-auto">
            <projects />
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/projects">
                Ver Todos os Projetos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Seção 4: Cinza (Conheça Nossa Equipe) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black-1000">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Conheça Nossa Equipe</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Nossa diversificada equipe de pesquisadores e engenheiros reúne expertise de várias disciplinas.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 py-12">
            <TeamMembers />
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/team">
                Conheça a Equipe Completa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Seção 5: Preto (Últimas Notícias e Insights) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Últimas Notícias e Insights</h2>
              <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                Mantenha-se atualizado com nossos mais recentes avanços de pesquisa, publicações e eventos.
              </p>
              <Button asChild className="mt-6">
                <Link href="/blog">
                  Visite Nosso Blog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <LatestNews />
          </div>
        </div>
      </section>
      {/*<section className="w-full py-12 md:py-24 lg:py-32">
        ... (Esta seção estava comentada e não será modificada)
      </section>*/}
      {/* Seção 6: Cinza (Colabore com o Labriot) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black-1000">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Colabore com o Labriot</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Interessado em fazer parceria conosco em projetos de pesquisa ou explorar potenciais colaborações?
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/contact">Contate Nossa Equipe</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}