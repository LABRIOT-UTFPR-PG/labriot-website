import { Prisma } from "@prisma/client";
import { isDatabaseConfigured } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import {
  RepositoryConflictError,
  RepositoryNotFoundError,
  RepositoryUnavailableError,
} from "@/lib/repositories/errors";

export type UserRecord = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreateInput = {
  username: string;
  passwordHash: string;
};

export type UserCredentialsRecord = UserRecord & {
  passwordHash: string;
};

export interface UserRepository {
  count(): Promise<number>;
  list(): Promise<UserRecord[]>;
  getById(id: string): Promise<UserRecord | null>;
  getCredentialsById(id: string): Promise<UserCredentialsRecord | null>;
  create(data: UserCreateInput): Promise<UserRecord>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  remove(id: string): Promise<void>;
}

const unavailableUserRepository: UserRepository = {
  async count() {
    throw new RepositoryUnavailableError();
  },
  async list() {
    throw new RepositoryUnavailableError();
  },
  async getById() {
    throw new RepositoryUnavailableError();
  },
  async getCredentialsById() {
    throw new RepositoryUnavailableError();
  },
  async create() {
    throw new RepositoryUnavailableError();
  },
  async updatePassword() {
    throw new RepositoryUnavailableError();
  },
  async remove() {
    throw new RepositoryUnavailableError();
  },
};

const prismaUserRepository: UserRepository = {
  async count() {
    return prisma.user.count();
  },
  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  },
  async getById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
  async getCredentialsById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      passwordHash: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
  async create(data) {
    try {
      return await prisma.user.create({
        data: {
          username: data.username,
          password: data.passwordHash,
        },
        select: {
          id: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new RepositoryConflictError("Ja existe um administrador com esse usuario.");
      }

      throw error;
    }
  },
  async updatePassword(id, passwordHash) {
    try {
      await prisma.user.update({
        where: { id },
        data: { password: passwordHash },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new RepositoryNotFoundError("Administrador nao encontrado.");
      }

      throw error;
    }
  },
  async remove(id) {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new RepositoryNotFoundError("Administrador nao encontrado.");
      }

      throw error;
    }
  },
};

export function getUserRepository() {
  return isDatabaseConfigured() ? prismaUserRepository : unavailableUserRepository;
}
