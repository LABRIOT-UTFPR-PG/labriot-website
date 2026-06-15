"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/form-errors"

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, fullDescription, status, startDate, endDate, image, url }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast({
        title: "Nao foi possivel salvar",
        description: getApiErrorMessage(payload, "Verifique os campos e tente novamente."),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Projeto salvo",
      description: "O projeto foi salvo com sucesso.",
    });
    router.push('/admin/projects');
  };

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
        <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Projeto
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Projeto</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: ATLAS: Sistema de Aprendizado e Adaptação de Terreno Autônomo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="ongoing">Em Andamento</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                {status === "completed" && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Conclusão</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Curta</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma breve descrição do projeto (máximo 200 caracteres)"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Descrição Completa</Label>
              <Textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Descrição detalhada do projeto para exibição na página de detalhes..."
                className="min-h-[180px]"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">Link / Página Customizada (Opcional)</Label>
                <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ex: /projects/roboflow" />
                <p className="text-xs text-muted-foreground">
                  Se você criou uma página específica para este projeto (ex: <code>/projects/roboflow</code>), insira o caminho aqui. Ao clicar no projeto na página inicial, o usuário será direcionado diretamente para ela.
                </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
