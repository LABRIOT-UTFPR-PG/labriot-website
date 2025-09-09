import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nossos Projetos</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Explore nossas iniciativas de pesquisa inovadoras e inovações tecnológicas em robótica e IA.
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
                        Criando um sistema de IA multimodal que pode entender e traduzir entre diferentes formas de
                        dados, incluindo texto, imagens e leituras de sensores.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/nexus">Ver Detalhes do Projeto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>SENTINEL: Monitoramento Ambiental Inteligente com Inteligência de Enxame</CardTitle>
                      <CardDescription>Iniciado: Abril 2023</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src="/placeholder.svg?height=225&width=400"
                          alt="Robôs de enxame SENTINEL monitorando o ambiente"
                          width={400}
                          height={225}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Desenvolvendo um enxame de pequenos robôs autônomos que trabalham juntos para monitorar
                        condições ambientais e coletar dados em locais de difícil acesso ou perigosos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/sentinel">Ver Detalhes do Projeto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>ARIA: Interface Robótica Adaptativa para Assistência</CardTitle>
                      <CardDescription>Iniciado: Junho 2023</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src="/placeholder.svg?height=225&width=400"
                          alt="Robô assistivo ARIA interagindo com uma pessoa"
                          width={400}
                          height={225}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Criando um sistema robótico assistivo que pode se adaptar às necessidades e preferências
                        individuais do usuário, fornecendo suporte personalizado para atividades diárias.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/aria">Ver Detalhes do Projeto</Link>
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
                        Desenvolveu uma mão robótica com sensores táteis capaz de manipular objetos delicados com
                        destreza e sensibilidade semelhantes às humanas.
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
                        Criou um sistema avançado de visão computacional capaz de reconhecer e interpretar cenas
                        complexas e atividades humanas em tempo real.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/iris">Ver Detalhes do Projeto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>ECHO: Comunicação Aprimorada para Operações Humano-Robô</CardTitle>
                      <CardDescription>Concluído: Maio 2022</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src="/placeholder.svg?height=225&width=400"
                          alt="Demonstração do sistema de comunicação ECHO"
                          width={400}
                          height={225}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Desenvolveu uma interface de linguagem natural que permite comunicação intuitiva entre humanos e
                        robôs em ambientes de trabalho colaborativo.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/echo">Ver Detalhes do Projeto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>PULSE: Compreensão Preditiva de Sistemas de Aprendizado em Ambientes</CardTitle>
                      <CardDescription>Concluído: Fevereiro 2022</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src="/placeholder.svg?height=225&width=400"
                          alt="Visualização do sistema PULSE"
                          width={400}
                          height={225}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Criou uma estrutura para prever e compreender como sistemas de IA aprendem e se adaptam a novos
                        ambientes, melhorando a transparência e explicabilidade.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/projects/pulse">Ver Detalhes do Projeto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Metodologia de Projeto</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Nossos projetos de pesquisa seguem uma metodologia rigorosa que garante validade científica,
                    aplicabilidade prática e considerações éticas.
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Identificação e Definição do Problema</span>
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Revisão de Literatura e Análise do Estado da Arte</span>
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Formulação de Hipóteses e Design Experimental</span>
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Implementação e Prototipagem</span>
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Testes, Avaliação e Refinamento</span>
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
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span>Documentação e Disseminação</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Diagrama de metodologia de projeto"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Interessado em Colaborar?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Estamos sempre abertos a novas parcerias de pesquisa e colaborações com instituições acadêmicas,
                parceiros da indústria e agências governamentais.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact">Contate Nossa Equipe de Pesquisa</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

