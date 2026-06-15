import { canUseMockData, isDatabaseConfigured } from "@/lib/api";
import { findById, posts } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { RepositoryNotFoundError, RepositoryUnavailableError } from "@/lib/repositories/errors";

export type PostRecord = {
  id: string | number;
  title: string;
  summary: string | null;
  content: string | null;
  author: string | null;
  date: string | null;
  image: string | null;
};

export type PostInput = Omit<PostRecord, "id">;

export interface PostRepository {
  count(): Promise<number>;
  list(): Promise<PostRecord[]>;
  getById(id: string): Promise<PostRecord | null>;
  create(data: PostInput): Promise<PostRecord>;
  update(id: string, data: PostInput): Promise<PostRecord>;
  remove(id: string): Promise<void>;
}

const mockPostRepository: PostRepository = {
  async count() {
    return posts.length;
  },
  async list() {
    return [...posts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  },
  async getById(id) {
    return findById(posts, id);
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

const prismaPostRepository: PostRepository = {
  async count() {
    return prisma.post.count();
  },
  async list() {
    return prisma.post.findMany({
      orderBy: { date: "desc" },
    });
  },
  async getById(id) {
    return prisma.post.findUnique({
      where: { id },
    });
  },
  async create(data) {
    return prisma.post.create({ data });
  },
  async update(id, data) {
    try {
      return await prisma.post.update({
        where: { id },
        data,
      });
    } catch {
      throw new RepositoryNotFoundError("Post nao encontrado");
    }
  },
  async remove(id) {
    try {
      await prisma.post.delete({
        where: { id },
      });
    } catch {
      throw new RepositoryNotFoundError("Post nao encontrado");
    }
  },
};

export function getPostRepository() {
  if (isDatabaseConfigured()) {
    return prismaPostRepository;
  }

  return canUseMockData() ? mockPostRepository : unavailablePostRepository;
}

const unavailablePostRepository: PostRepository = {
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
