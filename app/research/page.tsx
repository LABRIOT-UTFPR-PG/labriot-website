import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, Cpu, BotIcon as Robot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Áreas de Pesquisa</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Explorando as fronteiras da robótica e inteligência artificial através de pesquisa inovadora.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <Robot className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Sistemas Autônomos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvendo sistemas robóticos autônomos capazes de navegar em ambientes complexos e tomar
                    decisões sem intervenção humana.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/research/autonomous-systems">Saiba Mais</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Brain className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Aprendizado de Máquina</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Criando algoritmos avançados que permitem às máquinas aprender com dados, adaptar-se a novas
                    entradas e realizar tarefas semelhantes às humanas.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/research/machine-learning">Saiba Mais</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Cpu className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Interação Humano-Robô</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pesquisando interfaces intuitivas e métodos de comunicação para aprimorar a colaboração entre
                    humanos e sistemas robóticos.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/research/human-robot-interaction">Saiba Mais</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Visão Computacional</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Nossa pesquisa em visão computacional se concentra em capacitar máquinas para interpretar e
                    compreender informações visuais do mundo, com aplicações em reconhecimento de objetos, compreensão
                    de cenas e navegação visual.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Detecção e Reconhecimento de Objetos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Compreensão e Segmentação de Cenas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>SLAM Visual e Navegação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Reconstrução 3D a partir de Imagens 2D</span>
                  </li>
                </ul>
                <div>
                  <Button asChild>
                    <Link href="/research/computer-vision">
                      Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Visualização de pesquisa em visão computacional"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex items-center justify-center lg:order-last">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Pesquisa em processamento de linguagem natural"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Processamento de Linguagem Natural
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Nossa pesquisa em PLN se concentra no desenvolvimento de sistemas que podem entender, interpretar e
                    gerar linguagem humana, permitindo uma comunicação e interação mais natural entre humanos e robôs.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Compreensão de Linguagem para Robótica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Sistemas de IA Conversacional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Fundamentação de Linguagem Multimodal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Seguimento de Instruções em Linguagem Natural</span>
                  </li>
                </ul>
                <div>
                  <Button asChild>
                    <Link href="/research/nlp">
                      Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Publicações de Pesquisa</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nosso trabalho foi publicado em revistas e conferências de alto nível nos campos da robótica e
                  inteligência artificial.
                </p>
              </div>
            </div>
            <Tabs defaultValue="2023" className="mt-8 w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="2023">2023</TabsTrigger>
                <TabsTrigger value="2022">2022</TabsTrigger>
                <TabsTrigger value="2021">2021</TabsTrigger>
              </TabsList>
              <TabsContent value="2023" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Aprendizado Adaptativo em Sistemas Robóticos</CardTitle>
                    <CardDescription>IEEE Transactions on Robotics, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Chen, S., Johnson, M., & Patel, A. (2023). Uma abordagem inovadora para aprendizado adaptativo em
                      sistemas robóticos, permitindo que robôs se ajustem rapidamente a ambientes e tarefas em mudança.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/adaptive-learning-2023">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Compreensão de Cenas 3D em Tempo Real para Navegação Autônoma</CardTitle>
                    <CardDescription>International Conference on Robotics and Automation (ICRA), 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Johnson, M., Patel, A., & Chen, S. (2023). Uma estrutura para compreensão de cenas 3D em tempo
                      real que permite que robôs naveguem em ambientes complexos e dinâmicos.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/scene-understanding-2023">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="2022" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Percepção Multi-Modal para Manipulação Robótica</CardTitle>
                    <CardDescription>Conference on Robot Learning (CoRL), 2022</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Patel, A., Chen, S., & Johnson, M. (2022). Uma estrutura para integrar informações visuais, táteis
                      e proprioceptivas para aprimorar as capacidades de manipulação robótica.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/multi-modal-perception-2022">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Considerações Éticas na Tomada de Decisão Autônoma</CardTitle>
                    <CardDescription>AI Ethics Journal, 2022</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Chen, S., & Johnson, M. (2022). Uma exploração das implicações éticas da tomada de decisão
                      autônoma em sistemas de IA e uma estrutura proposta para o desenvolvimento responsável de IA.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/ethical-considerations-2022">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="2021" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Aprendizado por Reforço para Manipulação Robótica</CardTitle>
                    <CardDescription>Neural Information Processing Systems (NeurIPS), 2021</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Johnson, M., & Chen, S. (2021). Uma abordagem inovadora de aprendizado por reforço para tarefas de
                      manipulação robótica que reduz a necessidade de dados extensivos de treinamento.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/reinforcement-learning-2021">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Robótica de Enxame para Monitoramento Ambiental</CardTitle>
                    <CardDescription>Science Robotics, 2021</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Patel, A., & Chen, S. (2021). Uma abordagem de robótica de enxame para monitoramento ambiental que
                      permite coleta e análise eficientes de dados em ambientes de grande escala.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href="/publications/swarm-robotics-2021">Ver Publicação</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="flex justify-center mt-12">
              <Button asChild size="lg">
                <Link href="/publications">
                  Ver Todas as Publicações <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

