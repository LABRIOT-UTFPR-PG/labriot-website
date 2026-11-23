"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Camera,
  X,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_DIMENSION = 1280;

/**
 * Redimensiona e comprime a imagem no cliente antes de enviar ao backend,
 * evitando payloads gigantes de câmeras de celular e erros 413 no proxy.
 */
function compressImageDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    img.src = dataUrl;
  });
}

export function RoboflowUploader() {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [countObjects, setCountObjects] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [minConfidence, setMinConfidence] = useState<number>(0.4);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  // Vincula o MediaStream ao <video> somente DEPOIS que o elemento é montado no DOM
  useEffect(() => {
    if (isCameraOpen && liveVideoRef.current && streamRef.current) {
      liveVideoRef.current.srcObject = streamRef.current;
      liveVideoRef.current.play().catch(() => {});
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const filteredPredictions = predictions.filter(
    (pred) => typeof pred.confidence !== "number" || pred.confidence >= minConfidence
  );

  const drawPredictions = useCallback((preds: Prediction[]) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !image.naturalWidth || !image.naturalHeight) return;

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = image.width / image.naturalWidth;
    const scaleY = image.height / image.naturalHeight;

    preds.forEach((pred) => {
      const x = (pred.x - pred.width / 2) * scaleX;
      const y = (pred.y - pred.height / 2) * scaleY;
      const w = pred.width * scaleX;
      const h = pred.height * scaleY;

      const padding = 8;
      const drawX = Math.max(0, x - padding);
      const drawY = Math.max(0, y - padding);
      const drawW = Math.min(canvas.width - drawX, w + padding * 2);
      const drawH = Math.min(canvas.height - drawY, h + padding * 2);

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.strokeRect(drawX, drawY, drawW, drawH);

      const text = `${pred.class} (${(pred.confidence * 100).toFixed(1)}%)`;
      ctx.font = "14px sans-serif";
      const textWidth = ctx.measureText(text).width;

      const labelX = Math.min(drawX, Math.max(0, canvas.width - textWidth - 8));
      const labelY =
        drawY + drawH + 22 > canvas.height ? Math.max(0, drawY - 22) : drawY + drawH;

      ctx.fillStyle = "#22c55e";
      ctx.fillRect(labelX, labelY, textWidth + 8, 22);

      ctx.fillStyle = "#000000";
      ctx.fillText(text, labelX + 4, labelY + 15);
    });
  }, []);

  useEffect(() => {
    if (!annotatedImage && selectedImage && hasAnalyzed) {
      drawPredictions(filteredPredictions);
    }
  }, [annotatedImage, selectedImage, hasAnalyzed, filteredPredictions, drawPredictions]);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Câmera indisponível neste navegador ou conexão (requer HTTPS).");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setSelectedImage(null);
      setAnnotatedImage(null);
      setPredictions([]);
      setCountObjects(null);
      setHasAnalyzed(false);
      setIsCameraOpen(true);
    } catch {
      toast.error(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    }
  };

  const processImage = async (imageSrc: string) => {
    setLoading(true);
    setHasAnalyzed(false);
    try {
      const compressed = await compressImageDataUrl(imageSrc);

      const response = await fetch("/api/roboflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: compressed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao processar a imagem.");
      }

      const receivedPredictions: Prediction[] = Array.isArray(data.predictions)
        ? data.predictions
        : [];
      setPredictions(receivedPredictions);
      setCountObjects(
        typeof data.countObjects === "number" ? data.countObjects : receivedPredictions.length
      );
      setHasAnalyzed(true);

      if (typeof data.outputImage === "string" && data.outputImage.length > 0) {
        const base64Prefix = data.outputImage.startsWith("data:image/")
          ? ""
          : "data:image/jpeg;base64,";
        setAnnotatedImage(`${base64Prefix}${data.outputImage}`);
      } else {
        setAnnotatedImage(null);
        setTimeout(() => drawPredictions(receivedPredictions), 120);
      }

      toast.success("Imagem analisada com sucesso!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao processar a imagem.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!liveVideoRef.current || !liveVideoRef.current.videoWidth) {
      toast.error("Aguarde a câmera inicializar antes de capturar.");
      return;
    }

    const video = liveVideoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.9);

    stopCamera();
    setSelectedImage(base64);
    processImage(base64);
  };

  const handleSelectedFile = (file: File | undefined) => {
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Formato inválido. Envie apenas imagens JPEG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      toast.error("A imagem excede o limite de 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const base64 = event.target.result;
        setSelectedImage(base64);
        setAnnotatedImage(null);
        setCountObjects(null);
        setPredictions([]);
        processImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectedFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;
    handleSelectedFile(e.dataTransfer.files?.[0]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <UploadCloud className="w-6 h-6 text-primary" />
          Análise Automática de Imagem (IA)
        </CardTitle>
        <CardDescription>
          Envie ou capture uma foto de placa-mãe/hardware. Nosso modelo experimental de visão
          computacional identifica componentes automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-foreground">Aviso de Privacidade e IA (LGPD):</strong>{" "}
            as imagens enviadas são transmitidas temporariamente à API externa da Roboflow apenas
            para inferência e não são salvas no servidor do Labriot.{" "}
            <strong className="text-foreground">
              Não envie fotos de rostos, documentos ou dados pessoais.
            </strong>{" "}
            Resultados são probabilísticos e experimentais.
          </p>
        </div>

        {!isCameraOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "bg-muted/50 border-muted-foreground/30 hover:bg-muted/80"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Clique para enviar</span> ou
                    arraste uma imagem aqui
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apenas JPEG, PNG ou WEBP (Máx. 5 MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={startCamera}
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Tirar Foto com a Câmera
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden bg-black flex justify-center items-center min-h-[300px]">
              <video
                ref={liveVideoRef}
                autoPlay
                playsInline
                muted
                className="max-h-[500px] w-full object-contain"
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="button" onClick={capturePhoto} className="flex-1 sm:flex-none">
                <Camera className="w-4 h-4 mr-2" /> Capturar
              </Button>
              <Button
                type="button"
                onClick={stopCamera}
                variant="destructive"
                className="flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        )}

        {!isCameraOpen && selectedImage && (
          <div className="relative border rounded-lg overflow-hidden bg-black/5 flex justify-center items-center">
            <img
              ref={imageRef}
              src={annotatedImage || selectedImage}
              alt="Imagem enviada para análise"
              className="max-h-[500px] w-auto object-contain"
              onLoad={() => {
                if (!annotatedImage && filteredPredictions.length > 0) {
                  drawPredictions(filteredPredictions);
                }
              }}
            />
            {!annotatedImage && (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
        )}

        {!isCameraOpen && predictions.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Confiança mínima exibida: {Math.round(minConfidence * 100)}%
              </span>
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-36 accent-primary"
                aria-label="Limiar mínimo de confiança"
              />
            </div>

            {filteredPredictions.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredPredictions.map((pred, index) => (
                  <div
                    key={`${pred.class}-${index}`}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                  >
                    {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Nenhuma detecção acima de {Math.round(minConfidence * 100)}% de confiança.
              </p>
            )}
          </div>
        )}

        {!isCameraOpen && hasAnalyzed && predictions.length === 0 && (countObjects ?? 0) === 0 && (
          <div className="rounded-lg border bg-muted/50 p-3 text-center text-sm text-muted-foreground">
            Nenhum componente de placa-mãe compatível foi identificado nesta imagem. Certifique-se
            de que o objeto esteja bem iluminado e dentro do escopo do modelo.
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Processando imagem com a IA...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {hasAnalyzed
                  ? `Detecção concluída: ${
                      filteredPredictions.length > 0
                        ? filteredPredictions.length
                        : (countObjects ?? 0)
                    } componente(s) identificado(s)`
                  : selectedImage
                    ? "Imagem pronta para análise"
                    : "Aguardando imagem para iniciar..."}
              </p>
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border">
            {loading ? "Processando..." : hasAnalyzed ? "Concluído" : "Modelo Experimental"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
