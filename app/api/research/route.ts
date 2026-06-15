import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getResearchRepository } from "@/lib/repositories/research";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, researchPayloadSchema } from "@/lib/validations/research";

export async function GET() {
  const research = await getResearchRepository().list();
  return NextResponse.json(research);
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "research:create",
    request,
    ipRule: {
      limit: 120,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 60,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de pesquisas. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = researchPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const item = await getResearchRepository().create(validation.data);
  await recordAdminAudit({
    actor,
    action: "create",
    resourceType: "research",
    resourceId: String(item.id),
    resourceLabel: item.title,
    summary: `Criou a pesquisa ${item.title}.`,
    ip: getClientIp(request),
  });
  return NextResponse.json(item, { status: 201 });
}
