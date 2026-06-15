import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { getPublicSiteSettings } from "@/lib/public-data"

export default async function ContactPage() {
  const settings = await getPublicSiteSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contate-nos</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Entre em contato com a equipe do {settings.siteName} para discutir colaboracoes de pesquisa, parcerias ou consultas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informacoes de Contato</CardTitle>
                    <CardDescription>Entre em contato conosco atraves de qualquer um desses canais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Endereco</h3>
                        <p className="whitespace-pre-line text-sm text-muted-foreground">{settings.contactAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          <Link href={`mailto:${settings.contactEmail}`} className="hover:underline">
                            {settings.contactEmail}
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Telefone</h3>
                        <p className="text-sm text-muted-foreground">{settings.contactPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <ContactForm siteName={settings.siteName} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
