import { z } from "zod";

const optionalEnvString = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().min(1).optional());

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optionalEnvString,
  AUTH_SECRET: optionalEnvString,
  JWT_SECRET: optionalEnvString,
  API_KEY: optionalEnvString,
  ROBOFLOW_API_KEY: optionalEnvString,
  WEB3FORMS_ACCESS_KEY: optionalEnvString,
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: optionalEnvString,
  ROBOFLOW_EMBED_URL: optionalEnvString,
  NEXT_PUBLIC_SITE_URL: optionalEnvString,
  SITE_URL: optionalEnvString,
  ALLOW_MOCK_DATA: z.enum(["true", "false"]).optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

function readServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEY: process.env.API_KEY,
    ROBOFLOW_API_KEY: process.env.ROBOFLOW_API_KEY,
    WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
    ROBOFLOW_EMBED_URL: process.env.ROBOFLOW_EMBED_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SITE_URL: process.env.SITE_URL,
    ALLOW_MOCK_DATA: process.env.ALLOW_MOCK_DATA,
  });
}

export function getServerEnv() {
  return readServerEnv();
}

export function getAuthSecretValue() {
  const env = readServerEnv();
  const secret = env.AUTH_SECRET || env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("Defina AUTH_SECRET no ambiente de producao.");
  }

  return "labriot-dev-secret-change-me";
}

export function getDatabaseUrl() {
  return readServerEnv().DATABASE_URL ?? null;
}

export function getRoboflowApiKey() {
  const env = readServerEnv();
  const apiKey = env.API_KEY || env.ROBOFLOW_API_KEY;

  if (!apiKey) {
    throw new Error("Defina API_KEY ou ROBOFLOW_API_KEY para habilitar a integracao com o Roboflow.");
  }

  return apiKey;
}

export function getWeb3FormsAccessKey() {
  const env = readServerEnv();
  const accessKey = env.WEB3FORMS_ACCESS_KEY || env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Defina WEB3FORMS_ACCESS_KEY para habilitar o envio do formulario de contato.");
  }

  return accessKey;
}

export function getRoboflowEmbedUrl() {
  const env = readServerEnv();

  if (!env.ROBOFLOW_EMBED_URL) {
    throw new Error("Defina ROBOFLOW_EMBED_URL para habilitar o embed do Roboflow.");
  }

  return env.ROBOFLOW_EMBED_URL;
}
