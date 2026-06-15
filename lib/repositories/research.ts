import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { findById, research } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type ResearchRecord = {
  id: string | number;
  title: string;
  description: string | null;
};

export type ResearchInput = Omit<ResearchRecord, "id">;

export interface ResearchRepository {
  count(): Promise<number>;
  list(): Promise<ResearchRecord[]>;
  getById(id: string): Promise<ResearchRecord | null>;
  create(data: ResearchInput): Promise<ResearchRecord>;
  update(id: string, data: ResearchInput): Promise<ResearchRecord>;
  remove(id: string): Promise<void>;
}

const mockResearchRepository: ResearchRepository = {
  async count() {
    return research.length;
  },
  async list() {
    return [...research];
  },
  async getById(id) {
    return findById(research, id);
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

const prismaResearchRepository: ResearchRepository = {
  async count() {
    return prisma.research.count();
  },
  async list() {
    return prisma.research.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  async getById(id) {
    return prisma.research.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.research.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.research.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Pesquisa nao encontrada");
    }
  },
  async remove(id) {
    try {
      await prisma.research.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Pesquisa nao encontrada");
    }
  },
};

export function getResearchRepository() {
  if (isDatabaseConfigured()) {
    return prismaResearchRepository;
  }

  return canUseMockData() ? mockResearchRepository : unavailableResearchRepository;
}

const unavailableResearchRepository: ResearchRepository = {
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
