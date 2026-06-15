import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { findById, publications } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type PublicationRecord = {
  id: string | number;
  title: string;
  authors: string;
  journal: string | null;
  year: number;
  doi: string | null;
  description: string | null;
};

export type PublicationInput = Omit<PublicationRecord, "id">;

export interface PublicationRepository {
  count(): Promise<number>;
  list(): Promise<PublicationRecord[]>;
  getById(id: string): Promise<PublicationRecord | null>;
  create(data: PublicationInput): Promise<PublicationRecord>;
  update(id: string, data: PublicationInput): Promise<PublicationRecord>;
  remove(id: string): Promise<void>;
}

const mockPublicationRepository: PublicationRepository = {
  async count() {
    return publications.length;
  },
  async list() {
    return [...publications].sort((a, b) => b.year - a.year);
  },
  async getById(id) {
    return findById(publications, id);
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

const prismaPublicationRepository: PublicationRepository = {
  async count() {
    return prisma.publication.count();
  },
  async list() {
    return prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
  },
  async getById(id) {
    return prisma.publication.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.publication.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.publication.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Publicacao nao encontrada");
    }
  },
  async remove(id) {
    try {
      await prisma.publication.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Publicacao nao encontrada");
    }
  },
};

export function getPublicationRepository() {
  if (isDatabaseConfigured()) {
    return prismaPublicationRepository;
  }

  return canUseMockData() ? mockPublicationRepository : unavailablePublicationRepository;
}

const unavailablePublicationRepository: PublicationRepository = {
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
