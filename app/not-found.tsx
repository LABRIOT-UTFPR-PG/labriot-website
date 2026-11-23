import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Página não encontrada</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar para a Página Inicial</Link>
      </Button>
    </div>
  );
}
