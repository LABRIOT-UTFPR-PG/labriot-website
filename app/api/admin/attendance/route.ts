import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getAttendanceRepository } from "@/lib/repositories/attendance";
import { getTeamRepository } from "@/lib/repositories/team";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { getClientIp } from "@/lib/rate-limit";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { attendanceSessionPayloadSchema, formatZodErrors } from "@/lib/validations/attendance";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const [sessions, team] = await Promise.all([
    getAttendanceRepository().list(),
    getTeamRepository().list(),
  ]);

  return NextResponse.json({
    sessions,
    team,
  });
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
    scope: "attendance:create",
    request,
    ipRule: {
      limit: 80,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 40,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de presenca. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = attendanceSessionPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const members = await getTeamRepository().list();
  const session = await getAttendanceRepository().createWithMembers(validation.data, members);

  await recordAdminAudit({
    actor,
    action: "create",
    resourceType: "attendance_session",
    resourceId: session.id,
    resourceLabel: session.title,
    summary: `Criou a reuniao de presenca ${session.title} com ${session.totalMembers} membros importados.`,
    ip: getClientIp(request),
  });

  return NextResponse.json(session, { status: 201 });
}
