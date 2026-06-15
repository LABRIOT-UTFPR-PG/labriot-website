import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getProjectRepository } from "@/lib/repositories/projects";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, projectPayloadSchema } from "@/lib/validations/project";

export async function GET() {
  const projects = await getProjectRepository().list();
  return NextResponse.json(projects);
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
    scope: "projects:create",
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

  const project = await getProjectRepository().create(validation.data);
  await recordAdminAudit({
    actor,
    action: "create",
    resourceType: "project",
    resourceId: String(project.id),
    resourceLabel: project.title,
    summary: `Criou o projeto ${project.title}.`,
    ip: getClientIp(request),
  });

  return NextResponse.json(project, { status: 201 });
}
