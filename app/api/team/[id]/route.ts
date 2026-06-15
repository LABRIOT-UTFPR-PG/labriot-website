import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, invalidIdResponse, isDatabaseConfigured, isObjectId } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getTeamRepository } from "@/lib/repositories/team";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, teamPayloadSchema } from "@/lib/validations/team";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("membro");
  }

  const member = await getTeamRepository().getById(id);

  if (!member) {
    return NextResponse.json({ message: "Membro nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(member);
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
    return invalidIdResponse("membro");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "team:update",
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
    message: "Muitas alteracoes de membros da equipe. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = teamPayloadSchema.safeParse(payload);

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
    const member = await getTeamRepository().update(id, {
      ...validation.data,
      role: validation.data.role ?? "Pesquisador",
    });
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "team_member",
      resourceId: String(member.id),
      resourceLabel: member.name,
      summary: `Atualizou o membro de equipe ${member.name}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(member);
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
    return invalidIdResponse("membro");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "team:delete",
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
    message: "Muitas alteracoes de membros da equipe. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const existingMember = await getTeamRepository().getById(id);

  if (!existingMember) {
    return NextResponse.json({ message: "Membro nao encontrado" }, { status: 404 });
  }

  try {
    await getTeamRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "team_member",
      resourceId: String(existingMember.id),
      resourceLabel: existingMember.name,
      summary: `Excluiu o membro de equipe ${existingMember.name}.`,
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
