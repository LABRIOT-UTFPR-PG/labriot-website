"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Research() {
  const [researchAreas, setResearchAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/research')
      .then(res => res.json())
      .then(data => {
        setResearchAreas(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando áreas de pesquisa...</div>;

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
      {researchAreas.map((area) => (
        <Card key={area.id}>
          <CardHeader>
            <CardTitle>{area.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{area.description}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href={`/research/${area.id}`}>Saiba Mais</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}