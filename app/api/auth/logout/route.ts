import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { getClientIp } from "@/lib/rate-limit";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";

export async function POST(request: Request) {
  const actor = await getCurrentAdminActor();

  const rateLimit = enforceRequestRateLimit({
    scope: "auth:logout",
    request,
    ipRule: {
      limit: 30,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor?.userId ?? null,
    message: "Muitas tentativas de logout. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const response = NextResponse.json({ message: "Logout concluido." });

  response.cookies.delete(ADMIN_SESSION_COOKIE);

  await recordAdminAudit({
    actor,
    action: "logout",
    resourceType: "auth",
    resourceId: actor?.userId ?? null,
    resourceLabel: actor?.username ?? null,
    summary: "Encerrou a sessao administrativa.",
    ip: getClientIp(request),
  });

  return response;
}
