"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function HeroCarousel() {
  const featuredProjects = [
    {
      id: "labriot-main",
      title: "Avançando no Futuro da Robótica e IA",
      description: "Labriot é um laboratório de pesquisa dedicado a avançar as fronteiras da robótica e inteligência artificial através de pesquisa e desenvolvimento inovadores.",
      image: "/images/labriot-logo.png",
      url: "/contact",
      buttonText: "Contate-nos",
      contain: true
    },
    {
      id: "ia-para-todos",
      title: "IA para Todos",
      description: "Em colaboração com a Multicortex. Democratizando o acesso à inteligência artificial.",
      image: "/images/ia.avif",
      url: "https://github.com/ItamarIliuk/ia-para-todos",
      buttonText: "Ver Projeto",
      contain: false
    }
  ]

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel 
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {featuredProjects.map((project) => (
          <CarouselItem key={project.id}>
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] py-4 md:py-8 px-10 md:px-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {project.title}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild variant={project.id === 'labriot-main' ? 'outline' : 'default'} size="lg">
                    <Link href={project.url} target={project.url.startsWith("http") ? "_blank" : "_self"}>
                      {project.buttonText}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full lg:order-last flex items-center justify-center">
                <Card className="w-full overflow-hidden border-0 bg-transparent shadow-none">
                  <CardContent className="flex aspect-square items-center justify-center p-0 relative rounded-xl overflow-hidden group">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`transition-transform duration-300 group-hover:scale-105 ${project.contain ? 'object-contain p-4' : 'object-cover'}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:left-4" />
      <CarouselNext className="right-0 md:right-4" />
    </Carousel>
  )
}
