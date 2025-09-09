"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Labriot",
    siteDescription: "Laboratório de Pesquisa em Robótica e Inteligência Artificial",
    contactEmail: "info@labriot.com",
    contactPhone: "+55 (11) 5555-0123",
    contactAddress: "Rua da Inovação, 123, São Paulo, SP 04107",
    socialMedia: {
      twitter: "https://twitter.com/labriot",
      linkedin: "https://linkedin.com/company/labriot",
      github: "https://github.com/labriot",
    },
    enableBlog: true,
    enableEvents: true,
    enableNewsletter: true,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (platform, value) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }))
  }

  const handleToggleChange = (name, checked) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = () => {
    console.log("Configurações salvas:", settings)
    toast({
      title: "Configurações salvas",
      description: "As configurações do site foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="features">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Configurações básicas do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Logo do Site</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold">L</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-xs font-bold">L</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Favicon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Detalhes de contato exibidos no site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone de Contato</Label>
                <Input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddress">Endereço</Label>
                <Textarea
                  id="contactAddress"
                  name="contactAddress"
                  value={settings.contactAddress}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Links para perfis em redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.socialMedia.linkedin}
                  onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={settings.socialMedia.github}
                  onChange={(e) => handleSocialMediaChange("github", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recursos do Site</CardTitle>
              <CardDescription>Ativar ou desativar recursos do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableBlog">Blog</Label>
                  <p className="text-sm text-muted-foreground">Exibir seção de blog no site</p>
                </div>
                <Switch
                  id="enableBlog"
                  checked={settings.enableBlog}
                  onCheckedChange={(checked) => handleToggleChange("enableBlog", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEvents">Eventos</Label>
                  <p className="text-sm text-muted-foreground">Exibir seção de eventos no site</p>
                </div>
                <Switch
                  id="enableEvents"
                  checked={settings.enableEvents}
                  onCheckedChange={(checked) => handleToggleChange("enableEvents", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableNewsletter">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Exibir formulário de inscrição para newsletter</p>
                </div>
                <Switch
                  id="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onCheckedChange={(checked) => handleToggleChange("enableNewsletter", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}

