"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewProject() {
  const [activeTab, setActiveTab] = useState("basic")
  const [projectData, setProjectData] = useState({
    title: "",
    status: "ongoing",
    startDate: "",
    endDate: "",
    description: "",
    fullDescription: "",
    team: [],
    technologies: [],
    gallery: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTeamMember = () => {
    setProjectData((prev) => ({
      ...prev,
      team: [...prev.team, { id: Date.now(), name: "", role: "" }],
    }))
  }

  const handleRemoveTeamMember = (id) => {
    setProjectData((prev) => ({
      ...prev,
      team: prev.team.filter((member) => member.id !== id),
    }))
  }

  const handleTeamMemberChange = (id, field, value) => {
    setProjectData((prev) => ({
      ...prev,
      team: prev.team.map((member) => (member.id === id ? { ...member, [field]: value } : member)),
    }))
  }

  const handleAddTechnology = () => {
    setProjectData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, { id: Date.now(), name: "" }],
    }))
  }

  const handleRemoveTechnology = (id) => {
    setProjectData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech.id !== id),
    }))
  }

  const handleTechnologyChange = (id, value) => {
    setProjectData((prev) => ({
      ...prev,
      technologies: prev.technologies.map((tech) => (tech.id === id ? { ...tech, name: value } : tech)),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Projeto salvo:", projectData)
    toast({
      title: "Projeto salvo",
      description: "O projeto foi salvo com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="#">
              <Eye className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Link>
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Projeto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input
                    id="title"
                    name="title"
                    value={projectData.title}
                    onChange={handleChange}
                    placeholder="Ex: ATLAS: Sistema de Aprendizado e Adaptação de Terreno Autônomo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={projectData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="planned">Planejado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={projectData.startDate}
                      onChange={handleChange}
                    />
                  </div>

                  {projectData.status === "completed" && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Conclusão</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="month"
                        value={projectData.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Curta</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleChange}
                    placeholder="Uma breve descrição do projeto (máximo 200 caracteres)"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">{projectData.description.length}/200 caracteres</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Descrição Completa</Label>
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    value={projectData.fullDescription}
                    onChange={handleChange}
                    placeholder="Descrição detalhada do projeto, incluindo objetivos, metodologia e resultados esperados"
                    className="min-h-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tecnologias Utilizadas</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTechnology}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Tecnologia
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {projectData.technologies.map((tech) => (
                      <div key={tech.id} className="flex items-center gap-2">
                        <Input
                          value={tech.name}
                          onChange={(e) => handleTechnologyChange(tech.id, e.target.value)}
                          placeholder="Nome da tecnologia"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveTechnology(tech.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    ))}

                    {projectData.technologies.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma tecnologia adicionada. Clique no botão acima para adicionar.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Membros da Equipe</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTeamMember}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Membro
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {projectData.team.map((member) => (
                      <div key={member.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                        <div>
                          <Input
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(member.id, "name", e.target.value)}
                            placeholder="Nome do membro"
                          />
                        </div>
                        <div>
                          <Input
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(member.id, "role", e.target.value)}
                            placeholder="Função no projeto"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    ))}

                    {projectData.team.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhum membro adicionado. Clique no botão acima para adicionar.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagem Principal</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <h3 className="font-medium">Arraste uma imagem ou clique para fazer upload</h3>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 4MB)</p>
                      <Button type="button" variant="outline" size="sm">
                        Selecionar Arquivo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Galeria de Imagens</Label>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Imagem
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {projectData.gallery.length === 0 ? (
                      <p className="col-span-3 text-sm text-muted-foreground">
                        Nenhuma imagem adicionada. Clique no botão acima para adicionar.
                      </p>
                    ) : (
                      projectData.gallery.map((image, index) => (
                        <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                          {/* Aqui seria exibida a imagem */}
                          <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL do Vídeo (opcional)</Label>
                  <Input id="videoUrl" name="videoUrl" placeholder="Ex: https://youtube.com/watch?v=..." />
                  <p className="text-xs text-muted-foreground">Suporta links do YouTube e Vimeo</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/projects">Cancelar</Link>
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Projeto
        </Button>
      </div>
    </div>
  )
}

