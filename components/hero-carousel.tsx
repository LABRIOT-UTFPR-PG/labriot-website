"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      url: "https://itamariliuk.github.io/ia-para-todos/",
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
            <div className="grid min-h-[620px] items-center gap-10 px-10 py-10 md:px-16 md:py-14 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_560px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-5">
                  <div data-hero-reveal className="section-kicker w-fit">
                    Laboratório de Robótica, IA e IoT
                  </div>
                  <h1 data-hero-reveal className="max-w-3xl font-display text-5xl font-semibold tracking-[-0.055em] sm:text-6xl xl:text-7xl">
                    {project.title}
                  </h1>
                  <p data-hero-reveal className="max-w-2xl text-base leading-8 text-muted-foreground md:text-xl">
                    {project.description}
                  </p>
                </div>
                <div data-hero-reveal className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg" className="h-12 rounded-[var(--radius-button)] px-6 shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                    <Link href={project.url} target={project.url.startsWith("http") ? "_blank" : "_self"}>
                      {project.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-[var(--radius-button)] border-border/70 bg-background/35 px-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent">
                    <Link href="/#projects">
                      Ver projetos
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full lg:order-last flex items-center justify-center">
                <div data-hero-image className="premium-card group relative flex aspect-square w-full max-w-[540px] items-center justify-center overflow-hidden">
                  <div className="absolute inset-8 rounded-full bg-foreground/5 blur-3xl" />
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`transition-transform duration-500 group-hover:scale-105 ${project.contain ? 'object-contain p-6' : 'object-cover'}`}
                    priority={project.id === "labriot-main"}
                  />
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 top-[310px] md:left-4" />
      <CarouselNext className="right-0 top-[310px] md:right-4" />
    </Carousel>
  )
}
