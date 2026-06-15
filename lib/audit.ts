import { isDatabaseConfigured } from "@/lib/api";
import { getAuditLogRepository } from "@/lib/repositories/audit-logs";
import { type CurrentAdminActor, getCurrentAdminActor } from "@/lib/server-admin-session";

type RecordAdminAuditInput = {
  action: string;
  resourceType: string;
  summary: string;
  actor?: CurrentAdminActor | null;
  resourceId?: string | null;
  resourceLabel?: string | null;
  ip?: string | null;
};

export async function recordAdminAudit(input: RecordAdminAuditInput) {
  if (!isDatabaseConfigured()) {
    return;
  }

  const actor = input.actor ?? await getCurrentAdminActor();

  if (!actor) {
    return;
  }

  try {
    await getAuditLogRepository().create({
      adminUserId: actor.userId,
      adminUsername: actor.username,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      resourceLabel: input.resourceLabel ?? null,
      summary: input.summary,
      ip: input.ip ?? null,
    });
  } catch (error) {
    console.error("Falha ao registrar auditoria:", error);
  }
}
