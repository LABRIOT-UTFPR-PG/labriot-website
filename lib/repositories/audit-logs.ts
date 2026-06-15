import { isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RepositoryUnavailableError } from "@/lib/repositories/errors";

export type AuditLogRecord = {
  id: string;
  adminUserId: string;
  adminUsername: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  resourceLabel: string | null;
  summary: string;
  ip: string | null;
  createdAt: Date;
};

export type AuditLogCreateInput = Omit<AuditLogRecord, "id" | "createdAt">;

export interface AuditLogRepository {
  listRecent(limit?: number): Promise<AuditLogRecord[]>;
  create(data: AuditLogCreateInput): Promise<AuditLogRecord>;
}

const unavailableAuditLogRepository: AuditLogRepository = {
  async listRecent() {
    throw new RepositoryUnavailableError();
  },
  async create() {
    throw new RepositoryUnavailableError();
  },
};

const prismaAuditLogRepository: AuditLogRepository = {
  async listRecent(limit = 50) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  async create(data) {
    return prisma.auditLog.create({ data });
  },
};

export function getAuditLogRepository() {
  return isDatabaseConfigured() ? prismaAuditLogRepository : unavailableAuditLogRepository;
}
