import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { recordAdminAudit } from "@/lib/audit";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getAuditLogRepository } from "@/lib/repositories/audit-logs";
import { RepositoryConflictError } from "@/lib/repositories/errors";
import { getUserRepository } from "@/lib/repositories/users";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { createAdminPayloadSchema, formatZodErrors } from "@/lib/validations/auth";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;
  const [users, auditLogs] = await Promise.all([
    getUserRepository().list(),
    getAuditLogRepository().listRecent(60),
  ]);

  return NextResponse.json({
    users,
    auditLogs,
    currentUserId: typeof session?.sub === "string" ? session.sub : null,
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
    scope: "admin:create",
    request,
    ipRule: {
      limit: 60,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 30,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de administradores. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = createAdminPayloadSchema.safeParse(payload);

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
    const passwordHash = await bcrypt.hash(validation.data.password, 12);
    const user = await getUserRepository().create({
      username: validation.data.username,
      passwordHash,
    });

    await recordAdminAudit({
      actor,
      action: "create",
      resourceType: "admin",
      resourceId: user.id,
      resourceLabel: user.username,
      summary: `Criou o administrador ${user.username}.`,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof RepositoryConflictError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    throw error;
  }
}
