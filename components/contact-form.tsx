"use client"

import { useRef, useState } from "react"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/form-errors"

type ContactFormProps = {
  siteName: string
}

export function ContactForm({ siteName }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
    interest: "",
    botcheck: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState("")
  const captchaRef = useRef<HCaptcha>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      toast({
        title: "Verificacao pendente",
        description: "Confirme que voce nao e um robo antes de enviar.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const validationResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          siteName,
          "h-captcha-response": captchaToken,
        }),
      })

      const validationPayload = await validationResponse.json().catch(() => null)

      if (!validationResponse.ok) {
        toast({
          title: "Erro ao enviar",
          description: getApiErrorMessage(validationPayload, "Ocorreu um erro ao enviar o formulario."),
          variant: "destructive",
        })
        return
      }

      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

      if (!accessKey) {
        toast({
          title: "Erro",
          description: "O formulario de contato nao esta configurado.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Novo contato - ${siteName}`,
          from_name: `${siteName} Website`,
          replyto: formData.email,
          ...formData,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.success) {
        toast({
          title: "Formulario enviado",
          description: "Obrigado por entrar em contato. Retornaremos em breve.",
        })
        setFormData({
          name: "",
          email: "",
          organization: "",
          inquiryType: "",
          message: "",
          interest: "",
          botcheck: "",
        })
      } else {
        toast({
          title: "Erro ao enviar",
          description: getApiErrorMessage(payload, "Ocorreu um erro ao enviar o formulario."),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulario. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      captchaRef.current?.resetCaptcha()
      setCaptchaToken("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envie-nos uma Mensagem</CardTitle>
        <CardDescription>Preencha o formulario abaixo e entraremos em contato em breve</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="checkbox"
            name="botcheck"
            value={formData.botcheck}
            onChange={handleChange}
            className="hidden"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
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
            <Label htmlFor="organization">Organizacao</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Sua organizacao"
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
                <SelectItem value="research-collaboration">Colaboracao em Pesquisa</SelectItem>
                <SelectItem value="industry-partnership">Parceria Empresarial</SelectItem>
                <SelectItem value="media-inquiry">Visita Tecnica</SelectItem>
                <SelectItem value="general-inquiry">Consulta Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Areas de Interesse</Label>
            <RadioGroup
              value={formData.interest}
              onValueChange={handleRadioChange}
              disabled={submitting}
              className="flex flex-col space-y-1"
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
                  Inteligencia Artificial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human-robot-interaction" id="human-robot-interaction" />
                <Label htmlFor="human-robot-interaction" className="font-normal">
                  Robotica
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="academic-inquiry" id="academic-inquiry" />
                <Label htmlFor="academic-inquiry" className="font-normal">
                  Consulta Academica
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
              disabled={submitting}
              required
              className="min-h-[120px]"
            />
          </div>
          {process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && (
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken("")}
            />
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
