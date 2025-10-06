"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, Cpu, BotIcon as Robot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
}

export default function ResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/publications')
      .then(res => res.json())
      .then(data => {
        setPublications(data);
        setLoading(false);
      });
  }, []);

  const years = [...new Set(publications.map(p => p.year))];

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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Publicações de Pesquisa</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nosso trabalho foi publicado em revistas e conferências de alto nível nos campos da robótica e
                  inteligência artificial.
                </p>
              </div>
            </div>
            {loading ? (
              <div>Carregando publicações...</div>
            ) : (
              <Tabs defaultValue={years.length > 0 ? years[0].toString() : ""} className="mt-8 w-full max-w-4xl mx-auto">
                <TabsList className={`grid w-full grid-cols-${years.length}`}>
                  {years.map(year => (
                    <TabsTrigger key={year} value={year.toString()}>{year}</TabsTrigger>
                  ))}
                </TabsList>
                {years.map(year => (
                  <TabsContent key={year} value={year.toString()} className="mt-6 space-y-4">
                    {publications.filter(p => p.year === year).map(publication => (
                      <Card key={publication.id}>
                        <CardHeader>
                          <CardTitle>{publication.title}</CardTitle>
                          <CardDescription>{publication.authors}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">
                            {publication.journal}, {publication.year}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" asChild>
                            <Link href={`https://doi.org/${publication.doi}`} target="_blank">Ver Publicação</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
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