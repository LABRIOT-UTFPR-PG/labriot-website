import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

async function loadEnvFile() {
  try {
    const env = await readFile(resolve(process.cwd(), ".env"), "utf8");

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
    // Ignore missing .env. Prisma will surface missing DATABASE_URL if needed.
  }
}

function parseArgs(argv) {
  const args = {
    input: null,
    url: null,
    cookie: null,
    clear: false,
    importSettingsOnly: false,
    includeAdmins: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--input") {
      args.input = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--url") {
      args.url = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--cookie") {
      args.cookie = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === "--clear") {
      args.clear = true;
      continue;
    }

    if (token === "--settings-only") {
      args.importSettingsOnly = true;
      continue;
    }

    if (token === "--include-admins") {
      args.includeAdmins = true;
      continue;
    }
  }

  return args;
}

function normalizeNullableString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeMaybeString(value) {
  if (typeof value !== "string") return null;
  return value.trim();
}

function mapProject(item) {
  return {
    id: String(item.id),
    title: item.title,
    description: normalizeNullableString(item.description),
    status: typeof item.status === "string" ? item.status : "ongoing",
    startDate: normalizeNullableString(item.startDate),
    endDate: normalizeNullableString(item.endDate),
    image: normalizeNullableString(item.image),
    url: normalizeNullableString(item.url),
    fullDescription: normalizeNullableString(item.fullDescription),
  };
}

function mapEvent(item) {
  return {
    id: String(item.id),
    title: item.title,
    description: normalizeNullableString(item.description),
    date: item.date,
    time: normalizeNullableString(item.time),
    location: normalizeNullableString(item.location),
    status: typeof item.status === "string" ? item.status : "Proximo",
  };
}

function mapPost(item) {
  return {
    id: String(item.id),
    title: item.title,
    summary: normalizeNullableString(item.summary),
    content: normalizeNullableString(item.content),
    author: normalizeNullableString(item.author),
    date: normalizeNullableString(item.date),
    image: normalizeNullableString(item.image),
  };
}

function mapTeamMember(item) {
  return {
    id: String(item.id),
    name: item.name,
    role: typeof item.role === "string" ? item.role : "Pesquisador",
    specialization: normalizeNullableString(item.specialization),
    category: typeof item.category === "string" ? item.category : "students",
    image: normalizeNullableString(item.image),
    linkedin: normalizeNullableString(item.linkedin),
  };
}

function mapPublication(item) {
  return {
    id: String(item.id),
    title: item.title,
    authors: item.authors,
    journal: normalizeNullableString(item.journal),
    year: item.year,
    doi: normalizeNullableString(item.doi),
    description: normalizeNullableString(item.description),
  };
}

function mapResearch(item) {
  return {
    id: String(item.id),
    title: item.title,
    description: normalizeNullableString(item.description),
  };
}

function mapSettings(item) {
  return {
    id: "site-settings",
    siteName: item.siteName,
    siteDescription: item.siteDescription,
    contactEmail: item.contactEmail,
    contactPhone: item.contactPhone,
    contactAddress: item.contactAddress,
    socialTwitter: item.socialMedia?.twitter ?? "",
    socialLinkedin: item.socialMedia?.linkedin ?? "",
    socialGithub: item.socialMedia?.github ?? "",
    enableBlog: Boolean(item.enableBlog),
    enableEvents: Boolean(item.enableEvents),
    enableNewsletter: Boolean(item.enableNewsletter),
  };
}

async function readInput(args) {
  if (args.input) {
    if (args.input.startsWith("http://") || args.input.startsWith("https://")) {
      const response = await fetch(args.input, {
        headers: args.cookie ? { cookie: args.cookie } : {},
      });

      if (!response.ok) {
        throw new Error(`Falha ao baixar export: HTTP ${response.status}`);
      }

      return response.json();
    }

    const filePath = resolve(process.cwd(), args.input);
    return JSON.parse(await readFile(filePath, "utf8"));
  }

  if (args.url) {
    const response = await fetch(args.url, {
      headers: args.cookie ? { cookie: args.cookie } : {},
    });

    if (!response.ok) {
      throw new Error(`Falha ao baixar export: HTTP ${response.status}`);
    }

    return response.json();
  }

  throw new Error("Passe --input <arquivo.json> ou --url <endpoint>.");
}

async function upsertMany(prisma, model, rows, mapper, label) {
  let count = 0;

  for (const item of rows ?? []) {
    const data = mapper(item);
    await prisma[model].upsert({
      where: { id: String(data.id) },
      update: data,
      create: data,
    });
    count += 1;
  }

  console.log(`${label}: ${count}`);
}

await loadEnvFile();

const args = parseArgs(process.argv);
const prisma = new PrismaClient();

try {
  const data = await readInput(args);

  if (args.clear) {
    await prisma.event.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.publication.deleteMany({});
    await prisma.research.deleteMany({});
    await prisma.teamMember.deleteMany({});
    await prisma.siteSettings.deleteMany({});
  }

  await upsertMany(prisma, "project", data.projects, mapProject, "Projects importados");
  await upsertMany(prisma, "publication", data.publications, mapPublication, "Publicacoes importadas");
  await upsertMany(prisma, "post", data.posts, mapPost, "Posts importados");
  await upsertMany(prisma, "event", data.events, mapEvent, "Eventos importados");
  await upsertMany(prisma, "teamMember", data.team, mapTeamMember, "Membros da equipe importados");
  await upsertMany(prisma, "research", data.research, mapResearch, "Pesquisas importadas");

  if (data.settings) {
    await prisma.siteSettings.upsert({
      where: { id: "site-settings" },
      update: mapSettings(data.settings),
      create: mapSettings(data.settings),
    });
    console.log("Configuracoes do site importadas");
  }

  if (args.includeAdmins) {
    console.log("Aviso: admins nao podem ser restaurados a partir do export atual porque o JSON nao inclui password hashes.");
  }

  console.log("Importacao concluida.");
} finally {
  await prisma.$disconnect();
}
