import { z } from "zod";
import { formatZodErrors } from "@/lib/validations/common";

export const contactPayloadSchema = z.object({
  name: z.string().trim().min(1, "Nome e obrigatorio.").max(120),
  email: z.string().trim().email("Use um email valido.").max(200),
  organization: z.string().trim().max(200).optional().default(""),
  inquiryType: z.string().trim().min(1, "Tipo de consulta e obrigatorio.").max(80),
  message: z.string().trim().min(1, "Mensagem e obrigatoria.").max(5000),
  interest: z.string().trim().max(80).optional().default(""),
  botcheck: z.string().trim().max(80).optional().default(""),
  "h-captcha-response": z.string().trim().min(1, "Confirme que voce nao e um robo."),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
export { formatZodErrors };
