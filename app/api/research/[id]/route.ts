import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import {
  databaseUnavailableResponse,
  invalidIdResponse,
  isDatabaseConfigured,
  isObjectId,
} from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getResearchRepository } from "@/lib/repositories/research";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, researchPayloadSchema } from "@/lib/validations/research";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("pesquisa");
  }

  const item = await getResearchRepository().getById(id);

  if (!item) {
    return NextResponse.json({ message: "Pesquisa nao encontrada" }, { status: 404 });
  }

  return NextResponse.json(item);
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
    return invalidIdResponse("pesquisa");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "research:update",
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

  try {
    const item = await getResearchRepository().update(id, validation.data);
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "research",
      resourceId: String(item.id),
      resourceLabel: item.title,
      summary: `Atualizou a pesquisa ${item.title}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(item);
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
    return invalidIdResponse("pesquisa");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "research:delete",
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

  const existingResearch = await getResearchRepository().getById(id);

  if (!existingResearch) {
    return NextResponse.json({ message: "Pesquisa nao encontrada" }, { status: 404 });
  }

  try {
    await getResearchRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "research",
      resourceId: String(existingResearch.id),
      resourceLabel: existingResearch.title,
      summary: `Excluiu a pesquisa ${existingResearch.title}.`,
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
