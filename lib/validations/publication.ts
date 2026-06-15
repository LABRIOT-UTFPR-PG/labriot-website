import { z } from "zod";
import { formatZodErrors, optionalText } from "@/lib/validations/common";

const optionalDoi = z
  .string()
  .trim()
  .max(200)
  .optional()
  .nullable()
  .refine((value) => !value || !/\s/.test(value), {
    message: "DOI nao pode conter espacos.",
  })
  .transform((value) => (value ? value : null));

export const publicationPayloadSchema = z.object({
  title: z.string().trim().min(1, "Titulo e obrigatorio.").max(240),
  authors: z.string().trim().min(1, "Autores e obrigatorio.").max(400),
  journal: optionalText(240),
  year: z.coerce.number().int().min(1900, "Ano invalido.").max(2100, "Ano invalido."),
  doi: optionalDoi,
  description: optionalText(3000),
});

export type PublicationPayload = z.infer<typeof publicationPayloadSchema>;
export { formatZodErrors };
