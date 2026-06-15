import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { databaseUnavailableResponse, invalidIdResponse, isDatabaseConfigured, isObjectId } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getUserRepository } from "@/lib/repositories/users";
import { enforceRequestRateLimit } from "@/lib/request-security";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("administrador");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const session = await verifyAdminSessionToken(token);

  const rateLimit = enforceRequestRateLimit({
    scope: "admin:delete",
    request,
    ipRule: {
      limit: 60,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 30,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: typeof session.sub === "string" ? session.sub : null,
    message: "Muitas alteracoes de administradores. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  if (session.sub === id) {
    return NextResponse.json(
      { message: "Voce nao pode excluir o administrador que esta em uso na sessao atual." },
      { status: 409 }
    );
  }

  const userRepository = getUserRepository();
  const adminToDelete = await userRepository.getById(id);

  if (!adminToDelete) {
    return NextResponse.json({ message: "Administrador nao encontrado." }, { status: 404 });
  }

  const totalAdmins = await userRepository.count();

  if (totalAdmins <= 1) {
    return NextResponse.json(
      { message: "Nao e permitido excluir o ultimo administrador do sistema." },
      { status: 409 }
    );
  }

  try {
    await userRepository.remove(id);
    await recordAdminAudit({
      actor: {
        userId: String(session.sub),
        username: typeof session.username === "string" ? session.username : "admin",
      },
      action: "delete",
      resourceType: "admin",
      resourceId: adminToDelete.id,
      resourceLabel: adminToDelete.username,
      summary: `Excluiu o administrador ${adminToDelete.username}.`,
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
