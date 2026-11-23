"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
    interest: "",
    website: "", // Honeypot anti-bot
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        toast({
          title: "Formulário Enviado",
          description: "Obrigado por entrar em contato. Retornaremos em breve.",
        });
        setFormData({
          name: "",
          email: "",
          organization: "",
          inquiryType: "",
          message: "",
          interest: "",
          website: "",
        });
      } else {
        throw new Error(data.error || "Falha ao enviar o formulário.");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.";
      toast({
        title: "Erro",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                          <Link href="mailto:labriot.utfpr@gmail.com" className="hover:underline">
                            labriot.utfpr@gmail.com
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
                    referrerPolicy="no-referrer-when-downgrade"
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
                    {/* Campo honeypot invisível para bloquear bots */}
                    <div className="hidden" aria-hidden="true">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Tipo de Consulta</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => handleSelectChange("inquiryType", value)}
                        disabled={submitting}
                      >
                        <SelectTrigger id="inquiryType">
                          <SelectValue placeholder="Selecione o tipo de consulta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research-collaboration">Colaboração em Pesquisa</SelectItem>
                          <SelectItem value="industry-partnership">Parceria Empresarial</SelectItem>
                          <SelectItem value="media-inquiry">Visita Técnica</SelectItem>
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
                        disabled={submitting}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="autonomous-systems" id="autonomous-systems" />
                          <Label htmlFor="autonomous-systems" className="font-normal">
                            Agentes Inteligentes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="machine-learning" id="machine-learning" />
                          <Label htmlFor="machine-learning" className="font-normal">
                            Inteligência Artificial
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="human-robot-interaction" id="human-robot-interaction" />
                          <Label htmlFor="human-robot-interaction" className="font-normal">
                            Robótica
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="academic-inquiry" id="academic-inquiry" />
                          <Label htmlFor="academic-inquiry" className="font-normal">
                            Consulta Acadêmica
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
                        placeholder="Sua mensagem (mínimo 10 caracteres)"
                        minLength={10}
                        required
                        disabled={submitting}
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Mensagem"
                      )}
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
                  <CardTitle>Como posso colaborar com o Labriot?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Estamos abertos a colaborações com instituições acadêmicas e empresas de diversos ramos. Entre em contato conosco através do formulário acima, especificando seus interesses de pesquisa e potenciais áreas de colaboração.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Posso visitar seu laboratório?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oferecemos visitas agendadas para parceiros acadêmicos e da indústria. Entre em contato conosco com pelo menos duas semanas de antecedência para agendar uma visita.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
