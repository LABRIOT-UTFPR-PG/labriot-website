import { NextResponse } from "next/server";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { contactPayloadSchema, formatZodErrors } from "@/lib/validations/contact";

export async function POST(request: Request) {
  const payload = await request.json();
  const validation = contactPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "contact",
    request,
    ipRule: {
      limit: 8,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 3,
      windowMs: 30 * 60 * 1000,
    },
    identityKey: validation.data.email,
    message: "Muitas mensagens enviadas. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  if (validation.data.botcheck) {
    return NextResponse.json({ message: "Mensagem enviada com sucesso." });
  }

  return NextResponse.json({ message: "Validacao concluida." });
}
