"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import type { SiteSettings } from "@/lib/site-settings"

type SiteFooterProps = {
  settings: SiteSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const quickLinks = [
    { href: "/#projects", label: "Projetos" },
    { href: "/#team", label: "Equipe" },
    ...(settings.enableEvents ? [{ href: "/#events", label: "Agenda" }] : []),
    { href: "/contact", label: "Contato" },
  ]

  const socialLinks = [
    { href: settings.socialMedia.github, label: "GitHub", icon: Github },
    { href: settings.socialMedia.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: settings.socialMedia.twitter, label: "Twitter", icon: Twitter },
  ].filter((item) => item.href)

  return (
    <footer className="bg-background pb-8 pt-2">
      <div className="container px-4 md:px-6">
        <div className="footer-card px-6 py-8 md:px-10 lg:py-10">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1.1fr]">
            <div className="max-w-md space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight">
                <span className="relative flex h-11 w-11 overflow-hidden rounded-2xl border border-border/60 bg-background/70">
                  <Image
                    src="/images/labriot-logo.png"
                    alt={`Logo ${settings.siteName}`}
                    fill
                    sizes="44px"
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="font-display text-xl tracking-[-0.04em]">{settings.siteName.toUpperCase()}</span>
              </Link>
              <p className="text-sm leading-6 text-muted-foreground">
                {settings.siteDescription}
              </p>
              {socialLinks.length ? (
                <div className="flex gap-2">
                  {socialLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">Navegação</h2>
              <nav className="grid gap-2.5 text-sm text-muted-foreground">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="w-fit transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">Contato</h2>
              <div className="grid gap-4 text-sm text-muted-foreground">
                <Link href={`mailto:${settings.contactEmail}`} className="flex items-start gap-3 transition-colors hover:text-foreground">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{settings.contactEmail}</span>
                </Link>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{settings.contactAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.siteName}. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
