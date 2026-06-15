import { events, findById } from "@/lib/mock-data";
import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type EventRecord = {
  id: string | number;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  status: string;
};

export type EventInput = Omit<EventRecord, "id">;

export interface EventRepository {
  count(): Promise<number>;
  list(): Promise<EventRecord[]>;
  getById(id: string): Promise<EventRecord | null>;
  create(data: EventInput): Promise<EventRecord>;
  update(id: string, data: EventInput): Promise<EventRecord>;
  remove(id: string): Promise<void>;
}

const mockEventRepository: EventRepository = {
  async count() {
    return events.length;
  },
  async list() {
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  },
  async getById(id) {
    return findById(events, id);
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

const prismaEventRepository: EventRepository = {
  async count() {
    return prisma.event.count();
  },
  async list() {
    return prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  },
  async getById(id) {
    return prisma.event.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.event.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.event.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Evento nao encontrado");
    }
  },
  async remove(id) {
    try {
      await prisma.event.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Evento nao encontrado");
    }
  },
};

export function getEventRepository() {
  if (isDatabaseConfigured()) {
    return prismaEventRepository;
  }

  return canUseMockData() ? mockEventRepository : unavailableEventRepository;
}

const unavailableEventRepository: EventRepository = {
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
