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
import { ArrowLeft, Save, Eye, Upload, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NewBlogPost() {
  const [activeTab, setActiveTab] = useState("content")
  const [postData, setPostData] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
    coverImage: null,
    tags: [],
    publishDate: "",
    status: "draft",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPostData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setPostData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Post salvo:", postData)
    toast({
      title: "Post salvo",
      description: "O post foi salvo como rascunho.",
    })
  }

  const handlePublish = () => {
    console.log("Post publicado:", postData)
    toast({
      title: "Post publicado",
      description: "O post foi publicado com sucesso.",
    })
  }

  // Lista simulada de autores
  const authors = [
    { id: 1, name: "Dra. Sarah Chen" },
    { id: 2, name: "Dr. Marcus Johnson" },
    { id: 3, name: "Dra. Aisha Patel" },
    { id: 4, name: "Dr. Thomas Lee" },
    { id: 5, name: "Dra. Elena Rodriguez" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Novo Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="#">
              <Eye className="mr-2 h-4 w-4" />
              Pré-visualizar
            </Link>
          </Button>
          <Button variant="outline" onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button onClick={handlePublish}>Publicar</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={postData.title}
                    onChange={handleChange}
                    placeholder="Digite o título do post"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Select value={postData.author} onValueChange={(value) => handleSelectChange("author", value)}>
                    <SelectTrigger id="author">
                      <SelectValue placeholder="Selecione o autor" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.name}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={postData.excerpt}
                    onChange={handleChange}
                    placeholder="Um breve resumo do post (máximo 200 caracteres)"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">{postData.excerpt.length}/200 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <div className="border rounded-md">
                    <div className="flex items-center border-b p-2 gap-2">
                      <Button variant="ghost" size="sm">
                        Título
                      </Button>
                      <Button variant="ghost" size="sm">
                        Negrito
                      </Button>
                      <Button variant="ghost" size="sm">
                        Itálico
                      </Button>
                      <Button variant="ghost" size="sm">
                        Link
                      </Button>
                      <Button variant="ghost" size="sm">
                        Lista
                      </Button>
                      <Button variant="ghost" size="sm">
                        Imagem
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      name="content"
                      value={postData.content}
                      onChange={handleChange}
                      placeholder="Escreva o conteúdo do post aqui..."
                      className="min-h-[400px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
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
                  <Label>Imagem de Capa</Label>
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
                  <Label htmlFor="altText">Texto Alternativo</Label>
                  <Input id="altText" name="altText" placeholder="Descrição da imagem para acessibilidade" />
                  <p className="text-xs text-muted-foreground">Descreva a imagem para pessoas com deficiência visual</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" name="tags" placeholder="Robótica, IA, Pesquisa (separadas por vírgula)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Data de Publicação</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="date"
                      value={postData.publishDate}
                      onChange={handleChange}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Deixe em branco para publicar imediatamente</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={postData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Título SEO</Label>
                  <Input id="seoTitle" name="seoTitle" placeholder="Título otimizado para mecanismos de busca" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Descrição SEO</Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    placeholder="Descrição otimizada para mecanismos de busca"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">Recomendado: 150-160 caracteres</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/blog">Cancelar</Link>
        </Button>
        <Button variant="outline" onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Rascunho
        </Button>
        <Button onClick={handlePublish}>Publicar</Button>
      </div>
    </div>
  )
}

