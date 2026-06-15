import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { findById, projects } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type ProjectRecord = {
  id: string | number;
  title: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  image: string | null;
  url: string | null;
  fullDescription: string | null;
};

export type ProjectInput = Omit<ProjectRecord, "id">;

export interface ProjectRepository {
  count(): Promise<number>;
  list(): Promise<ProjectRecord[]>;
  getById(id: string): Promise<ProjectRecord | null>;
  create(data: ProjectInput): Promise<ProjectRecord>;
  update(id: string, data: ProjectInput): Promise<ProjectRecord>;
  remove(id: string): Promise<void>;
}

const mockProjectRepository: ProjectRepository = {
  async count() {
    return projects.length;
  },
  async list() {
    return [...projects];
  },
  async getById(id) {
    return findById(projects, id);
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

const prismaProjectRepository: ProjectRepository = {
  async count() {
    return prisma.project.count();
  },
  async list() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  async getById(id) {
    return prisma.project.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.project.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.project.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Projeto nao encontrado");
    }
  },
  async remove(id) {
    try {
      await prisma.project.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Projeto nao encontrado");
    }
  },
};

export function getProjectRepository() {
  if (isDatabaseConfigured()) {
    return prismaProjectRepository;
  }

  return canUseMockData() ? mockProjectRepository : unavailableProjectRepository;
}

const unavailableProjectRepository: ProjectRepository = {
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
