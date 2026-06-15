import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getUserRepository } from "@/lib/repositories/users";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { formatZodErrors, updateAdminPasswordPayloadSchema } from "@/lib/validations/auth";

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "admin:password",
    request,
    ipRule: {
      limit: 20,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas tentativas de troca de senha. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = updateAdminPasswordPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const userRepository = getUserRepository();
  const currentUser = await userRepository.getCredentialsById(actor.userId);

  if (!currentUser) {
    return NextResponse.json({ message: "Administrador nao encontrado." }, { status: 404 });
  }

  const passwordMatches = await bcrypt.compare(validation.data.currentPassword, currentUser.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ message: "Senha atual incorreta." }, { status: 409 });
  }

  try {
    const passwordHash = await bcrypt.hash(validation.data.newPassword, 12);
    await userRepository.updatePassword(actor.userId, passwordHash);

    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "admin_password",
      resourceId: actor.userId,
      resourceLabel: actor.username,
      summary: "Atualizou a propria senha administrativa.",
      ip: getClientIp(request),
    });

    return NextResponse.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    throw error;
  }
}
