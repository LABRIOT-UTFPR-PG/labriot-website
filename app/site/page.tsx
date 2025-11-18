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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Áreas de Pesquisa</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Nossa equipe multidisciplinar explora vários domínios na interseção da robótica e inteligência
                artificial.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Visão Computacional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Capacitando máquinas para interpretar e compreender informações visuais do mundo.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/computer-vision">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Processamento de Linguagem Natural</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Desenvolvendo sistemas que podem entender, interpretar e gerar linguagem humana.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/nlp">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Aprendizado por Reforço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Treinando agentes para tomar sequências de decisões através de interações de tentativa e erro.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/reinforcement-learning">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manipulação Robótica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Criando sistemas capazes de interagir com objetos no mundo físico com precisão.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/robotic-manipulation">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inteligência de Enxame</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Estudando comportamento coletivo e auto-organização em sistemas multi-robôs.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/swarm-intelligence">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>IA Ética</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Garantindo que sistemas de IA sejam projetados e implementados de maneiras alinhadas com valores e
                  ética humanos.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/research/ethical-ai">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>*/}
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
          <Tabs defaultValue="ongoing" className="mt-8 w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ongoing">Projetos em Andamento</TabsTrigger>
              <TabsTrigger value="completed">Projetos Concluídos</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>ATLAS: Sistema de Aprendizado e Adaptação de Terreno Autônomo</CardTitle>
                    <CardDescription>Iniciado: Janeiro 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=225&width=400"
                        alt="Robô ATLAS navegando em terreno acidentado"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Desenvolvendo um sistema robótico capaz de navegar e se adaptar autonomamente a terrenos
                      desconhecidos e desafiadores usando técnicas de aprendizado por reforço.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/projects/atlas">Ver Detalhes do Projeto</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>NEXUS: Sistema de Compreensão Cruzada Aprimorado por Redes Neurais</CardTitle>
                    <CardDescription>Iniciado: Março 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=225&width=400"
                        alt="Visualização da rede neural NEXUS"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Criando um sistema de IA multimodal que pode entender e traduzir entre diferentes formas de dados,
                      incluindo texto, imagens e leituras de sensores.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/projects/nexus">Ver Detalhes do Projeto</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>HERMES: Manipulação Robótica que Emula Humanos com Sensibilidade Aprimorada</CardTitle>
                    <CardDescription>Concluído: Novembro 2022</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=225&width=400"
                        alt="Mão robótica HERMES manipulando objetos delicados"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Desenvolveu uma mão robótica com sensores táteis capaz de manipular objetos delicados com destreza
                      e sensibilidade semelhantes às humanas.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/projects/hermes">Ver Detalhes do Projeto</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>IRIS: Sistema Inteligente de Reconhecimento e Interpretação</CardTitle>
                    <CardDescription>Concluído: Agosto 2022</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=225&width=400"
                        alt="Sistema de visão computacional IRIS em ação"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Criou um sistema avançado de visão computacional capaz de reconhecer e interpretar cenas complexas
                      e atividades humanas em tempo real.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/projects/iris">Ver Detalhes do Projeto</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/projects">
                Ver Todos os Projetos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <ResearchHighlights />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Destaques de Pesquisa</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Nosso trabalho foi publicado em revistas e conferências de alto nível, contribuindo para o avanço da
                  robótica e IA.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild>
                  <Link href="/publications">
                    Ver Publicações <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>*/}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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