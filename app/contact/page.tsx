"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
    interest: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, interest: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulário enviado:", formData)
    toast({
      title: "Formulário Enviado",
      description: "Obrigado por entrar em contato. Retornaremos em breve.",
    })
    // Resetar formulário
    setFormData({
      name: "",
      email: "",
      organization: "",
      inquiryType: "",
      message: "",
      interest: "",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contate-nos</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Entre em contato com nossa equipe para discutir colaborações de pesquisa, parcerias ou consultas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                    <CardDescription>Entre em contato conosco através de qualquer um desses canais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Endereço</h3>
                        <p className="text-sm text-muted-foreground">
                          R. Doutor Washington Subtil Chueire, 330
                          <br />
                          Jardim Carvalho
                          <br />
                          Ponta Grossa - PR, 84017-220
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          <Link href="mailto:info@labriot.com" className="hover:underline">
                            info@labriot.com
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Telefone</h3>
                        <p className="text-sm text-muted-foreground">
                          <Link href="tel:+551155550123" className="hover:underline">
                            +55 (11) 5555-0123
                          </Link>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-8 aspect-video relative rounded-lg overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?width=100%25&height=100%25&hl=pt-BR&q=R.+Doutor+Washington+Subtil+Chueire,+330+-+Jardim+Carvalho,+Ponta+Grossa+-+PR,+84017-220&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Localização do Labriot no mapa"
                    aria-label="Mapa mostrando a localização do Labriot"
                  ></iframe>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Envie-nos uma Mensagem</CardTitle>
                  <CardDescription>Preencha o formulário abaixo e entraremos em contato em breve</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Seu email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organização</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Sua organização"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Tipo de Consulta</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => handleSelectChange("inquiryType", value)}
                      >
                        <SelectTrigger id="inquiryType">
                          <SelectValue placeholder="Selecione o tipo de consulta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research-collaboration">Colaboração em Pesquisa</SelectItem>
                          <SelectItem value="industry-partnership">Parceria com a Indústria</SelectItem>
                          <SelectItem value="media-inquiry">Consulta de Mídia</SelectItem>
                          <SelectItem value="career-opportunity">Oportunidade de Carreira</SelectItem>
                          <SelectItem value="general-inquiry">Consulta Geral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Áreas de Interesse</Label>
                      <RadioGroup
                        value={formData.interest}
                        onValueChange={handleRadioChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="autonomous-systems" id="autonomous-systems" />
                          <Label htmlFor="autonomous-systems" className="font-normal">
                            Sistemas Autônomos
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="machine-learning" id="machine-learning" />
                          <Label htmlFor="machine-learning" className="font-normal">
                            Aprendizado de Máquina
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="human-robot-interaction" id="human-robot-interaction" />
                          <Label htmlFor="human-robot-interaction" className="font-normal">
                            Interação Humano-Robô
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="font-normal">
                            Outro
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Sua mensagem"
                        required
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Perguntas Frequentes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Encontre respostas para perguntas comuns sobre nossa pesquisa, colaborações e mais.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Como posso colaborar com o Labriot em pesquisas?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recebemos colaborações com instituições acadêmicas, parceiros da indústria e agências
                    governamentais. Entre em contato conosco através do formulário acima, especificando seus interesses
                    de pesquisa e potenciais áreas de colaboração.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vocês oferecem estágios ou posições de pesquisa?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim, regularmente oferecemos estágios e posições de pesquisa para estudantes de graduação e
                    pós-graduação. Visite nossa página de Carreiras para vagas atuais ou entre em contato diretamente
                    conosco.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Posso visitar seu laboratório?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oferecemos visitas agendadas para parceiros acadêmicos e da indústria. Entre em contato conosco com
                    pelo menos duas semanas de antecedência para agendar uma visita. Por motivos de segurança, todos os
                    visitantes devem ser pré-aprovados.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Como posso me manter atualizado sobre sua pesquisa?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Você pode assinar nossa newsletter, seguir nosso blog ou se conectar conosco nas plataformas de
                    mídia social. Publicamos regularmente atualizações sobre nossa pesquisa, eventos e publicações.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

