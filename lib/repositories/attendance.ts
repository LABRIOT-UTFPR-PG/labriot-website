import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";
import type { TeamMemberRecord } from "@/lib/repositories/team";
import type {
  AttendanceSessionPayload,
  AttendanceSessionUpdatePayload,
} from "@/lib/validations/attendance";

export type AttendanceRecord = {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  memberRole: string | null;
  present: boolean;
  active: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AttendanceSession = {
  id: string;
  title: string;
  date: string;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
  records: AttendanceRecord[];
  totalMembers: number;
  presentCount: number;
  activeCount: number;
};

export interface AttendanceRepository {
  list(): Promise<AttendanceSession[]>;
  getById(id: string): Promise<AttendanceSession | null>;
  createWithMembers(
    data: AttendanceSessionPayload,
    members: TeamMemberRecord[]
  ): Promise<AttendanceSession>;
  update(id: string, data: AttendanceSessionUpdatePayload): Promise<AttendanceSession>;
  remove(id: string): Promise<void>;
}

function compareRecordsByName(left: AttendanceRecord, right: AttendanceRecord) {
  return left.memberName.localeCompare(right.memberName, "pt-BR", { sensitivity: "base" });
}

function withStats(
  session: Omit<AttendanceSession, "records" | "totalMembers" | "presentCount" | "activeCount">,
  records: AttendanceRecord[]
): AttendanceSession {
  const sortedRecords = records.slice().sort(compareRecordsByName);

  return {
    ...session,
    records: sortedRecords,
    totalMembers: sortedRecords.length,
    presentCount: sortedRecords.filter((record) => record.present).length,
    activeCount: sortedRecords.filter((record) => record.active).length,
  };
}

function normalizeText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

const prismaAttendanceRepository: AttendanceRepository = {
  async list() {
    const sessions = await prisma.attendanceSession.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    const sessionIds = sessions.map((session) => session.id);
    const records = sessionIds.length
      ? await prisma.attendanceRecord.findMany({
          where: {
            sessionId: {
              in: sessionIds,
            },
          },
        })
      : [];

    const recordsBySession = new Map<string, AttendanceRecord[]>();

    for (const record of records) {
      const group = recordsBySession.get(record.sessionId) ?? [];
      group.push(record);
      recordsBySession.set(record.sessionId, group);
    }

    return sessions.map((session) => withStats(session, recordsBySession.get(session.id) ?? []));
  },

  async getById(id) {
    const session = await prisma.attendanceSession.findUnique({
      where: { id },
    });

    if (!session) {
      return null;
    }

    const records = await prisma.attendanceRecord.findMany({
      where: { sessionId: id },
    });

    return withStats(session, records);
  },

  async createWithMembers(data, members) {
    const session = await prisma.attendanceSession.create({
      data: {
        title: data.title,
        date: data.date,
        summary: normalizeText(data.summary),
      },
    });

    for (const member of members) {
      if (typeof member.id !== "string") {
        continue;
      }

      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          memberId: member.id,
          memberName: member.name,
          memberRole: member.specialization ?? member.role ?? null,
          present: false,
          active: true,
          notes: null,
        },
      });
    }

    const created = await this.getById(session.id);

    if (!created) {
      throw new RepositoryNotFoundError("Reuniao de presenca nao encontrada.");
    }

    return created;
  },

  async update(id, data) {
    try {
      await prisma.attendanceSession.update({
        where: { id },
        data: {
          title: data.title,
          date: data.date,
          summary: normalizeText(data.summary),
        },
      });
    } catch {
      throw new RepositoryNotFoundError("Reuniao de presenca nao encontrada.");
    }

    for (const record of data.records) {
      await prisma.attendanceRecord.updateMany({
        where: {
          sessionId: id,
          memberId: record.memberId,
        },
        data: {
          present: record.present,
          active: record.active,
          notes: normalizeText(record.notes),
        },
      });
    }

    const updated = await this.getById(id);

    if (!updated) {
      throw new RepositoryNotFoundError("Reuniao de presenca nao encontrada.");
    }

    return updated;
  },

  async remove(id) {
    await prisma.attendanceRecord.deleteMany({
      where: { sessionId: id },
    });

    try {
      await prisma.attendanceSession.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Reuniao de presenca nao encontrada.");
    }
  },
};

const unavailableAttendanceRepository: AttendanceRepository = {
  async list() {
    throw new RepositoryUnavailableError();
  },
  async getById() {
    throw new RepositoryUnavailableError();
  },
  async createWithMembers() {
    throw new RepositoryUnavailableError();
  },
  async update() {
    throw new RepositoryUnavailableError();
  },
  async remove() {
    throw new RepositoryUnavailableError();
  },
};

export function getAttendanceRepository() {
  if (isDatabaseConfigured()) {
    return prismaAttendanceRepository;
  }

  return canUseMockData() ? unavailableAttendanceRepository : unavailableAttendanceRepository;
}
