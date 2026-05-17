import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida" }, { status: 400 });
    }

    const API_KEY = process.env.API_KEY;

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
      console.error("=== Roboflow API Error ===");
      console.error(`Status: ${response.status}`);
      console.error(`Body: ${errorText}`);
      console.error("==========================");
      return NextResponse.json(
        { error: `Erro na API do Roboflow (Workflows): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("=== Roboflow Workflow Response ===");
    console.dir(data, { depth: null }); // Exibe todo o JSON no console local do dev para inspeção
    console.log("==================================");

    // Salva o JSON em um arquivo local para podermos analisar a estrutura completa
    try {
      const fs = require("fs");
      const path = require("path");
      const logPath = path.join(process.cwd(), "roboflow_response_scratch.json");
      fs.writeFileSync(logPath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[DEBUG] JSON salvo com sucesso em: ${logPath}`);
    } catch (fsErr) {
      console.error("[DEBUG] Falha ao salvar arquivo de log:", fsErr);
    }

    // Mapeamento dinâmico para garantir compatibilidade com o frontend
    // Roboflow Workflows retorna a resposta estruturada pelos blocos de saída definidos no JSON.
    let predictions = [];
    let countObjects = 0;
    let outputImage = null;

    if (data.outputs && Array.isArray(data.outputs) && data.outputs.length > 0) {
      const firstOutput = data.outputs[0];
      predictions = firstOutput.predictions || [];
      countObjects = typeof firstOutput.count_objects === 'number' ? firstOutput.count_objects : (firstOutput.count_objects?.value || predictions.length);
      outputImage = firstOutput.output_image?.value || null;
    } else {
      predictions = data.predictions || [];
      countObjects = typeof data.count_objects === 'number' ? data.count_objects : (data.count_objects?.value || predictions.length);
      outputImage = data.output_image?.value || null;
    }

    return NextResponse.json({ 
      ...data, 
      predictions,
      countObjects,
      outputImage
    });
  } catch (error) {
    console.error("Roboflow API Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
