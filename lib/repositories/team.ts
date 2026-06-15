import { findById, teamMembers } from "@/lib/mock-data";
import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type TeamMemberRecord = {
  id: string | number;
  name: string;
  role: string;
  specialization: string | null;
  category: string;
  image: string | null;
  linkedin: string | null;
};

export type TeamMemberInput = Omit<TeamMemberRecord, "id">;

export interface TeamRepository {
  count(): Promise<number>;
  list(): Promise<TeamMemberRecord[]>;
  getById(id: string): Promise<TeamMemberRecord | null>;
  create(data: TeamMemberInput): Promise<TeamMemberRecord>;
  update(id: string, data: TeamMemberInput): Promise<TeamMemberRecord>;
  remove(id: string): Promise<void>;
}

const mockTeamRepository: TeamRepository = {
  async count() {
    return teamMembers.length;
  },
  async list() {
    return [...teamMembers];
  },
  async getById(id) {
    return findById(teamMembers, id);
  },
  async create() {
    throw new RepositoryUnavailableError();
  },
  async update() {
    throw new RepositoryUnavailableError();
  },
  async remove() {
    throw new RepositoryUnavailableError();
  },
};

const prismaTeamRepository: TeamRepository = {
  async count() {
    return prisma.teamMember.count();
  },
  async list() {
    return prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });
  },
  async getById(id) {
    return prisma.teamMember.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.teamMember.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.teamMember.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Membro nao encontrado");
    }
  },
  async remove(id) {
    try {
      await prisma.teamMember.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Membro nao encontrado");
    }
  },
};

export function getTeamRepository() {
  if (isDatabaseConfigured()) {
    return prismaTeamRepository;
  }

  return canUseMockData() ? mockTeamRepository : unavailableTeamRepository;
}

const unavailableTeamRepository: TeamRepository = {
  async count() {
    throw new RepositoryUnavailableError();
  },
  async list() {
    throw new RepositoryUnavailableError();
  },
  async getById() {
    throw new RepositoryUnavailableError();
  },
  async create() {
    throw new RepositoryUnavailableError();
  },
  async update() {
    throw new RepositoryUnavailableError();
  },
  async remove() {
    throw new RepositoryUnavailableError();
  },
};
