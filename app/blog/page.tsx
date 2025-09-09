import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Blog Labriot</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Mantenha-se atualizado com nossos mais recentes avanços de pesquisa, insights e eventos em robótica e
                  IA.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input type="text" placeholder="Pesquisar artigos..." className="max-w-lg flex-1" />
                  <Button type="submit">Pesquisar</Button>
                </form>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Avanço na Manipulação Robótica"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Avanço na Manipulação Robótica: Nova Tecnologia de Sensoriamento Tátil</CardTitle>
                  <CardDescription>15 de Março de 2023 • Dra. Aisha Patel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa equipe desenvolveu uma nova tecnologia de sensoriamento tátil que permite aos robôs manipular
                    objetos delicados com precisão e sensibilidade sem precedentes.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/breakthrough-robotic-manipulation">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Labriot Recebe Subsídio"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Labriot Recebe Subsídio de R$ 12,5 Milhões para Pesquisa em Navegação Autônoma</CardTitle>
                  <CardDescription>10 de Março de 2023 • Dra. Sarah Chen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nosso laboratório recebeu um subsídio significativo para avançar a pesquisa em sistemas de navegação
                    autônoma para ambientes complexos.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/grant-autonomous-navigation">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Publicação na Nature Robotics"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Novo Artigo Publicado na Nature Robotics</CardTitle>
                  <CardDescription>28 de Fevereiro de 2023 • Dr. Marcus Johnson</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A pesquisa inovadora da nossa equipe sobre sensoriamento tátil em manipulação robótica foi publicada
                    na Nature Robotics.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/nature-robotics-publication">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Workshop de Robótica"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Labriot Sediará Workshop Internacional de Robótica</CardTitle>
                  <CardDescription>10 de Janeiro de 2023 • Dra. Elena Rodriguez</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Junte-se a nós para um workshop de três dias com pesquisadores líderes no campo da robótica e IA.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/international-robotics-workshop">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Estrutura de Ética em IA"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Introduzindo uma Nova Estrutura para Desenvolvimento Ético de IA</CardTitle>
                  <CardDescription>15 de Dezembro de 2022 • Dr. Thomas Lee</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa equipe desenvolveu uma estrutura abrangente para garantir que considerações éticas sejam
                    integradas aos processos de desenvolvimento de IA.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/ethical-ai-framework">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=300&width=600"
                    alt="Robótica de Enxame"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Avanços em Robótica de Enxame para Monitoramento Ambiental</CardTitle>
                  <CardDescription>20 de Novembro de 2022 • Dra. Maya Nguyen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa equipe de pesquisa fez progressos significativos no desenvolvimento de sistemas de robótica de
                    enxame para aplicações de monitoramento ambiental.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild>
                    <Link href="/blog/swarm-robotics-environmental-monitoring">
                      Leia Mais <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="lg">
                Carregar Mais Artigos
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Assine Nossa Newsletter</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Mantenha-se atualizado com nossos mais recentes avanços de pesquisa, publicações e eventos.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2 sm:flex-row">
                <Input type="email" placeholder="Digite seu email" className="max-w-lg flex-1" />
                <Button type="submit">Assinar</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

