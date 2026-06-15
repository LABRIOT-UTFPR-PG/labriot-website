import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getSiteSettingsRepository } from "@/lib/repositories/site-settings";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { formatZodErrors, siteSettingsPayloadSchema } from "@/lib/validations/site-settings";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const settings = await getSiteSettingsRepository().get();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "site-settings:update",
    request,
    ipRule: {
      limit: 30,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 15,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas atualizacoes de configuracoes. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = siteSettingsPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const settings = await getSiteSettingsRepository().save(validation.data);

  await recordAdminAudit({
    actor,
    action: "update",
    resourceType: "site_settings",
    resourceId: "site-settings",
    resourceLabel: settings.siteName,
    summary: "Atualizou as configuracoes gerais do site.",
    ip: getClientIp(request),
  });

  return NextResponse.json(settings);
}
