import { Metadata } from "next";
import { RoboflowUploader } from "@/components/RoboflowUploader";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Projeto de Visão Computacional | Labriot",
  description:
    "Demonstração experimental de visão computacional do Labriot para identificação de componentes em placas-mãe.",
};

export default function RoboflowPage() {
  const embedUrl = process.env.NEXT_PUBLIC_ROBOFLOW_EMBED_URL?.trim();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link
            href="/#projects"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Link>
        </Button>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Demonstração de Visão Computacional
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Teste nosso modelo experimental treinado para detecção de componentes em placas-mãe via
          visão computacional.
        </p>
      </div>

      {embedUrl ? (
        <Tabs defaultValue="uploader" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="uploader">Uploader Customizado</TabsTrigger>
            <TabsTrigger value="widget">Widget Oficial (Webcam)</TabsTrigger>
          </TabsList>

          <TabsContent value="uploader" className="space-y-6">
            <div className="bg-gradient-to-b from-muted/50 to-background border rounded-xl p-6 md:p-12 shadow-sm">
              <RoboflowUploader />
            </div>
          </TabsContent>

          <TabsContent value="widget" className="space-y-6">
            <Card className="border-border bg-card shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Painel Interativo Roboflow
                </CardTitle>
                <CardDescription>
                  Este widget oficial roda o workflow completo. Você pode fazer upload de fotos,
                  arrastar arquivos ou <strong>usar a sua webcam em tempo real</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 border-t">
                <div className="w-full bg-muted/20 relative" style={{ minHeight: "720px" }}>
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="720"
                    allow="camera"
                    referrerPolicy="no-referrer"
                    title="Widget interativo Roboflow"
                    className="w-full border-0"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-gradient-to-b from-muted/50 to-background border rounded-xl p-6 md:p-12 shadow-sm">
          <RoboflowUploader />
        </div>
      )}

      <div className="mt-16 prose prose-neutral dark:prose-invert max-w-none border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Como funciona e limitações</h2>
        <p>
          Este sistema utiliza um modelo de Machine Learning hospedado no{" "}
          <strong>Roboflow Workflows</strong> treinado especificamente para identificar componentes
          em placas-mãe, retornando coordenadas de marcação (bounding boxes) e taxas de confiança.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          Por ser um protótipo acadêmico, detecções podem apresentar falsos positivos ou omissões,
          especialmente em fotos fora de foco, mal iluminadas ou contendo objetos fora do escopo do
          treinamento.
        </p>
      </div>
    </div>
  );
}
