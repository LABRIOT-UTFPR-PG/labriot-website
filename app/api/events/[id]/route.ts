import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, invalidIdResponse, isDatabaseConfigured, isObjectId } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getEventRepository } from "@/lib/repositories/events";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { eventPayloadSchema, formatZodErrors } from "@/lib/validations/event";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("evento");
  }

  const event = await getEventRepository().getById(id);

  if (!event) {
    return NextResponse.json({ message: "Evento nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("evento");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "events:update",
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

  try {
    const event = await getEventRepository().update(id, validation.data);
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "event",
      resourceId: String(event.id),
      resourceLabel: event.title,
      summary: `Atualizou o evento ${event.title}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    throw error;
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("evento");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "events:delete",
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

  const existingEvent = await getEventRepository().getById(id);

  if (!existingEvent) {
    return NextResponse.json({ message: "Evento nao encontrado" }, { status: 404 });
  }

  try {
    await getEventRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "event",
      resourceId: String(existingEvent.id),
      resourceLabel: existingEvent.title,
      summary: `Excluiu o evento ${existingEvent.title}.`,
      ip: getClientIp(request),
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    throw error;
  }
}
