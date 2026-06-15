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
import { getProjectRepository } from "@/lib/repositories/projects";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, projectPayloadSchema } from "@/lib/validations/project";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("projeto");
  }

  const project = await getProjectRepository().getById(id);

  if (!project) {
    return NextResponse.json({ message: "Projeto nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(project);
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
    return invalidIdResponse("projeto");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "projects:update",
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
    message: "Muitas alteracoes de projetos. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = projectPayloadSchema.safeParse(payload);

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
    const project = await getProjectRepository().update(id, validation.data);
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "project",
      resourceId: String(project.id),
      resourceLabel: project.title,
      summary: `Atualizou o projeto ${project.title}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(project);
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
    return invalidIdResponse("projeto");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "projects:delete",
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
    message: "Muitas alteracoes de projetos. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const existingProject = await getProjectRepository().getById(id);

  if (!existingProject) {
    return NextResponse.json({ message: "Projeto nao encontrado" }, { status: 404 });
  }

  try {
    await getProjectRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "project",
      resourceId: String(existingProject.id),
      resourceLabel: existingProject.title,
      summary: `Excluiu o projeto ${existingProject.title}.`,
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
