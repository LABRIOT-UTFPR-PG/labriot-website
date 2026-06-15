"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/form-errors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string | null;
  year: number;
  doi: string | null;
  description: string | null;
}

export default function PublicationsAdmin() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
    fetch('/api/publications')
      .then(res => res.json())
      .then(data => {
        setPublications(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      const response = await fetch(`/api/publications/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        alert(getApiErrorMessage(payload, "Nao foi possivel excluir a publicacao."));
        return;
      }

      setPublications(publications.filter(p => p.id !== id));
    }
  };

  const years = [...new Set(publications.map(p => p.year))];

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Publicações</h1>
        <Button asChild>
          <Link href="/admin/publications/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Publicação
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar publicações..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline" asChild>
          <a href="/api/admin/export?scope=publications">Exportar</a>
        </Button>
      </div>

      <Tabs defaultValue={years.length > 0 ? years[0].toString() : "empty"} className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-2">
          {years.map(year => (
            <TabsTrigger key={year} value={year.toString()}>{year}</TabsTrigger>
          ))}
        </TabsList>

        {years.map(year => (
          <TabsContent key={year} value={year.toString()} className="mt-6 space-y-4">
            {publications.filter(p => p.year === year).map((publication) => (
              <Card key={publication.id}>
                <CardHeader>
                  <CardTitle>{publication.title}</CardTitle>
                  <CardDescription>{publication.authors}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Publicado em:</span> {publication.journal || "Nao informado"}, {publication.year}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">DOI:</span> {publication.doi || "Nao informado"}
                    </p>
                    <p className="text-sm text-muted-foreground">{publication.description || "Sem descricao."}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/publications/edit/${publication.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(publication.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                  {publication.doi ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`https://doi.org/${publication.doi}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Publicação
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Sem DOI
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
