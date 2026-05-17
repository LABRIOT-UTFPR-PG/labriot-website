"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

export function RoboflowUploader() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const drawPredictions = (preds: Prediction[]) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factors in case the displayed image size differs from original
    // The predictions are usually returned in the original image coordinates by Roboflow
    // But since we are overlaying the canvas exactly on the image element, we need to map them.
    const scaleX = image.width / image.naturalWidth;
    const scaleY = image.height / image.naturalHeight;

    preds.forEach((pred) => {
      // Roboflow x and y are the center of the bounding box
      const x = (pred.x - pred.width / 2) * scaleX;
      const y = (pred.y - pred.height / 2) * scaleY;
      const w = pred.width * scaleX;
      const h = pred.height * scaleY;

      // Draw box
      ctx.strokeStyle = "#00FF00"; // Green bounding box
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Draw background for text
      const text = `${pred.class} (${(pred.confidence * 100).toFixed(1)}%)`;
      ctx.font = "16px sans-serif";
      const textWidth = ctx.measureText(text).width;
      
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(x, y - 24, textWidth + 8, 24);

      // Draw text
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x + 4, y - 8);
    });
  };

  const processImage = async (imageSrc: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/roboflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao processar a imagem");
      }

      setPredictions(data.predictions || []);
      
      // We need a small delay to ensure the image is fully rendered before drawing
      setTimeout(() => drawPredictions(data.predictions || []), 120);

      toast.success("Imagem analisada com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, envie um arquivo de imagem válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setSelectedImage(base64);
        setPredictions([]); // Clear previous predictions
        processImage(base64); // Analisa imediatamente!
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <UploadCloud className="w-6 h-6 text-primary animate-pulse" />
          Análise Automática de Imagem (IA)
        </CardTitle>
        <CardDescription>
          Selecione ou arraste uma imagem. Nosso modelo de visão computacional fará a identificação instantaneamente!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 border-muted-foreground/30 hover:bg-muted/80 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Clique para enviar</span> ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground">JPEG, PNG ou WEBP (Max 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>
        </div>

        {selectedImage && (
          <div className="relative border rounded-lg overflow-hidden bg-black/5 flex justify-center items-center">
            {/* Imagem de Fundo */}
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Uploaded"
              className="max-h-[500px] w-auto object-contain"
              onLoad={() => {
                if (predictions.length > 0) {
                  drawPredictions(predictions);
                }
              }}
            />
            {/* Canvas para desenhar as marcações por cima */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ pointerEvents: "none" }}
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Processando imagem com a IA...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {predictions.length > 0
                  ? `Detecção concluída: ${predictions.length} objeto(s) identificado(s)`
                  : selectedImage
                  ? "Imagem pronta para análise"
                  : "Aguardando imagem para iniciar..."}
              </p>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border">
            {loading ? "Processando..." : predictions.length > 0 ? "Concluído" : "Análise em Tempo Real"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
