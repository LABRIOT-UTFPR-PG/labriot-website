import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB decodificado
const MAX_BASE64_CHARS = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 128;
const UPSTREAM_TIMEOUT_MS = 20_000;

const ALLOWED_DATA_URI_PREFIX = /^data:image\/(jpeg|jpg|png|webp);base64,/i;

// Controle simples de cota diária global (proteção contra Denial of Wallet)
let dailyCounter = { dateKey: '', count: 0 };

function consumeDailyQuota(): boolean {
  const limit = Number(process.env.ROBOFLOW_DAILY_LIMIT || 250);
  if (limit <= 0) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (dailyCounter.dateKey !== today) {
    dailyCounter = { dateKey: today, count: 0 };
  }
  if (dailyCounter.count >= limit) {
    return false;
  }
  dailyCounter.count += 1;
  return true;
}

/**
 * Valida magic bytes reais para aceitar exclusivamente JPEG, PNG ou WebP.
 * Bloqueia SVGs, scripts disfarçados ou arquivos corrompidos.
 */
function hasValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  // WebP: "RIFF" .... "WEBP"
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';

  return isJpeg || isPng || isWebp;
}

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const perIpLimit = Number(process.env.ROBOFLOW_RATE_LIMIT_PER_HOUR || 15);
  const rate = checkRateLimit(ip, {
    namespace: 'roboflow-inference',
    maxRequests: perIpLimit,
    windowMs: 60 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          'Limite de análises por hora atingido para seu endereço. Aguarde antes de enviar novas imagens.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      }
    );
  }

  const contentLengthHeader = req.headers.get('content-length');
  if (contentLengthHeader && Number(contentLengthHeader) > MAX_BASE64_CHARS + 2048) {
    return NextResponse.json(
      { error: 'Imagem excede o limite máximo permitido (5 MB).' },
      { status: 413 }
    );
  }

  try {
    const body = await req.json();
    const { image } = body ?? {};

    if (typeof image !== 'string' || image.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem válida foi fornecida.' },
        { status: 400 }
      );
    }

    if (image.length > MAX_BASE64_CHARS) {
      return NextResponse.json(
        { error: 'Imagem excede o tamanho máximo permitido (5 MB).' },
        { status: 413 }
      );
    }

    // Exige prefixo de data URI seguro (JPEG/PNG/WEBP) ou base64 puro
    let base64Data = image.trim();
    if (base64Data.startsWith('data:')) {
      if (!ALLOWED_DATA_URI_PREFIX.test(base64Data)) {
        return NextResponse.json(
          { error: 'Formato não suportado. Envie apenas JPEG, PNG ou WEBP.' },
          { status: 400 }
        );
      }
      base64Data = base64Data.replace(ALLOWED_DATA_URI_PREFIX, '');
    }

    if (!/^[A-Za-z0-9+/=\s]+$/.test(base64Data)) {
      return NextResponse.json(
        { error: 'Codificação base64 da imagem inválida.' },
        { status: 400 }
      );
    }

    const decodedBuffer = Buffer.from(base64Data, 'base64');
    if (decodedBuffer.length === 0 || decodedBuffer.length > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Tamanho de imagem inválido (máximo 5 MB).' },
        { status: 413 }
      );
    }

    if (!hasValidImageMagicBytes(decodedBuffer)) {
      return NextResponse.json(
        {
          error:
            'Arquivo inválido. Apenas imagens reais nos formatos JPEG, PNG ou WEBP são aceitas.',
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.ROBOFLOW_API_KEY || process.env.API_KEY;
    const roboflowUrl =
      process.env.ROBOFLOW_WORKFLOW_URL ||
      'https://serverless.roboflow.com/image-jlx1n/workflows/detect-motherboard';

    if (!apiKey) {
      console.error('[roboflow] ROBOFLOW_API_KEY não configurada.');
      return NextResponse.json(
        { error: 'Serviço de análise de IA temporariamente indisponível.' },
        { status: 503 }
      );
    }

    if (!consumeDailyQuota()) {
      return NextResponse.json(
        {
          error:
            'A cota diária de demonstrações de IA foi atingida. Tente novamente amanhã.',
        },
        { status: 429 }
      );
    }

    const response = await fetch(roboflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: {
          image: {
            type: 'base64',
            value: base64Data,
          },
        },
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Não expõe detalhes internos ou payload da conta do provedor ao cliente
      console.error(`[roboflow] Erro upstream HTTP ${response.status}`);
      return NextResponse.json(
        { error: 'Não foi possível processar a imagem no serviço de IA. Tente novamente.' },
        { status: 502 }
      );
    }

    const data = await response.json();

    let predictions: unknown[] = [];
    let countObjects = 0;
    let outputImage: string | null = null;

    if (data.outputs && Array.isArray(data.outputs) && data.outputs.length > 0) {
      const firstOutput = data.outputs[0];
      const rawPreds = firstOutput.predictions;
      predictions = Array.isArray(rawPreds)
        ? rawPreds
        : Array.isArray(rawPreds?.predictions)
          ? rawPreds.predictions
          : [];
      countObjects =
        typeof firstOutput.count_objects === 'number'
          ? firstOutput.count_objects
          : (firstOutput.count_objects?.value ?? predictions.length);
      outputImage = firstOutput.output_image?.value || null;
    } else {
      predictions = Array.isArray(data.predictions) ? data.predictions : [];
      countObjects =
        typeof data.count_objects === 'number'
          ? data.count_objects
          : (data.count_objects?.value ?? predictions.length);
      outputImage = data.output_image?.value || null;
    }

    // Retorna apenas os campos necessários (minimização de dados)
    return NextResponse.json(
      {
        predictions,
        countObjects,
        outputImage,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-RateLimit-Remaining': String(rate.remaining),
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Tempo limite excedido ao processar a imagem. Tente com uma imagem menor.' },
        { status: 504 }
      );
    }
    console.error('[roboflow] Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a imagem.' },
      { status: 500 }
    );
  }
}
