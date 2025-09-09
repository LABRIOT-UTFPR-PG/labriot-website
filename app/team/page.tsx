import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nossa Equipe</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Conheça as mentes brilhantes por trás das pesquisas e inovações revolucionárias do Labriot.
                </p>
              </div>
            </div>
            <Tabs defaultValue="leadership" className="mt-8 w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="leadership">Liderança</TabsTrigger>
                <TabsTrigger value="researchers">Pesquisadores</TabsTrigger>
                <TabsTrigger value="engineers">Engenheiros</TabsTrigger>
              </TabsList>
              <TabsContent value="leadership" className="mt-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Dra. Sarah Chen"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dra. Sarah Chen</CardTitle>
                      <CardDescription>Diretora do Laboratório</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        A Dra. Chen é uma renomada especialista em robótica e IA com mais de 15 anos de experiência na
                        área. Ela lidera as iniciativas de pesquisa e a direção estratégica do Labriot.
                      </p>
                      <div className="mt-4 flex space-x-4">
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/team/sarah-chen">Ver Perfil Completo</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=400&width=400"
                        alt="Dr. Marcus Johnson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dr. Marcus Johnson</CardTitle>
                      <CardDescription>Pesquisador Líder</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        O Dr. Johnson é especializado em aprendizado de máquina e redes neurais. Ele supervisiona as
                        equipes de pesquisa e garante o rigor científico de todos os projetos.
                      </p>
                      <div className="mt-4 flex space-x-4">
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href="#">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/team/marcus-johnson">Ver Perfil Completo</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="researchers" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dra. Aisha Patel"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dra. Aisha Patel</CardTitle>
                      <CardDescription>Pesquisadora Sênior</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Especializada em manipulação robótica e tecnologias de fusão de sensores.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/aisha-patel">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dr. James Wilson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dr. James Wilson</CardTitle>
                      <CardDescription>Pesquisador Sênior</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Foca em visão computacional e SLAM visual para navegação autônoma.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/james-wilson">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dra. Elena Rodriguez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dra. Elena Rodriguez</CardTitle>
                      <CardDescription>Cientista de Pesquisa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Especializada em processamento de linguagem natural e interação humano-robô.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/elena-rodriguez">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dr. David Kim"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dr. David Kim</CardTitle>
                      <CardDescription>Cientista de Pesquisa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Trabalha com algoritmos de aprendizado por reforço para controle robótico.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/david-kim">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dra. Maya Nguyen"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dra. Maya Nguyen</CardTitle>
                      <CardDescription>Cientista de Pesquisa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Pesquisa inteligência de enxame e coordenação multi-robôs.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/maya-nguyen">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Dr. Thomas Lee"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Dr. Thomas Lee</CardTitle>
                      <CardDescription>Cientista de Pesquisa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Foca em IA ética e desenvolvimento responsável de robótica.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/thomas-lee">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="engineers" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Michael Zhang"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Michael Zhang</CardTitle>
                      <CardDescription>Engenheiro Líder</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Supervisiona a equipe de engenharia e o desenvolvimento de hardware para sistemas robóticos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/michael-zhang">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Sophia Martinez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Sophia Martinez</CardTitle>
                      <CardDescription>Engenheira de Software Sênior</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Desenvolve arquiteturas de software para sistemas de controle robótico.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/sophia-martinez">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Alex Johnson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Alex Johnson</CardTitle>
                      <CardDescription>Engenheiro de Robótica</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Especializado em design mecânico e prototipagem de sistemas robóticos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/alex-johnson">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Priya Sharma"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Priya Sharma</CardTitle>
                      <CardDescription>Engenheira de IA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Implementa e otimiza modelos de aprendizado de máquina para aplicações robóticas.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/priya-sharma">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Carlos Mendez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Carlos Mendez</CardTitle>
                      <CardDescription>Engenheiro de Eletrônica</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Projeta e implementa sistemas de sensores e componentes eletrônicos para robôs.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/carlos-mendez">Ver Perfil</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Emma Wilson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Emma Wilson</CardTitle>
                      <CardDescription>Engenheira de Integração de Sistemas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Especializada em integrar componentes de hardware e software em sistemas robóticos completos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href="/team/emma-wilson">Ver Perfil</Link>
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
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Junte-se à Nossa Equipe</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Estamos sempre procurando pesquisadores, engenheiros e equipe de suporte talentosos para se juntar à
                    nossa equipe e contribuir para pesquisas inovadoras em robótica e IA.
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
                    <span>Ambiente de pesquisa colaborativo e inovador</span>
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
                    <span>Instalações e equipamentos de última geração</span>
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
                    <span>Oportunidades para desenvolvimento profissional e crescimento</span>
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
                    <span>Remuneração e benefícios competitivos</span>
                  </li>
                </ul>
                <div>
                  <Button asChild>
                    <Link href="/careers">
                      Ver Vagas Abertas <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Colaboração da equipe Labriot"
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
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Colabore com Nossa Equipe</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Interessado em fazer parceria com nossos pesquisadores em um projeto? Estamos abertos a colaborações com
                instituições acadêmicas, parceiros da indústria e agências governamentais.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact">Contate Nossa Equipe</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

