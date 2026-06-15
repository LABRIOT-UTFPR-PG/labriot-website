import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, invalidIdResponse, isDatabaseConfigured, isObjectId } from "@/lib/api";
import { getAttendanceRepository } from "@/lib/repositories/attendance";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { getClientIp } from "@/lib/rate-limit";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { attendanceSessionUpdatePayloadSchema, formatZodErrors } from "@/lib/validations/attendance";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("reuniao de presenca");
  }

  const session = await getAttendanceRepository().getById(id);

  if (!session) {
    return NextResponse.json({ message: "Reuniao de presenca nao encontrada." }, { status: 404 });
  }

  return NextResponse.json(session);
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
    return invalidIdResponse("reuniao de presenca");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "attendance:update",
    request,
    ipRule: {
      limit: 160,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 80,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de presenca. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = attendanceSessionUpdatePayloadSchema.safeParse(payload);

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
    const session = await getAttendanceRepository().update(id, validation.data);

    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "attendance_session",
      resourceId: session.id,
      resourceLabel: session.title,
      summary: `Atualizou a presenca da reuniao ${session.title}: ${session.presentCount}/${session.totalMembers} presentes.`,
      ip: getClientIp(request),
    });

    return NextResponse.json(session);
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
    return invalidIdResponse("reuniao de presenca");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "attendance:delete",
    request,
    ipRule: {
      limit: 40,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 20,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de presenca. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const session = await getAttendanceRepository().getById(id);

  if (!session) {
    return NextResponse.json({ message: "Reuniao de presenca nao encontrada." }, { status: 404 });
  }

  try {
    await getAttendanceRepository().remove(id);

    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "attendance_session",
      resourceId: session.id,
      resourceLabel: session.title,
      summary: `Removeu a reuniao de presenca ${session.title}.`,
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
