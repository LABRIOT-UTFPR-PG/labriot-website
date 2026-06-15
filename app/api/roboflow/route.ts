import { NextResponse } from "next/server";
import { getRoboflowApiKey } from "@/lib/env";
import { enforceRequestRateLimit, isSameOriginRequest, rejectCrossOriginRequest } from "@/lib/request-security";

export async function POST(req: Request) {
  try {
    if (!isSameOriginRequest(req)) {
      return rejectCrossOriginRequest(req);
    }

    const rateLimit = enforceRequestRateLimit({
      scope: "roboflow:analyze",
      request: req,
      ipRule: {
        limit: 30,
        windowMs: 10 * 60 * 1000,
      },
      message: "Muitas analises de imagem. Tente novamente mais tarde.",
    });

    if (rateLimit) {
      return rateLimit;
    }

    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida" }, { status: 400 });
    }

    let API_KEY: string;

    try {
      API_KEY = getRoboflowApiKey();
    } catch {
      return NextResponse.json(
        { error: "A integracao com o Roboflow nao esta configurada no servidor." },
        { status: 503 }
      );
    }

    // URL pública e correta do endpoint de inferência do seu Workflow de placa mãe (detect-motherboard)
    const roboflowUrl = "https://serverless.roboflow.com/image-jlx1n/workflows/detect-motherboard";

    // Remove prefixo base64 se existir (ex: data:image/jpeg;base64,)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Chamada usando o modelo do Roboflow Workflows
    const response = await fetch(roboflowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: API_KEY,
        inputs: {
          image: {
            type: "base64",
            value: base64Data,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Erro na API do Roboflow (Workflows): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let predictions = [];
    let countObjects = 0;
    let outputImage = null;

    if (data.outputs && Array.isArray(data.outputs) && data.outputs.length > 0) {
      const firstOutput = data.outputs[0];
      predictions = firstOutput.predictions || [];
      countObjects = typeof firstOutput.count_objects === "number" ? firstOutput.count_objects : (firstOutput.count_objects?.value || predictions.length);
      outputImage = firstOutput.output_image?.value || null;
    } else {
      predictions = data.predictions || [];
      countObjects = typeof data.count_objects === "number" ? data.count_objects : (data.count_objects?.value || predictions.length);
      outputImage = data.output_image?.value || null;
    }

    return NextResponse.json({
      ...data,
      predictions,
      countObjects,
      outputImage
    });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
