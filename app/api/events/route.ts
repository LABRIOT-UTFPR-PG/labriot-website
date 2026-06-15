import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getEventRepository } from "@/lib/repositories/events";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { eventPayloadSchema, formatZodErrors } from "@/lib/validations/event";

export async function GET() {
  const events = await getEventRepository().list();
  return NextResponse.json(events);
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
    scope: "events:create",
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
    message: "Muitas alteracoes de eventos. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = eventPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const event = await getEventRepository().create(validation.data);
  await recordAdminAudit({
    actor,
    action: "create",
    resourceType: "event",
    resourceId: String(event.id),
    resourceLabel: event.title,
    summary: `Criou o evento ${event.title}.`,
    ip: getClientIp(request),
  });

  return NextResponse.json(event, { status: 201 });
}
