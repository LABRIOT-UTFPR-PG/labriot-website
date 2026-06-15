import { z } from "zod";
import { formatZodErrors } from "@/lib/validations/common";

const optionalPublicUrl = z
  .string()
  .trim()
  .max(500)
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
  );

export const siteSettingsPayloadSchema = z.object({
  siteName: z.string().trim().min(1, "Nome do site e obrigatorio.").max(120),
  siteDescription: z.string().trim().min(1, "Descricao do site e obrigatoria.").max(500),
  contactEmail: z.string().trim().email("Use um email valido.").max(200),
  contactPhone: z.string().trim().min(1, "Telefone de contato e obrigatorio.").max(100),
  contactAddress: z.string().trim().min(1, "Endereco e obrigatorio.").max(500),
  socialMedia: z.object({
    twitter: optionalPublicUrl,
    linkedin: optionalPublicUrl,
    github: optionalPublicUrl,
  }),
  enableBlog: z.boolean(),
  enableEvents: z.boolean(),
  enableNewsletter: z.boolean(),
});

export type SiteSettingsPayload = z.infer<typeof siteSettingsPayloadSchema>;
export { formatZodErrors };
