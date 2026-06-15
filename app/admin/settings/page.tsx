"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/form-errors"
import { createDefaultSiteSettings, type SiteSettings } from "@/lib/site-settings"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(() => createDefaultSiteSettings())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    void loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/settings")
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel carregar as configuracoes."))
      }

      setSettings({
        ...createDefaultSiteSettings(),
        ...payload,
        socialMedia: {
          ...createDefaultSiteSettings().socialMedia,
          ...payload?.socialMedia,
        },
      })
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Nao foi possivel carregar as configuracoes."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (platform: keyof typeof settings.socialMedia, value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }))
  }

  const handleToggleChange = (
    name: "enableBlog" | "enableEvents" | "enableNewsletter",
    checked: boolean
  ) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleUploadPlaceholder = () => {
    toast({
      title: "Upload ainda nao implementado",
      description: "Por enquanto, logo e favicon permanecem como placeholders visuais.",
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel salvar as configuracoes."))
      }

      setSettings(payload)
      toast({
        title: "Configuracoes salvas",
        description: "As configuracoes do site foram atualizadas com sucesso.",
      })
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Nao foi possivel salvar as configuracoes."
      setError(message)
      toast({
        title: "Erro ao salvar",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <Button onClick={() => void handleSave()} disabled={loading || saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Carregando configuracoes...</p> : null}

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
                    <Button variant="outline" size="sm" type="button" onClick={handleUploadPlaceholder}>
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
                    <Button variant="outline" size="sm" type="button" onClick={handleUploadPlaceholder}>
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
        <Button onClick={() => void handleSave()} disabled={loading || saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
