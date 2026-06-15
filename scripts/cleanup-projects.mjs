import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

function loadEnvFile() {
  try {
    const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");

    for (const line of env.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Prisma will report missing DATABASE_URL if needed.
  }
}

function isValidDate(value) {
  if (!value) return true;

  const match = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidLink(value) {
  if (!value) return true;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidImage(value) {
  if (!value) return true;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

loadEnvFile();

const prisma = new PrismaClient();
let changed = 0;

try {
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    const data = {};

    if (!isValidDate(project.startDate)) data.startDate = null;
    if (!isValidDate(project.endDate)) data.endDate = null;
    if (!isValidImage(project.image)) data.image = null;
    if (!isValidLink(project.url)) data.url = null;

    if (Object.keys(data).length > 0) {
      await prisma.project.update({
        where: { id: project.id },
        data,
      });
      changed += 1;
      console.log(`Projeto normalizado: ${project.id} (${project.title})`);
    }
  }

  console.log(`Limpeza concluida. Projetos alterados: ${changed}.`);
} finally {
  await prisma.$disconnect();
}
