import { z } from "zod";

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const optionalLink = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value) return true;
      if (value.startsWith("/")) return true;

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Use uma URL http(s) valida ou um caminho interno iniciado por /." }
  )
  .transform((value) => (value ? value : null));

export const optionalImageLink = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value) return true;
      if (value.startsWith("/")) return true;

      try {
        const url = new URL(value);
        return url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Use uma imagem https valida ou um caminho interno iniciado por /." }
  )
  .transform((value) => (value ? value : null));

export const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value) return true;

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Use uma URL http(s) valida." }
  )
  .transform((value) => (value ? value : null));

export function isValidDateInput(value: string) {
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

export const optionalDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((value) => !value || isValidDateInput(value), {
    message: "Use uma data valida.",
  })
  .transform((value) => (value ? value : null));

export const requiredDate = z
  .string()
  .trim()
  .min(1, "Data e obrigatoria.")
  .refine(isValidDateInput, { message: "Use uma data valida." });

export const optionalTime = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((value) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), {
    message: "Use um horario valido.",
  })
  .transform((value) => (value ? value : null));

export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
