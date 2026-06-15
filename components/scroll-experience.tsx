"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type WindowWithLabriotLenis = Window & {
  labriotLenis?: Lenis
}

const expoEase = (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time))

export function ScrollExperience() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const revealElements = gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]")

    gsap.registerPlugin(ScrollTrigger)
    root.classList.add("scroll-reveal-ready")

    if (prefersReducedMotion) {
      gsap.set(revealElements, { autoAlpha: 1, clearProps: "transform" })
      gsap.set("[data-hero-reveal], [data-hero-image]", { autoAlpha: 1, clearProps: "transform" })
    }

    const lenis = new Lenis({
      lerp: 0.1,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
      autoResize: true,
      stopInertiaOnNavigate: true,
      anchors: false,
      prevent: (node) =>
        node.closest("[data-lenis-prevent], [role='dialog'], iframe, textarea, select") !== null,
    })

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    const parallaxTargets = gsap.utils.toArray<HTMLElement>(".landing-flow")

    const unsubscribe = lenis.on("scroll", ({ animatedScroll }) => {
      const value = `${animatedScroll * -0.035}px`
      parallaxTargets.forEach((el) => el.style.setProperty("--scroll-parallax-y", value))
      ScrollTrigger.update()
    })

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)
    ;(window as WindowWithLabriotLenis).labriotLenis = lenis

    const handleSpotlightMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const card = target?.closest<HTMLElement>(".premium-card")

      if (!card) {
        return
      }

      const rect = card.getBoundingClientRect()
      card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`)
      card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`)
    }

    const handleSpotlightLeave = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const card = target?.closest<HTMLElement>(".premium-card")

      if (!card) {
        return
      }

      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) {
        return
      }

      card.style.removeProperty("--spotlight-x")
      card.style.removeProperty("--spotlight-y")
    }

    window.addEventListener("pointermove", handleSpotlightMove, { passive: true })
    window.addEventListener("pointerout", handleSpotlightLeave, { passive: true })

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        return
      }

      gsap.fromTo(
        "[data-hero-reveal]",
        {
          autoAlpha: 0,
          y: 34,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        }
      )

      gsap.fromTo(
        "[data-hero-image]",
        {
          autoAlpha: 0,
          scale: 0.92,
          y: 28,
          rotate: -1.5,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotate: 0,
          duration: 1.35,
          ease: "expo.out",
          delay: 0.28,
        }
      )

      revealElements.forEach((element, index) => {
        const startsInView = element.getBoundingClientRect().top < window.innerHeight * 0.58

        if (startsInView) {
          gsap.set(element, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
          })
          return
        }

        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 88,
            scale: 0.978,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            duration: 1.1,
            delay: Math.min(index % 5, 4) * 0.05,
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        )
      })
    })

    const refreshId = window.setTimeout(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    }, 250)

    return () => {
      window.clearTimeout(refreshId)
      context.revert()
      unsubscribe()
      gsap.ticker.remove(updateLenis)
      window.removeEventListener("pointermove", handleSpotlightMove)
      window.removeEventListener("pointerout", handleSpotlightLeave)
      parallaxTargets.forEach((el) => el.style.removeProperty("--scroll-parallax-y"))
      lenis.destroy()
      delete (window as WindowWithLabriotLenis).labriotLenis
    }
  }, [pathname])

  return null
}
