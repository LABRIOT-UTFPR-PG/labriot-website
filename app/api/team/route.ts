import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getTeamRepository } from "@/lib/repositories/team";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, teamPayloadSchema } from "@/lib/validations/team";

export async function GET() {
  const team = await getTeamRepository().list();
  return NextResponse.json(team);
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
    scope: "team:create",
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

  const member = await getTeamRepository().create({
    ...validation.data,
    role: validation.data.role ?? "Pesquisador",
  });
  await recordAdminAudit({
    actor,
    action: "create",
    resourceType: "team_member",
    resourceId: String(member.id),
    resourceLabel: member.name,
    summary: `Criou o membro de equipe ${member.name}.`,
    ip: getClientIp(request),
  });

  return NextResponse.json(member, { status: 201 });
}
