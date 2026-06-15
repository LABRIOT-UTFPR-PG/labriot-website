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
import { getPublicationRepository } from "@/lib/repositories/publications";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, publicationPayloadSchema } from "@/lib/validations/publication";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("publicacao");
  }

  const publication = await getPublicationRepository().getById(id);

  if (!publication) {
    return NextResponse.json({ message: "Publicacao nao encontrada" }, { status: 404 });
  }

  return NextResponse.json(publication);
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
    return invalidIdResponse("publicacao");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "publications:update",
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
    message: "Muitas alteracoes de publicacoes. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = publicationPayloadSchema.safeParse(payload);

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
    const publication = await getPublicationRepository().update(id, validation.data);
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "publication",
      resourceId: String(publication.id),
      resourceLabel: publication.title,
      summary: `Atualizou a publicacao ${publication.title}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(publication);
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
    return invalidIdResponse("publicacao");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "publications:delete",
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
    message: "Muitas alteracoes de publicacoes. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const existingPublication = await getPublicationRepository().getById(id);

  if (!existingPublication) {
    return NextResponse.json({ message: "Publicacao nao encontrada" }, { status: 404 });
  }

  try {
    await getPublicationRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "publication",
      resourceId: String(existingPublication.id),
      resourceLabel: existingPublication.title,
      summary: `Excluiu a publicacao ${existingPublication.title}.`,
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
